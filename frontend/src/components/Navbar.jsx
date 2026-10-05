import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Plus,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Zap,
  Bot
} from 'lucide-react';

export function Navbar({
  currentTab,
  setTab,
  onOpenMobileMenu,
  overdueCount = 0,
  overdueTasks = [],
  onSearch,
  searchQuery = '',
  currentUser = null
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const tabTitles = {
    dashboard: { title: 'Operations Command Center', subtitle: 'Live telemetry, neural synthesis & accountability overview' },
    meetings: { title: 'Meeting Knowledge Base', subtitle: 'Parsed transcript archives, key decisions & discussion logs' },
    'add-meeting': { title: 'Neural Meeting Analysis', subtitle: 'Transform raw conversations into prioritized deliverables' },
    tasks: { title: 'Action Item Pipeline', subtitle: 'Monitor deliverables, assignees, deadlines and progress' },
    accountability: { title: 'Team Accountability', subtitle: 'Scorecards, completion velocity & workload distribution' },
    insights: { title: 'AI Telemetry Insights', subtitle: 'Predictive workstream diagnostics, blockers & directives' },
    settings: { title: 'Engine Configuration', subtitle: 'NLP extraction parameters and operational settings' },
  };

  const currentInfo = tabTitles[currentTab] || { title: 'Command Center', subtitle: '' };

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#0B0D0F]/85 backdrop-blur-2xl border-b border-[#171B20] px-4 lg:px-8 flex items-center justify-between">
      {/* Left Title / Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 text-[#9CA3AF] hover:text-[#F5F7FA] lg:hidden rounded-xl hover:bg-[#111418] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg lg:text-xl font-black text-[#F5F7FA] tracking-tight leading-tight">
              {currentInfo.title}
            </h1>
            {/* Electric Lime AI Badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#B8FF00] text-[#050505] shadow-[0_0_12px_rgba(184,255,0,0.35)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#050505] animate-ping"></span>
              <span>AI ONLINE</span>
            </span>
          </div>
          <p className="hidden sm:block text-xs text-[#9CA3AF] font-medium mt-0.5">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Global Search Input */}
        <div className="relative hidden md:block w-64 lg:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            placeholder="Search tasks, meetings, people..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#111418] border border-[#171B20] rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#B8FF00] focus:border-[#B8FF00] transition-all text-[#F5F7FA] placeholder:text-[#9CA3AF] font-medium shadow-inner"
          />
        </div>

        {/* Quick Add Button: Lime -> Gold gradient */}
        {currentTab !== 'add-meeting' && (
          <button
            onClick={() => setTab('add-meeting')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#B8FF00] to-[#FFD166] hover:from-[#C5FF1A] hover:to-[#FFE199] text-[#050505] text-xs font-black rounded-2xl shadow-[0_0_20px_rgba(184,255,0,0.35)] transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ New Meeting</span>
          </button>
        )}

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-[#9CA3AF] hover:text-[#F5F7FA] hover:bg-[#111418] rounded-2xl border border-[#171B20] transition-all"
            title="Action Alerts"
          >
            <Bell className="w-4 h-4" />
            {overdueCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4D5A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF4D5A]"></span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-84 bg-[#0B0D0F]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-[#171B20] py-3.5 z-50 animate-slide-up">
              <div className="px-4 pb-2.5 border-b border-[#171B20] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-[#F5F7FA]">
                  <AlertCircle className="w-4 h-4 text-[#FF4D5A]" />
                  <span>Action Alerts</span>
                </div>
                <span className="text-[10px] font-black bg-[#FF4D5A]/15 text-[#FF4D5A] px-2 py-0.5 rounded-full border border-[#FF4D5A]/30">
                  {overdueCount} Overdue
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-[#171B20] px-2">
                {overdueTasks.length > 0 ? (
                  overdueTasks.map((t) => (
                    <div key={t.id} className="p-3 hover:bg-[#111418] rounded-2xl text-left transition-colors">
                      <p className="text-xs font-bold text-[#F5F7FA] line-clamp-1">
                        {t.task}
                      </p>
                      <div className="flex items-center justify-between mt-1 text-[11px] text-[#9CA3AF] font-medium">
                        <span className="text-[#FFD166] font-bold">{t.assignee}</span>
                        <span className="text-[#FF4D5A] font-black">Due: {t.deadline}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-[#9CA3AF] font-medium">
                    <CheckCircle2 className="w-6 h-6 text-[#B8FF00] mx-auto mb-2" />
                    All tasks are currently on track!
                  </div>
                )}
              </div>

              <div className="pt-2 px-3 border-t border-[#171B20]">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    setTab('tasks');
                  }}
                  className="w-full py-2 text-xs text-center font-black text-[#B8FF00] hover:text-[#D4FF4D] hover:bg-[#B8FF00]/10 rounded-xl transition-colors"
                >
                  View All Action Items →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-[#171B20]">
          <img
            src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
            alt="User"
            className="w-8 h-8 rounded-xl border border-[#B8FF00]/40 bg-[#111418] shadow-[0_0_8px_rgba(184,255,0,0.2)]"
          />
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-[#F5F7FA] truncate max-w-[140px]">
              {currentUser?.name || 'Commander'}
            </span>
            <span className="text-[10px] text-[#FFD166] font-black truncate max-w-[140px]">
              {currentUser?.role || 'Lead Operator'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
