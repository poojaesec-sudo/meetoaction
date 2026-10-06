from fastapi import APIRouter, HTTPException, status
from ..schemas import (
    AISummarizeRequest,
    AISummarizeResponse,
    AIActionItemsRequest,
    AIActionItemsResponse,
    AIHighlightsRequest,
    AIHighlightsResponse,
    AIFollowUpsRequest,
    AIFollowUpsResponse
)
from ..services.ai_service import analyze_meeting_transcript

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

@router.post("/summarize", response_model=AISummarizeResponse)
async def summarize_notes(payload: AISummarizeRequest):
    """
    Summarize meeting notes and extract key discussion points using AI / local NLP engine.
    """
    notes = payload.notes.strip()
    if not notes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Meeting notes cannot be empty."
        )

    analysis = await analyze_meeting_transcript(
        transcript=notes,
        title=payload.title or "Meeting",
    )
    return {
        "summary": analysis.get("summary", "Summary generated based on meeting notes."),
        "key_points": analysis.get("discussion_points", [])
    }

@router.post("/action-items", response_model=AIActionItemsResponse)
async def extract_action_items(payload: AIActionItemsRequest):
    """
    Extract structured action items (task, assignee, deadline, priority) from meeting notes.
    """
    notes = payload.notes.strip()
    if not notes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Meeting notes cannot be empty."
        )

    analysis = await analyze_meeting_transcript(
        transcript=notes,
        title=payload.title or "Meeting",
    )
    return {
        "action_items": analysis.get("action_items", [])
    }

@router.post("/highlights", response_model=AIHighlightsResponse)
async def generate_highlights(payload: AIHighlightsRequest):
    """
    Generates high-impact meeting highlights and key decisions.
    """
    notes = payload.notes.strip()
    if not notes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Meeting notes cannot be empty."
        )

    analysis = await analyze_meeting_transcript(
        transcript=notes,
        title=payload.title or "Meeting",
    )
    highlights = analysis.get("discussion_points", [])
    if not highlights:
        highlights = [
            f"Discussed core agenda topics for {payload.title or 'the team'}.",
            "Reviewed progress milestones and upcoming deliverables."
        ]
    return {
        "highlights": highlights,
        "decisions": analysis.get("decisions", [])
    }

@router.post("/follow-ups", response_model=AIFollowUpsResponse)
async def generate_follow_ups(payload: AIFollowUpsRequest):
    """
    Generates actionable follow-up check-ins and next steps.
    """
    notes = payload.notes.strip()
    if not notes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Meeting notes cannot be empty."
        )

    analysis = await analyze_meeting_transcript(
        transcript=notes,
        title=payload.title or "Meeting",
    )
    action_items = analysis.get("action_items", [])
    follow_ups = []
    
    for item in action_items:
        assignee = item.get("assignee") if isinstance(item, dict) else item.assignee
        task = item.get("task") if isinstance(item, dict) else item.task
        deadline = item.get("deadline") if isinstance(item, dict) else item.deadline
        if assignee and assignee != "Unassigned":
            follow_ups.append(f"Check in with {assignee} regarding '{task}' (Target: {deadline})")
        else:
            follow_ups.append(f"Assign an owner for '{task}' before next sprint sync")

    if not follow_ups:
        follow_ups = [
            "Send meeting summary and next steps email to all participants.",
            "Schedule next sync to review deliverables and address blockers.",
            "Verify task deadlines in the team sprint board."
        ]

    return {
        "follow_up_points": follow_ups
    }
