import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  ChevronDown
} from 'lucide-react';
import { PriorityBadge, TaskStatusBadge } from '../components/Badges';

export function ActionItemsPage({
  tasks = [],
  teamMembers = [],
  meetings = [],
  onUpdateTask,
  onCreateTask,
  onDeleteTask
}) {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('All');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form states for Create
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Poojasri');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [newTaskDeadline, setNewTaskDeadline] = useState('October 12');
  const [newTaskMeetingId, setNewTaskMeetingId] = useState('');

  // Filtered tasks
  const filteredTasks = tasks.filter((t) => {
    if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (assigneeFilter !== 'All' && t.assignee !== assigneeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = t.task?.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchAssignee = t.assignee?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchAssignee) return false;
    }
    return true;
  });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await onCreateTask({
      task: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      assignee: newTaskAssignee,
      priority: newTaskPriority,
      deadline: newTaskDeadline,
      meeting_id: newTaskMeetingId ? parseInt(newTaskMeetingId) : null,
      status: 'Pending',
      progress: 0
    });

    setNewTaskTitle('');
    setNewTaskDesc('');
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingTask) return;

    await onUpdateTask(editingTask.id, {
      task: editingTask.task,
      description: editingTask.description,
      assignee: editingTask.assignee,
      priority: editingTask.priority,
      deadline: editingTask.deadline,
      status: editingTask.status,
      progress: editingTask.status === 'Completed' ? 100 : editingTask.progress
    });

    setEditingTask(null);
  };

  const toggleComplete = (task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    onUpdateTask(task.id, {
      status: nextStatus,
      progress: nextStatus === 'Completed' ? 100 : 0
    });
  };

  // Team list fallback
  const teamNames = teamMembers.length > 0
    ? teamMembers.map((m) => m.name.split(' ')[0])
    : ['Poojasri', 'Rithanya', 'Poojitha', 'Karthik', 'Aravind'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8FF00]/15 text-[#B8FF00] text-xs font-black border border-[#B8FF00]/30 shadow-[0_0_12px_rgba(184,255,0,0.2)] mb-2">
            <CheckSquare className="w-3.5 h-3.5 text-[#B8FF00]" />
            <span>Execution Tracker</span>
          </div>
          <h2 className="text-2xl font-black text-[#F5F7FA] tracking-tight">
            Action Items & Task Matrix
          </h2>
          <p className="text-xs text-[#9CA3AF] font-medium mt-1">
            Assign accountability, track deadlines, and enforce deliverables across meetings.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-[#B8FF00] to-[#FFD166] hover:from-[#C5FF1A] hover:to-[#FFE199] text-[#050505] text-xs font-black rounded-2xl shadow-[0_0_20px_rgba(184,255,0,0.35)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Action Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0B0D0F] border border-[#171B20] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-command-card">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action items by keyword or owner..."
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-[#111418] border border-[#171B20] rounded-xl text-[#F5F7FA] placeholder-[#9CA3AF]/60 focus:outline-none focus:border-[#B8FF00] transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs font-bold px-3 py-2 bg-[#111418] border border-[#171B20] text-[#F5F7FA] rounded-xl focus:outline-none focus:border-[#B8FF00]"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold px-3 py-2 bg-[#111418] border border-[#171B20] text-[#F5F7FA] rounded-xl focus:outline-none focus:border-[#B8FF00]"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>

          {/* Assignee */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="text-xs font-bold px-3 py-2 bg-[#111418] border border-[#171B20] text-[#F5F7FA] rounded-xl focus:outline-none focus:border-[#B8FF00]"
          >
            <option value="All">All Assignees</option>
            {teamNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Items List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((t) => (
            <div
              key={t.id}
              className={`p-4 rounded-2xl bg-[#0B0D0F] border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-command-card ${
                t.status === 'Completed'
                  ? 'border-[#171B20] opacity-80'
                  : t.status === 'Overdue'
                  ? 'border-[#FF4D5A]/40 bg-[#FF4D5A]/5'
                  : 'border-[#171B20] hover:border-[#B8FF00]/40'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => toggleComplete(t)}
                  className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors flex-shrink-0 ${
                    t.status === 'Completed'
                      ? 'bg-[#B8FF00] border-[#B8FF00] text-[#050505]'
                      : 'border-[#171B20] bg-[#111418] hover:border-[#B8FF00]'
                  }`}
                >
                  {t.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-xs font-black ${t.status === 'Completed' ? 'line-through text-[#9CA3AF]' : 'text-[#F5F7FA]'}`}>
                      {t.task}
                    </p>
                    <PriorityBadge priority={t.priority} isInferred={t.is_inferred_priority} />
                  </div>

                  {t.description && (
                    <p className="text-[11px] text-[#9CA3AF] mt-1 line-clamp-2 leading-relaxed">
                      {t.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-2 text-[10px] text-[#9CA3AF] flex-wrap">
                    <span className="flex items-center gap-1 font-bold text-[#FFD166]">
                      <User className="w-3 h-3" />
                      <span>{t.assignee}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-[#B8FF00]">
                      <Clock className="w-3 h-3" />
                      <span>Due: {t.deadline}</span>
                    </span>
                    <span>•</span>
                    <span className="text-[#9CA3AF] truncate max-w-[160px]">
                      {t.meeting_title || 'Direct Action Item'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                <TaskStatusBadge status={t.status} />

                <button
                  onClick={() => setEditingTask({ ...t })}
                  className="p-1.5 text-[#9CA3AF] hover:text-[#B8FF00] hover:bg-[#111418] rounded-xl transition-colors"
                  title="Edit Action Item"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    if (confirm('Delete this action item?')) {
                      onDeleteTask(t.id);
                    }
                  }}
                  className="p-1.5 text-[#9CA3AF] hover:text-[#FF4D5A] hover:bg-[#111418] rounded-xl transition-colors"
                  title="Delete Action Item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-xs text-[#9CA3AF] rounded-3xl bg-[#0B0D0F] border border-[#171B20]">
            <CheckSquare className="w-10 h-10 text-[#B8FF00] mx-auto mb-3 opacity-60" />
            <p className="text-sm font-black text-[#F5F7FA]">No action items found</p>
            <p className="mt-1">Try adjusting your filters or click "+ New Action Item" to create one.</p>
          </div>
        )}
      </div>

      {/* ================= MODAL: CREATE ACTION ITEM ================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0B0D0F] border border-[#171B20] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#171B20] pb-3">
              <h3 className="text-base font-black text-[#F5F7FA] flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#B8FF00]" />
                <span>Create Action Item</span>
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
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Prepare executive slide deck for board"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#111418] border border-[#171B20] rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                  Context / Description
                </label>
                <textarea
                  rows={2}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Additional context or requirements discussed in the meeting..."
                  className="w-full px-3.5 py-2 text-xs bg-[#111418] border border-[#171B20] rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                    Assignee
                  </label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#111418] border border-[#171B20] text-[#F5F7FA] rounded-xl focus:outline-none focus:border-[#B8FF00]"
                  >
                    {teamNames.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#111418] border border-[#171B20] text-[#F5F7FA] rounded-xl focus:outline-none focus:border-[#B8FF00]"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                    Deadline
                  </label>
                  <input
                    type="text"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    placeholder="e.g. October 10"
                    className="w-full px-3 py-2 text-xs bg-[#111418] border border-[#171B20] text-[#F5F7FA] rounded-xl focus:outline-none focus:border-[#B8FF00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                    Associated Meeting (Optional)
                  </label>
                  <select
                    value={newTaskMeetingId}
                    onChange={(e) => setNewTaskMeetingId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#111418] border border-[#171B20] text-[#F5F7FA] rounded-xl focus:outline-none focus:border-[#B8FF00]"
                  >
                    <option value="">General / Direct Task</option>
                    {meetings.map((m) => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
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
                  className="px-5 py-2.5 text-xs font-black bg-gradient-to-r from-[#B8FF00] to-[#FFD166] text-[#050505] rounded-xl shadow-[0_0_15px_rgba(184,255,0,0.35)]"
                >
                  Save Action Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT ACTION ITEM ================= */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0B0D0F] border border-[#171B20] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#171B20] pb-3">
              <h3 className="text-base font-black text-[#F5F7FA] flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#B8FF00]" />
                <span>Edit Action Item</span>
              </h3>
              <button
                onClick={() => setEditingTask(null)}
                className="p-1 text-[#9CA3AF] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={editingTask.task}
                  onChange={(e) => setEditingTask({ ...editingTask, task: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#111418] border border-[#171B20] rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#111418] border border-[#171B20] rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                    Assignee
                  </label>
                  <select
                    value={editingTask.assignee}
                    onChange={(e) => setEditingTask({ ...editingTask, assignee: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#111418] border border-[#171B20] text-[#F5F7FA] rounded-xl focus:outline-none focus:border-[#B8FF00]"
                  >
                    {teamNames.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                    Priority
                  </label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#111418] border border-[#171B20] text-[#F5F7FA] rounded-xl focus:outline-none focus:border-[#B8FF00]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                    Status
                  </label>
                  <select
                    value={editingTask.status}
                    onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#111418] border border-[#171B20] text-[#F5F7FA] rounded-xl focus:outline-none focus:border-[#B8FF00]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                  Deadline
                </label>
                <input
                  type="text"
                  value={editingTask.deadline || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#111418] border border-[#171B20] text-[#F5F7FA] rounded-xl focus:outline-none focus:border-[#B8FF00]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#171B20]">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 text-xs text-[#9CA3AF] hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-black bg-gradient-to-r from-[#B8FF00] to-[#FFD166] text-[#050505] rounded-xl shadow-[0_0_15px_rgba(184,255,0,0.35)]"
                >
                  Update Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActionItemsPage;
