from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import TeamMember, ActionItem
from ..schemas import TeamMemberCreate, TeamMemberUpdate, TeamMemberResponse
from ..auth_deps import get_active_user_id

router = APIRouter(prefix="/team", tags=["Team"])

@router.get("", response_model=List[TeamMemberResponse])
def get_team_members(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_active_user_id)
):
    """
    Returns all team members in the user's workspace,
    with aggregated active and completed task counts.
    """
    members = db.query(TeamMember).filter(TeamMember.user_id == user_id).all()
    
    # If no team members exist yet for this user, seed default team members
    if not members:
        defaults = [
            TeamMember(user_id=user_id, name="Poojasri T", email="poojasri@team.io", role="Team Lead / Product Owner", status="Active", avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Poojasri"),
            TeamMember(user_id=user_id, name="Rithanya S", email="rithanya@team.io", role="Data Engineer", status="In Meeting", avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Rithanya"),
            TeamMember(user_id=user_id, name="Poojitha K", email="poojitha@team.io", role="ML & QA Engineer", status="Available", avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Poojitha"),
            TeamMember(user_id=user_id, name="Karthik M", email="karthik@team.io", role="Fullstack Developer", status="Active", avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik"),
        ]
        db.add_all(defaults)
        db.commit()
        members = db.query(TeamMember).filter(TeamMember.user_id == user_id).all()

    # Get all action items for task metrics
    all_tasks = db.query(ActionItem).filter(ActionItem.user_id == user_id).all()

    results = []
    for m in members:
        m_name_lower = m.name.lower()
        first_name = m.name.split()[0].lower() if m.name else ""

        # Match tasks assigned to full name or first name
        user_tasks = [
            t for t in all_tasks 
            if t.assignee and (t.assignee.lower() == m_name_lower or t.assignee.lower() == first_name)
        ]
        active = sum(1 for t in user_tasks if t.status in ["Pending", "In Progress", "Overdue"])
        completed = sum(1 for t in user_tasks if t.status == "Completed")

        results.append({
            "id": m.id,
            "user_id": m.user_id,
            "name": m.name,
            "email": m.email,
            "role": m.role,
            "status": m.status,
            "avatar": m.avatar or f"https://api.dicebear.com/7.x/avataaars/svg?seed={m.name}",
            "active_tasks_count": active,
            "completed_tasks_count": completed,
            "created_at": m.created_at
        })
    return results

@router.post("", response_model=TeamMemberResponse, status_code=status.HTTP_201_CREATED)
def create_team_member(
    member_in: TeamMemberCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_active_user_id)
):
    """
    Adds a new team member to the workspace.
    """
    avatar = member_in.avatar or f"https://api.dicebear.com/7.x/avataaars/svg?seed={member_in.name}"
    member = TeamMember(
        user_id=user_id,
        name=member_in.name.strip(),
        email=member_in.email.strip().lower(),
        role=member_in.role or "Team Member",
        status=member_in.status or "Active",
        avatar=avatar
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return {
        "id": member.id,
        "user_id": member.user_id,
        "name": member.name,
        "email": member.email,
        "role": member.role,
        "status": member.status,
        "avatar": member.avatar,
        "active_tasks_count": 0,
        "completed_tasks_count": 0,
        "created_at": member.created_at
    }

@router.put("/{id}", response_model=TeamMemberResponse)
def update_team_member(
    id: int,
    updates: TeamMemberUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_active_user_id)
):
    """
    Updates an existing team member's role, status, name, or avatar.
    """
    member = db.query(TeamMember).filter(TeamMember.id == id, TeamMember.user_id == user_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")

    update_data = updates.dict(exclude_unset=True)
    for field, val in update_data.items():
        if val is not None:
            setattr(member, field, val)

    db.commit()
    db.refresh(member)
    return {
        "id": member.id,
        "user_id": member.user_id,
        "name": member.name,
        "email": member.email,
        "role": member.role,
        "status": member.status,
        "avatar": member.avatar,
        "active_tasks_count": 0,
        "completed_tasks_count": 0,
        "created_at": member.created_at
    }

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team_member(
    id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_active_user_id)
):
    """
    Removes a team member from the workspace.
    """
    member = db.query(TeamMember).filter(TeamMember.id == id, TeamMember.user_id == user_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    db.delete(member)
    db.commit()
    return None
