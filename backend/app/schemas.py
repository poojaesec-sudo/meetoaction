from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

# User Schemas
class UserBase(BaseModel):
    name: str
    email: str
    role: Optional[str] = "Team Member"
    avatar: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    confirm_password: Optional[str] = None
    role: Optional[str] = "Team Member"

class LoginResponse(BaseModel):
    token: str
    user: UserResponse

# Action Items Schemas
class ActionItemBase(BaseModel):
    task: str
    description: Optional[str] = ""
    assignee: Optional[str] = "Unassigned"
    deadline: Optional[str] = "Not specified"
    priority: Optional[str] = "Medium"
    status: Optional[str] = "Pending"
    progress: Optional[int] = 0
    source_context: Optional[str] = ""
    is_inferred_priority: Optional[bool] = False

class ActionItemCreate(ActionItemBase):
    meeting_id: Optional[int] = None

class ActionItemUpdate(BaseModel):
    task: Optional[str] = None
    description: Optional[str] = None
    assignee: Optional[str] = None
    deadline: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[int] = None
    source_context: Optional[str] = None
    meeting_id: Optional[int] = None

class ActionItemResponse(ActionItemBase):
    id: int
    meeting_id: Optional[int] = None
    meeting_title: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Decision Schemas
class DecisionBase(BaseModel):
    decision: str

class DecisionResponse(DecisionBase):
    id: int
    meeting_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Discussion Point Schemas
class DiscussionPointBase(BaseModel):
    point: str

class DiscussionPointResponse(DiscussionPointBase):
    id: int
    meeting_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Analysis AI Schemas
class ExtractedActionItem(BaseModel):
    task: str
    description: Optional[str] = ""
    assignee: str = "Unassigned"
    deadline: str = "Not specified"
    priority: str = "Medium"
    status: str = "Pending"
    source_context: Optional[str] = ""
    is_inferred_priority: bool = False

class AIAnalysisResult(BaseModel):
    summary: str
    discussion_points: List[str] = []
    decisions: List[str] = []
    action_items: List[ExtractedActionItem] = []
    topics: List[str] = []

class MeetingAnalyzeRequest(BaseModel):
    title: Optional[str] = "Untitled Meeting"
    date: Optional[str] = ""
    participants: Optional[str] = ""
    transcript: str

# Meeting Schemas
class MeetingCreate(BaseModel):
    title: str
    date: str
    participants: Optional[str] = ""
    transcript: str
    summary: Optional[str] = ""
    discussion_points: Optional[List[str]] = []
    decisions: Optional[List[str]] = []
    action_items: Optional[List[ActionItemBase]] = []

class MeetingResponse(BaseModel):
    id: int
    title: str
    date: str
    participants: str
    summary: str
    created_at: datetime
    action_items_count: int = 0
    completion_rate: float = 0.0

    class Config:
        from_attributes = True

class MeetingDetailResponse(MeetingResponse):
    transcript: str
    discussion_points: List[DiscussionPointResponse] = []
    decisions: List[DecisionResponse] = []
    action_items: List[ActionItemResponse] = []

    class Config:
        from_attributes = True

# Accountability Schemas
class MemberAccountability(BaseModel):
    member: str
    total_assigned: int
    completed: int
    pending: int
    in_progress: int
    overdue: int
    completion_percentage: float
    high_priority_count: int
    tasks: List[ActionItemResponse] = []

class AccountabilityStats(BaseModel):
    team_members: List[MemberAccountability]
    total_tasks: int
    total_completed: int
    overall_completion_rate: float

# Dashboard Stats Schemas
class DashboardStats(BaseModel):
    total_meetings: int
    total_action_items: int
    pending_tasks: int
    in_progress_tasks: int
    completed_tasks: int
    overdue_tasks: int
    high_priority_tasks: int
    completion_percentage: float
    status_distribution: dict
    priority_distribution: dict
    recent_meetings: List[MeetingResponse]
    upcoming_deadlines: List[ActionItemResponse]
    overdue_list: List[ActionItemResponse]

# Insights Schemas
class AIInsightsResponse(BaseModel):
    unresolved_tasks_count: int
    people_with_pending_tasks: List[str]
    overdue_task_count: int
    frequently_discussed_topics: List[dict]
    meeting_productivity_trends: List[dict]
    workload_distribution: List[dict]
    actionable_recommendations: List[dict]
