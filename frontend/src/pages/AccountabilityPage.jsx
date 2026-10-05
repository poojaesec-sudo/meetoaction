import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Zap,
  Target
} from 'lucide-react';
import { PriorityBadge, TaskStatusBadge } from '../components/Badges';

export function AccountabilityPage({ data, loading, onUpdateTask, setTab }) {
  const [expandedMember, setExpandedMember] = useState(null);

  if (loading && !data) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 bg-[#0B0D0F]/90 rounded-3xl border border-[#171B20]"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-56 bg-[#0B0D0F]/90 rounded-3xl border border-[#171B20]"></div>
          ))}
        </div>
      </div>
    );
  }

  const team = data?.team_members || [];
  const totalTasks = data?.total_tasks || 0;
  const totalCompleted = data?.total_completed || 0;
  const overallRate = data?.overall_completion_rate || 0;

  const toggleExpand = (member) => {
    setExpandedMember(expandedMember === member ? null : member);
  };

  if (team.length === 0) {
    return (
      <div className="space-y-6">
        {/* Top Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0B0D0F]/95 backdrop-blur-2xl border border-[#171B20] p-6 lg:p-8 shadow-command-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8FF00]/15 text-[#B8FF00] text-xs font-black mb-3 border border-[#B8FF00]/30 shadow-[0_0_12px_rgba(184,255,0,0.2)]">
              <UserCheck className="w-3.5 h-3.5 text-[#B8FF00]" />
              <span>AI Command Accountability Matrix</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-[#F5F7FA] tracking-tight">
              Team Accountability
            </h2>
            <p className="mt-1.5 text-xs text-[#9CA3AF] font-medium leading-relaxed">
              Transparent milestone fulfillment and workload distribution per team member. Quantify follow-through and balance deliverables.
            </p>
          </div>
        </div>

        {/* Empty State */}
        <div className="py-20 text-center bg-[#0B0D0F]/95 rounded-3xl border border-[#171B20] p-8 shadow-command-card">
          <div className="w-16 h-16 rounded-3xl bg-[#111418] border border-[#B8FF00]/30 flex items-center justify-center mx-auto mb-4 text-[#B8FF00] shadow-[0_0_20px_rgba(184,255,0,0.25)]">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-[#F5F7FA]">Team accountability will appear after your first meeting.</h3>
          <p className="text-xs text-[#9CA3AF] mt-1.5 max-w-md mx-auto font-medium leading-relaxed">
            When you analyze a meeting with AI, assignees and action items will automatically populate team performance metrics and completion scorecards here.
          </p>
          <button
            onClick={() => setTab && setTab('add-meeting')}
            className="mt-6 px-6 py-2.5 bg-gradient-to-r from-[#B8FF00] to-[#FFD166] hover:from-[#C5FF1A] hover:to-[#FFE199] text-[#050505] text-xs font-black rounded-2xl shadow-[0_0_20px_rgba(184,255,0,0.35)] transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#050505]" />
            <span>Add First Meeting</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner - AI Team Command Center */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0B0D0F]/95 backdrop-blur-2xl border border-[#171B20] p-6 lg:p-8 shadow-command-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Ambient glow spots */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#B8FF00]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#FF2DA6]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8FF00]/15 text-[#B8FF00] text-xs font-black mb-3 border border-[#B8FF00]/30 shadow-[0_0_12px_rgba(184,255,0,0.2)]">
            <UserCheck className="w-3.5 h-3.5 text-[#B8FF00]" />
            <span>AI Team Command Center</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-black text-[#F5F7FA] tracking-tight">
            Team Accountability
          </h2>
          <p className="mt-1.5 text-xs text-[#9CA3AF] font-medium leading-relaxed">
            Transparent milestone fulfillment and workload distribution per team member. Quantify follow-through, balance deliverables, and eliminate orphan action items.
          </p>
        </div>

        {/* Global workspace execution meter */}
        <div className="relative z-10 bg-[#111418] rounded-3xl p-5 border border-[#171B20] flex items-center gap-5 flex-shrink-0 shadow-inner">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-mono block">
              Workspace Execution
            </span>
            <span className="text-3xl font-black text-[#B8FF00] font-mono">
              {overallRate}%
            </span>
            <span className="text-[11px] text-[#FFD166] font-black block mt-0.5">
              {totalCompleted} of {totalTasks} deliverables done
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#B8FF00] to-[#FFD166] flex items-center justify-center shadow-[0_0_20px_rgba(184,255,0,0.35)] text-[#050505]">
            <Award className="w-7 h-7 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Team Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {team.map((memberStats) => {
          const isExpanded = expandedMember === memberStats.member;
          const isLead = memberStats.member.toLowerCase().includes('pooja');
          const pct = memberStats.completion_percentage;

          let colorTheme = {
            topGradient: 'from-[#FF7A00] via-[#FFA04D] to-[#FFD166]',
            strokeColor: '#FF7A00',
            hoverGlow: 'hover:border-[#FF7A00]/40',
            perfBadge: 'bg-[#FF7A00]/15 text-[#FF7A00] border-[#FF7A00]/30',
            perfLabel: 'Building Velocity',
          };

          if (pct >= 75) {
            colorTheme = {
              topGradient: 'from-[#B8FF00] via-[#C5FF1A] to-[#FFD166]',
              strokeColor: '#B8FF00',
              hoverGlow: 'hover:border-[#B8FF00]/40',
              perfBadge: 'bg-[#B8FF00]/15 text-[#B8FF00] border-[#B8FF00]/30',
              perfLabel: 'Top Execution',
            };
          } else if (pct >= 40) {
            colorTheme = {
              topGradient: 'from-[#FFD166] via-[#FFE199] to-[#FF7A00]',
              strokeColor: '#FFD166',
              hoverGlow: 'hover:border-[#FFD166]/40',
              perfBadge: 'bg-[#FFD166]/15 text-[#FFD166] border-[#FFD166]/30',
              perfLabel: 'On Track',
            };
          }

          // Circular progress calculations
          const radius = 28;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (pct / 100) * circumference;

          return (
            <div
              key={memberStats.member}
              className={`bg-[#0B0D0F]/90 backdrop-blur-xl rounded-3xl border border-[#171B20] shadow-command-card transition-all duration-300 overflow-hidden flex flex-col justify-between ${colorTheme.hoverGlow}`}
            >
              {/* Top gradient strip */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${colorTheme.topGradient}`} />

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${memberStats.member}`}
                        alt={memberStats.member}
                        className="w-14 h-14 rounded-2xl bg-[#111418] border border-[#171B20] p-0.5 shadow-md"
                      />
                      {isLead && (
                        <span className="absolute -top-1 -right-1 p-1 bg-[#B8FF00] text-[#050505] rounded-full shadow-[0_0_8px_#B8FF00]">
                          <Award className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-[#F5F7FA]">
                          {memberStats.member}
                        </h3>
                        {isLead && (
                          <span className="text-[10px] bg-gradient-to-r from-[#B8FF00] to-[#FFD166] text-[#050505] font-black px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(184,255,0,0.3)]">
                            Team Lead
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#9CA3AF] font-semibold mt-0.5">
                        <span className="text-[#F5F7FA] font-bold">{memberStats.total_assigned}</span> Total Assigned ({memberStats.high_priority_count} High Priority)
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${colorTheme.perfBadge}`}
                  >
                    {colorTheme.perfLabel}
                  </span>
                </div>

                {/* Circular Progress & Metrics Row */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-[#111418] p-4 rounded-2xl border border-[#171B20] gap-4">
                  {/* Circular SVG Progress */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-18 h-18 flex items-center justify-center">
                      <svg className="w-18 h-18 -rotate-90">
                        <circle
                          cx="36"
                          cy="36"
                          r={radius}
                          stroke="#171B20"
                          strokeWidth="6"
                          fill="transparent"
                        />
                        <circle
                          cx="36"
                          cy="36"
                          r={radius}
                          stroke={colorTheme.strokeColor}
                          strokeWidth="6"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <span className="absolute text-xs font-black text-[#F5F7FA] font-mono">
                        {pct}%
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-black text-[#F5F7FA] block">
                        Completion Rate
                      </span>
                      <span className="text-[11px] text-[#9CA3AF] font-medium block">
                        {memberStats.completed_count} completed deliverables
                      </span>
                    </div>
                  </div>

                  {/* Quick Stat Pill Grid */}
                  <div className="flex items-center gap-2">
                    <div className="text-center px-3 py-2 bg-[#0B0D0F] rounded-xl border border-[#171B20]">
                      <span className="text-[10px] font-mono text-[#9CA3AF] block">Pending</span>
                      <span className="text-sm font-black text-[#FF7A00]">
                        {memberStats.pending_count}
                      </span>
                    </div>
                    <div className="text-center px-3 py-2 bg-[#0B0D0F] rounded-xl border border-[#171B20]">
                      <span className="text-[10px] font-mono text-[#9CA3AF] block">Active</span>
                      <span className="text-sm font-black text-[#00E5FF]">
                        {memberStats.in_progress_count}
                      </span>
                    </div>
                    <div className="text-center px-3 py-2 bg-[#0B0D0F] rounded-xl border border-[#171B20]">
                      <span className="text-[10px] font-mono text-[#9CA3AF] block">Overdue</span>
                      <span className="text-sm font-black text-[#FF4D5A]">
                        {memberStats.overdue_count}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Collapsible Action Items Drawer */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#171B20] space-y-2 animate-slide-up">
                    <span className="text-xs font-black text-[#9CA3AF] uppercase tracking-wider block font-mono">
                      Assigned Deliverables ({memberStats.assigned_tasks.length})
                    </span>

                    {memberStats.assigned_tasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 bg-[#111418] rounded-xl border border-[#171B20] flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#F5F7FA] truncate">
                            {task.task}
                          </p>
                          <span className="text-[10px] font-mono text-[#FFD166]">
                            Due: {task.deadline}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <PriorityBadge priority={task.priority} />
                          <TaskStatusBadge status={task.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Expand Toggle Bar */}
              <button
                onClick={() => toggleExpand(memberStats.member)}
                className="w-full py-2.5 bg-[#111418]/60 hover:bg-[#111418] border-t border-[#171B20] text-xs font-black text-[#B8FF00] hover:text-[#D4FF4D] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{isExpanded ? 'Hide Task Breakdown' : 'Expand Task Breakdown'}</span>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AccountabilityPage;
