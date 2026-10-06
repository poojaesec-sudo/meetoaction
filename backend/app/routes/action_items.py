from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import ActionItem, Meeting
from ..schemas import ActionItemCreate, ActionItemUpdate, ActionItemResponse
from ..auth_deps import get_active_user_id

router = APIRouter(prefix="/action-items", tags=["Action Items"])

@router.get("", response_model=List[ActionItemResponse])
def get_action_items(
    priority: Optional[str] = Query(None, description="Filter by priority: High, Medium, Low"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status: Pending, In Progress, Completed, Overdue"),
    assignee: Optional[str] = Query(None, description="Filter by assigned person"),
    q: Optional[str] = Query(None, description="Search query in task title or description"),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_active_user_id)
):
    query = db.query(ActionItem).filter(ActionItem.user_id == user_id)

    if priority and priority != "All":
        query = query.filter(ActionItem.priority == priority)

    if status_filter and status_filter != "All":
        query = query.filter(ActionItem.status == status_filter)

    if assignee and assignee != "All":
        query = query.filter(ActionItem.assignee == assignee)

    if q:
        search_pattern = f"%{q}%"
        query = query.filter(
            (ActionItem.task.ilike(search_pattern)) | 
            (ActionItem.description.ilike(search_pattern)) |
            (ActionItem.assignee.ilike(search_pattern))
        )

    tasks = query.order_by(ActionItem.created_at.desc()).all()
    
    results = []
    for t in tasks:
        m_title = t.meeting.title if t.meeting else "Direct Action Item"
        results.append({
            "id": t.id,
            "meeting_id": t.meeting_id,
            "meeting_title": m_title,
            "task": t.task,
            "description": t.description,
            "assignee": t.assignee,
            "deadline": t.deadline,
            "priority": t.priority,
            "status": t.status,
            "progress": t.progress,
            "source_context": t.source_context,
            "is_inferred_priority": t.is_inferred_priority,
            "created_at": t.created_at
        })
    return results

@router.post("", response_model=ActionItemResponse, status_code=status.HTTP_201_CREATED)
def create_action_item(
    item_in: ActionItemCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_active_user_id)
):
    item = ActionItem(
        user_id=user_id,
        meeting_id=item_in.meeting_id,
        task=item_in.task,
        description=item_in.description or "",
        assignee=item_in.assignee or "Unassigned",
        deadline=item_in.deadline or "Not specified",
        priority=item_in.priority or "Medium",
        status=item_in.status or "Pending",
        progress=item_in.progress or 0,
        source_context=item_in.source_context or "",
        is_inferred_priority=item_in.is_inferred_priority or False
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    m_title = item.meeting.title if item.meeting else "Direct Action Item"
    return {
        "id": item.id,
        "meeting_id": item.meeting_id,
        "meeting_title": m_title,
        "task": item.task,
        "description": item.description,
        "assignee": item.assignee,
        "deadline": item.deadline,
        "priority": item.priority,
        "status": item.status,
        "progress": item.progress,
        "source_context": item.source_context,
        "is_inferred_priority": item.is_inferred_priority,
        "created_at": item.created_at
    }

@router.put("/{id}", response_model=ActionItemResponse)
def update_action_item(
    id: int,
    updates: ActionItemUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_active_user_id)
):
    item = db.query(ActionItem).filter(ActionItem.id == id, ActionItem.user_id == user_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found")

    update_data = updates.dict(exclude_unset=True)

    if "status" in update_data:
        if update_data["status"] == "Completed" and ("progress" not in update_data or update_data["progress"] is None):
            update_data["progress"] = 100
        elif update_data["status"] == "Pending" and ("progress" not in update_data or update_data["progress"] is None):
            update_data["progress"] = 0
            
    if "progress" in update_data and update_data["progress"] is not None:
        if update_data["progress"] == 100 and "status" not in update_data:
            update_data["status"] = "Completed"
        elif update_data["progress"] > 0 and update_data["progress"] < 100 and "status" not in update_data and item.status == "Pending":
            update_data["status"] = "In Progress"

    for field, val in update_data.items():
        setattr(item, field, val)

    db.commit()
    db.refresh(item)

    m_title = item.meeting.title if item.meeting else "Direct Action Item"
    return {
        "id": item.id,
        "meeting_id": item.meeting_id,
        "meeting_title": m_title,
        "task": item.task,
        "description": item.description,
        "assignee": item.assignee,
        "deadline": item.deadline,
        "priority": item.priority,
        "status": item.status,
        "progress": item.progress,
        "source_context": item.source_context,
        "is_inferred_priority": item.is_inferred_priority,
        "created_at": item.created_at
    }

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_action_item(
    id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_active_user_id)
):
    item = db.query(ActionItem).filter(ActionItem.id == id, ActionItem.user_id == user_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found")
    db.delete(item)
    db.commit()
    return None
