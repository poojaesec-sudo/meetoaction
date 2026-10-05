import React from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  Tag,
  Lightbulb,
  ShieldCheck,
  BarChart3,
  Flame,
  ArrowRight,
  Bot,
  Zap,
  Activity,
  Layers,
  Cpu
} from 'lucide-react';

export function InsightsPage({ insights, loading, setTab }) {
  if (loading && !insights) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-44 bg-[#0B0D0F]/90 rounded-3xl border border-[#171B20]"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-[#0B0D0F]/90 rounded-3xl border border-[#171B20]"></div>
          ))}
        </div>
      </div>
    );
  }

  const ins = insights || {
    unresolved_tasks_count: 0,
    people_with_pending_tasks: [],
    overdue_task_count: 0,
    frequently_discussed_topics: [],
    meeting_productivity_trends: [],
    workload_distribution: [],
    actionable_recommendations: [],
  };

  const hasData =
    (ins.frequently_discussed_topics && ins.frequently_discussed_topics.length > 0) ||
    (ins.meeting_productivity_trends && ins.meeting_productivity_trends.length > 0) ||
    ins.unresolved_tasks_count > 0;

  if (!hasData) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0B0D0F]/95 backdrop-blur-2xl border border-[#171B20] text-[#F5F7FA] p-6 lg:p-9 shadow-command-card">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8FF00]/15 border border-[#B8FF00]/30 text-[#B8FF00] text-xs font-black mb-3 shadow-[0_0_12px_rgba(184,255,0,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-[#B8FF00] animate-spin-slow" />
              <span>Neural Meeting Telemetry</span>
            </div>
            <h2 className="text-2xl lg:text-4xl font-black text-[#F5F7FA] tracking-tight leading-tight">
              AI Telemetry Insights
            </h2>
            <p className="mt-2 text-xs lg:text-sm text-[#9CA3AF] font-medium leading-relaxed">
              Understand your team's operational patterns with AI. Synthesized analytics across meetings highlight delivery velocity, recurring topics, and predictive directives.
            </p>
          </div>
        </div>

        {/* Empty State Card */}
        <div className="py-20 text-center bg-[#0B0D0F]/95 rounded-3xl border border-[#171B20] p-8 shadow-command-card">
          <div className="w-16 h-16 rounded-3xl bg-[#111418] border border-[#B8FF00]/30 flex items-center justify-center mx-auto mb-4 text-[#B8FF00] shadow-[0_0_20px_rgba(184,255,0,0.25)]">
            <Cpu className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-[#F5F7FA]">Insights will appear after you add meetings and tasks.</h3>
          <p className="text-xs text-[#9CA3AF] mt-1.5 max-w-md mx-auto font-medium leading-relaxed">
            AI continuously monitors transcripts, deadlines, and completion patterns. Add your first meeting to generate automated productivity insights and recommendations.
          </p>
          <button
            onClick={() => setTab && setTab('add-meeting')}
            className="mt-6 px-6 py-2.5 bg-gradient-to-r from-[#B8FF00] to-[#FFD166] hover:from-[#C5FF1A] hover:to-[#FFE199] text-[#050505] text-xs font-black rounded-2xl shadow-[0_0_20px_rgba(184,255,0,0.35)] transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#050505]" />
            <span>+ Add Your First Meeting</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Obsidian AI Command Glow */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0B0D0F]/95 backdrop-blur-2xl border border-[#171B20] text-[#F5F7FA] p-6 lg:p-9 shadow-command-card">
        {/* Glow circles */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#B8FF00]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#FF2DA6]/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8FF00]/15 border border-[#B8FF00]/30 text-[#B8FF00] text-xs font-black mb-3 shadow-[0_0_12px_rgba(184,255,0,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-[#B8FF00] animate-spin-slow" />
              <span>Neural Meeting Telemetry</span>
            </div>
            <h2 className="text-2xl lg:text-4xl font-black text-[#F5F7FA] tracking-tight leading-tight">
              AI Productivity Insights
            </h2>
            <p className="mt-2 text-xs lg:text-sm text-[#9CA3AF] font-medium leading-relaxed">
              Understand your team's work patterns with AI. Synthesized analytics across meeting history highlight delivery velocity, recurring topics, and actionable directives.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <span className="px-4 py-2 bg-[#111418] rounded-2xl text-xs font-black text-[#B8FF00] border border-[#B8FF00]/30 flex items-center gap-2 shadow-[0_0_12px_rgba(184,255,0,0.2)]">
              <ShieldCheck className="w-4 h-4 text-[#B8FF00]" />
              Objective & Bias-Free
            </span>
          </div>
        </div>
      </div>

      {/* 4 Glowing Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Unresolved Tasks → Solar Orange */}
        <div className="bg-[#0B0D0F]/90 backdrop-blur-xl p-5 rounded-3xl border border-[#171B20] shadow-command-card hover:border-[#FF7A00]/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF7A00] to-[#FFA04D]" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-wider font-mono">
              Unresolved Tasks
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#111418] text-[#FF7A00] border border-[#FF7A00]/30 flex items-center justify-center shadow-[0_0_12px_rgba(255,122,0,0.3)] group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-black text-[#F5F7FA] font-mono">
            {ins.unresolved_tasks_count}
          </div>
          <p className="text-xs text-[#FF7A00] font-bold mt-1">
            Active deliverables pending completion
          </p>
        </div>

        {/* Active Contributors → Cyber Gold */}
        <div className="bg-[#0B0D0F]/90 backdrop-blur-xl p-5 rounded-3xl border border-[#171B20] shadow-command-card hover:border-[#FFD166]/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD166] to-[#FFE199]" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-wider font-mono">
              Active Contributors
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#111418] text-[#FFD166] border border-[#FFD166]/30 flex items-center justify-center shadow-[0_0_12px_rgba(255,209,102,0.3)] group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-black text-[#F5F7FA] font-mono">
            {ins.people_with_pending_tasks?.length || 0}
          </div>
          <p className="text-xs text-[#FFD166] font-bold mt-1 truncate">
            {ins.people_with_pending_tasks?.join(', ') || 'No active assignees'}
          </p>
        </div>

        {/* Overdue Milestones → Coral / Hot Magenta */}
        <div className="bg-[#0B0D0F]/90 backdrop-blur-xl p-5 rounded-3xl border border-[#171B20] shadow-command-card hover:border-[#FF4D5A]/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF4D5A] to-[#FF2DA6]" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-wider font-mono">
              Overdue Milestones
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#111418] text-[#FF4D5A] border border-[#FF4D5A]/30 flex items-center justify-center shadow-[0_0_12px_rgba(255,77,90,0.3)] group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-black text-[#FF4D5A] font-mono">
            {ins.overdue_task_count}
          </div>
          <p className="text-xs text-[#FF4D5A] font-bold mt-1">
            {ins.overdue_task_count === 0 ? 'All milestones on schedule' : 'Urgent re-alignment needed'}
          </p>
        </div>

        {/* Execution Velocity → Electric Lime */}
        <div className="bg-[#0B0D0F]/90 backdrop-blur-xl p-5 rounded-3xl border border-[#171B20] shadow-command-card hover:border-[#B8FF00]/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B8FF00] to-[#C5FF1A]" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-wider font-mono">
              Delivery Velocity
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#111418] text-[#B8FF00] border border-[#B8FF00]/30 flex items-center justify-center shadow-[0_0_12px_rgba(184,255,0,0.3)] group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-black text-[#B8FF00] font-mono">
            Active
          </div>
          <p className="text-xs text-[#B8FF00] font-bold mt-1">
            Real-time pipeline synchronization
          </p>
        </div>
      </div>

      {/* Actionable AI Recommendations */}
      <div className="bg-[#0B0D0F]/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-[#171B20] shadow-command-card relative overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-[#FF2DA6] to-[#FF7A00] text-white shadow-[0_0_15px_rgba(255,45,166,0.3)]">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#F5F7FA]">
                Actionable AI Directives
              </h3>
              <p className="text-xs text-[#9CA3AF] font-medium">Auto-generated sprint focus directives & unblocking steps</p>
            </div>
          </div>
          <span className="text-xs font-black text-[#B8FF00] bg-[#B8FF00]/10 px-3 py-1 rounded-full border border-[#B8FF00]/30 shadow-[0_0_8px_rgba(184,255,0,0.2)]">
            Command Presets
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ins.actionable_recommendations?.map((rec, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl border border-[#171B20] bg-[#111418] hover:border-[#B8FF00]/40 transition-all space-y-2.5 shadow-command-card"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r from-[#B8FF00] to-[#FFD166] text-[#050505]">
                  {rec.type}
                </span>
                <span
                  className={`text-[11px] font-black ${
                    rec.impact === 'High'
                      ? 'text-[#FF4D5A]'
                      : rec.impact === 'Positive'
                      ? 'text-[#B8FF00]'
                      : 'text-[#FF7A00]'
                  }`}
                >
                  {rec.impact} Priority
                </span>
              </div>
              <h4 className="text-xs font-black text-[#F5F7FA]">{rec.title}</h4>
              <p className="text-xs text-[#9CA3AF] leading-relaxed font-medium">{rec.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Cloud & Meeting Productivity Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Cloud */}
        <div className="bg-[#0B0D0F]/90 backdrop-blur-xl rounded-3xl p-6 border border-[#171B20] shadow-command-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-black text-[#F5F7FA] flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#B8FF00]" />
              <span>Frequently Discussed Topics & Keywords</span>
            </h3>
            <span className="text-xs text-[#9CA3AF] font-mono font-bold">NLP Tag Matrix</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {ins.frequently_discussed_topics?.map((topic, idx) => {
              const tagColors = [
                'bg-[#B8FF00]/10 text-[#B8FF00] border-[#B8FF00]/30 hover:border-[#B8FF00]',
                'bg-[#FF2DA6]/10 text-[#FF2DA6] border-[#FF2DA6]/30 hover:border-[#FF2DA6]',
                'bg-[#FF7A00]/10 text-[#FF7A00] border-[#FF7A00]/30 hover:border-[#FF7A00]',
                'bg-[#FFD166]/10 text-[#FFD166] border-[#FFD166]/30 hover:border-[#FFD166]',
                'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30 hover:border-[#00E5FF]',
              ];
              const color = tagColors[idx % tagColors.length];

              return (
                <div
                  key={idx}
                  className={`px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-default ${color}`}
                >
                  <span>{topic.topic}</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#050505] text-[10px] font-black font-mono border border-[#171B20]">
                    {topic.frequency}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-[#171B20] text-xs text-[#9CA3AF] font-medium font-mono">
            Extracted automatically from discussion bullet points and transcript key terms.
          </div>
        </div>

        {/* Meeting Productivity Trends */}
        <div className="bg-[#0B0D0F]/90 backdrop-blur-xl rounded-3xl p-6 border border-[#171B20] shadow-command-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-black text-[#F5F7FA] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#FFD166]" />
              <span>Meeting Delivery Trends</span>
            </h3>
            <span className="text-xs text-[#9CA3AF] font-mono font-bold">Actions Extracted</span>
          </div>

          <div className="space-y-3.5">
            {ins.meeting_productivity_trends?.map((trend, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#111418] border border-[#171B20] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#F5F7FA]">{trend.meeting}</span>
                  <span className="text-[#FFD166] font-bold text-[11px] bg-[#050505] px-2 py-0.5 rounded-md border border-[#171B20] font-mono">{trend.date}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] font-medium">
                  <span>{trend.actions_generated} Actions Extracted</span>
                  <span className="font-black text-[#B8FF00] font-mono">{trend.completion_rate}% Fulfilled</span>
                </div>
                <div className="w-full h-2 bg-[#050505] rounded-full overflow-hidden p-0.5 border border-[#171B20]">
                  <div
                    style={{ width: `${trend.completion_rate}%` }}
                    className="h-full bg-gradient-to-r from-[#B8FF00] to-[#FFD166] rounded-full transition-all duration-500 shadow-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InsightsPage;
