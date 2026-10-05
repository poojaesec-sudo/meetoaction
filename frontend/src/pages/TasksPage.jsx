import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Filter,
  Kanban,
  Table as TableIcon,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpDown,
  User,
  X
} from 'lucide-react';
import { PriorityBadge, TaskStatusBadge } from '../components/Badges';

export function TasksPage({
  tasks = [],
  loading,
  onUpdateTask,
  onCreateTask,
  onDeleteTask,
  setTab
}) {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('deadline'); // 'deadline' | 'priority' | 'status'

  // Modal State for Edit / Create
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Dynamic list of unique assignees for filter dropdown
  const uniqueAssignees = Array.from(
    new Set(tasks.map((t) => t.assignee).filter(Boolean))
  );

  // Filter Tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.meeting_title && t.meeting_title.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'All' || t.assignee === assigneeFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  // Sort Tasks
  filteredTasks.sort((a, b) => {
    if (sortBy === 'priority') {
      const pMap = { High: 3, Medium: 2, Low: 1 };
      return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
    }
    if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return (a.deadline || '').localeCompare(b.deadline || '');
  });

  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveModal = (taskData) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, taskData);
    } else {
      onCreateTask(taskData);
    }
    setIsModalOpen(false);
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8FF00]/15 text-[#B8FF00] text-xs font-black border border-[#B8FF00]/30 shadow-[0_0_12px_rgba(184,255,0,0.2)] mb-2">
              <CheckSquare className="w-3.5 h-3.5 text-[#B8FF00]" />
              <span>Workspace Action Items</span>
            </div>
            <h2 className="text-2xl font-black text-[#F5F7FA] tracking-tight">
              Action Items & Deliverables
            </h2>
            <p className="text-xs text-[#9CA3AF] font-medium mt-1">
              0 action items tracked in your workspace.
            </p>
          </div>
        </div>

        {/* Empty State Card */}
        <div className="py-20 text-center bg-[#0B0D0F]/95 rounded-3xl border border-[#171B20] p-8 shadow-command-card">
          <div className="w-16 h-16 rounded-3xl bg-[#111418] border border-[#B8FF00]/30 flex items-center justify-center mx-auto mb-4 text-[#B8FF00] shadow-[0_0_20px_rgba(184,255,0,0.25)]">
            <CheckSquare className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-[#F5F7FA]">No action items yet</h3>
          <p className="text-xs text-[#9CA3AF] mt-1.5 max-w-sm mx-auto font-medium leading-relaxed">
            AI-extracted tasks will appear here after analyzing a meeting.
          </p>
          <button
            onClick={() => setTab && setTab('add-meeting')}
            className="mt-6 px-6 py-2.5 bg-gradient-to-r from-[#B8FF00] to-[#FFD166] hover:from-[#C5FF1A] hover:to-[#FFE199] text-[#050505] text-xs font-black rounded-2xl shadow-[0_0_20px_rgba(184,255,0,0.35)] transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#050505]" />
            <span>Analyze a Meeting</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Primary Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8FF00]/15 text-[#B8FF00] text-xs font-black border border-[#B8FF00]/30 shadow-[0_0_12px_rgba(184,255,0,0.2)] mb-2">
            <CheckSquare className="w-3.5 h-3.5 text-[#B8FF00]" />
            <span>Execution Lifecycle</span>
          </div>
          <h2 className="text-2xl font-black text-[#F5F7FA] tracking-tight flex items-center gap-2">
            Action Item Management
          </h2>
          <p className="text-xs text-[#9CA3AF] font-medium mt-1">
            <span className="text-[#B8FF00] font-black">{filteredTasks.length}</span> task{filteredTasks.length === 1 ? '' : 's'} active in current pipeline. Track real-time progress, ownership, and milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="bg-[#111418] p-1 rounded-2xl flex items-center gap-1 border border-[#171B20] shadow-inner">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-[#B8FF00] to-[#FFD166] text-[#050505] shadow-[0_0_15px_rgba(184,255,0,0.3)]'
                  : 'text-[#9CA3AF] hover:text-[#F5F7FA]'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                viewMode === 'kanban'
                  ? 'bg-gradient-to-r from-[#FF2DA6] to-[#FF7A00] text-white shadow-[0_0_15px_rgba(255,45,166,0.3)]'
                  : 'text-[#9CA3AF] hover:text-[#F5F7FA]'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-gradient-to-r from-[#FF2DA6] to-[#FF7A00] hover:from-[#FF47B2] hover:to-[#FF8C26] text-white text-xs font-black rounded-2xl shadow-[0_0_18px_rgba(255,45,166,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0B0D0F]/90 backdrop-blur-xl rounded-3xl p-4 border border-[#171B20] shadow-command-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by task title, assignee, or meeting context..."
            className="w-full pl-9 pr-3.5 py-2.5 text-xs font-medium bg-[#111418] border border-[#171B20] rounded-2xl text-[#F5F7FA] placeholder-[#9CA3AF] focus:outline-none focus:border-[#B8FF00] focus:ring-1 focus:ring-[#B8FF00] transition-all"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs font-black bg-[#111418] border border-[#171B20] rounded-2xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
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
            className="px-3 py-2 text-xs font-black bg-[#111418] border border-[#171B20] rounded-2xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
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
            className="px-3 py-2 text-xs font-black bg-[#111418] border border-[#171B20] rounded-2xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
          >
            <option value="All">All Owners</option>
            {uniqueAssignees.map((assignee) => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs font-black bg-[#111418] border border-[#171B20] rounded-2xl text-[#B8FF00] focus:outline-none focus:border-[#B8FF00]"
          >
            <option value="deadline">Sort: Deadline</option>
            <option value="priority">Sort: Priority</option>
            <option value="status">Sort: Status</option>
          </select>
        </div>
      </div>

      {/* Main Content: Table or Kanban */}
      {viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-[#0B0D0F]/90 backdrop-blur-xl rounded-3xl border border-[#171B20] shadow-command-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111418] border-b border-[#171B20] text-[#9CA3AF] uppercase text-[10px] font-black tracking-wider">
                <tr>
                  <th className="py-4 px-5">Deliverable</th>
                  <th className="py-4 px-4">Origin Meeting</th>
                  <th className="py-4 px-4">Assigned To</th>
                  <th className="py-4 px-4">Due Date</th>
                  <th className="py-4 px-4">Priority</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Progress</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171B20] text-[#F5F7FA]">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-[#111418]/60 transition-colors group"
                    >
                      {/* Task Name */}
                      <td className="py-4 px-5">
                        <div className="max-w-xs">
                          <p className="font-bold text-[#F5F7FA] group-hover:text-[#B8FF00] transition-colors line-clamp-1">
                            {t.task}
                          </p>
                          {t.description && (
                            <p className="text-[11px] text-[#9CA3AF] line-clamp-1 mt-0.5 font-medium">
                              {t.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Origin Meeting */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-xs text-[#9CA3AF] font-medium">
                          {t.meeting_title || 'Direct Sprint Task'}
                        </span>
                      </td>

                      {/* Assigned To */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.assignee}`}
                            alt={t.assignee}
                            className="w-7 h-7 rounded-xl bg-[#050505] border border-[#171B20] p-0.5"
                          />
                          <span className="font-bold text-[#F5F7FA]">{t.assignee}</span>
                        </div>
                      </td>

                      {/* Deadline */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`font-black font-mono ${
                            t.status === 'Overdue'
                              ? 'text-[#FF4D5A]'
                              : 'text-[#FFD166]'
                          }`}
                        >
                          {t.deadline}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <PriorityBadge
                          priority={t.priority}
                          isInferred={t.is_inferred_priority}
                        />
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <select
                          value={t.status}
                          onChange={(e) =>
                            onUpdateTask(t.id, { status: e.target.value })
                          }
                          className="text-xs font-black px-2.5 py-1.5 bg-[#050505] border border-[#171B20] text-[#F5F7FA] rounded-xl focus:outline-none focus:border-[#B8FF00] transition-all"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                      </td>

                      {/* Progress Slider */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={t.progress || 0}
                            onChange={(e) =>
                              onUpdateTask(t.id, {
                                progress: parseInt(e.target.value),
                              })
                            }
                            className="w-24 accent-[#B8FF00] cursor-pointer h-2 bg-[#111418] rounded-lg border border-[#171B20]"
                          />
                          <span className="text-[11px] font-black text-[#B8FF00] w-9 text-right font-mono">
                            {t.progress || 0}%
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(t)}
                            title="Edit task"
                            className="p-1.5 text-[#9CA3AF] hover:text-[#B8FF00] hover:bg-[#B8FF00]/10 rounded-xl transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(t.id)}
                            title="Delete task"
                            className="p-1.5 text-[#9CA3AF] hover:text-[#FF4D5A] hover:bg-[#FF4D5A]/10 rounded-xl transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-[#9CA3AF] text-xs font-medium">
                      No action items match the selected criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* KANBAN BOARD VIEW: 4 COMMAND STAGES */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              id: 'Pending',
              label: 'Pending',
              borderTop: 'border-t-2 border-t-[#FF7A00]',
              badge: 'bg-[#FF7A00]/15 text-[#FF7A00] border border-[#FF7A00]/40',
              dot: 'bg-[#FF7A00] shadow-[0_0_8px_#FF7A00]',
              cardBorder: 'border-l-[#FF7A00]'
            },
            {
              id: 'In Progress',
              label: 'In Progress',
              borderTop: 'border-t-2 border-t-[#00E5FF]',
              badge: 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40',
              dot: 'bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]',
              cardBorder: 'border-l-[#00E5FF]'
            },
            {
              id: 'Overdue',
              label: 'Overdue',
              borderTop: 'border-t-2 border-t-[#FF4D5A]',
              badge: 'bg-[#FF4D5A]/15 text-[#FF4D5A] border border-[#FF4D5A]/40',
              dot: 'bg-[#FF4D5A] shadow-[0_0_8px_#FF4D5A]',
              cardBorder: 'border-l-[#FF4D5A]'
            },
            {
              id: 'Completed',
              label: 'Completed',
              borderTop: 'border-t-2 border-t-[#B8FF00]',
              badge: 'bg-[#B8FF00]/15 text-[#B8FF00] border border-[#B8FF00]/40',
              dot: 'bg-[#B8FF00] shadow-[0_0_8px_#B8FF00]',
              cardBorder: 'border-l-[#B8FF00]'
            },
          ].map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className={`bg-[#0B0D0F]/90 backdrop-blur-xl rounded-3xl p-4 border border-[#171B20] ${col.borderTop} flex flex-col min-h-[520px] transition-all shadow-command-card`}
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#171B20]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#F5F7FA]">
                      {col.label}
                    </h3>
                  </div>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${col.badge}`}>
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {columnTasks.map((t) => (
                    <div
                      key={t.id}
                      className={`bg-[#111418] p-4 rounded-2xl border border-[#171B20] border-l-4 ${col.cardBorder} shadow-command-card hover:border-[#B8FF00]/40 hover:-translate-y-1 transition-all duration-200 space-y-3 group`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <PriorityBadge priority={t.priority} isInferred={t.is_inferred_priority} />
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEdit(t)}
                            className="p-1 text-[#9CA3AF] hover:text-[#B8FF00] rounded-lg hover:bg-[#B8FF00]/10"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(t.id)}
                            className="p-1 text-[#9CA3AF] hover:text-[#FF4D5A] rounded-lg hover:bg-[#FF4D5A]/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xs font-black text-[#F5F7FA] line-clamp-2 group-hover:text-[#B8FF00] transition-colors">
                        {t.task}
                      </h4>

                      <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] pt-1 border-t border-[#171B20]">
                        <div className="flex items-center gap-1.5 font-bold text-[#F5F7FA]">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.assignee}`}
                            alt={t.assignee}
                            className="w-5 h-5 rounded-full border border-[#171B20]"
                          />
                          <span>{t.assignee}</span>
                        </div>
                        <span className="font-bold text-[#FFD166] font-mono">{t.deadline}</span>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-black text-[#9CA3AF] mb-1">
                          <span>Progress</span>
                          <span className="font-mono text-[#B8FF00]">{t.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#050505] rounded-full overflow-hidden p-0.5 border border-[#171B20]">
                          <div
                            style={{ width: `${t.progress}%` }}
                            className={`h-full rounded-full ${
                              col.id === 'Completed'
                                ? 'bg-gradient-to-r from-[#B8FF00] to-[#C5FF1A]'
                                : col.id === 'In Progress'
                                ? 'bg-gradient-to-r from-[#00E5FF] to-[#33EBFF]'
                                : col.id === 'Overdue'
                                ? 'bg-gradient-to-r from-[#FF4D5A] to-[#FF2DA6]'
                                : 'bg-gradient-to-r from-[#FF7A00] to-[#FFA04D]'
                            } transition-all duration-500`}
                          />
                        </div>
                      </div>

                      {/* Quick status mover dropdown */}
                      <select
                        value={t.status}
                        onChange={(e) => onUpdateTask(t.id, { status: e.target.value })}
                        className="w-full text-[11px] font-black py-1.5 px-2 bg-[#050505] border border-[#171B20] rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
                      >
                        <option value="Pending">Move to: Pending</option>
                        <option value="In Progress">Move to: In Progress</option>
                        <option value="Completed">Move to: Completed</option>
                        <option value="Overdue">Move to: Overdue</option>
                      </select>
                    </div>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="h-36 border-2 border-dashed border-[#171B20] rounded-2xl flex items-center justify-center text-xs text-[#9CA3AF] font-medium font-mono">
                      No tasks in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Creation & Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0B0D0F] rounded-3xl max-w-md w-full border border-[#171B20] shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden">
            <div className="p-5 border-b border-[#171B20] flex items-center justify-between bg-[#111418]">
              <h3 className="text-sm font-black text-[#F5F7FA]">
                {editingTask ? 'Edit Action Item' : 'Create New Action Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#9CA3AF] hover:text-white rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                handleSaveModal({
                  task: fd.get('task'),
                  description: fd.get('description'),
                  assignee: fd.get('assignee'),
                  deadline: fd.get('deadline'),
                  priority: fd.get('priority'),
                  status: fd.get('status'),
                  progress: parseInt(fd.get('progress') || '0'),
                });
              }}
              className="p-5 space-y-4 text-xs"
            >
              <div>
                <label className="block text-[11px] font-black text-[#9CA3AF] mb-1.5">
                  Task Title *
                </label>
                <input
                  name="task"
                  defaultValue={editingTask?.task || ''}
                  required
                  placeholder="e.g. Deploy security patch..."
                  className="w-full px-3.5 py-2.5 bg-[#111418] border border-[#171B20] rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-[#9CA3AF] mb-1.5">
                  Context / Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editingTask?.description || ''}
                  rows={2}
                  placeholder="Additional context or notes..."
                  className="w-full px-3.5 py-2 bg-[#111418] border border-[#171B20] rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-[#9CA3AF] mb-1.5">
                    Assignee
                  </label>
                  <input
                    name="assignee"
                    defaultValue={editingTask?.assignee || 'Unassigned'}
                    className="w-full px-3 py-2 bg-[#111418] border border-[#171B20] rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-[#9CA3AF] mb-1.5">
                    Deadline
                  </label>
                  <input
                    name="deadline"
                    defaultValue={editingTask?.deadline || 'Not specified'}
                    className="w-full px-3 py-2 bg-[#111418] border border-[#171B20] rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-[#9CA3AF] mb-1.5">
                    Priority
                  </label>
                  <select
                    name="priority"
                    defaultValue={editingTask?.priority || 'Medium'}
                    className="w-full px-3 py-2 bg-[#111418] border border-[#171B20] rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-[#9CA3AF] mb-1.5">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={editingTask?.status || 'Pending'}
                    className="w-full px-3 py-2 bg-[#111418] border border-[#171B20] rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#171B20] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#111418] hover:bg-[#171B20] text-[#9CA3AF] rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#B8FF00] to-[#FFD166] text-[#050505] font-black rounded-xl shadow-[0_0_15px_rgba(184,255,0,0.3)] hover:scale-105 transition-all"
                >
                  Save Deliverable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TasksPage;
