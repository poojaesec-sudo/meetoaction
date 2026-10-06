export const DEFAULT_MEETINGS = [
  {
    id: 1,
    title: 'Project Review & Prototype Alignment',
    date: '2026-10-04',
    participants: 'Poojasri, Rithanya, Poojitha',
    agenda: '1. Prototype alignment\n2. Task responsibilities and timeline\n3. Technology stack selection',
    transcript: 'Project review meeting. Poojasri will prepare the presentation by October 8. Rithanya will complete the dataset preparation by October 6. Poojitha will test the model by October 10. The team decided to use Python and FastAPI for the prototype.',
    summary: 'Project Review focused on project alignment, task delegation, and technical decisions. Key responsibilities were assigned to Poojasri, Rithanya, and Poojitha across 3 action items. Primary decision made: Use Python and FastAPI for the prototype.',
    created_at: '2026-10-04T10:00:00Z',
    action_items_count: 3,
    completion_rate: 33.3,
    discussion_points: [
      { id: 1, meeting_id: 1, point: 'Project roadmap alignment and MVP timeline' },
      { id: 2, meeting_id: 1, point: 'Presentation structuring and executive demo visual assets' },
      { id: 3, meeting_id: 1, point: 'Dataset preprocessing and feature extraction pipeline' },
      { id: 4, meeting_id: 1, point: 'Model validation metrics and test suite execution' }
    ],
    decisions: [
      { id: 1, meeting_id: 1, decision: 'Use Python and FastAPI for the prototype backend' },
      { id: 2, meeting_id: 1, decision: 'Use SQLite for lightweight persistence and zero-config deployment' }
    ],
    action_items: [
      {
        id: 1,
        meeting_id: 1,
        meeting_title: 'Project Review & Prototype Alignment',
        task: 'Prepare the presentation',
        description: 'Create executive slide deck highlighting architecture, demo workflows, and business value.',
        assignee: 'Poojasri',
        deadline: 'October 8',
        priority: 'High',
        status: 'In Progress',
        progress: 65,
        source_context: 'Poojasri will prepare the presentation by October 8.',
        is_inferred_priority: true,
        created_at: '2026-10-04T10:15:00Z'
      },
      {
        id: 2,
        meeting_id: 1,
        meeting_title: 'Project Review & Prototype Alignment',
        task: 'Complete the dataset preparation',
        description: 'Clean and curate meeting transcripts corpus and validate entity annotation tags.',
        assignee: 'Rithanya',
        deadline: 'October 6',
        priority: 'High',
        status: 'Completed',
        progress: 100,
        source_context: 'Rithanya will complete the dataset preparation by October 6.',
        is_inferred_priority: true,
        created_at: '2026-10-04T10:18:00Z'
      },
      {
        id: 3,
        meeting_id: 1,
        meeting_title: 'Project Review & Prototype Alignment',
        task: 'Test the model',
        description: 'Execute automated benchmark evaluations and measure entity recognition precision/recall.',
        assignee: 'Poojitha',
        deadline: 'October 10',
        priority: 'Medium',
        status: 'Pending',
        progress: 0,
        source_context: 'Poojitha will test the model by October 10.',
        is_inferred_priority: true,
        created_at: '2026-10-04T10:20:00Z'
      }
    ]
  },
  {
    id: 2,
    title: 'Sprint 1 Architecture & Design Sync',
    date: '2026-09-28',
    participants: 'Poojasri, Rithanya, Poojitha, Karthik',
    agenda: '1. UI framework decision\n2. Database schema validation\n3. REST API routing and CORS',
    transcript: 'Sprint 1 architecture meeting. We agreed on modern Tailwind CSS for frontend styling. Karthik will set up the REST API endpoints and CORS configuration by October 2. Poojasri will finalize the database schema by September 30. Rithanya to review data privacy compliance by October 1.',
    summary: 'Technical kickoff covering UI styling framework, schema design, and API endpoints. Architecture consensus reached on Tailwind and FastAPI.',
    created_at: '2026-09-28T14:30:00Z',
    action_items_count: 4,
    completion_rate: 75.0,
    discussion_points: [
      { id: 5, meeting_id: 2, point: 'Frontend styling guidelines and component design system' },
      { id: 6, meeting_id: 2, point: 'API schema validation and error responses standardization' }
    ],
    decisions: [
      { id: 3, meeting_id: 2, decision: 'Adopt Tailwind CSS for flexible, modern responsive design' },
      { id: 4, meeting_id: 2, decision: 'Implement strict RESTful routing with Pydantic payload validation' }
    ],
    action_items: [
      {
        id: 4,
        meeting_id: 2,
        meeting_title: 'Sprint 1 Architecture & Design Sync',
        task: 'Finalize the database schema',
        description: 'Define SQLAlchemy models for Meetings, Action Items, Decisions, and Users.',
        assignee: 'Poojasri',
        deadline: 'September 30',
        priority: 'High',
        status: 'Completed',
        progress: 100,
        source_context: 'Poojasri will finalize the database schema by September 30.',
        is_inferred_priority: false,
        created_at: '2026-09-28T14:40:00Z'
      },
      {
        id: 5,
        meeting_id: 2,
        meeting_title: 'Sprint 1 Architecture & Design Sync',
        task: 'Set up REST API endpoints and CORS',
        description: 'Implement FastAPI routers for meetings, tasks, and accountability.',
        assignee: 'Karthik',
        deadline: 'October 2',
        priority: 'High',
        status: 'Completed',
        progress: 100,
        source_context: 'Karthik will set up the REST API endpoints and CORS configuration by October 2.',
        is_inferred_priority: false,
        created_at: '2026-09-28T14:45:00Z'
      },
      {
        id: 6,
        meeting_id: 2,
        meeting_title: 'Sprint 1 Architecture & Design Sync',
        task: 'Review data privacy compliance',
        description: 'Verify employee privacy safeguards and ensure no sensitive personal assessments are generated.',
        assignee: 'Rithanya',
        deadline: 'October 1',
        priority: 'Medium',
        status: 'Overdue',
        progress: 40,
        source_context: 'Rithanya to review data privacy compliance by October 1.',
        is_inferred_priority: false,
        created_at: '2026-09-28T14:50:00Z'
      },
      {
        id: 7,
        meeting_id: 2,
        meeting_title: 'Sprint 1 Architecture & Design Sync',
        task: 'Publish API Swagger Documentation',
        description: 'Generate OpenAPI schema and ensure endpoint documentation is comprehensive.',
        assignee: 'Karthik',
        deadline: 'October 3',
        priority: 'Low',
        status: 'Completed',
        progress: 100,
        source_context: 'Karthik to document Swagger by October 3.',
        is_inferred_priority: true,
        created_at: '2026-09-28T15:00:00Z'
      }
    ]
  },
  {
    id: 3,
    title: 'AI Intelligence & Executive Demo Dry Run',
    date: '2026-10-02',
    participants: 'Poojasri, Karthik, Aravind',
    agenda: '1. Live demo run-through\n2. Local heuristic fallback validation\n3. Cloudflare tunnel and Vercel edge testing',
    transcript: 'Executive demo dry run. Aravind will verify the Vercel edge deployment latency by October 7. Poojasri will record the video demonstration walkthrough by October 8.',
    summary: 'Validation dry run ensuring zero-friction demo experience across local and deployed environments.',
    created_at: '2026-10-02T16:00:00Z',
    action_items_count: 2,
    completion_rate: 50.0,
    discussion_points: [
      { id: 7, meeting_id: 3, point: 'Network latency optimization and cold start mitigation' },
      { id: 8, meeting_id: 3, point: 'User onboarding tour and instant demo credentials flow' }
    ],
    decisions: [
      { id: 5, meeting_id: 3, decision: 'Provide seamless instant demo login for hackathon evaluation' }
    ],
    action_items: [
      {
        id: 8,
        meeting_id: 3,
        meeting_title: 'AI Intelligence & Executive Demo Dry Run',
        task: 'Verify Vercel edge deployment latency',
        description: 'Benchmark CORS headers and SSL negotiation times from multiple regions.',
        assignee: 'Aravind',
        deadline: 'October 7',
        priority: 'Medium',
        status: 'In Progress',
        progress: 80,
        source_context: 'Aravind will verify the Vercel edge deployment latency by October 7.',
        is_inferred_priority: true,
        created_at: '2026-10-02T16:15:00Z'
      }
    ]
  }
];

export const DEFAULT_TASKS = [
  ...DEFAULT_MEETINGS[0].action_items,
  ...DEFAULT_MEETINGS[1].action_items,
  ...DEFAULT_MEETINGS[2].action_items,
];

export const DEFAULT_TEAM = [
  {
    id: 1,
    name: 'Poojasri T',
    email: 'poojasri@team.io',
    role: 'Team Lead / Product Owner',
    status: 'Active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Poojasri',
    active_tasks_count: 1,
    completed_tasks_count: 1
  },
  {
    id: 2,
    name: 'Rithanya S',
    email: 'rithanya@team.io',
    role: 'Data Engineer',
    status: 'In Meeting',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rithanya',
    active_tasks_count: 1,
    completed_tasks_count: 1
  },
  {
    id: 3,
    name: 'Poojitha K',
    email: 'poojitha@team.io',
    role: 'ML & QA Engineer',
    status: 'Available',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Poojitha',
    active_tasks_count: 1,
    completed_tasks_count: 0
  },
  {
    id: 4,
    name: 'Karthik M',
    email: 'karthik@team.io',
    role: 'Fullstack Developer',
    status: 'Active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik',
    active_tasks_count: 0,
    completed_tasks_count: 2
  },
  {
    id: 5,
    name: 'Aravind R',
    email: 'aravind@team.io',
    role: 'Cloud & DevOps Architect',
    status: 'Away',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aravind',
    active_tasks_count: 1,
    completed_tasks_count: 0
  }
];

export const DEFAULT_STATS = {
  total_meetings: 3,
  total_action_items: 8,
  pending_tasks: 2,
  in_progress_tasks: 2,
  completed_tasks: 4,
  overdue_tasks: 1,
  high_priority_tasks: 4,
  completion_percentage: 50.0,
  status_distribution: {
    Completed: 4,
    'In Progress': 2,
    Pending: 2,
    Overdue: 1
  },
  priority_distribution: {
    High: 4,
    Medium: 3,
    Low: 1
  },
  recent_meetings: DEFAULT_MEETINGS.slice(0, 3),
  upcoming_deadlines: DEFAULT_TASKS.filter((t) => t.status !== 'Completed').slice(0, 4),
  overdue_list: DEFAULT_TASKS.filter((t) => t.status === 'Overdue')
};

export const DEFAULT_ACCOUNTABILITY = {
  team_members: [
    {
      member: 'Poojasri T',
      total_assigned: 2,
      completed: 1,
      pending: 0,
      in_progress: 1,
      overdue: 0,
      completion_percentage: 50.0,
      high_priority_count: 2,
      tasks: DEFAULT_TASKS.filter((t) => t.assignee === 'Poojasri')
    },
    {
      member: 'Rithanya S',
      total_assigned: 2,
      completed: 1,
      pending: 0,
      in_progress: 0,
      overdue: 1,
      completion_percentage: 50.0,
      high_priority_count: 1,
      tasks: DEFAULT_TASKS.filter((t) => t.assignee === 'Rithanya')
    },
    {
      member: 'Poojitha K',
      total_assigned: 1,
      completed: 0,
      pending: 1,
      in_progress: 0,
      overdue: 0,
      completion_percentage: 0.0,
      high_priority_count: 0,
      tasks: DEFAULT_TASKS.filter((t) => t.assignee === 'Poojitha')
    },
    {
      member: 'Karthik M',
      total_assigned: 2,
      completed: 2,
      pending: 0,
      in_progress: 0,
      overdue: 0,
      completion_percentage: 100.0,
      high_priority_count: 1,
      tasks: DEFAULT_TASKS.filter((t) => t.assignee === 'Karthik')
    },
    {
      member: 'Aravind R',
      total_assigned: 1,
      completed: 0,
      pending: 0,
      in_progress: 1,
      overdue: 0,
      completion_percentage: 0.0,
      high_priority_count: 0,
      tasks: DEFAULT_TASKS.filter((t) => t.assignee === 'Aravind')
    }
  ],
  total_tasks: 8,
  total_completed: 4,
  overall_completion_rate: 50.0
};

export const DEFAULT_INSIGHTS = {
  unresolved_tasks_count: 4,
  people_with_pending_tasks: ['Poojitha', 'Poojasri', 'Rithanya', 'Aravind'],
  overdue_task_count: 1,
  frequently_discussed_topics: [
    { topic: 'Prototype Architecture', count: 3, percentage: 38 },
    { topic: 'Dataset Preparation', count: 2, percentage: 25 },
    { topic: 'Presentation & Slides', count: 2, percentage: 25 },
    { topic: 'CORS & REST Endpoints', count: 1, percentage: 12 }
  ],
  meeting_productivity_trends: [
    { period: 'Week 1', meetings: 1, actions_extracted: 4, completion_rate: 75 },
    { period: 'Week 2', meetings: 2, actions_extracted: 4, completion_rate: 50 }
  ],
  workload_distribution: [
    { name: 'Poojasri', active_tasks: 1, completed: 1 },
    { name: 'Rithanya', active_tasks: 1, completed: 1 },
    { name: 'Poojitha', active_tasks: 1, completed: 0 },
    { name: 'Karthik', active_tasks: 0, completed: 2 },
    { name: 'Aravind', active_tasks: 1, completed: 0 }
  ],
  actionable_recommendations: [
    {
      type: 'Overdue Alert',
      severity: 'high',
      title: 'Address Overdue Privacy Compliance Task',
      description: 'Rithanya has 1 overdue task: "Review data privacy compliance". Recommend scheduling a 5-minute sync to remove blockers.'
    },
    {
      type: 'Execution Velocity',
      severity: 'success',
      title: 'Strong Engineering Completion Rate',
      description: 'Karthik completed 100% of assigned sprint deliverables on schedule. Backend API endpoints and CORS setup are finalized.'
    },
    {
      type: 'Delegation Balance',
      severity: 'info',
      title: 'Balanced Sprint Distribution',
      description: 'Tasks are evenly distributed across all 5 active team members with clear priority categorization.'
    }
  ]
};
