import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  CheckSquare,
  Users,
  Sparkles,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Bot,
  Zap,
  Activity,
  Radio
} from 'lucide-react';

export function Sidebar({ currentTab, setTab, currentUser, onLogout, isOpen, setIsOpen, overdueCount = 0 }) {
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      iconColor: 'text-[#B8FF00] group-hover:text-[#D4FF4D]',
    },
    { 
      id: 'portal', 
      label: 'Member Portal', 
      icon: ShieldCheck,
      iconColor: 'text-[#B8FF00] group-hover:text-[#D4FF4D]',
    },
    { 
      id: 'meetings', 
      label: 'Meetings', 
      icon: Calendar,
      iconColor: 'text-[#FFD166] group-hover:text-[#FFE199]',
    },
    { 
      id: 'action-items', 
      label: 'Action Items', 
      icon: CheckSquare,
      badge: overdueCount > 0 ? `${overdueCount}` : null,
      badgeColor: 'bg-[#FF4D5A] text-white shadow-[0_0_10px_#FF4D5A]',
      iconColor: 'text-[#FF7A00] group-hover:text-[#FFA04D]',
    },
    { 
      id: 'tasks', 
      label: 'Tasks Kanban', 
      icon: Activity,
      iconColor: 'text-[#B8FF00] group-hover:text-[#D4FF4D]',
    },
    { 
      id: 'team', 
      label: 'Team Members', 
      icon: Users,
      iconColor: 'text-[#FFD166] group-hover:text-[#FFE199]',
    },
    { 
      id: 'add-meeting', 
      label: 'Analyze Meeting', 
      icon: PlusCircle, 
      highlight: true,
      badge: 'AI ✨',
      iconColor: 'text-[#FF2DA6] group-hover:text-[#FF6BC0]',
    },
    { 
      id: 'insights', 
      label: 'AI Insights', 
      icon: Sparkles,
      iconColor: 'text-[#FF2DA6] group-hover:text-[#FF6BC0]',
    },
    { 
      id: 'settings', 
      label: 'Profile / Settings', 
      icon: Settings,
      iconColor: 'text-[#9CA3AF] group-hover:text-white',
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0B0D0F]/95 backdrop-blur-2xl border-r border-[#171B20] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Obsidian Command Header */}
        <div className="h-20 px-5 border-b border-[#171B20] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-[#111418] border border-[#B8FF00]/40 flex items-center justify-center text-[#B8FF00] shadow-[0_0_20px_rgba(184,255,0,0.3)]">
                <Bot className="w-5 h-5 text-[#B8FF00] animate-pulse" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#B8FF00] border-2 border-[#0B0D0F] rounded-full shadow-[0_0_6px_#B8FF00]"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-[#F5F7FA]">
                  Meet<span className="bg-gradient-to-r from-[#B8FF00] via-[#FFD166] to-[#FF7A00] bg-clip-text text-transparent font-black">2Action</span>
                </span>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[#B8FF00] text-[#050505] shadow-[0_0_8px_rgba(184,255,0,0.4)]">
                  AI
                </span>
              </div>
              <span className="block text-[9px] font-black tracking-widest text-[#9CA3AF] uppercase font-mono mt-0.5">
                Obsidian Command Node
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-1.5 text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest flex items-center justify-between font-mono">
            <span>Operations</span>
            <Radio className="w-3 h-3 text-[#B8FF00] animate-pulse" />
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#B8FF00] to-[#FFD166] text-[#050505] shadow-[0_0_24px_rgba(184,255,0,0.4)] border border-[#B8FF00] scale-[1.02]'
                    : item.highlight
                    ? 'text-[#FF2DA6] bg-[#FF2DA6]/10 hover:bg-[#FF2DA6]/20 border border-[#FF2DA6]/35'
                    : 'text-[#9CA3AF] hover:text-[#F5F7FA] hover:bg-[#111418] hover:translate-x-1 border border-transparent hover:border-[#1F242C]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                    isActive ? 'bg-[#050505]/20 text-[#050505]' : 'bg-[#111418] group-hover:bg-[#171B20] ' + item.iconColor
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="tracking-tight">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                        isActive
                          ? 'bg-[#050505] text-[#B8FF00] shadow-[0_0_8px_#B8FF00]'
                          : item.badgeColor || 'bg-gradient-to-r from-[#FF2DA6] to-[#FF7A00] text-white shadow-[0_0_8px_rgba(255,45,166,0.4)]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-[#050505] animate-pulse" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Command Center Status Pill */}
        <div className="p-3.5 mx-3 mb-2 rounded-2xl bg-[#111418]/90 border border-[#171B20] shadow-command-card backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-black text-[#F5F7FA]">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#B8FF00] fill-[#B8FF00]" />
              <span className="tracking-tight">Neural Core Active</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-[#B8FF00] shadow-[0_0_8px_#B8FF00] animate-ping"></span>
          </div>
          <p className="text-[10px] text-[#9CA3AF] mt-1 font-mono">
            LLM engine synced & ready.
          </p>
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-[#171B20] bg-[#0B0D0F]">
          <div className="flex items-center justify-between p-2 rounded-2xl bg-[#111418] border border-[#171B20] hover:border-[#B8FF00]/30 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Poojasri'}
                  alt={currentUser?.name || 'User'}
                  className="w-9 h-9 rounded-xl border border-[#B8FF00]/30 bg-[#050505] p-0.5"
                />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#B8FF00] border border-[#050505] rounded-full shadow-[0_0_6px_#B8FF00]"></span>
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-[#F5F7FA] truncate max-w-[105px]">
                  {currentUser?.name || 'Commander'}
                </p>
                <p className="text-[10px] font-bold text-[#B8FF00] truncate max-w-[105px]">
                  {currentUser?.role || 'Lead Operator'}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="p-1.5 text-[#9CA3AF] hover:text-[#FF4D5A] hover:bg-[#FF4D5A]/15 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
