from datetime import datetime, timedelta
from collections import Counter
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Meeting, ActionItem, DiscussionPoint, Decision
from ..schemas import DashboardStats, AIInsightsResponse, ActionItemResponse, MeetingResponse
from ..auth_deps import get_active_user_id

router = APIRouter(tags=["Insights & Dashboard"])

@router.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_active_user_id)
):
    meetings = db.query(Meeting).filter(Meeting.user_id == user_id).order_by(Meeting.created_at.desc()).all()
    tasks = db.query(ActionItem).filter(ActionItem.user_id == user_id).order_by(ActionItem.created_at.desc()).all()

    total_meetings = len(meetings)
    total_action_items = len(tasks)
    pending_tasks = sum(1 for t in tasks if t.status == "Pending")
    in_progress_tasks = sum(1 for t in tasks if t.status == "In Progress")
    completed_tasks = sum(1 for t in tasks if t.status == "Completed")
    overdue_tasks = sum(1 for t in tasks if t.status == "Overdue")
    high_priority_tasks = sum(1 for t in tasks if t.priority == "High")

    completion_percentage = round((completed_tasks / total_action_items * 100), 1) if total_action_items > 0 else 0.0

    # Status distribution
    status_dist = {
        "Pending": pending_tasks,
        "In Progress": in_progress_tasks,
        "Completed": completed_tasks,
        "Overdue": overdue_tasks
    }

    # Priority distribution
    priority_dist = {
        "High": sum(1 for t in tasks if t.priority == "High"),
        "Medium": sum(1 for t in tasks if t.priority == "Medium"),
        "Low": sum(1 for t in tasks if t.priority == "Low")
    }

    # Recent meetings
    recent_meetings_list = []
    for m in meetings[:5]:
        m_total = len(m.action_items)
        m_completed = sum(1 for a in m.action_items if a.status == "Completed")
        rate = round((m_completed / m_total * 100), 1) if m_total > 0 else 0.0
        recent_meetings_list.append(MeetingResponse(
            id=m.id,
            title=m.title,
            date=m.date,
            participants=m.participants,
            summary=m.summary,
            created_at=m.created_at,
            action_items_count=m_total,
            completion_rate=rate
        ))

    # Upcoming deadlines (Tasks not completed, with a deadline)
    upcoming = []
    overdue_list = []
    for t in tasks:
        m_title = t.meeting.title if t.meeting else "Direct Task"
        t_res = ActionItemResponse(
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
        )
        if t.status == "Overdue":
            overdue_list.append(t_res)
        elif t.status != "Completed" and t.deadline and t.deadline != "Not specified":
            upcoming.append(t_res)

    return DashboardStats(
        total_meetings=total_meetings,
        total_action_items=total_action_items,
        pending_tasks=pending_tasks,
        in_progress_tasks=in_progress_tasks,
        completed_tasks=completed_tasks,
        overdue_tasks=overdue_tasks,
        high_priority_tasks=high_priority_tasks,
        completion_percentage=completion_percentage,
        status_distribution=status_dist,
        priority_distribution=priority_dist,
        recent_meetings=recent_meetings_list,
        upcoming_deadlines=upcoming[:6],
        overdue_list=overdue_list[:6]
    )


@router.get("/insights", response_model=AIInsightsResponse)
def get_ai_insights(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_active_user_id)
):
    tasks = db.query(ActionItem).filter(ActionItem.user_id == user_id).all()
    meetings = db.query(Meeting).filter(Meeting.user_id == user_id).all()

    # If completely fresh account with zero data, return empty cleanly
    if not tasks and not meetings:
        return AIInsightsResponse(
            unresolved_tasks_count=0,
            people_with_pending_tasks=[],
            overdue_task_count=0,
            frequently_discussed_topics=[],
            meeting_productivity_trends=[],
            workload_distribution=[],
            actionable_recommendations=[]
        )

    # Unresolved tasks count
    unresolved_count = sum(1 for t in tasks if t.status in ["Pending", "In Progress", "Overdue"])
    overdue_count = sum(1 for t in tasks if t.status == "Overdue")

    # People with pending/in-progress tasks
    pending_people = list({
        t.assignee for t in tasks 
        if t.status in ["Pending", "In Progress", "Overdue"] and t.assignee not in ["Unassigned", ""]
    })

    # Frequently discussed topics
    topic_words = []
    stopwords = {"the", "and", "for", "with", "this", "that", "will", "from", "are", "team", "review", "meeting", "sync", "project", "test"}
    
    for m in meetings:
        topic_words.extend([w.lower() for w in m.title.split() if len(w) > 3 and w.lower() not in stopwords])
    for t in tasks:
        topic_words.extend([w.lower() for w in t.task.split() if len(w) > 3 and w.lower() not in stopwords])

    word_counts = Counter(topic_words).most_common(6)
    frequently_discussed = [
        {"topic": word.capitalize(), "frequency": count, "category": "Project Workstream"}
        for word, count in word_counts
    ]

    # Productivity trends per meeting
    meeting_trends = []
    for m in meetings[:6]:
        m_actions = m.action_items
        total = len(m_actions)
        done = sum(1 for a in m_actions if a.status == "Completed")
        rate = round((done / total * 100), 1) if total > 0 else 0.0
        meeting_trends.append({
            "meeting": m.title[:20] + "..." if len(m.title) > 20 else m.title,
            "date": m.date,
            "actions_generated": total,
            "completion_rate": rate
        })

    # Workload distribution
    assignee_counter = Counter(t.assignee for t in tasks if t.status != "Completed")
    workload_dist = [
        {"assignee": assignee, "active_tasks": count}
        for assignee, count in assignee_counter.most_common(5)
    ]

    # Constructive AI recommendations focused on active user tasks & timelines
    recommendations = []
    if overdue_count > 0:
        recommendations.append({
            "type": "Urgent",
            "title": f"{overdue_count} Overdue Milestone{'s' if overdue_count > 1 else ''}",
            "description": "Immediate team alignment recommended to unblock overdue dependencies and reset delivery target dates.",
            "impact": "High"
        })
    
    unassigned_count = sum(1 for t in tasks if t.assignee == "Unassigned" and t.status != "Completed")
    if unassigned_count > 0:
        recommendations.append({
            "type": "Action Required",
            "title": f"{unassigned_count} Unassigned Action Item{'s' if unassigned_count > 1 else ''}",
            "description": "Assign task owners during the next standup to prevent orphan work items from delaying milestones.",
            "impact": "Medium"
        })

    high_pending = sum(1 for t in tasks if t.priority == "High" and t.status in ["Pending", "In Progress"])
    if high_pending > 0:
        recommendations.append({
            "type": "Optimization",
            "title": f"Prioritize {high_pending} High-Priority Deliverable{'s' if high_pending > 1 else ''}",
            "description": "Direct sprint focus toward high-impact tasks to ensure project milestones are fulfilled on schedule.",
            "impact": "High"
        })

    if total_actions := len(tasks):
        recommendations.append({
            "type": "Process Health",
            "title": "Automated Action Tracking Active",
            "description": f"AI workspace active with {total_actions} extracted action items tracked.",
            "impact": "Positive"
        })

    return AIInsightsResponse(
        unresolved_tasks_count=unresolved_count,
        people_with_pending_tasks=pending_people,
        overdue_task_count=overdue_count,
        frequently_discussed_topics=frequently_discussed,
        meeting_productivity_trends=meeting_trends,
        workload_distribution=workload_dist,
        actionable_recommendations=recommendations
    )
