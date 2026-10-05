import React, { useState } from 'react';
import {
  Calendar,
  Users,
  CheckSquare,
  ChevronRight,
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  Copy,
  Download,
  X,
  Sparkles,
  Lightbulb,
  Check,
  Eye,
  MessageSquare
} from 'lucide-react';
import { PriorityBadge, TaskStatusBadge } from '../components/Badges';

export function MeetingsPage({
  meetings,
  loading,
  setTab,
  onSelectMeeting,
  selectedMeetingDetail,
  onCloseDetail,
  onDeleteMeeting,
  onUpdateTask
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = (meeting) => {
    if (!meeting) return;
    const md = `# Meeting: ${meeting.title}
Date: ${meeting.date}
Participants: ${meeting.participants}

## Executive Summary
${meeting.summary}

## Key Discussion Points
${meeting.discussion_points?.map((dp) => `- ${dp.point}`).join('\n') || 'None recorded'}

## Decisions Made
${meeting.decisions?.map((d) => `- ${d.decision}`).join('\n') || 'None recorded'}

## Extracted Action Items
${meeting.action_items
  ?.map(
    (a) =>
      `- [${a.status === 'Completed' ? 'x' : ' '}] **${a.task}** | Assignee: ${a.assignee} | Due: ${a.deadline} | Priority: ${a.priority}`
  )
  .join('\n') || 'None recorded'}
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const headerGradients = [
    'from-[#B8FF00] via-[#C5FF1A] to-[#FFD166]', // Lime to Gold
    'from-[#FF2DA6] via-[#FF47B2] to-[#FF7A00]', // Magenta to Orange
    'from-[#FF7A00] via-[#FFA04D] to-[#FFD166]', // Orange to Gold
    'from-[#FF4D5A] via-[#FF707A] to-[#FF2DA6]', // Coral to Magenta
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8FF00]/15 text-[#B8FF00] text-xs font-black border border-[#B8FF00]/30 shadow-[0_0_12px_rgba(184,255,0,0.2)] mb-2">
            <Calendar className="w-3.5 h-3.5 text-[#B8FF00]" />
            <span>Transcript Knowledge Archives</span>
          </div>
          <h2 className="text-2xl font-black text-[#F5F7FA] tracking-tight">
            Meeting History & Records
          </h2>
          <p className="text-xs text-[#9CA3AF] font-medium mt-1">
            <span className="text-[#B8FF00] font-black">{meetings.length}</span> recorded meeting{meetings.length === 1 ? '' : 's'}. Review executive summaries, decisions, and action items.
          </p>
        </div>

        <button
          onClick={() => setTab('add-meeting')}
          className="px-4 py-2.5 bg-gradient-to-r from-[#B8FF00] to-[#FFD166] hover:from-[#C5FF1A] hover:to-[#FFE199] text-[#050505] text-xs font-black rounded-2xl shadow-[0_0_20px_rgba(184,255,0,0.35)] transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Meeting</span>
        </button>
      </div>

      {/* Meetings Cards Grid with Obsidian Palette Borders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings.length > 0 ? (
          meetings.map((m, idx) => {
            const participantsArr = m.participants
              ? m.participants.split(',').map((p) => p.trim())
              : [];
            const gradient = headerGradients[idx % headerGradients.length];

            return (
              <div
                key={m.id}
                className="bg-[#0B0D0F]/90 backdrop-blur-xl rounded-3xl border border-[#171B20] shadow-command-card hover:border-[#B8FF00]/40 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Gradient header strip */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />

                <div className="p-6">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-black text-[#B8FF00] bg-[#111418] px-2.5 py-1 rounded-xl border border-[#171B20]">
                      {m.date}
                    </span>
                    <span className="text-[11px] font-black text-[#FFD166] bg-[#111418] px-2.5 py-0.5 rounded-lg border border-[#171B20]">
                      {m.action_items_count} Action Items
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-[#111418] text-[#B8FF00] border border-[#171B20] flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:border-[#B8FF00]/40 transition-all">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black text-[#F5F7FA] line-clamp-1 group-hover:text-[#B8FF00] transition-colors">
                      {m.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#9CA3AF] font-medium line-clamp-2 leading-relaxed mt-2">
                    {m.summary || 'Click to view full summary, decisions, and action items.'}
                  </p>

                  {/* Participants Chips */}
                  {participantsArr.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {participantsArr.slice(0, 3).map((p, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-bold text-[#F5F7FA] bg-[#111418] px-2 py-0.5 rounded-lg border border-[#171B20]"
                        >
                          {p}
                        </span>
                      ))}
                      {participantsArr.length > 3 && (
                        <span className="text-[10px] font-bold text-[#9CA3AF] bg-[#111418] px-1.5 py-0.5 rounded-lg">
                          +{participantsArr.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom View Meeting Button */}
                <div className="p-4 bg-[#111418]/70 border-t border-[#171B20] flex items-center justify-between">
                  <span className="text-[10px] text-[#9CA3AF] font-mono">
                    SQLite Synced
                  </span>
                  <button
                    onClick={() => onSelectMeeting(m.id)}
                    className="px-4 py-2 bg-gradient-to-r from-[#B8FF00] to-[#FFD166] hover:from-[#C5FF1A] hover:to-[#FFE199] text-[#050505] text-xs font-black rounded-xl shadow-[0_0_15px_rgba(184,255,0,0.3)] transition-all flex items-center gap-1.5 hover:scale-105"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Meeting</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center bg-[#0B0D0F]/95 rounded-3xl border border-[#171B20] p-8 shadow-command-card">
            <div className="w-16 h-16 rounded-3xl bg-[#111418] border border-[#B8FF00]/30 flex items-center justify-center mx-auto mb-4 text-[#B8FF00] shadow-[0_0_20px_rgba(184,255,0,0.25)]">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-base font-black text-[#F5F7FA]">No meetings yet</h3>
            <p className="text-xs text-[#9CA3AF] mt-1.5 max-w-sm mx-auto font-medium">
              Your analyzed meetings will appear here.
            </p>
            <button
              onClick={() => setTab('add-meeting')}
              className="mt-6 px-6 py-2.5 bg-gradient-to-r from-[#B8FF00] to-[#FFD166] hover:from-[#C5FF1A] hover:to-[#FFE199] text-[#050505] text-xs font-black rounded-2xl shadow-[0_0_20px_rgba(184,255,0,0.35)] transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add First Meeting</span>
            </button>
          </div>
        )}
      </div>

      {/* Full Meeting Analysis Modal */}
      {selectedMeetingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0B0D0F] rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-[0_0_60px_rgba(0,0,0,0.9)] border border-[#171B20] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#171B20] flex items-start justify-between bg-[#111418]">
              <div>
                <div className="flex items-center gap-2 mb-1.5 text-xs">
                  <span className="font-black text-[#B8FF00] bg-[#050505] px-2.5 py-0.5 rounded-lg border border-[#B8FF00]/30">
                    {selectedMeetingDetail.date}
                  </span>
                  <span className="text-[#9CA3AF]">•</span>
                  <span className="text-[#F5F7FA] font-bold">
                    {selectedMeetingDetail.participants}
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#F5F7FA]">
                  {selectedMeetingDetail.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyMarkdown(selectedMeetingDetail)}
                  className="p-2 text-[#9CA3AF] hover:text-[#B8FF00] hover:bg-[#B8FF00]/10 rounded-xl transition-colors"
                  title="Copy meeting summary as Markdown"
                >
                  {copied ? <Check className="w-4 h-4 text-[#B8FF00]" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this meeting?')) {
                      onDeleteMeeting(selectedMeetingDetail.id);
                      onCloseDetail();
                    }
                  }}
                  className="p-2 text-[#9CA3AF] hover:text-[#FF4D5A] hover:bg-[#FF4D5A]/10 rounded-xl transition-colors"
                  title="Delete meeting"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onCloseDetail}
                  className="p-2 text-[#9CA3AF] hover:text-white hover:bg-[#171B20] rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Summary */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#9CA3AF] mb-2 flex items-center gap-1.5 font-mono">
                  <FileText className="w-3.5 h-3.5 text-[#B8FF00]" />
                  <span>Executive Summary</span>
                </h4>
                <div className="p-4 bg-[#111418] rounded-2xl border border-[#171B20] text-xs text-[#F5F7FA] leading-relaxed font-medium">
                  {selectedMeetingDetail.summary}
                </div>
              </div>

              {/* Discussion Points & Decisions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30">
                  <h4 className="text-xs font-black text-[#FF7A00] mb-2.5 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-[#FF7A00]" />
                    <span>Discussion Points</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#F5F7FA] font-medium">
                    {selectedMeetingDetail.discussion_points?.map((dp) => (
                      <li key={dp.id} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mt-1.5 flex-shrink-0" />
                        <span>{dp.point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-[#B8FF00]/10 border border-[#B8FF00]/30">
                  <h4 className="text-xs font-black text-[#B8FF00] mb-2.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B8FF00]" />
                    <span>Agreed Decisions</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#F5F7FA] font-bold">
                    {selectedMeetingDetail.decisions?.map((dec) => (
                      <li key={dec.id} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] mt-1.5 flex-shrink-0" />
                        <span>{dec.decision}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Items List */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#9CA3AF] mb-3 flex items-center gap-1.5 font-mono">
                  <CheckSquare className="w-3.5 h-3.5 text-[#FF2DA6]" />
                  <span>Action Items & Tasks ({selectedMeetingDetail.action_items?.length || 0})</span>
                </h4>
                <div className="space-y-2.5">
                  {selectedMeetingDetail.action_items?.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl border border-[#171B20] bg-[#111418] hover:border-[#B8FF00]/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-command-card"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-black text-[#F5F7FA]">{item.task}</p>
                        <div className="flex items-center gap-2 text-[11px] text-[#9CA3AF] font-medium mt-1">
                          <span>Owner: <strong className="text-[#FFD166]">{item.assignee}</strong></span>
                          <span>•</span>
                          <span className="text-[#B8FF00] font-bold font-mono">Due: {item.deadline}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <PriorityBadge priority={item.priority} isInferred={item.is_inferred_priority} />
                        <select
                          value={item.status}
                          onChange={(e) =>
                            onUpdateTask && onUpdateTask(item.id, { status: e.target.value })
                          }
                          className="text-xs font-bold px-2.5 py-1 bg-[#050505] border border-[#171B20] text-[#F5F7FA] rounded-xl focus:outline-none focus:border-[#B8FF00]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw Transcript Drawer */}
              <div>
                <details className="text-xs text-[#9CA3AF] bg-[#111418] p-4 rounded-2xl border border-[#171B20]">
                  <summary className="font-bold text-[#F5F7FA] cursor-pointer">
                    View Raw Transcript
                  </summary>
                  <pre className="mt-3 font-mono text-[11px] text-[#9CA3AF] whitespace-pre-wrap leading-relaxed">
                    {selectedMeetingDetail.transcript}
                  </pre>
                </details>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MeetingsPage;
