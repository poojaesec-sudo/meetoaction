from sqlalchemy.orm import Session
from .models import User, Meeting, ActionItem, Decision, DiscussionPoint

def seed_database(db: Session, force_reset: bool = False):
    """
    Populates SQLite with realistic demo data, including the exact sample meeting:
    'Project review meeting. Poojasri will prepare the presentation by October 8.
     Rithanya will complete the dataset preparation by October 6.
     Poojitha will test the model by October 10.
     The team decided to use Python and FastAPI for the prototype.'
    """
    if force_reset:
        db.query(ActionItem).delete()
        db.query(Decision).delete()
        db.query(DiscussionPoint).delete()
        db.query(Meeting).delete()
        db.query(User).delete()
        db.commit()

    # Check if already seeded
    existing_user = db.query(User).first()
    if existing_user and not force_reset:
        return

    # Seed Users
    lead_user = User(
        name="Poojasri T",
        email="poojasri@team.io",
        password="demo",
        role="Team Lead / Product Owner",
        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Poojasri"
    )
    user2 = User(
        name="Rithanya S",
        email="rithanya@team.io",
        password="demo",
        role="Data Engineer",
        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Rithanya"
    )
    user3 = User(
        name="Poojitha K",
        email="poojitha@team.io",
        password="demo",
        role="ML & QA Engineer",
        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Poojitha"
    )
    user4 = User(
        name="Karthik M",
        email="karthik@team.io",
        password="demo",
        role="Fullstack Developer",
        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik"
    )
    db.add_all([lead_user, user2, user3, user4])
    db.commit()

    # Meeting 1: Requirement 15 Exact Sample Meeting
    m1 = Meeting(
        title="Project Review & Prototype Alignment",
        date="2026-10-04",
        participants="Poojasri, Rithanya, Poojitha",
        transcript="Project review meeting. Poojasri will prepare the presentation by October 8. Rithanya will complete the dataset preparation by October 6. Poojitha will test the model by October 10. The team decided to use Python and FastAPI for the prototype.",
        summary="Project Review focused on project alignment, task delegation, and technical decisions. Key responsibilities were assigned to Poojasri, Rithanya, and Poojitha across 3 action items. Primary decision made: Use Python and FastAPI for the prototype."
    )
    db.add(m1)
    db.commit()
    db.refresh(m1)

    # M1 Discussion points
    db.add_all([
        DiscussionPoint(meeting_id=m1.id, point="Project roadmap alignment and MVP timeline"),
        DiscussionPoint(meeting_id=m1.id, point="Presentation structuring and visual assets"),
        DiscussionPoint(meeting_id=m1.id, point="Dataset preprocessing and feature extraction"),
        DiscussionPoint(meeting_id=m1.id, point="Model validation metrics and test suite execution")
    ])

    # M1 Decisions
    db.add_all([
        Decision(meeting_id=m1.id, decision="Use Python and FastAPI for the prototype backend"),
        Decision(meeting_id=m1.id, decision="Use SQLite for lightweight local persistence and zero-config deployment")
    ])

    # M1 Action Items
    db.add_all([
        ActionItem(
            meeting_id=m1.id,
            task="Prepare the presentation",
            description="Create executive slide deck highlighting architecture, demo workflows, and business value.",
            assignee="Poojasri",
            deadline="October 8",
            priority="High",
            status="In Progress",
            progress=65,
            source_context="Poojasri will prepare the presentation by October 8.",
            is_inferred_priority=True
        ),
        ActionItem(
            meeting_id=m1.id,
            task="Complete the dataset preparation",
            description="Clean and curate meeting transcripts corpus and validate entity annotation tags.",
            assignee="Rithanya",
            deadline="October 6",
            priority="High",
            status="Pending",
            progress=25,
            source_context="Rithanya will complete the dataset preparation by October 6.",
            is_inferred_priority=True
        ),
        ActionItem(
            meeting_id=m1.id,
            task="Test the model",
            description="Execute automated benchmark evaluations and measure entity recognition precision/recall.",
            assignee="Poojitha",
            deadline="October 10",
            priority="Medium",
            status="Pending",
            progress=0,
            source_context="Poojitha will test the model by October 10.",
            is_inferred_priority=True
        )
    ])

    # Meeting 2: Architecture & Sprint 1 Kickoff (to show rich accountability stats & overdue/completed tracking)
    m2 = Meeting(
        title="Sprint 1 Architecture & Design Sync",
        date="2026-09-28",
        participants="Poojasri, Rithanya, Poojitha, Karthik",
        transcript="Sprint 1 architecture meeting. We agreed on modern Tailwind CSS for frontend styling. Karthik will set up the REST API endpoints and CORS configuration by October 2. Poojasri will finalize the database schema by September 30. Rithanya to review data privacy compliance by October 1.",
        summary="Technical kickoff covering UI styling framework, schema design, and API endpoints. Architecture consensus reached on Tailwind and FastAPI."
    )
    db.add(m2)
    db.commit()
    db.refresh(m2)

    db.add_all([
        DiscussionPoint(meeting_id=m2.id, point="Frontend styling guidelines and component design system"),
        DiscussionPoint(meeting_id=m2.id, point="API schema validation and error responses standardization")
    ])

    db.add_all([
        Decision(meeting_id=m2.id, decision="Adopt Tailwind CSS for flexible, modern responsive design"),
        Decision(meeting_id=m2.id, decision="Implement strict RESTful routing with Pydantic payload validation")
    ])

    db.add_all([
        ActionItem(
            meeting_id=m2.id,
            task="Finalize the database schema",
            description="Define SQLAlchemy models for Meetings, Action Items, Decisions, and Users.",
            assignee="Poojasri",
            deadline="September 30",
            priority="High",
            status="Completed",
            progress=100,
            source_context="Poojasri will finalize the database schema by September 30.",
            is_inferred_priority=False
        ),
        ActionItem(
            meeting_id=m2.id,
            task="Set up REST API endpoints and CORS",
            description="Implement FastAPI routers for meetings, tasks, and accountability.",
            assignee="Karthik",
            deadline="October 2",
            priority="High",
            status="Completed",
            progress=100,
            source_context="Karthik will set up the REST API endpoints and CORS configuration by October 2.",
            is_inferred_priority=False
        ),
        ActionItem(
            meeting_id=m2.id,
            task="Review data privacy compliance",
            description="Verify employee privacy safeguards and ensure no sensitive personal assessments are generated.",
            assignee="Rithanya",
            deadline="October 1",
            priority="Medium",
            status="Overdue",
            progress=40,
            source_context="Rithanya to review data privacy compliance by October 1.",
            is_inferred_priority=False
        ),
        ActionItem(
            meeting_id=m2.id,
            task="Publish API Swagger Documentation",
            description="Generate OpenAPI schema and ensure endpoint documentation is comprehensive.",
            assignee="Karthik",
            deadline="October 3",
            priority="Low",
            status="In Progress",
            progress=70,
            source_context="Karthik to document Swagger by October 3.",
            is_inferred_priority=True
        ),
        ActionItem(
            meeting_id=m2.id,
            task="Setup CI/CD deployment pipeline",
            description="Configure automated build and linting checks.",
            assignee="Unassigned",
            deadline="Not specified",
            priority="Medium",
            status="Pending",
            progress=0,
            source_context="Team discussed setting up CI/CD.",
            is_inferred_priority=True
        )
    ])

    db.commit()
