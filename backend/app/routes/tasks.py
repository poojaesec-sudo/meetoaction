from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import ActionItem, Meeting
from ..schemas import ActionItemCreate, ActionItemUpdate, ActionItemResponse
from ..auth_deps import get_active_user_id

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.get("", response_model=List[ActionItemResponse])
def get_tasks(
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
        m_title = t.meeting.title if t.meeting else "Direct Task"
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
def create_task(
    task_in: ActionItemCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_active_user_id)
):
    task = ActionItem(
        user_id=user_id,
        meeting_id=task_in.meeting_id,
        task=task_in.task,
        description=task_in.description or "",
        assignee=task_in.assignee or "Unassigned",
        deadline=task_in.deadline or "Not specified",
        priority=task_in.priority or "Medium",
        status=task_in.status or "Pending",
        progress=task_in.progress or 0,
        source_context=task_in.source_context or "",
        is_inferred_priority=task_in.is_inferred_priority or False
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    m_title = task.meeting.title if task.meeting else "Direct Task"
    return {
        "id": task.id,
        "meeting_id": task.meeting_id,
        "meeting_title": m_title,
        "task": task.task,
        "description": task.description,
        "assignee": task.assignee,
        "deadline": task.deadline,
        "priority": task.priority,
        "status": task.status,
        "progress": task.progress,
        "source_context": task.source_context,
        "is_inferred_priority": task.is_inferred_priority,
        "created_at": task.created_at
    }

@router.put("/{id}", response_model=ActionItemResponse)
def update_task(
    id: int,
    updates: ActionItemUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_active_user_id)
):
    task = db.query(ActionItem).filter(ActionItem.id == id, ActionItem.user_id == user_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = updates.dict(exclude_unset=True)

    # Auto-adjust progress if status changed to Completed
    if "status" in update_data:
        if update_data["status"] == "Completed" and ("progress" not in update_data or update_data["progress"] is None):
            update_data["progress"] = 100
        elif update_data["status"] == "Pending" and ("progress" not in update_data or update_data["progress"] is None):
            update_data["progress"] = 0
            
    # Auto-adjust status if progress changed to 100
    if "progress" in update_data and update_data["progress"] is not None:
        if update_data["progress"] == 100 and "status" not in update_data:
            update_data["status"] = "Completed"
        elif update_data["progress"] > 0 and update_data["progress"] < 100 and "status" not in update_data and task.status == "Pending":
            update_data["status"] = "In Progress"

    for field, val in update_data.items():
        setattr(task, field, val)

    db.commit()
    db.refresh(task)

    m_title = task.meeting.title if task.meeting else "Direct Task"
    return {
        "id": task.id,
        "meeting_id": task.meeting_id,
        "meeting_title": m_title,
        "task": task.task,
        "description": task.description,
        "assignee": task.assignee,
        "deadline": task.deadline,
        "priority": task.priority,
        "status": task.status,
        "progress": task.progress,
        "source_context": task.source_context,
        "is_inferred_priority": task.is_inferred_priority,
        "created_at": task.created_at
    }

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_active_user_id)
):
    task = db.query(ActionItem).filter(ActionItem.id == id, ActionItem.user_id == user_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return None
