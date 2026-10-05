import re
from typing import Optional
from fastapi import Header, Depends
from sqlalchemy.orm import Session
from .database import get_db
from .models import User

def get_current_user_optional(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Extracts the authenticated user from the Authorization: Bearer <token> header.
    Returns None if no header is present or token does not match an existing user.
    """
    if not authorization:
        return None
    parts = authorization.split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        token_str = parts[1]
        match = re.search(r'(\d+)$', token_str)
        if match:
            try:
                uid = int(match.group(1))
                return db.query(User).filter(User.id == uid).first()
            except Exception:
                return None
    return None

def get_active_user_id(
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> int:
    """
    Returns the user ID of the authenticated user.
    If no user token is present, defaults to demo user (id=1).
    """
    if current_user and current_user.id:
        return current_user.id
    return 1
