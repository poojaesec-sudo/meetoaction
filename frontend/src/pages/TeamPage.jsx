import React, { useState } from 'react';
import {
  Users,
  Plus,
  Mail,
  CheckCircle2,
  Clock,
  Shield,
  Trash2,
  Edit2,
  X,
  UserCheck,
  Activity,
  Zap,
  Radio
} from 'lucide-react';
import { api } from '../services/api';

export function TeamPage({ teamMembers = [], setTab, onRefreshTeam }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // New member form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Frontend Engineer');
  const [status, setStatus] = useState('Active');
  const [submitting, setSubmitting] = useState(false);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setSubmitting(true);
    try {
      await api.createTeamMember({
        name: name.trim(),
        email: email.trim(),
        role: role.trim(),
        status
      });
      setName('');
      setEmail('');
      setIsAddModalOpen(false);
      if (onRefreshTeam) onRefreshTeam();
    } catch (err) {
      console.error('Error adding team member:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.updateTeamMember(id, { status: newStatus });
      if (onRefreshTeam) onRefreshTeam();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteMember = async (id) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      try {
        await api.deleteTeamMember(id);
        if (onRefreshTeam) onRefreshTeam();
      } catch (err) {
        console.error('Error deleting member:', err);
      }
    }
  };

  const getStatusColor = (s) => {
    switch (s) {
      case 'Active':
        return 'text-[#B8FF00] bg-[#B8FF00]/10 border-[#B8FF00]/30';
      case 'In Meeting':
        return 'text-[#FF2DA6] bg-[#FF2DA6]/10 border-[#FF2DA6]/30';
      case 'Available':
        return 'text-[#4DA8FF] bg-[#4DA8FF]/10 border-[#4DA8FF]/30';
      case 'Away':
        return 'text-[#FF7A00] bg-[#FF7A00]/10 border-[#FF7A00]/30';
      default:
        return 'text-[#9CA3AF] bg-[#111418] border-[#171B20]';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8FF00]/15 text-[#B8FF00] text-xs font-black border border-[#B8FF00]/30 shadow-[0_0_12px_rgba(184,255,0,0.2)] mb-2">
            <Users className="w-3.5 h-3.5 text-[#B8FF00]" />
            <span>Collaboration Roster</span>
          </div>
          <h2 className="text-2xl font-black text-[#F5F7FA] tracking-tight">
            Team Members & Ownership
          </h2>
          <p className="text-xs text-[#9CA3AF] font-medium mt-1">
            <span className="text-[#B8FF00] font-black">{teamMembers.length}</span> active team members driving accountability.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-[#B8FF00] to-[#FFD166] hover:from-[#C5FF1A] hover:to-[#FFE199] text-[#050505] text-xs font-black rounded-2xl shadow-[0_0_20px_rgba(184,255,0,0.35)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => {
          const totalTasks = (member.active_tasks_count || 0) + (member.completed_tasks_count || 0);
          const completionRate = totalTasks > 0 ? Math.round(((member.completed_tasks_count || 0) / totalTasks) * 100) : 100;

          return (
            <div
              key={member.id}
              className="p-6 rounded-3xl bg-[#0B0D0F]/95 backdrop-blur-2xl border border-[#171B20] hover:border-[#B8FF00]/30 transition-all flex flex-col justify-between shadow-command-card group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                        alt={member.name}
                        className="w-12 h-12 rounded-2xl bg-[#050505] border border-[#171B20] p-0.5 group-hover:border-[#B8FF00]/40 transition-colors"
                      />
                      <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0B0D0F] ${
                        member.status === 'Active' ? 'bg-[#B8FF00]' : member.status === 'In Meeting' ? 'bg-[#FF2DA6]' : 'bg-[#FF7A00]'
                      }`} />
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-[#F5F7FA]">{member.name}</h4>
                      <p className="text-[11px] font-bold text-[#FFD166] mt-0.5">{member.role}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="p-1.5 text-[#9CA3AF] hover:text-[#FF4D5A] hover:bg-[#FF4D5A]/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Email */}
                  <div className="flex items-center gap-2 text-xs text-[#9CA3AF] font-mono">
                    <Mail className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span className="truncate">{member.email}</span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#171B20]">
                    <span className="text-[11px] text-[#9CA3AF] font-bold">Status</span>
                    <select
                      value={member.status}
                      onChange={(e) => handleUpdateStatus(member.id, e.target.value)}
                      className={`text-[11px] font-black px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer ${getStatusColor(member.status)}`}
                    >
                      <option value="Active">Active</option>
                      <option value="In Meeting">In Meeting</option>
                      <option value="Available">Available</option>
                      <option value="Away">Away</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Task Metrics Footer */}
              <div className="mt-5 pt-4 border-t border-[#171B20] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9CA3AF] font-bold">Deliverable Completion</span>
                  <span className="font-mono font-black text-[#B8FF00]">{completionRate}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#111418] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#B8FF00] to-[#FFD166] rounded-full transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#9CA3AF] pt-1">
                  <span>Active Tasks: <strong className="text-[#FF7A00]">{member.active_tasks_count || 0}</strong></span>
                  <span>Completed: <strong className="text-[#B8FF00]">{member.completed_tasks_count || 0}</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= MODAL: ADD TEAM MEMBER ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0B0D0F] border border-[#171B20] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#171B20] pb-3">
              <h3 className="text-base font-black text-[#F5F7FA] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#B8FF00]" />
                <span>Add Team Member</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-[#9CA3AF] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Chen"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#111418] border border-[#171B20] rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. maya@team.io"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#111418] border border-[#171B20] rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. AI Research Engineer"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#111418] border border-[#171B20] rounded-xl text-[#F5F7FA] focus:outline-none focus:border-[#B8FF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F5F7FA] mb-1">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#111418] border border-[#171B20] text-[#F5F7FA] rounded-xl focus:outline-none focus:border-[#B8FF00]"
                >
                  <option value="Active">Active</option>
                  <option value="In Meeting">In Meeting</option>
                  <option value="Available">Available</option>
                  <option value="Away">Away</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#171B20]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#9CA3AF] hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-black bg-gradient-to-r from-[#B8FF00] to-[#FFD166] text-[#050505] rounded-xl shadow-[0_0_15px_rgba(184,255,0,0.35)] disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamPage;
