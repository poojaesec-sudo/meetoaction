import React from 'react';

export function StatCard({ title, value, icon: Icon, change, subtitle, color = 'lime' }) {
  const colorMap = {
    lime: {
      gradient: 'from-[#B8FF00] to-[#FFD166]',
      iconGlow: 'bg-[#B8FF00] text-[#050505] shadow-[0_0_20px_rgba(184,255,0,0.45)]',
      badgeBg: 'bg-[#B8FF00]/15 text-[#B8FF00] border-[#B8FF00]/40',
      borderHover: 'hover:border-[#B8FF00]/60 hover:shadow-neon-lime',
      topLine: 'from-[#B8FF00] via-[#C5FF1A] to-[#FFD166]',
      valColor: 'text-[#B8FF00]',
    },
    magenta: {
      gradient: 'from-[#FF2DA6] to-[#FF7A00]',
      iconGlow: 'bg-[#FF2DA6] text-white shadow-[0_0_20px_rgba(255,45,166,0.45)]',
      badgeBg: 'bg-[#FF2DA6]/15 text-[#FF2DA6] border-[#FF2DA6]/40',
      borderHover: 'hover:border-[#FF2DA6]/60 hover:shadow-neon-magenta',
      topLine: 'from-[#FF2DA6] via-[#FF47B2] to-[#FF7A00]',
      valColor: 'text-[#FF2DA6]',
    },
    orange: {
      gradient: 'from-[#FF7A00] to-[#FFD166]',
      iconGlow: 'bg-[#FF7A00] text-[#050505] shadow-[0_0_20px_rgba(255,122,0,0.45)]',
      badgeBg: 'bg-[#FF7A00]/15 text-[#FF7A00] border-[#FF7A00]/40',
      borderHover: 'hover:border-[#FF7A00]/60 hover:shadow-neon-orange',
      topLine: 'from-[#FF7A00] via-[#FFA04D] to-[#FFD166]',
      valColor: 'text-[#FF7A00]',
    },
    gold: {
      gradient: 'from-[#FFD166] to-[#FF7A00]',
      iconGlow: 'bg-[#FFD166] text-[#050505] shadow-[0_0_20px_rgba(255,209,102,0.45)]',
      badgeBg: 'bg-[#FFD166]/15 text-[#FFD166] border-[#FFD166]/40',
      borderHover: 'hover:border-[#FFD166]/60 hover:shadow-neon-gold',
      topLine: 'from-[#FFD166] via-[#FFE199] to-[#FF7A00]',
      valColor: 'text-[#FFD166]',
    },
    coral: {
      gradient: 'from-[#FF4D5A] to-[#FF2DA6]',
      iconGlow: 'bg-[#FF4D5A] text-white shadow-[0_0_20px_rgba(255,77,90,0.45)]',
      badgeBg: 'bg-[#FF4D5A]/15 text-[#FF4D5A] border-[#FF4D5A]/40',
      borderHover: 'hover:border-[#FF4D5A]/60 hover:shadow-neon-coral',
      topLine: 'from-[#FF4D5A] via-[#FF707A] to-[#FF2DA6]',
      valColor: 'text-[#FF4D5A]',
    },
    // Backwards-compat aliases
    cyan: {
      gradient: 'from-[#B8FF00] to-[#FFD166]',
      iconGlow: 'bg-[#B8FF00] text-[#050505] shadow-[0_0_20px_rgba(184,255,0,0.45)]',
      badgeBg: 'bg-[#B8FF00]/15 text-[#B8FF00] border-[#B8FF00]/40',
      borderHover: 'hover:border-[#B8FF00]/60 hover:shadow-neon-lime',
      topLine: 'from-[#B8FF00] to-[#FFD166]',
      valColor: 'text-[#B8FF00]',
    },
    purple: {
      gradient: 'from-[#FF2DA6] to-[#FF7A00]',
      iconGlow: 'bg-[#FF2DA6] text-white shadow-[0_0_20px_rgba(255,45,166,0.45)]',
      badgeBg: 'bg-[#FF2DA6]/15 text-[#FF2DA6] border-[#FF2DA6]/40',
      borderHover: 'hover:border-[#FF2DA6]/60 hover:shadow-neon-magenta',
      topLine: 'from-[#FF2DA6] to-[#FF7A00]',
      valColor: 'text-[#FF2DA6]',
    },
    amber: {
      gradient: 'from-[#FF7A00] to-[#FFD166]',
      iconGlow: 'bg-[#FF7A00] text-[#050505] shadow-[0_0_20px_rgba(255,122,0,0.45)]',
      badgeBg: 'bg-[#FF7A00]/15 text-[#FF7A00] border-[#FF7A00]/40',
      borderHover: 'hover:border-[#FF7A00]/60 hover:shadow-neon-orange',
      topLine: 'from-[#FF7A00] to-[#FFD166]',
      valColor: 'text-[#FF7A00]',
    },
    emerald: {
      gradient: 'from-[#FFD166] to-[#FF7A00]',
      iconGlow: 'bg-[#FFD166] text-[#050505] shadow-[0_0_20px_rgba(255,209,102,0.45)]',
      badgeBg: 'bg-[#FFD166]/15 text-[#FFD166] border-[#FFD166]/40',
      borderHover: 'hover:border-[#FFD166]/60 hover:shadow-neon-gold',
      topLine: 'from-[#FFD166] to-[#FF7A00]',
      valColor: 'text-[#FFD166]',
    },
  };

  const scheme = colorMap[color] || colorMap.lime;

  return (
    <div
      className={`group relative bg-[#0B0D0F]/90 backdrop-blur-2xl rounded-3xl p-5 border border-[#171B20] shadow-command-card ${scheme.borderHover} transition-all duration-300 hover:-translate-y-1.5 overflow-hidden`}
    >
      {/* Top command accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${scheme.topLine}`} />

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#9CA3AF]">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-2xl ${scheme.iconGlow} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 font-bold`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div className="text-3xl lg:text-4xl font-black text-[#F5F7FA] tracking-tight">
          {value}
        </div>
        {change && (
          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border backdrop-blur-md uppercase tracking-wider ${scheme.badgeBg}`}>
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs font-medium text-[#9CA3AF] line-clamp-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default StatCard;
