from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Meeting, ActionItem, Decision, DiscussionPoint
from ..schemas import (
    MeetingCreate,
    MeetingResponse,
    MeetingDetailResponse,
    MeetingAnalyzeRequest,
    AIAnalysisResult
)
from ..services.ai_service import analyze_meeting_transcript
from ..auth_deps import get_active_user_id

router = APIRouter(prefix="/meetings", tags=["Meetings"])

@router.post("/analyze", response_model=AIAnalysisResult)
async def analyze_meeting(payload: MeetingAnalyzeRequest):
    """
    Runs AI analysis on the transcript to extract summary, discussion points,
    decisions, and structured action items without saving to the DB yet.
    """
    if not payload.transcript.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Meeting transcript or notes cannot be empty."
        )

    analysis = await analyze_meeting_transcript(
        transcript=payload.transcript,
        title=payload.title or "Untitled Meeting",
        date=payload.date or "",
        participants=payload.participants or ""
    )
    return analysis

@router.post("", response_model=MeetingDetailResponse, status_code=status.HTTP_201_CREATED)
def create_meeting(
    meeting_in: MeetingCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_active_user_id)
):
    """
    Persists an analyzed meeting, its decisions, discussion points, and action items
    isolated to the authenticated user's workspace.
    """
    new_meeting = Meeting(
        user_id=user_id,
        title=meeting_in.title,
        date=meeting_in.date,
        participants=meeting_in.participants or "",
        agenda=meeting_in.agenda or "",
        transcript=meeting_in.transcript or "",
        summary=meeting_in.summary or ""
    )
    db.add(new_meeting)
    db.commit()
    db.refresh(new_meeting)

    # Save Discussion Points
    if meeting_in.discussion_points:
        for pt in meeting_in.discussion_points:
            db.add(DiscussionPoint(meeting_id=new_meeting.id, point=pt))

    # Save Decisions
    if meeting_in.decisions:
        for dec in meeting_in.decisions:
            db.add(Decision(meeting_id=new_meeting.id, decision=dec))

    # Save Action Items
    if meeting_in.action_items:
        for item in meeting_in.action_items:
            db.add(ActionItem(
                user_id=user_id,
                meeting_id=new_meeting.id,
                task=item.task,
                description=item.description or "",
                assignee=item.assignee or "Unassigned",
                deadline=item.deadline or "Not specified",
                priority=item.priority or "Medium",
                status=item.status or "Pending",
                progress=item.progress or 0,
                source_context=item.source_context or "",
                is_inferred_priority=item.is_inferred_priority or False
            ))

    db.commit()
    db.refresh(new_meeting)

    # Build response with calculated metrics
    total_actions = len(new_meeting.action_items)
    completed_actions = sum(1 for a in new_meeting.action_items if a.status == "Completed")
    completion_rate = round((completed_actions / total_actions * 100), 1) if total_actions > 0 else 0.0

    return {
        "id": new_meeting.id,
        "title": new_meeting.title,
        "date": new_meeting.date,
        "participants": new_meeting.participants,
        "agenda": new_meeting.agenda,
        "summary": new_meeting.summary,
        "transcript": new_meeting.transcript,
        "created_at": new_meeting.created_at,
        "action_items_count": total_actions,
        "completion_rate": completion_rate,
        "discussion_points": new_meeting.discussion_points,
        "decisions": new_meeting.decisions,
        "action_items": new_meeting.action_items
    }

@router.get("", response_model=List[MeetingResponse])
def get_meetings(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_active_user_id)
):
    """
    Returns all meetings belonging to the authenticated user.
    """
    meetings = db.query(Meeting).filter(Meeting.user_id == user_id).order_by(Meeting.created_at.desc()).all()
    results = []
    for m in meetings:
        total = len(m.action_items)
        completed = sum(1 for a in m.action_items if a.status == "Completed")
        rate = round((completed / total * 100), 1) if total > 0 else 0.0
        results.append({
            "id": m.id,
            "title": m.title,
            "date": m.date,
            "participants": m.participants,
            "agenda": m.agenda or "",
            "summary": m.summary,
            "created_at": m.created_at,
            "action_items_count": total,
            "completion_rate": rate
        })
    return results

@router.get("/{id}", response_model=MeetingDetailResponse)
def get_meeting(
    id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_active_user_id)
):
    """
    Returns full details of a specific meeting belonging to the authenticated user.
    """
    meeting = db.query(Meeting).filter(Meeting.id == id, Meeting.user_id == user_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    total = len(meeting.action_items)
    completed = sum(1 for a in meeting.action_items if a.status == "Completed")
    rate = round((completed / total * 100), 1) if total > 0 else 0.0

    action_items_res = []
    for a in meeting.action_items:
        action_items_res.append({
            "id": a.id,
            "meeting_id": a.meeting_id,
            "meeting_title": meeting.title,
            "task": a.task,
            "description": a.description,
            "assignee": a.assignee,
            "deadline": a.deadline,
            "priority": a.priority,
            "status": a.status,
            "progress": a.progress,
            "source_context": a.source_context,
            "is_inferred_priority": a.is_inferred_priority,
            "created_at": a.created_at
        })

    return {
        "id": meeting.id,
        "title": meeting.title,
        "date": meeting.date,
        "participants": meeting.participants,
        "agenda": meeting.agenda or "",
        "summary": meeting.summary,
        "transcript": meeting.transcript,
        "created_at": meeting.created_at,
        "action_items_count": total,
        "completion_rate": rate,
        "discussion_points": meeting.discussion_points,
        "decisions": meeting.decisions,
        "action_items": action_items_res
    }

@router.put("/{id}", response_model=MeetingDetailResponse)
def update_meeting(
    id: int,
    updates: dict,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_active_user_id)
):
    """
    Updates a meeting's title, date, participants, agenda, transcript/notes, or summary.
    """
    meeting = db.query(Meeting).filter(Meeting.id == id, Meeting.user_id == user_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    allowed_fields = ["title", "date", "participants", "agenda", "transcript", "summary"]
    for field in allowed_fields:
        if field in updates and updates[field] is not None:
            setattr(meeting, field, updates[field])

    db.commit()
    db.refresh(meeting)

    total = len(meeting.action_items)
    completed = sum(1 for a in meeting.action_items if a.status == "Completed")
    rate = round((completed / total * 100), 1) if total > 0 else 0.0

    action_items_res = []
    for a in meeting.action_items:
        action_items_res.append({
            "id": a.id,
            "meeting_id": a.meeting_id,
            "meeting_title": meeting.title,
            "task": a.task,
            "description": a.description,
            "assignee": a.assignee,
            "deadline": a.deadline,
            "priority": a.priority,
            "status": a.status,
            "progress": a.progress,
            "source_context": a.source_context,
            "is_inferred_priority": a.is_inferred_priority,
            "created_at": a.created_at
        })

    return {
        "id": meeting.id,
        "title": meeting.title,
        "date": meeting.date,
        "participants": meeting.participants,
        "agenda": meeting.agenda or "",
        "summary": meeting.summary,
        "transcript": meeting.transcript,
        "created_at": meeting.created_at,
        "action_items_count": total,
        "completion_rate": rate,
        "discussion_points": meeting.discussion_points,
        "decisions": meeting.decisions,
        "action_items": action_items_res
    }


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meeting(
    id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_active_user_id)
):
    """
    Deletes a meeting belonging to the authenticated user.
    """
    meeting = db.query(Meeting).filter(Meeting.id == id, Meeting.user_id == user_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    db.delete(meeting)
    db.commit()
    return None
