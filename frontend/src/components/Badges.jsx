import React from 'react';
import { Clock, PlayCircle, CheckCircle2, AlertTriangle, Sparkles, Flame, Zap } from 'lucide-react';

export function TaskStatusBadge({ status, className = '' }) {
  const configs = {
    'Completed': {
      bg: 'bg-[#B8FF00]/10 text-[#B8FF00] border-[#B8FF00]/40 shadow-[0_0_12px_rgba(184,255,0,0.2)]',
      icon: CheckCircle2,
      dot: 'bg-[#B8FF00] shadow-[0_0_8px_#B8FF00]',
    },
    'In Progress': {
      bg: 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/40 shadow-[0_0_12px_rgba(0,229,255,0.2)]',
      icon: PlayCircle,
      dot: 'bg-[#00E5FF] animate-pulse shadow-[0_0_8px_#00E5FF]',
    },
    'Overdue': {
      bg: 'bg-[#FF4D5A]/15 text-[#FF4D5A] border-[#FF4D5A]/45 shadow-[0_0_12px_rgba(255,77,90,0.25)]',
      icon: AlertTriangle,
      dot: 'bg-[#FF4D5A] animate-ping shadow-[0_0_8px_#FF4D5A]',
    },
    'Pending': {
      bg: 'bg-[#FF7A00]/10 text-[#FF7A00] border-[#FF7A00]/40 shadow-[0_0_12px_rgba(255,122,0,0.2)]',
      icon: Clock,
      dot: 'bg-[#FF7A00] shadow-[0_0_8px_#FF7A00]',
    },
  };

  const config = configs[status] || configs['Pending'];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${config.bg} transition-all duration-200 hover:scale-[1.02] ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon className="w-3.5 h-3.5 opacity-90" />
      <span>{status}</span>
    </span>
  );
}

export function PriorityBadge({ priority, isInferred = false, className = '' }) {
  const configs = {
    'High': {
      bg: 'bg-[#FF2DA6]/15 text-[#FF2DA6] border-[#FF2DA6]/40 shadow-[0_0_12px_rgba(255,45,166,0.2)]',
      dot: 'bg-gradient-to-r from-[#FF2DA6] to-[#FF4D5A]',
      icon: Flame,
    },
    'Medium': {
      bg: 'bg-[#FF7A00]/15 text-[#FF7A00] border-[#FF7A00]/40 shadow-[0_0_12px_rgba(255,122,0,0.2)]',
      dot: 'bg-gradient-to-r from-[#FF7A00] to-[#FFD166]',
      icon: Zap,
    },
    'Low': {
      bg: 'bg-[#FFD166]/15 text-[#FFD166] border-[#FFD166]/40 shadow-[0_0_12px_rgba(255,209,102,0.2)]',
      dot: 'bg-gradient-to-r from-[#FFD166] to-[#B8FF00]',
      icon: Clock,
    },
  };

  const config = configs[priority] || configs['Medium'];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black border backdrop-blur-md ${config.bg} transition-all duration-200 hover:scale-[1.02] ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon className="w-3 h-3 opacity-90" />
      <span>{priority}</span>
      {isInferred && (
        <span
          title="Priority inferred by AI from meeting context"
          className="text-[9px] text-[#050505] bg-[#B8FF00] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ml-1 shadow-[0_0_8px_rgba(184,255,0,0.4)]"
        >
          <Sparkles className="w-2.5 h-2.5 text-[#050505]" />
          <span>AI</span>
        </span>
      )}
    </span>
  );
}

export default { TaskStatusBadge, PriorityBadge };
