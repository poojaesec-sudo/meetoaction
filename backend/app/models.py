from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50), default="Team Member")
    avatar = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, default=1)
    title = Column(String(255), nullable=False)
    date = Column(String(50), nullable=False)
    participants = Column(Text, default="")  # comma-separated string
    agenda = Column(Text, default="")
    transcript = Column(Text, nullable=False)  # Notes / transcript
    summary = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    action_items = relationship("ActionItem", back_populates="meeting", cascade="all, delete-orphan")
    decisions = relationship("Decision", back_populates="meeting", cascade="all, delete-orphan")
    discussion_points = relationship("DiscussionPoint", back_populates="meeting", cascade="all, delete-orphan")

class ActionItem(Base):
    __tablename__ = "action_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, default=1)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=True)
    task = Column(String(255), nullable=False)
    description = Column(Text, default="")
    assignee = Column(String(100), default="Unassigned")
    deadline = Column(String(100), default="Not specified")
    priority = Column(String(20), default="Medium")  # High, Medium, Low
    status = Column(String(20), default="Pending")    # Pending, In Progress, Completed, Overdue
    progress = Column(Integer, default=0)             # 0 - 100
    source_context = Column(Text, default="")
    is_inferred_priority = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    meeting = relationship("Meeting", back_populates="action_items")

class Decision(Base):
    __tablename__ = "decisions"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False)
    decision = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    meeting = relationship("Meeting", back_populates="decisions")

class DiscussionPoint(Base):
    __tablename__ = "discussion_points"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False)
    point = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    meeting = relationship("Meeting", back_populates="discussion_points")

class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, default=1)
    name = Column(String(100), nullable=False)
    email = Column(String(120), nullable=False)
    role = Column(String(100), default="Team Member")
    status = Column(String(50), default="Active")  # Active, In Meeting, Away, Available
    avatar = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

