import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Zap,
  Activity,
  Bot,
  Calendar,
  CheckSquare,
  Users,
  Sparkles,
  ArrowRight,
  Terminal,
  Cpu,
  CheckCircle2,
  Clock,
  ExternalLink,
  PlusCircle,
  Radio,
  RefreshCw
} from 'lucide-react';
import { PriorityBadge, TaskStatusBadge } from '../components/Badges';
import { api } from '../services/api';

export function PortalPage({ currentUser, setTab, tasks = [], meetings = [], onQuickCompleteTask }) {
  const [healthStatus, setHealthStatus] = useState('Checking...');
  const [latency, setLatency] = useState(null);
  const [pinging, setPinging] = useState(false);

  const testConnection = async () => {
    setPinging(true);
    const start = performance.now();
    try {
      const res = await api.checkHealth();
      const end = performance.now();
      setLatency(Math.round(end - start));
      setHealthStatus(res?.status || 'Online');
    } catch (err) {
      setLatency(null);
      setHealthStatus('Offline / Local Fallback Active');
    } finally {
      setPinging(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  // Filter tasks assigned to current user
  const userFirstName = currentUser?.name?.split(' ')[0]?.toLowerCase() || '';
  const myTasks = tasks.filter((t) => {
    if (!t.assignee) return false;
    const aLower = t.assignee.toLowerCase();
    return aLower.includes(userFirstName) || (currentUser?.name && aLower.includes(currentUser.name.toLowerCase()));
  });

  const activeMyTasks = myTasks.filter((t) => t.status !== 'Completed');
  const completedMyTasks = myTasks.filter((t) => t.status === 'Completed');

  return (
    <div className="space-y-7 animate-fade-in">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0B0D0F]/95 backdrop-blur-2xl border border-[#171B20] p-6 lg:p-8 shadow-command-card">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B8FF00]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF2DA6]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8FF00] text-[#050505] text-[10px] font-black uppercase tracking-wider shadow-[0_0_12px_rgba(184,255,0,0.4)]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Member Portal & Command Access</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-[#F5F7FA] tracking-tight">
              Command Node: <span className="bg-gradient-to-r from-[#B8FF00] via-[#FFD166] to-[#FF7A00] bg-clip-text text-transparent">{currentUser?.name || 'Operator'}</span>
            </h2>
            <p className="text-xs lg:text-sm text-[#9CA3AF] max-w-2xl font-medium">
              Authorized access point for meeting intelligence dispatch, personal execution tracking, and team synchronization.
            </p>
          </div>

          {/* User Identity Chip */}
          <div className="p-3.5 rounded-2xl bg-[#111418] border border-[#171B20] flex items-center gap-3.5 flex-shrink-0">
            <img
              src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Poojasri'}
              alt={currentUser?.name || 'User'}
              className="w-12 h-12 rounded-xl bg-[#050505] border border-[#B8FF00]/40 p-0.5"
            />
            <div>
              <p className="text-xs font-black text-[#F5F7FA]">{currentUser?.name || 'Commander'}</p>
              <p className="text-[10px] font-bold text-[#B8FF00]">{currentUser?.role || 'Team Lead'}</p>
              <p className="text-[9px] text-[#9CA3AF] font-mono mt-0.5">{currentUser?.email || 'poojasri@team.io'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launchpad Grid */}
      <div>
        <h3 className="text-xs font-black text-[#9CA3AF] uppercase tracking-widest font-mono mb-3.5 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-[#B8FF00]" />
          <span>Quick Command Launchpad</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setTab('add-meeting')}
            className="p-5 rounded-2xl bg-[#0B0D0F] border border-[#171B20] hover:border-[#FF2DA6]/50 hover:bg-[#111418] transition-all group text-left relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FF2DA6]/10 text-[#FF2DA6] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-[#F5F7FA] group-hover:text-[#FF2DA6] transition-colors flex items-center justify-between">
              <span>Analyze Meeting</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h4>
            <p className="text-xs text-[#9CA3AF] mt-1 font-medium">Extract summary & action items from notes</p>
          </button>

          <button
            onClick={() => setTab('action-items')}
            className="p-5 rounded-2xl bg-[#0B0D0F] border border-[#171B20] hover:border-[#B8FF00]/50 hover:bg-[#111418] transition-all group text-left relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-[#B8FF00]/10 text-[#B8FF00] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-[#F5F7FA] group-hover:text-[#B8FF00] transition-colors flex items-center justify-between">
              <span>Action Items</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h4>
            <p className="text-xs text-[#9CA3AF] mt-1 font-medium">Manage tasks, deadlines, and ownership</p>
          </button>

          <button
            onClick={() => setTab('team')}
            className="p-5 rounded-2xl bg-[#0B0D0F] border border-[#171B20] hover:border-[#FFD166]/50 hover:bg-[#111418] transition-all group text-left relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFD166]/10 text-[#FFD166] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-[#F5F7FA] group-hover:text-[#FFD166] transition-colors flex items-center justify-between">
              <span>Team Directory</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h4>
            <p className="text-xs text-[#9CA3AF] mt-1 font-medium">Inspect roles, status, and task load</p>
          </button>

          <button
            onClick={() => setTab('settings')}
            className="p-5 rounded-2xl bg-[#0B0D0F] border border-[#171B20] hover:border-[#FF7A00]/50 hover:bg-[#111418] transition-all group text-left relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/10 text-[#FF7A00] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-[#F5F7FA] group-hover:text-[#FF7A00] transition-colors flex items-center justify-between">
              <span>System & API</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h4>
            <p className="text-xs text-[#9CA3AF] mt-1 font-medium">Verify health ping & Vercel environment</p>
          </button>
        </div>
      </div>

      {/* Main Split: My Action Items + Telemetry Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Assigned Action Items */}
        <div className="lg:col-span-2 rounded-3xl bg-[#0B0D0F]/95 backdrop-blur-2xl border border-[#171B20] p-6 shadow-command-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-[#F5F7FA]">My Active Action Items</h3>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Tasks assigned directly to {currentUser?.name || 'you'}
              </p>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#B8FF00]/10 text-[#B8FF00] border border-[#B8FF00]/30 font-mono">
              {activeMyTasks.length} Pending / {completedMyTasks.length} Done
            </span>
          </div>

          <div className="space-y-3">
            {myTasks.length > 0 ? (
              myTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-[#111418] border border-[#171B20] hover:border-[#B8FF00]/30 transition-all flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => onQuickCompleteTask && onQuickCompleteTask(t.id)}
                      className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors flex-shrink-0 ${
                        t.status === 'Completed'
                          ? 'bg-[#B8FF00] border-[#B8FF00] text-[#050505]'
                          : 'border-[#171B20] bg-[#050505] hover:border-[#B8FF00]'
                      }`}
                    >
                      {t.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-xs font-black truncate ${t.status === 'Completed' ? 'line-through text-[#9CA3AF]' : 'text-[#F5F7FA]'}`}>
                        {t.task}
                      </p>
                      {t.description && (
                        <p className="text-[11px] text-[#9CA3AF] mt-0.5 line-clamp-1">{t.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[#9CA3AF]">
                        <span className="text-[#FFD166] font-bold">Meeting: {t.meeting_title || 'General'}</span>
                        <span>•</span>
                        <span className="text-[#B8FF00] font-mono">Due: {t.deadline}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <PriorityBadge priority={t.priority} />
                    <TaskStatusBadge status={t.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-[#9CA3AF] rounded-2xl bg-[#111418] border border-[#171B20]">
                <CheckCircle2 className="w-8 h-8 text-[#B8FF00] mx-auto mb-2 opacity-60" />
                <p className="font-bold text-[#F5F7FA]">All clear! No pending tasks assigned to you.</p>
                <p className="text-[11px] mt-1">Create a new task or extract items from your next meeting.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Telemetry Console */}
        <div className="rounded-3xl bg-[#0B0D0F]/95 backdrop-blur-2xl border border-[#171B20] p-6 shadow-command-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#F5F7FA] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#B8FF00]" />
              <span>System Telemetry</span>
            </h3>
            <button
              onClick={testConnection}
              disabled={pinging}
              className="p-1.5 text-[#9CA3AF] hover:text-[#B8FF00] hover:bg-[#111418] rounded-xl transition-colors disabled:opacity-50"
              title="Re-ping backend health"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${pinging ? 'animate-spin text-[#B8FF00]' : ''}`} />
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-[#111418] border border-[#171B20]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9CA3AF] font-bold">API Status</span>
                <span className="inline-flex items-center gap-1.5 font-black text-[#B8FF00]">
                  <span className="w-2 h-2 rounded-full bg-[#B8FF00] animate-ping" />
                  {healthStatus}
                </span>
              </div>
              {latency !== null && (
                <p className="text-[10px] text-[#9CA3AF] mt-1 font-mono">Response Latency: {latency}ms</p>
              )}
            </div>

            <div className="p-3 rounded-2xl bg-[#111418] border border-[#171B20]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9CA3AF] font-bold">Persistence</span>
                <span className="text-xs font-black text-[#FFD166] font-mono">SQLite (meetings.db)</span>
              </div>
              <p className="text-[10px] text-[#9CA3AF] mt-1 font-mono">Status: Connected & Synchronized</p>
            </div>

            <div className="p-3 rounded-2xl bg-[#111418] border border-[#171B20]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9CA3AF] font-bold">AI Extraction Core</span>
                <span className="text-xs font-black text-[#FF2DA6] font-mono">NLP Engine / LLM</span>
              </div>
              <p className="text-[10px] text-[#9CA3AF] mt-1 font-mono">Dual-mode: Gemini + Zero-Dep Local Fallback</p>
            </div>

            <div className="p-3 rounded-2xl bg-[#111418] border border-[#171B20]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9CA3AF] font-bold">API Base Endpoint</span>
                <span className="text-[10px] text-[#F5F7FA] font-mono truncate max-w-[140px]">
                  {api.getApiBaseUrl()}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setTab('settings')}
              className="w-full py-2 px-3 rounded-xl bg-[#171B20] hover:bg-[#1F242C] text-[#F5F7FA] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Inspect Configuration</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortalPage;
