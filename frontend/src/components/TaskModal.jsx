import React, { useState, useEffect } from 'react';
import { X, Check, Calendar, User, Flag, AlignLeft, Sparkles, CheckSquare } from 'lucide-react';

export function TaskModal({ isOpen, onClose, onSave, task = null, teamMembers = [] }) {
  const [formData, setFormData] = useState({
    task: '',
    description: '',
    assignee: 'Unassigned',
    deadline: '',
    priority: 'Medium',
    status: 'Pending',
    progress: 0,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        task: task.task || '',
        description: task.description || '',
        assignee: task.assignee || 'Unassigned',
        deadline: task.deadline || '',
        priority: task.priority || 'Medium',
        status: task.status || 'Pending',
        progress: task.progress || 0,
      });
    } else {
      setFormData({
        task: '',
        description: '',
        assignee: 'Unassigned',
        deadline: '',
        priority: 'Medium',
        status: 'Pending',
        progress: 0,
      });
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.task.trim()) return;
    onSave(formData);
  };

  const handleStatusChange = (newStatus) => {
    let newProgress = formData.progress;
    if (newStatus === 'Completed') newProgress = 100;
    else if (newStatus === 'Pending' && newProgress === 100) newProgress = 0;
    setFormData({ ...formData, status: newStatus, progress: newProgress });
  };

  const handleProgressChange = (newProg) => {
    let newStatus = formData.status;
    if (newProg === 100) newStatus = 'Completed';
    else if (newProg > 0 && formData.status === 'Pending') newStatus = 'In Progress';
    setFormData({ ...formData, progress: newProg, status: newStatus });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0B0D0F] rounded-3xl max-w-lg w-full shadow-[0_0_70px_rgba(0,0,0,0.9)] border border-[#171B20] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#171B20] flex items-center justify-between bg-[#111418]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#B8FF00]/15 border border-[#B8FF00]/40 text-[#B8FF00] flex items-center justify-center shadow-[0_0_12px_rgba(184,255,0,0.3)]">
              <CheckSquare className="w-4 h-4 text-[#B8FF00]" />
            </div>
            <div>
              <h2 className="text-sm font-black text-[#F5F7FA]">
                {task ? 'Edit Action Item' : 'New Command Directive'}
              </h2>
              <span className="text-[10px] text-[#9CA3AF] font-bold">Obsidian Task Execution</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9CA3AF] hover:text-[#F5F7FA] hover:bg-[#111418] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#F5F7FA] mb-1.5">
              Task Directive *
            </label>
            <input
              type="text"
              required
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              placeholder="e.g., Prepare architecture presentation"
              className="w-full px-3.5 py-2.5 text-xs font-semibold bg-[#111418] border border-[#171B20] rounded-2xl text-[#F5F7FA] placeholder-[#9CA3AF]/60 focus:outline-none focus:border-[#B8FF00] focus:ring-2 focus:ring-[#B8FF00]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#F5F7FA] mb-1.5">
              Description & Context
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Key requirements, dependencies, and deliverables..."
              className="w-full px-3.5 py-2.5 text-xs font-medium bg-[#111418] border border-[#171B20] rounded-2xl text-[#F5F7FA] placeholder-[#9CA3AF]/60 focus:outline-none focus:border-[#B8FF00] focus:ring-2 focus:ring-[#B8FF00]/20 resize-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#F5F7FA] mb-1.5">
                Assigned To
              </label>
              <input
                type="text"
                list="team-members-list"
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                placeholder="Assignee name"
                className="w-full px-3.5 py-2 text-xs font-semibold bg-[#111418] border border-[#171B20] rounded-2xl text-[#F5F7FA] placeholder-[#9CA3AF]/60 focus:outline-none focus:border-[#B8FF00] focus:ring-2 focus:ring-[#B8FF00]/20 transition-all"
              />
              <datalist id="team-members-list">
                <option value="Poojasri" />
                <option value="Rithanya" />
                <option value="Poojitha" />
                <option value="Karthik" />
                <option value="Unassigned" />
                {teamMembers.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#F5F7FA] mb-1.5">
                Target Deadline
              </label>
              <input
                type="text"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                placeholder="e.g., October 8 or 2026-10-08"
                className="w-full px-3.5 py-2 text-xs font-semibold bg-[#111418] border border-[#171B20] rounded-2xl text-[#F5F7FA] placeholder-[#9CA3AF]/60 focus:outline-none focus:border-[#B8FF00] focus:ring-2 focus:ring-[#B8FF00]/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#F5F7FA] mb-1.5">
                Priority Tier
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-bold bg-[#111418] border border-[#171B20] rounded-2xl focus:outline-none focus:border-[#B8FF00] focus:ring-2 focus:ring-[#B8FF00]/20 text-[#F5F7FA]"
              >
                <option value="High" className="bg-[#0B0D0F] text-[#FF2DA6]">High Priority</option>
                <option value="Medium" className="bg-[#0B0D0F] text-[#FF7A00]">Medium Priority</option>
                <option value="Low" className="bg-[#0B0D0F] text-[#FFD166]">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#F5F7FA] mb-1.5">
                Execution Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-bold bg-[#111418] border border-[#171B20] rounded-2xl focus:outline-none focus:border-[#B8FF00] focus:ring-2 focus:ring-[#B8FF00]/20 text-[#F5F7FA]"
              >
                <option value="Pending" className="bg-[#0B0D0F] text-[#FF7A00]">Pending</option>
                <option value="In Progress" className="bg-[#0B0D0F] text-[#00E5FF]">In Progress</option>
                <option value="Completed" className="bg-[#0B0D0F] text-[#B8FF00]">Completed</option>
                <option value="Overdue" className="bg-[#0B0D0F] text-[#FF4D5A]">Overdue</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-[#F5F7FA] mb-1.5">
              <span>Execution Progress</span>
              <span className="text-[#B8FF00] font-black">{formData.progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.progress}
              onChange={(e) => handleProgressChange(parseInt(e.target.value))}
              className="w-full accent-[#B8FF00] cursor-pointer h-2 bg-[#111418] rounded-lg"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-[#171B20] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#9CA3AF] hover:text-[#F5F7FA] bg-[#111418] hover:bg-[#171B20] border border-[#171B20] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-command"
            >
              <Check className="w-4 h-4 text-[#050505]" />
              <span>{task ? 'Update Directive' : 'Commit Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
