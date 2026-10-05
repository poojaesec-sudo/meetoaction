import hashlib
import re
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import User
from ..schemas import LoginRequest, LoginResponse, SignupRequest, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

def hash_password(password: str) -> str:
    salt = "meet2action_salt_2026"
    return hashlib.sha256(f"{salt}{password}".encode("utf-8")).hexdigest()

def verify_password(plain_password: str, stored_password: str) -> bool:
    # Supports seeded demo accounts with plain text passwords AND securely hashed passwords
    if stored_password == plain_password:
        return True
    return stored_password == hash_password(plain_password)

@router.post("/register", response_model=LoginResponse)
@router.post("/signup", response_model=LoginResponse)
def register(data: SignupRequest, db: Session = Depends(get_db)):
    name = data.name.strip()
    email = data.email.strip().lower()
    password = data.password
    confirm_password = data.confirm_password

    # Validate Full Name
    if not name or len(name) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter your full name (at least 2 characters)."
        )

    # Validate Email Format
    email_regex = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
    if not re.match(email_regex, email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid email address (e.g. name@example.com)."
        )

    # Validate Password Length
    if not password or len(password) < 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 4 characters long."
        )

    # Validate Confirm Password if provided
    if confirm_password is not None and password != confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match. Please verify and try again."
        )

    # Check if User already exists
    existing = db.query(User).filter(func.lower(User.email) == email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists. Please log in instead."
        )

    # Create new User securely
    hashed_pwd = hash_password(password)
    seed_name = re.sub(r'[^a-zA-Z0-9]', '', name) or "User"
    avatar_url = f"https://api.dicebear.com/7.x/avataaars/svg?seed={seed_name}"

    new_user = User(
        name=name,
        email=email,
        password=hashed_pwd,
        role=data.role if data.role else "Team Member",
        avatar=avatar_url
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "token": f"token-{new_user.id}",
        "user": new_user
    }

@router.post("/login", response_model=LoginResponse)
def login(creds: LoginRequest, db: Session = Depends(get_db)):
    email = creds.email.strip().lower()
    password = creds.password

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide your email address."
        )
    if not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter your password."
        )

    user = db.query(User).filter(func.lower(User.email) == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No account found with this email. Please check your email or create a new account."
        )

    if not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password. Please verify and try again."
        )

    return {
        "token": f"token-{user.id}",
        "user": user
    }

@router.post("/demo-login", response_model=LoginResponse)
def demo_login(db: Session = Depends(get_db)):
    # Default demo team lead
    user = db.query(User).filter(User.email == "poojasri@team.io").first()
    if not user:
        user = User(
            name="Poojasri T",
            email="poojasri@team.io",
            password="demo",
            role="Team Lead / Product Owner",
            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Poojasri"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return {
        "token": f"demo-token-{user.id}",
        "user": user
    }

from ..auth_deps import get_current_user_optional

@router.get("/me", response_model=UserResponse)
def get_current_user(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    if current_user:
        return current_user
    user = db.query(User).first()
    if not user:
        user = User(
            name="Poojasri T",
            email="poojasri@team.io",
            password="demo",
            role="Team Lead",
            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Poojasri"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
