from collections import defaultdict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import ActionItem, Meeting
from ..schemas import AccountabilityStats, MemberAccountability, ActionItemResponse
from ..auth_deps import get_active_user_id

router = APIRouter(prefix="/accountability", tags=["Accountability"])

@router.get("", response_model=AccountabilityStats)
def get_accountability_stats(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_active_user_id)
):
    """
    Computes accountability metrics for every team member in the authenticated user's workspace.
    """
    tasks = db.query(ActionItem).filter(ActionItem.user_id == user_id).all()

    if not tasks:
        return AccountabilityStats(
            team_members=[],
            total_tasks=0,
            total_completed=0,
            overall_completion_rate=0.0
        )

    # Group by assignee
    grouped = defaultdict(list)
    for t in tasks:
        assignee = t.assignee.strip() if t.assignee else "Unassigned"
        grouped[assignee].append(t)

    member_stats = []
    total_all_tasks = len(tasks)
    total_all_completed = 0

    for member, m_tasks in grouped.items():
        total_assigned = len(m_tasks)
        completed = sum(1 for t in m_tasks if t.status == "Completed")
        pending = sum(1 for t in m_tasks if t.status == "Pending")
        in_progress = sum(1 for t in m_tasks if t.status == "In Progress")
        overdue = sum(1 for t in m_tasks if t.status == "Overdue")
        high_priority = sum(1 for t in m_tasks if t.priority == "High")

        total_all_completed += completed
        rate = round((completed / total_assigned * 100), 1) if total_assigned > 0 else 0.0

        task_responses = []
        for t in m_tasks:
            m_title = t.meeting.title if t.meeting else "Direct Task"
            task_responses.append(ActionItemResponse(
                id=t.id,
                meeting_id=t.meeting_id,
                meeting_title=m_title,
                task=t.task,
                description=t.description,
                assignee=t.assignee,
                deadline=t.deadline,
                priority=t.priority,
                status=t.status,
                progress=t.progress,
                source_context=t.source_context,
                is_inferred_priority=t.is_inferred_priority,
                created_at=t.created_at
            ))

        member_stats.append(MemberAccountability(
            member=member,
            total_assigned=total_assigned,
            completed=completed,
            pending=pending,
            in_progress=in_progress,
            overdue=overdue,
            completion_percentage=rate,
            high_priority_count=high_priority,
            tasks=task_responses
        ))

    member_stats.sort(key=lambda x: (x.member == "Unassigned", -x.total_assigned))
    overall_rate = round((total_all_completed / total_all_tasks * 100), 1) if total_all_tasks > 0 else 0.0

    return AccountabilityStats(
        team_members=member_stats,
        total_tasks=total_all_tasks,
        total_completed=total_all_completed,
        overall_completion_rate=overall_rate
    )
