import React, { useState } from 'react';
import {
  Calendar,
  Users,
  CheckSquare,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  FileText,
  CheckCircle2,
  Copy,
  Download,
  X,
  Sparkles,
  Lightbulb,
  Check,
  Eye,
  MessageSquare,
  Bot,
  Zap,
  ListOrdered,
  Layers,
  ArrowRight,
  Clock
} from 'lucide-react';
import { PriorityBadge, TaskStatusBadge } from '../components/Badges';
import { api } from '../services/api';

export function MeetingsPage({
  meetings = [],
  loading,
  setTab,
  onSelectMeeting,
  selectedMeetingDetail,
  onCloseDetail,
  onDeleteMeeting,
  onUpdateTask,
  onCreateMeeting,
  onUpdateMeeting
}) {
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');

  // Create Meeting Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 16));
  const [newParticipants, setNewParticipants] = useState('Poojasri, Rithanya, Poojitha');
  const [newAgenda, setNewAgenda] = useState('1. Project alignment\n2. Task responsibilities and timeline\n3. Deliverables review');
  const [newNotes, setNewNotes] = useState('Project sync meeting. Poojasri will prepare the presentation by October 8. Rithanya will complete the dataset preparation by October 6. Poojitha will test the model by October 10. The team decided to use Python and FastAPI for the prototype.');
  const [creatingMeeting, setCreatingMeeting] = useState(false);

  // Edit Meeting Modal
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // AI Meeting Assistant Interactive State inside Meeting Details
  const [aiLoading, setAiLoading] = useState(false);
  const [aiActiveTab, setAiActiveTab] = useState(null); // 'summary' | 'actions' | 'highlights' | 'followups'
  const [aiResult, setAiResult] = useState(null);
  const [addedItemSuccess, setAddedItemSuccess] = useState(false);

  const handleCopyMarkdown = (meeting) => {
    if (!meeting) return;
    const md = `# Meeting: ${meeting.title}
Date: ${meeting.date}
Participants: ${meeting.participants}

## Agenda
${meeting.agenda || 'None specified'}

## Executive Summary
${meeting.summary || 'None recorded'}

## Key Discussion Points
${meeting.discussion_points?.map((dp) => `- ${dp.point}`).join('\n') || 'None recorded'}

## Decisions Made
${meeting.decisions?.map((d) => `- ${d.decision}`).join('\n') || 'None recorded'}

## Action Items
${meeting.action_items?.map((a) => `- [${a.status === 'Completed' ? 'x' : ' '}] **${a.task}** | Assignee: ${a.assignee} | Due: ${a.deadline} | Priority: ${a.priority}`).join('\n') || 'None recorded'}
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newNotes.trim()) return;

    setCreatingMeeting(true);
    try {
      if (onCreateMeeting) {
        await onCreateMeeting({
          title: newTitle.trim(),
          date: newDate,
          participants: newParticipants.trim(),
          agenda: newAgenda.trim(),
          transcript: newNotes.trim(),
          summary: `Meeting on ${newTitle.trim()} covering agenda topics and deliverables.`
        });
      }
      setIsCreateModalOpen(false);
      setNewTitle('');
    } catch (err) {
      console.error('Failed to create meeting:', err);
    } finally {
      setCreatingMeeting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingMeeting) return;

    setSavingEdit(true);
    try {
      if (onUpdateMeeting) {
        await onUpdateMeeting(editingMeeting.id, {
          title: editingMeeting.title,
          date: editingMeeting.date,
          participants: editingMeeting.participants,
          agenda: editingMeeting.agenda,
          transcript: editingMeeting.transcript,
          summary: editingMeeting.summary
        });
      }
      setEditingMeeting(null);
    } catch (err) {
      console.error('Failed to update meeting:', err);
    } finally {
      setSavingEdit(false);
    }
  };

  // AI Meeting Assistant Operations
  const runAiSummarize = async () => {
    if (!selectedMeetingDetail) return;
    setAiLoading(true);
    setAiActiveTab('summary');
    try {
      const res = await api.aiSummarize(
        selectedMeetingDetail.transcript || selectedMeetingDetail.summary,
        selectedMeetingDetail.title
      );
      setAiResult({ type: 'summary', data: res });
    } catch (err) {
      // Local rule fallback
      setAiResult({
        type: 'summary',
        data: {
          summary: selectedMeetingDetail.summary || `Executive summary of ${selectedMeetingDetail.title}: key milestones reviewed and actions assigned.`,
          key_points: selectedMeetingDetail.discussion_points?.map((d) => d.point) || ['Agenda milestone check', 'Deliverables review']
        }
      });
    } finally {
      setAiLoading(false);
    }
  };

  const runAiExtractActions = async () => {
    if (!selectedMeetingDetail) return;
    setAiLoading(true);
    setAiActiveTab('actions');
    try {
      const res = await api.aiActionItems(
        selectedMeetingDetail.transcript || selectedMeetingDetail.summary,
        selectedMeetingDetail.title
      );
      setAiResult({ type: 'actions', data: res });
    } catch (err) {
      setAiResult({
        type: 'actions',
        data: {
          action_items: selectedMeetingDetail.action_items || [
            { task: 'Prepare next milestone deliverable', assignee: 'Poojasri', deadline: 'October 14', priority: 'High' }
          ]
        }
      });
    } finally {
      setAiLoading(false);
    }
  };

  const runAiHighlights = async () => {
    if (!selectedMeetingDetail) return;
    setAiLoading(true);
    setAiActiveTab('highlights');
    try {
      const res = await api.aiHighlights(
        selectedMeetingDetail.transcript || selectedMeetingDetail.summary,
        selectedMeetingDetail.title
      );
      setAiResult({ type: 'highlights', data: res });
    } catch (err) {
      setAiResult({
        type: 'highlights',
        data: {
          highlights: [
            `Consensus established on ${selectedMeetingDetail.title} execution timeline.`,
            'Zero technical blockers reported for the upcoming demo release.'
          ],
          decisions: selectedMeetingDetail.decisions?.map((d) => d.decision) || ['Proceed with current architecture']
        }
      });
    } finally {
      setAiLoading(false);
    }
  };

  const runAiFollowUps = async () => {
    if (!selectedMeetingDetail) return;
    setAiLoading(true);
    setAiActiveTab('followups');
    try {
      const res = await api.aiFollowUps(
        selectedMeetingDetail.transcript || selectedMeetingDetail.summary,
        selectedMeetingDetail.title
      );
      setAiResult({ type: 'followups', data: res });
    } catch (err) {
      setAiResult({
        type: 'followups',
        data: {
          follow_up_points: [
            'Send executive briefing notes to all participants.',
            'Verify deadline completion for high-priority sprint tasks.',
            'Schedule brief check-in prior to final demo submission.'
          ]
        }
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddExtractedItem = async (item) => {
    try {
      await api.createActionItem({
        task: item.task,
        description: item.description || '',
        assignee: item.assignee || 'Unassigned',
        priority: item.priority || 'Medium',
        deadline: item.deadline || 'October 12',
        meeting_id: selectedMeetingDetail?.id
      });
      setAddedItemSuccess(true);
      setTimeout(() => setAddedItemSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Filter meetings by search query
  const filteredMeetings = meetings.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.title?.toLowerCase().includes(q) ||
      m.participants?.toLowerCase().includes(q) ||
      m.summary?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8FF00]/15 text-[#B8FF00] text-xs font-black border border-[#B8FF00]/30 shadow-[0_0_12px_rgba(184,255,0,0.2)] mb-2">
            <Calendar className="w-3.5 h-3.5 text-[#B8FF00]" />
            <span>Meeting Intelligence Archives</span>
          </div>
          <h2 className="text-2xl font-black text-[#F5F7FA] tracking-tight">
            Meetings & Intelligence Logs
          </h2>
          <p className="text-xs text-[#9CA3AF] font-medium mt-1">
            <span className="text-[#B8FF00] font-black">{meetings.length}</span> recorded meeting{meetings.length === 1 ? '' : 's'}. Review summaries, agendas, and action items.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-[#B8FF00] to-[#FFD166] hover:from-[#C5FF1A] hover:to-[#FFE199] text-[#050505] text-xs font-black rounded-2xl shadow-[0_0_20px_rgba(184,255,0,0.35)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Meeting</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search meetings by title, participant, or keyword..."
          className="w-full px-4 py-2.5 text-xs bg-[#0B0D0F] border border-[#171B20] rounded-2xl text-[#F5F7FA] placeholder-[#9CA3AF]/60 focus:outline-none focus:border-[#B8FF00] transition-colors shadow-command-card"
        />
      </div>

      {/* Meetings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeetings.length > 0 ? (
          filteredMeetings.map((m) => {
            const participantsArr = m.participants
              ? m.participants.split(',').map((p) => p.trim())
              : [];

            return (
              <div
                key={m.id}
                className="p-6 rounded-3xl bg-[#0B0D0F]/95 backdrop-blur-2xl border border-[#171B20] hover:border-[#B8FF00]/40 transition-all duration-300 flex flex-col justify-between shadow-command-card group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono font-black text-[#B8FF00] bg-[#111418] px-2.5 py-1 rounded-lg border border-[#B8FF00]/20">
                      {m.date}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingMeeting({ ...m })}
                        className="p-1.5 text-[#9CA3AF] hover:text-[#B8FF00] rounded-lg transition-colors"
                        title="Edit Meeting"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this meeting and its attached action items?')) {
                            onDeleteMeeting(m.id);
                          }
                        }}
                        className="p-1.5 text-[#9CA3AF] hover:text-[#FF4D5A] rounded-lg transition-colors"
                        title="Delete Meeting"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-black text-[#F5F7FA] group-hover:text-[#B8FF00] transition-colors line-clamp-1">
                    {m.title}
                  </h3>

                  <p className="text-xs text-[#9CA3AF] mt-2 line-clamp-3 leading-relaxed font-medium">
                    {m.summary || 'Summary generated from meeting transcript.'}
                  </p>

                  {/* Participants Chips */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {participantsArr.map((p, pIdx) => (
                      <span
                        key={pIdx}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#111418] text-[#9CA3AF] border border-[#171B20]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Metrics & Open Details */}
                <div className="mt-6 pt-4 border-t border-[#171B20] flex items-center justify-between">
                  <div className="text-[11px] text-[#9CA3AF]">
                    <span>Action Items: <strong className="text-[#FFD166]">{m.action_items_count || 0}</strong></span>
                  </div>

                  <button
                    onClick={() => onSelectMeeting(m.id)}
                    className="px-3.5 py-1.5 bg-[#111418] hover:bg-[#B8FF00] hover:text-[#050505] text-[#F5F7FA] text-xs font-black rounded-xl border border-[#171B20] hover:border-[#B8FF00] transition-all flex items-center gap-1.5"
                  >
                    <span>Open Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full p-12 text-center text-xs text-[#9CA3AF] rounded-3xl bg-[#0B0D0F] border border-[#171B20]">
            <Calendar className="w-10 h-10 text-[#B8FF00] mx-auto mb-3 opacity-60" />
            <p className="text-sm font-black text-[#F5F7FA]">No meetings recorded yet</p>
            <p className="mt-1">Click "+ New Meeting" to add your first meeting notes.</p>
          </div>
        )}
      </div>

      {/* ================= MODAL: CREATE MEETING ================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0B0D0F] border border-[#171B20] rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#171B20] pb-3">
              <h3 className="text-base font-black text-[#F5F7FA] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#B8FF00]" />
                <span>Create New Meeting</span>
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-[#9CA3AF] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Q4 Sprint Planning & Architecture Review"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#111418] border border-[#171B20] rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#111418] border border-[#171B20] text-[#F5F7FA] rounded-xl focus:outline-none focus:border-[#B8FF00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                    Participants (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newParticipants}
                    onChange={(e) => setNewParticipants(e.target.value)}
                    placeholder="e.g. Poojasri, Rithanya, Poojitha"
                    className="w-full px-3 py-2 text-xs bg-[#111418] border border-[#171B20] text-[#F5F7FA] rounded-xl focus:outline-none focus:border-[#B8FF00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                  Agenda
                </label>
                <textarea
                  rows={2}
                  value={newAgenda}
                  onChange={(e) => setNewAgenda(e.target.value)}
                  placeholder="1. Roadmap discussion&#10;2. Architecture selection&#10;3. Deliverables delegation"
                  className="w-full px-3.5 py-2 text-xs bg-[#111418] border border-[#171B20] rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                  Meeting Notes / Transcript *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Enter meeting notes or transcript. The AI will extract action items and summaries..."
                  className="w-full px-3.5 py-2 text-xs bg-[#111418] border border-[#171B20] rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00] font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#171B20]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#9CA3AF] hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingMeeting}
                  className="px-5 py-2.5 text-xs font-black bg-gradient-to-r from-[#B8FF00] to-[#FFD166] text-[#050505] rounded-xl shadow-[0_0_15px_rgba(184,255,0,0.35)] disabled:opacity-50"
                >
                  {creatingMeeting ? 'Saving Meeting...' : 'Save Meeting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT MEETING ================= */}
      {editingMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0B0D0F] border border-[#171B20] rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#171B20] pb-3">
              <h3 className="text-base font-black text-[#F5F7FA] flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#B8FF00]" />
                <span>Edit Meeting</span>
              </h3>
              <button
                onClick={() => setEditingMeeting(null)}
                className="p-1 text-[#9CA3AF] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editingMeeting.title}
                  onChange={(e) => setEditingMeeting({ ...editingMeeting, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#111418] border border-[#171B20] rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={editingMeeting.date}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#111418] border border-[#171B20] text-[#F5F7FA] rounded-xl focus:outline-none focus:border-[#B8FF00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                    Participants
                  </label>
                  <input
                    type="text"
                    value={editingMeeting.participants}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, participants: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#111418] border border-[#171B20] text-[#F5F7FA] rounded-xl focus:outline-none focus:border-[#B8FF00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                  Agenda
                </label>
                <textarea
                  rows={2}
                  value={editingMeeting.agenda || ''}
                  onChange={(e) => setEditingMeeting({ ...editingMeeting, agenda: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#111418] border border-[#171B20] rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                  Summary
                </label>
                <textarea
                  rows={2}
                  value={editingMeeting.summary || ''}
                  onChange={(e) => setEditingMeeting({ ...editingMeeting, summary: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#111418] border border-[#171B20] rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#171B20]">
                <button
                  type="button"
                  onClick={() => setEditingMeeting(null)}
                  className="px-4 py-2 text-xs text-[#9CA3AF] hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2.5 text-xs font-black bg-gradient-to-r from-[#B8FF00] to-[#FFD166] text-[#050505] rounded-xl shadow-[0_0_15px_rgba(184,255,0,0.35)] disabled:opacity-50"
                >
                  {savingEdit ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MEETING DETAILS MODAL / DRAWER ================= */}
      {selectedMeetingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0B0D0F] border border-[#171B20] rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#171B20] flex items-start justify-between gap-4 bg-gradient-to-r from-[#0B0D0F] via-[#111418] to-[#0B0D0F]">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <span className="font-black text-[#B8FF00] bg-[#050505] px-2.5 py-0.5 rounded-lg border border-[#B8FF00]/30 font-mono">
                    {selectedMeetingDetail.date}
                  </span>
                  <span className="text-[#9CA3AF]">•</span>
                  <span className="text-[#F5F7FA] font-bold">
                    {selectedMeetingDetail.participants}
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#F5F7FA]">
                  {selectedMeetingDetail.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyMarkdown(selectedMeetingDetail)}
                  className="p-2 text-[#9CA3AF] hover:text-[#B8FF00] hover:bg-[#111418] rounded-xl transition-colors"
                  title="Copy as Markdown"
                >
                  {copied ? <Check className="w-4 h-4 text-[#B8FF00]" /> : <Copy className="w-4 h-4" />}
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
              {/* Agenda & Summary */}
              {selectedMeetingDetail.agenda && (
                <div className="p-4 rounded-2xl bg-[#111418] border border-[#171B20]">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#FFD166] mb-2 flex items-center gap-1.5 font-mono">
                    <ListOrdered className="w-3.5 h-3.5 text-[#FFD166]" />
                    <span>Meeting Agenda</span>
                  </h4>
                  <pre className="text-xs text-[#F5F7FA] whitespace-pre-wrap font-sans leading-relaxed">
                    {selectedMeetingDetail.agenda}
                  </pre>
                </div>
              )}

              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#9CA3AF] mb-2 flex items-center gap-1.5 font-mono">
                  <FileText className="w-3.5 h-3.5 text-[#B8FF00]" />
                  <span>Executive Summary</span>
                </h4>
                <div className="p-4 bg-[#111418] rounded-2xl border border-[#171B20] text-xs text-[#F5F7FA] leading-relaxed font-medium">
                  {selectedMeetingDetail.summary || 'Summary generated from meeting transcript.'}
                </div>
              </div>

              {/* ================= AI MEETING ASSISTANT SECTION ================= */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#111418] via-[#0B0D0F] to-[#111418] border border-[#B8FF00]/30 shadow-command-card space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#B8FF00]/15 flex items-center justify-center text-[#B8FF00]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#F5F7FA] uppercase tracking-wider font-mono">
                        AI Meeting Assistant
                      </h4>
                      <p className="text-[10px] text-[#9CA3AF]">
                        Run intelligent NLP synthesis on this meeting's notes
                      </p>
                    </div>
                  </div>
                  {aiLoading && (
                    <span className="text-[10px] font-black text-[#B8FF00] font-mono animate-pulse flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-[#B8FF00]" />
                      Processing...
                    </span>
                  )}
                </div>

                {/* AI Action Trigger Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={runAiSummarize}
                    disabled={aiLoading}
                    className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border ${
                      aiActiveTab === 'summary'
                        ? 'bg-[#B8FF00] text-[#050505] border-[#B8FF00]'
                        : 'bg-[#0B0D0F] text-[#F5F7FA] border-[#171B20] hover:border-[#B8FF00]/50'
                    }`}
                  >
                    <span>🧠 Summarize</span>
                  </button>

                  <button
                    onClick={runAiExtractActions}
                    disabled={aiLoading}
                    className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border ${
                      aiActiveTab === 'actions'
                        ? 'bg-[#FF2DA6] text-white border-[#FF2DA6]'
                        : 'bg-[#0B0D0F] text-[#F5F7FA] border-[#171B20] hover:border-[#FF2DA6]/50'
                    }`}
                  >
                    <span>⚡ Action Items</span>
                  </button>

                  <button
                    onClick={runAiHighlights}
                    disabled={aiLoading}
                    className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border ${
                      aiActiveTab === 'highlights'
                        ? 'bg-[#FFD166] text-[#050505] border-[#FFD166]'
                        : 'bg-[#0B0D0F] text-[#F5F7FA] border-[#171B20] hover:border-[#FFD166]/50'
                    }`}
                  >
                    <span>✨ Highlights</span>
                  </button>

                  <button
                    onClick={runAiFollowUps}
                    disabled={aiLoading}
                    className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border ${
                      aiActiveTab === 'followups'
                        ? 'bg-[#FF7A00] text-white border-[#FF7A00]'
                        : 'bg-[#0B0D0F] text-[#F5F7FA] border-[#171B20] hover:border-[#FF7A00]/50'
                    }`}
                  >
                    <span>📋 Follow-ups</span>
                  </button>
                </div>

                {/* AI Output Container */}
                {aiResult && (
                  <div className="p-4 rounded-2xl bg-[#050505] border border-[#171B20] space-y-3 animate-fade-in text-xs">
                    {addedItemSuccess && (
                      <div className="p-2.5 rounded-xl bg-[#B8FF00]/15 text-[#B8FF00] font-bold text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Action item saved directly to your workspace!</span>
                      </div>
                    )}

                    {aiResult.type === 'summary' && (
                      <div>
                        <p className="font-black text-[#B8FF00] uppercase font-mono text-[10px] mb-1">
                          Generated Summary
                        </p>
                        <p className="text-[#F5F7FA] leading-relaxed mb-3">
                          {aiResult.data.summary}
                        </p>
                        {aiResult.data.key_points?.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] text-[#9CA3AF] font-bold">Key Discussion Points:</span>
                            {aiResult.data.key_points.map((pt, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-[#9CA3AF]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] mt-1.5 flex-shrink-0" />
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {aiResult.type === 'actions' && (
                      <div>
                        <p className="font-black text-[#FF2DA6] uppercase font-mono text-[10px] mb-2">
                          Extracted Action Items
                        </p>
                        <div className="space-y-2">
                          {aiResult.data.action_items?.map((act, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-[#111418] border border-[#171B20] flex items-center justify-between gap-3"
                            >
                              <div>
                                <p className="font-black text-[#F5F7FA] text-xs">{act.task}</p>
                                <p className="text-[10px] text-[#9CA3AF] mt-0.5">
                                  Owner: <strong className="text-[#FFD166]">{act.assignee}</strong> • Due: <strong className="text-[#B8FF00]">{act.deadline}</strong> • Priority: {act.priority}
                                </p>
                              </div>
                              <button
                                onClick={() => handleAddExtractedItem(act)}
                                className="px-2.5 py-1 bg-[#B8FF00]/15 hover:bg-[#B8FF00] text-[#B8FF00] hover:text-[#050505] text-[10px] font-black rounded-lg transition-colors flex-shrink-0"
                              >
                                + Import Item
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {aiResult.type === 'highlights' && (
                      <div>
                        <p className="font-black text-[#FFD166] uppercase font-mono text-[10px] mb-1">
                          Strategic Highlights & Decisions
                        </p>
                        <ul className="space-y-1.5">
                          {aiResult.data.highlights?.map((h, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-[#F5F7FA]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166] mt-1.5 flex-shrink-0" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiResult.type === 'followups' && (
                      <div>
                        <p className="font-black text-[#FF7A00] uppercase font-mono text-[10px] mb-1">
                          Recommended Follow-Up Steps
                        </p>
                        <ul className="space-y-1.5">
                          {aiResult.data.follow_up_points?.map((f, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-[#F5F7FA]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mt-1.5 flex-shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
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
                        <p className={`text-xs font-black ${item.status === 'Completed' ? 'line-through text-[#9CA3AF]' : 'text-[#F5F7FA]'}`}>
                          {item.task}
                        </p>
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
                    View Raw Transcript & Notes
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
