import React from 'react';
import {
  Calendar,
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  PlusCircle,
  TrendingUp,
  User,
  Sparkles,
  ChevronRight,
  Zap,
  Bot,
  Activity,
  Layers,
  FileText,
  UserCheck,
  Check,
  Cpu,
  Radio,
  Share2
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { TaskStatusBadge, PriorityBadge } from '../components/Badges';

export function DashboardPage({ stats, loading, setTab, onSelectMeeting, onQuickCompleteTask, currentUser }) {
  if (loading && !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 bg-[#0B0D0F]/90 rounded-3xl border border-[#171B20]"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-[#0B0D0F]/90 rounded-3xl border border-[#171B20]"></div>
          ))}
        </div>
      </div>
    );
  }

  const s = stats || {
    total_meetings: 0,
    total_action_items: 0,
    pending_tasks: 0,
    in_progress_tasks: 0,
    completed_tasks: 0,
    overdue_tasks: 0,
    high_priority_tasks: 0,
    completion_percentage: 0,
    status_distribution: { Pending: 0, 'In Progress': 0, Completed: 0, Overdue: 0 },
    priority_distribution: { High: 0, Medium: 0, Low: 0 },
    recent_meetings: [],
    upcoming_deadlines: [],
    overdue_list: [],
  };

  const isNewUser = s.total_meetings === 0;
  const totalActions = s.total_action_items || 1;
  const statusPercents = {
    Completed: Math.round(((s.status_distribution?.Completed || 0) / totalActions) * 100),
    'In Progress': Math.round(((s.status_distribution?.['In Progress'] || 0) / totalActions) * 100),
    Pending: Math.round(((s.status_distribution?.Pending || 0) / totalActions) * 100),
    Overdue: Math.round(((s.status_distribution?.Overdue || 0) / totalActions) * 100),
  };

  const userName = currentUser?.name || 'Commander';

  return (
    <div className="space-y-7">
      {/* ================= HERO SECTION: OBSIDIAN AI COMMAND CENTER ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0B0D0F]/95 backdrop-blur-2xl border border-[#171B20] p-6 lg:p-9 shadow-command-card">
        {/* Futuristic subtle glowing radial spots */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#B8FF00]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#FF2DA6]/7 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#FF7A00]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            {/* Small Neon Lime Badge with Black Text */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8FF00] text-[#050505] text-[10px] font-black uppercase tracking-wider mb-3.5 shadow-[0_0_14px_rgba(184,255,0,0.4)]">
              <Sparkles className="w-3 h-3 stroke-[3]" />
              <span>AI Operations Center</span>
            </div>

            {isNewUser ? (
              <>
                <h2 className="text-2xl lg:text-4xl font-black text-[#F5F7FA] tracking-tight leading-tight">
                  Welcome to Meet2Action AI 👋
                </h2>
                <p className="mt-2 text-xs lg:text-sm text-[#9CA3AF] font-medium leading-relaxed">
                  Your workspace is ready. Add your first meeting to start turning conversations into action.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setTab('add-meeting')}
                    className="px-6 py-3 bg-gradient-to-r from-[#B8FF00] to-[#FFD166] hover:from-[#C5FF1A] hover:to-[#FFE199] text-[#050505] font-black text-xs sm:text-sm rounded-2xl shadow-[0_0_24px_rgba(184,255,0,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2.5"
                  >
                    <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                    <span>+ Add Your First Meeting</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl lg:text-4xl font-black text-[#F5F7FA] tracking-tight leading-tight">
                  Command Node Active, {userName} 👋
                </h2>
                <p className="mt-2 text-xs lg:text-sm text-[#9CA3AF] font-medium leading-relaxed">
                  Transform raw meeting transcripts into prioritized action items. Synthesized <span className="text-[#B8FF00] font-bold">{s.total_action_items} tasks</span> across <span className="text-[#FFD166] font-bold">{s.total_meetings} meetings</span> with a <span className="text-[#B8FF00] font-bold">{s.completion_percentage}% execution velocity</span>.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setTab('add-meeting')}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#B8FF00] to-[#FFD166] hover:from-[#C5FF1A] hover:to-[#FFE199] text-[#050505] font-black text-xs rounded-2xl shadow-[0_0_20px_rgba(184,255,0,0.35)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                    <span>⚡ Analyze Meeting</span>
                  </button>
                  <button
                    onClick={() => setTab('accountability')}
                    className="px-4 py-2.5 bg-[#111418] hover:bg-[#171B20] text-[#F5F7FA] font-bold text-xs rounded-2xl border border-[#171B20] hover:border-[#FF2DA6]/40 transition-all flex items-center gap-2 hover:scale-105"
                  >
                    <span>Team Scorecard</span>
                    <ArrowRight className="w-4 h-4 text-[#FF2DA6]" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Glowing Futuristic AI Neural Orb Visual (Lime, Magenta, Orange, Gold) */}
          <div className="hidden lg:flex items-center justify-center p-6 rounded-3xl bg-[#111418]/80 backdrop-blur-xl border border-[#171B20] shadow-command-card relative">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Outer Lime dashed orbit ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-[#B8FF00]/40 animate-spin-slow" />
              {/* Secondary Magenta counter-rotating ring */}
              <div className="absolute inset-2 rounded-full border border-[#FF2DA6]/35 animate-spin-reverse" />
              {/* Third Gold inner ring */}
              <div className="absolute inset-4 rounded-full border border-dotted border-[#FFD166]/40 animate-spin-slow" />

              {/* Glowing Neural Orbital Nodes */}
              <div className="absolute -top-1 left-1/2 w-2.5 h-2.5 rounded-full bg-[#B8FF00] shadow-[0_0_10px_#B8FF00] animate-pulse" />
              <div className="absolute -bottom-1 left-1/4 w-2.5 h-2.5 rounded-full bg-[#FF2DA6] shadow-[0_0_10px_#FF2DA6]" />
              <div className="absolute top-1/3 -right-1 w-2.5 h-2.5 rounded-full bg-[#FF7A00] shadow-[0_0_10px_#FF7A00]" />
              <div className="absolute bottom-1/4 -left-1 w-2 h-2 rounded-full bg-[#FFD166] shadow-[0_0_8px_#FFD166]" />

              {/* Central Obsidian Core */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#B8FF00] via-[#FFD166] to-[#FF2DA6] p-[1.5px] shadow-[0_0_24px_rgba(184,255,0,0.4)] flex items-center justify-center">
                <div className="w-full h-full bg-[#050505] rounded-[14px] flex items-center justify-center">
                  <Bot className="w-8 h-8 text-[#B8FF00] animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= KPI CARDS: 4 DISTINCT COMMAND ACCENTS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Meetings → Electric Lime */}
        <StatCard
          title="Total Meetings"
          value={s.total_meetings}
          icon={Calendar}
          color="lime"
          subtitle={isNewUser ? "0 recorded transcripts" : "Processed transcripts"}
          change={isNewUser ? "Fresh node" : "+100% automated"}
        />
        {/* Action Items → Hot Magenta */}
        <StatCard
          title="Action Items"
          value={s.total_action_items}
          icon={CheckSquare}
          color="magenta"
          subtitle={isNewUser ? "0 extracted deliverables" : "Extracted by AI"}
          change={isNewUser ? "Awaiting input" : `${s.high_priority_tasks} High Priority`}
        />
        {/* Pending Tasks → Solar Orange */}
        <StatCard
          title="Pending Tasks"
          value={s.pending_tasks + s.in_progress_tasks}
          icon={Clock}
          color="orange"
          subtitle={isNewUser ? "0 active backlog items" : `${s.in_progress_tasks} in execution`}
          change="Sprint backlog"
        />
        {/* Completion Rate → Cyber Gold */}
        <StatCard
          title="Completion Rate"
          value={`${s.completion_percentage}%`}
          icon={CheckCircle2}
          color="gold"
          subtitle={isNewUser ? "0 completed items" : `${s.completed_tasks} completed deliverables`}
          change="Execution index"
        />
      </div>

      {/* ================= NEW USER ONBOARDING & GEOMETRIC MATRIX ================= */}
      {isNewUser && (
        <div className="bg-[#0B0D0F]/95 backdrop-blur-2xl rounded-3xl p-6 lg:p-8 border border-[#171B20] shadow-command-card relative overflow-hidden">
          {/* Subtle neon matrix glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#B8FF00]/10 via-[#FF2DA6]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#B8FF00] shadow-[0_0_8px_#B8FF00] animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-widest font-black text-[#B8FF00] font-mono">
                Command Onboarding Sequence
              </span>
            </div>
            <h3 className="text-lg lg:text-xl font-black text-[#F5F7FA] tracking-tight">
              Get Started in 4 Simple Steps
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-1 max-w-xl font-medium">
              Transform discussions and audio notes into high-impact accountability pipelines in seconds.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {[
                {
                  step: '01',
                  title: 'Step 1 — Add Meeting',
                  desc: 'Add or paste a meeting transcript or raw notes in seconds.',
                  icon: FileText,
                  accentColor: 'text-[#B8FF00]',
                  borderHover: 'hover:border-[#B8FF00]/50',
                  badgeBg: 'bg-[#B8FF00]/10 text-[#B8FF00]',
                },
                {
                  step: '02',
                  title: 'Step 2 — AI Analysis',
                  desc: 'Let AI analyze key decisions, discussion points, and tasks.',
                  icon: Bot,
                  accentColor: 'text-[#FFD166]',
                  borderHover: 'hover:border-[#FFD166]/50',
                  badgeBg: 'bg-[#FFD166]/10 text-[#FFD166]',
                },
                {
                  step: '03',
                  title: 'Step 3 — Review Items',
                  desc: 'Review extracted action items, assignees, deadlines, and urgency.',
                  icon: CheckSquare,
                  accentColor: 'text-[#FF7A00]',
                  borderHover: 'hover:border-[#FF7A00]/50',
                  badgeBg: 'bg-[#FF7A00]/10 text-[#FF7A00]',
                },
                {
                  step: '04',
                  title: 'Step 4 — Track Execution',
                  desc: 'Track team accountability, completion rates, and real-time scores.',
                  icon: TrendingUp,
                  accentColor: 'text-[#FF2DA6]',
                  borderHover: 'hover:border-[#FF2DA6]/50',
                  badgeBg: 'bg-[#FF2DA6]/10 text-[#FF2DA6]',
                }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className={`p-5 rounded-2xl bg-[#111418] border border-[#171B20] ${item.borderHover} transition-all duration-300 hover:-translate-y-1 hover:shadow-command-card flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3.5">
                        <span className="text-xs font-black font-mono text-[#9CA3AF]">
                          {item.step}
                        </span>
                        <div className={`p-2 rounded-xl border border-[#171B20] bg-[#0B0D0F] ${item.accentColor}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <h4 className="text-xs font-black text-[#F5F7FA]">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#9CA3AF] mt-1.5 leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Glowing Geometric Shapes SVG Matrix */}
            <div className="mt-6 pt-5 border-t border-[#171B20] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-[#9CA3AF] font-medium">
                {/* Micro geometric nodes */}
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="w-2 h-2 rounded-sm bg-[#B8FF00]/80"></span>
                  <span className="text-[#B8FF00]">Ready</span>
                  <span className="text-[#171B20]">•</span>
                  <span className="w-2 h-2 rounded-sm bg-[#FFD166]/80"></span>
                  <span className="text-[#FFD166]">Heuristic NLP</span>
                  <span className="text-[#171B20]">•</span>
                  <span className="w-2 h-2 rounded-sm bg-[#FF2DA6]/80"></span>
                  <span className="text-[#FF2DA6]">Isolated Workspace</span>
                </div>
              </div>
              <button
                onClick={() => setTab('add-meeting')}
                className="px-5 py-2.5 bg-gradient-to-r from-[#B8FF00] to-[#FFD166] hover:from-[#C5FF1A] hover:to-[#FFE199] text-[#050505] text-xs font-black rounded-xl shadow-[0_0_20px_rgba(184,255,0,0.35)] transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
              >
                <span>+ Add Your First Meeting</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= OVERDUE ALERT (Only when tasks exist) ================= */}
      {s.overdue_tasks > 0 && (
        <div className="bg-[#FF4D5A]/10 backdrop-blur-xl border border-[#FF4D5A]/30 rounded-3xl p-5 shadow-command-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-tr from-[#FF4D5A] to-[#FF2DA6] text-white rounded-2xl shadow-neon-coral">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#FF4D5A] flex items-center gap-2">
                <span>{s.overdue_tasks} deliverables require attention</span>
              </h4>
              <p className="text-xs text-[#9CA3AF] mt-0.5 font-medium">
                Unblock critical dependencies and reset targets with owners.
              </p>
            </div>
          </div>
          <button
            onClick={() => setTab('tasks')}
            className="px-4 py-2 bg-gradient-to-r from-[#FF4D5A] to-[#FF2DA6] hover:from-[#FF616C] hover:to-[#FF47B2] text-white text-xs font-black rounded-xl shadow-md transition-all hover:scale-105 whitespace-nowrap"
          >
            Resolve Overdue
          </button>
        </div>
      )}

      {/* ================= CHARTS SECTION: TASK STATUS & PRIORITY ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <div className="bg-[#0B0D0F]/90 backdrop-blur-xl rounded-3xl p-6 border border-[#171B20] shadow-command-card flex flex-col justify-between glass-card-hover">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-black text-[#F5F7FA] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#B8FF00]" />
                  <span>Task Status Distribution</span>
                </h3>
                <p className="text-xs text-[#9CA3AF] font-medium">Live operational progress across workspace</p>
              </div>
              <span className="text-xs font-black text-[#B8FF00] bg-[#B8FF00]/10 px-3 py-1 rounded-full border border-[#B8FF00]/30 shadow-[0_0_8px_rgba(184,255,0,0.2)]">
                {s.total_action_items} Total Items
              </span>
            </div>

            {/* Stacked Gradient Progress Bar */}
            <div className="h-4 w-full bg-[#111418] rounded-full overflow-hidden flex shadow-inner mb-6 p-0.5 border border-[#171B20]">
              {/* Completed: Electric Lime */}
              <div
                style={{ width: `${statusPercents.Completed}%` }}
                className="bg-gradient-to-r from-[#B8FF00] to-[#C5FF1A] transition-all duration-700 rounded-l-full shadow-neon-lime"
                title={`Completed: ${statusPercents.Completed}%`}
              />
              {/* In Progress: Tech Cyan */}
              <div
                style={{ width: `${statusPercents['In Progress']}%` }}
                className="bg-gradient-to-r from-[#00E5FF] to-[#33EBFF] transition-all duration-700 shadow-[0_0_10px_#00E5FF]"
                title={`In Progress: ${statusPercents['In Progress']}%`}
              />
              {/* Pending: Solar Orange */}
              <div
                style={{ width: `${statusPercents.Pending}%` }}
                className="bg-gradient-to-r from-[#FF7A00] to-[#FFA04D] transition-all duration-700 shadow-neon-orange"
                title={`Pending: ${statusPercents.Pending}%`}
              />
              {/* Overdue: Hot Magenta */}
              <div
                style={{ width: `${statusPercents.Overdue}%` }}
                className="bg-gradient-to-r from-[#FF2DA6] to-[#FF4D5A] transition-all duration-700 rounded-r-full shadow-neon-magenta"
                title={`Overdue: ${statusPercents.Overdue}%`}
              />
            </div>

            {/* Status Breakdown Legend Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Completed', count: s.status_distribution?.Completed || 0, gradient: 'from-[#B8FF00] to-[#C5FF1A]', text: 'text-[#B8FF00]', bg: 'bg-[#B8FF00]/10 border-[#B8FF00]/30' },
                { label: 'In Progress', count: s.status_distribution?.['In Progress'] || 0, gradient: 'from-[#00E5FF] to-[#33EBFF]', text: 'text-[#00E5FF]', bg: 'bg-[#00E5FF]/10 border-[#00E5FF]/30' },
                { label: 'Pending', count: s.status_distribution?.Pending || 0, gradient: 'from-[#FF7A00] to-[#FFA04D]', text: 'text-[#FF7A00]', bg: 'bg-[#FF7A00]/10 border-[#FF7A00]/30' },
                { label: 'Overdue', count: s.status_distribution?.Overdue || 0, gradient: 'from-[#FF2DA6] to-[#FF4D5A]', text: 'text-[#FF2DA6]', bg: 'bg-[#FF2DA6]/10 border-[#FF2DA6]/30' },
              ].map((item) => (
                <div key={item.label} className={`p-3.5 rounded-2xl border ${item.bg} backdrop-blur-md transition-all hover:scale-[1.02]`}>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${item.gradient}`} />
                    <span className="text-[11px] font-bold text-[#9CA3AF]">{item.label}</span>
                  </div>
                  <div className={`mt-2 text-2xl font-black ${item.text}`}>
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Distribution Card */}
        <div className="bg-[#0B0D0F]/90 backdrop-blur-xl rounded-3xl p-6 border border-[#171B20] shadow-command-card flex flex-col justify-between glass-card-hover">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-black text-[#F5F7FA] flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#FF2DA6]" />
                  <span>Priority Distribution</span>
                </h3>
                <p className="text-xs text-[#9CA3AF] font-medium">AI-classified delivery urgency</p>
              </div>
              <span className="text-xs font-black text-[#FF2DA6] bg-[#FF2DA6]/10 px-3 py-1 rounded-full border border-[#FF2DA6]/30 flex items-center gap-1 shadow-[0_0_8px_rgba(255,45,166,0.2)]">
                <Flame className="w-3.5 h-3.5 text-[#FF2DA6]" />
                {s.high_priority_tasks} High Priority
              </span>
            </div>

            <div className="space-y-4 my-2">
              {[
                { label: 'High Priority', count: s.priority_distribution?.High || 0, color: 'from-[#FF2DA6] to-[#FF4D5A]', textCol: 'text-[#FF2DA6]' },
                { label: 'Medium Priority', count: s.priority_distribution?.Medium || 0, color: 'from-[#FF7A00] to-[#FFD166]', textCol: 'text-[#FF7A00]' },
                { label: 'Low Priority', count: s.priority_distribution?.Low || 0, color: 'from-[#FFD166] to-[#B8FF00]', textCol: 'text-[#FFD166]' },
              ].map((p) => {
                const pct = s.total_action_items > 0 ? Math.round((p.count / s.total_action_items) * 100) : 0;
                return (
                  <div key={p.label}>
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-[#9CA3AF]">{p.label}</span>
                      <span className={`${p.textCol} font-black`}>{p.count} tasks ({pct}%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-[#111418] rounded-full overflow-hidden p-0.5 border border-[#171B20]">
                      <div
                        style={{ width: `${pct}%` }}
                        className={`h-full bg-gradient-to-r ${p.color} rounded-full transition-all duration-700`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#171B20] flex items-center justify-between text-[11px] text-[#9CA3AF] font-medium">
            <span className="flex items-center gap-1.5 text-[#B8FF00] font-black">
              <Sparkles className="w-3.5 h-3.5 text-[#B8FF00]" />
              Inferred automatically from transcript context and deadlines
            </span>
          </div>
        </div>
      </div>

      {/* ================= DEADLINES & RECENT MEETINGS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Style Deadlines */}
        <div className="bg-[#0B0D0F]/90 backdrop-blur-xl rounded-3xl p-6 border border-[#171B20] shadow-command-card flex flex-col justify-between glass-card-hover">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-black text-[#F5F7FA] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FFD166]" />
                  <span>Upcoming Deadlines</span>
                </h3>
                <p className="text-xs text-[#9CA3AF] font-medium">Scheduled deliverable milestones</p>
              </div>
              <button
                onClick={() => setTab('tasks')}
                className="text-xs font-black text-[#B8FF00] hover:text-[#D4FF4D] flex items-center gap-1"
              >
                <span>View All Tasks</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Vertical timeline */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#B8FF00] before:via-[#FF7A00] before:to-[#FF2DA6]">
              {s.upcoming_deadlines?.length > 0 ? (
                s.upcoming_deadlines.map((task) => {
                  const isHigh = task.priority === 'High';
                  const isOverdue = task.status === 'Overdue';
                  return (
                    <div key={task.id} className="relative group">
                      <span
                        className={`absolute -left-[23px] top-2 w-3.5 h-3.5 rounded-full border-2 border-[#0B0D0F] ${
                          isOverdue
                            ? 'bg-[#FF4D5A] shadow-[0_0_8px_#FF4D5A]'
                            : isHigh
                            ? 'bg-[#FF2DA6] shadow-[0_0_8px_#FF2DA6]'
                            : 'bg-[#B8FF00] shadow-[0_0_8px_#B8FF00]'
                        }`}
                      />

                      <div className="p-3.5 rounded-2xl bg-[#111418] border border-[#171B20] hover:border-[#B8FF00]/40 transition-all flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#F5F7FA] truncate group-hover:text-[#B8FF00] transition-colors">
                            {task.task}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-[#9CA3AF] font-medium">
                            <span className="flex items-center gap-1 text-[#F5F7FA]">
                              <User className="w-3 h-3 text-[#B8FF00]" />
                              {task.assignee}
                            </span>
                            <span>•</span>
                            <span className="font-bold text-[#FFD166]">
                              Due: {task.deadline}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <PriorityBadge priority={task.priority} />
                          <button
                            onClick={() => onQuickCompleteTask && onQuickCompleteTask(task.id)}
                            title="Mark Complete"
                            className="p-1.5 text-[#9CA3AF] hover:text-[#B8FF00] hover:bg-[#B8FF00]/10 rounded-xl transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-[#9CA3AF] font-medium">
                  No upcoming deadlines recorded.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Meetings Card */}
        <div className="bg-[#0B0D0F]/90 backdrop-blur-xl rounded-3xl p-6 border border-[#171B20] shadow-command-card flex flex-col justify-between glass-card-hover">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-black text-[#F5F7FA] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FFD166]" />
                  <span>Recent Meeting Archives</span>
                </h3>
                <p className="text-xs text-[#9CA3AF] font-medium">Transcripts and decision logs</p>
              </div>
              <button
                onClick={() => setTab('meetings')}
                className="text-xs font-black text-[#FFD166] hover:text-[#FFE199] flex items-center gap-1"
              >
                <span>All Meetings</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-[#171B20]">
              {s.recent_meetings?.length > 0 ? (
                s.recent_meetings.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => onSelectMeeting && onSelectMeeting(m.id)}
                    className="py-3.5 flex items-center justify-between gap-3 cursor-pointer group hover:bg-[#111418] -mx-2 px-3 rounded-2xl transition-all"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#F5F7FA] truncate group-hover:text-[#B8FF00] transition-colors">
                        {m.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#9CA3AF] font-medium">
                        <span className="text-[#B8FF00] bg-[#B8FF00]/10 px-2 py-0.5 rounded-md font-black border border-[#B8FF00]/25">{m.date}</span>
                        <span>•</span>
                        <span>{m.action_items_count} Action Items</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-black text-[#F5F7FA]">
                          {m.completion_rate}%
                        </span>
                        <div className="w-16 h-1.5 bg-[#111418] rounded-full mt-1 overflow-hidden border border-[#171B20]">
                          <div
                            style={{ width: `${m.completion_rate}%` }}
                            className="h-full bg-gradient-to-r from-[#B8FF00] to-[#FFD166] rounded-full"
                          />
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 group-hover:text-[#B8FF00] transition-transform" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-[#9CA3AF] font-medium">
                  No meetings recorded yet.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#171B20]">
            <button
              onClick={() => setTab('add-meeting')}
              className="w-full py-2.5 bg-[#111418] hover:bg-[#171B20] text-[#F5F7FA] font-bold text-xs rounded-2xl border border-[#171B20] hover:border-[#B8FF00]/40 transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-[#B8FF00]" />
              <span>Record or Paste New Meeting Transcript</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
