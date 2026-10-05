import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  Calendar,
  Users,
  FileText,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  Lightbulb,
  Check,
  AlertCircle,
  Clock,
  Layers,
  Bot,
  Zap,
  Tag,
  CheckSquare
} from 'lucide-react';
import { api } from '../services/api';
import { PriorityBadge, TaskStatusBadge } from '../components/Badges';
import confetti from 'canvas-confetti';

export function AddMeetingPage({ onMeetingCreated, setTab }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [participants, setParticipants] = useState('');
  const [transcript, setTranscript] = useState('');

  // AI Analysis State
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Preset Sample 1: Exact requirement 15
  const loadSample1 = () => {
    setTitle('Project Review & Prototype Alignment');
    setDate('2026-10-04');
    setParticipants('Poojasri, Rithanya, Poojitha');
    setTranscript(
      'Project review meeting. Poojasri will prepare the presentation by October 8. Rithanya will complete the dataset preparation by October 6. Poojitha will test the model by October 10. The team decided to use Python and FastAPI for the prototype.'
    );
    setAnalysisResult(null);
    setError('');
  };

  // Preset Sample 2: Multi-speaker sprint sync
  const loadSample2 = () => {
    setTitle('Sprint Architecture & Security Audit');
    setDate('2026-10-05');
    setParticipants('Poojasri, Rithanya, Karthik, Alex');
    setTranscript(
      `Sprint architecture discussion. Karthik will configure the OAuth2 authentication flow and refresh token rotation by October 12. Poojasri is responsible for conducting the user acceptance testing by October 14. We decided to enforce strict SQLite foreign key constraints. Alex to review security audit logs by Friday. Prepare CI/CD staging deployment pipeline. Urgent: Karthik must resolve database connection pool leakage ASAP.`
    );
    setAnalysisResult(null);
    setError('');
  };

  // File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setTranscript(event.target?.result || '');
    };
    reader.readAsText(file);
  };

  // AI Analysis Trigger
  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      setError('Please provide a meeting transcript or notes to analyze.');
      return;
    }
    setError('');
    setAnalyzing(true);
    setAnalysisStep(1);

    const stepTimers = [
      setTimeout(() => setAnalysisStep(2), 350),
      setTimeout(() => setAnalysisStep(3), 700),
      setTimeout(() => setAnalysisStep(4), 1050),
      setTimeout(() => setAnalysisStep(5), 1400),
      setTimeout(() => setAnalysisStep(6), 1750),
    ];

    try {
      const result = await api.analyzeMeeting({
        title: title || 'Team Meeting',
        date,
        participants,
        transcript,
      });

      stepTimers.forEach(clearTimeout);
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message || 'Failed to analyze meeting with AI.');
    } finally {
      setAnalyzing(false);
      setAnalysisStep(0);
    }
  };

  // Action item manipulation inside review
  const handleActionItemChange = (index, field, value) => {
    if (!analysisResult) return;
    const updated = [...analysisResult.action_items];
    updated[index] = { ...updated[index], [field]: value };
    setAnalysisResult({ ...analysisResult, action_items: updated });
  };

  const handleDeleteActionItem = (index) => {
    if (!analysisResult) return;
    const updated = analysisResult.action_items.filter((_, i) => i !== index);
    setAnalysisResult({ ...analysisResult, action_items: updated });
  };

  const handleAddActionItem = () => {
    if (!analysisResult) return;
    const newItem = {
      task: 'New Action Item',
      description: 'Manually added follow-up task',
      assignee: 'Unassigned',
      deadline: 'Not specified',
      priority: 'Medium',
      status: 'Pending',
      source_context: 'Added during review',
      is_inferred_priority: false,
    };
    setAnalysisResult({
      ...analysisResult,
      action_items: [...analysisResult.action_items, newItem],
    });
  };

  // Final Database Persistence
  const handleSaveToDatabase = async () => {
    if (!analysisResult) return;
    setSaving(true);
    setError('');

    try {
      const payload = {
        title: title || 'Team Meeting',
        date: date || new Date().toISOString().split('T')[0],
        participants: participants || '',
        transcript,
        summary: analysisResult.summary || '',
        discussion_points: analysisResult.discussion_points || [],
        decisions: analysisResult.decisions || [],
        action_items: analysisResult.action_items || [],
      };

      const saved = await api.createMeeting(payload);

      // Celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#B8FF00', '#FF2DA6', '#FF7A00', '#FFD166'],
        });
      } catch (e) {}

      setSuccessMsg('Meeting intelligence and action items successfully committed to database!');
      if (onMeetingCreated) onMeetingCreated(saved);

      setTimeout(() => {
        setTab('dashboard');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Error saving meeting to database.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Large Obsidian Input Card */}
      <div className="bg-[#0B0D0F]/95 backdrop-blur-2xl rounded-3xl p-6 lg:p-9 border border-[#171B20] shadow-command-card relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#B8FF00]/10 via-[#FF2DA6]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Card Header Banner */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#171B20]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8FF00]/15 text-[#B8FF00] text-xs font-black border border-[#B8FF00]/30 mb-2 shadow-[0_0_12px_rgba(184,255,0,0.2)]">
              <Bot className="w-3.5 h-3.5 text-[#B8FF00]" />
              <span>Neural Transcript Extraction</span>
            </div>
            <h2 className="text-2xl font-black text-[#F5F7FA] tracking-tight">
              Turn Meetings Into Measurable Action
            </h2>
            <p className="text-xs text-[#9CA3AF] font-medium mt-1">
              Extract tasks, assignees, deadlines, and decisions using AI in seconds.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={loadSample1}
              className="px-3.5 py-2 text-xs font-black bg-[#111418] hover:bg-[#171B20] text-[#B8FF00] rounded-2xl border border-[#B8FF00]/30 transition-all flex items-center gap-1.5 shadow-xs hover:scale-105"
              title="Load sample transcript"
            >
              <Zap className="w-3.5 h-3.5 text-[#B8FF00] fill-[#B8FF00]" />
              <span>Sample 1 (Team Sync)</span>
            </button>
            <button
              type="button"
              onClick={loadSample2}
              className="px-3.5 py-2 text-xs font-black bg-[#111418] hover:bg-[#171B20] text-[#FFD166] rounded-2xl border border-[#FFD166]/30 transition-all hover:scale-105"
            >
              <span>Sample 2 (Sprint Architecture)</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-5 p-4 bg-[#FF4D5A]/15 border border-[#FF4D5A]/40 rounded-2xl text-xs text-[#FF4D5A] font-bold flex items-center gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#FF4D5A]" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-5 p-4 bg-[#B8FF00]/15 border border-[#B8FF00]/40 rounded-2xl text-xs text-[#B8FF00] font-bold flex items-center gap-2.5 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#B8FF00]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Inputs */}
        <div className="mt-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black text-[#9CA3AF] mb-1.5">
                Meeting Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Project Review & Prototype Alignment"
                className="w-full px-3.5 py-2.5 text-xs font-bold bg-[#111418] border border-[#171B20] text-[#F5F7FA] rounded-2xl focus:outline-none focus:border-[#B8FF00] transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#9CA3AF] mb-1.5">
                Meeting Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs font-bold bg-[#111418] border border-[#171B20] text-[#F5F7FA] rounded-2xl focus:outline-none focus:border-[#B8FF00] transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#9CA3AF] mb-1.5">
                Participants (comma separated)
              </label>
              <div className="relative">
                <Users className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  placeholder="e.g., Alex, Sarah, David"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs font-bold bg-[#111418] border border-[#171B20] text-[#F5F7FA] rounded-2xl focus:outline-none focus:border-[#B8FF00] transition-all shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Transcript Textarea & File Upload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-black text-[#9CA3AF]">
                Meeting Transcript / Notes *
              </label>

              <label className="cursor-pointer text-xs font-black text-[#B8FF00] hover:text-[#D4FF4D] flex items-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Transcript (.txt, .md)</span>
                <input
                  type="file"
                  accept=".txt,.md,.text"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              rows={8}
              required
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste raw conversation transcript, audio-to-text output, or meeting minutes here..."
              className="w-full p-4 text-xs font-mono leading-relaxed bg-[#111418] border border-[#171B20] rounded-2xl focus:outline-none focus:border-[#B8FF00] transition-all text-[#F5F7FA] placeholder:text-[#9CA3AF]/60 shadow-inner"
            />
            <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] mt-1.5 font-medium">
              <span>{transcript.trim() ? `${transcript.trim().split(/\s+/).length} words` : '0 words'}</span>
              <span className="text-[#B8FF00] font-black">Intelligently extracts: Tasks, Assignees, Deadlines & Decisions</span>
            </div>
          </div>

          {/* Analyze with AI gradient button: Electric Lime -> Cyber Gold */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={analyzing || !transcript.trim()}
              className="px-8 py-3.5 bg-gradient-to-r from-[#B8FF00] to-[#FFD166] hover:from-[#C5FF1A] hover:to-[#FFE199] text-[#050505] font-black text-sm rounded-2xl shadow-[0_0_25px_rgba(184,255,0,0.4)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#050505]" />
              <span>{analyzing ? 'AI Processing In Progress...' : '⚡ Analyze with AI'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Processing Animation with Obsidian & Lime Accents */}
      {analyzing && (
        <div className="bg-[#0B0D0F]/95 backdrop-blur-2xl rounded-3xl p-8 border border-[#B8FF00]/40 shadow-command-card text-center space-y-5 animate-fade-in relative overflow-hidden">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-[#B8FF00] via-[#FFD166] to-[#FF7A00] mx-auto flex items-center justify-center text-[#050505] shadow-[0_0_24px_rgba(184,255,0,0.5)] animate-bounce">
            <Sparkles className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#F5F7FA] tracking-tight">
              NEURAL ENGINE PROCESSING
            </h3>
            <p className="text-xs text-[#9CA3AF] font-medium mt-0.5">
              Extracting semantic structure, deadlines, and deliverables...
            </p>
          </div>

          <div className="max-w-md mx-auto grid grid-cols-2 gap-2 text-xs">
            {[
              { id: 1, label: 'Reading transcript' },
              { id: 2, label: 'Detecting speakers' },
              { id: 3, label: 'Extracting tasks' },
              { id: 4, label: 'Inferring deadlines' },
              { id: 5, label: 'Detecting decisions' },
              { id: 6, label: 'Scoring priorities' },
            ].map((step) => {
              const done = analysisStep >= step.id;
              return (
                <div
                  key={step.id}
                  className={`p-2.5 rounded-xl border text-left transition-all font-semibold flex items-center gap-2 ${
                    done
                      ? 'bg-[#B8FF00]/15 text-[#B8FF00] border-[#B8FF00]/40 shadow-[0_0_10px_rgba(184,255,0,0.2)]'
                      : 'bg-[#111418] text-[#9CA3AF] border-[#171B20]'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${done ? 'bg-[#B8FF00] text-[#050505]' : 'bg-[#171B20] text-[#9CA3AF]'}`}>
                    {done ? '✓' : step.id}
                  </span>
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Analysis Results */}
      {analysisResult && !analyzing && (
        <div className="space-y-6 animate-slide-up">
          <div className="bg-[#0B0D0F]/95 backdrop-blur-2xl rounded-3xl p-6 border border-[#171B20] shadow-command-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8FF00]/15 text-[#B8FF00] text-xs font-black border border-[#B8FF00]/40 shadow-[0_0_12px_rgba(184,255,0,0.2)] mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B8FF00]" />
                <span>AI EXTRACTION COMPLETE</span>
              </span>
              <h3 className="text-lg font-black text-[#F5F7FA] tracking-tight">
                AI Executive Intelligence Report
              </h3>
              <p className="text-xs text-[#9CA3AF] font-medium">
                Review extracted action items, tweak assignments, or save directly to workspace database.
              </p>
            </div>

            <button
              onClick={handleSaveToDatabase}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-[#B8FF00] to-[#FFD166] hover:from-[#C5FF1A] hover:to-[#FFE199] text-[#050505] font-black text-xs rounded-2xl shadow-[0_0_24px_rgba(184,255,0,0.4)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{saving ? 'Saving to Database...' : 'Save & Track Action Items'}</span>
            </button>
          </div>

          {/* Cards Grid: Summary, Discussion Points, Decisions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* AI Summary Card */}
            <div className="bg-[#0B0D0F]/90 backdrop-blur-xl rounded-3xl p-6 border border-[#171B20] shadow-command-card flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#B8FF00] mb-3 flex items-center gap-2 font-mono">
                  <Sparkles className="w-4 h-4 text-[#B8FF00]" />
                  <span>Executive Summary</span>
                </h4>
                <textarea
                  rows={4}
                  value={analysisResult.summary}
                  onChange={(e) =>
                    setAnalysisResult({ ...analysisResult, summary: e.target.value })
                  }
                  className="w-full p-3 text-xs bg-[#111418] border border-[#171B20] rounded-2xl focus:outline-none focus:border-[#B8FF00] text-[#F5F7FA] leading-relaxed font-medium"
                />
              </div>
              <span className="text-[10px] text-[#9CA3AF] font-bold mt-2 block font-mono">
                Editable summary text
              </span>
            </div>

            {/* Discussion Points Card */}
            <div className="bg-[#0B0D0F]/90 backdrop-blur-xl rounded-3xl p-6 border border-[#171B20] shadow-command-card">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#FFD166] mb-3 flex items-center gap-2 font-mono">
                <Lightbulb className="w-4 h-4 text-[#FFD166]" />
                <span>Discussion Points</span>
              </h4>
              <ul className="space-y-2 text-xs text-[#F5F7FA] font-medium">
                {analysisResult.discussion_points?.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-[#111418] p-2.5 rounded-xl border border-[#171B20]">
                    <span className="w-2 h-2 rounded-full bg-[#FFD166] mt-1.5 flex-shrink-0 shadow-[0_0_6px_#FFD166]" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Decisions Card */}
            <div className="bg-[#0B0D0F]/90 backdrop-blur-xl rounded-3xl p-6 border border-[#171B20] shadow-command-card">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#B8FF00] mb-3 flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 text-[#B8FF00]" />
                <span>Decisions Made</span>
              </h4>
              <ul className="space-y-2 text-xs font-bold text-[#F5F7FA]">
                {analysisResult.decisions?.map((dec, idx) => (
                  <li
                    key={idx}
                    className="p-3 bg-[#111418] rounded-2xl border border-[#B8FF00]/25 shadow-xs flex items-center gap-2"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B8FF00] flex-shrink-0 shadow-[0_0_6px_#B8FF00]" />
                    <span>{dec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Items Cards Section */}
          <div className="bg-[#0B0D0F]/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-[#171B20] shadow-command-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#171B20]">
              <div>
                <h4 className="text-sm font-black text-[#F5F7FA] flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#FF2DA6]" />
                  <span>Action Items & Tasks ({analysisResult.action_items?.length || 0})</span>
                </h4>
                <p className="text-xs text-[#9CA3AF] font-medium">
                  Tasks, assignees, deadlines, and priorities extracted with intelligent fallbacks.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddActionItem}
                className="px-3.5 py-2 text-xs font-black text-[#050505] bg-gradient-to-r from-[#B8FF00] to-[#FFD166] rounded-xl transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(184,255,0,0.3)] hover:scale-105"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Task</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisResult.action_items?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-[#111418] border border-[#171B20] hover:border-[#B8FF00]/40 transition-all space-y-3 relative group shadow-command-card"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#B8FF00]/15 text-[#B8FF00] border border-[#B8FF00]/40">
                      <Sparkles className="w-2.5 h-2.5 text-[#B8FF00]" />
                      <span>AI EXTRACTED</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteActionItem(idx)}
                      className="p-1.5 text-[#9CA3AF] hover:text-[#FF4D5A] hover:bg-[#FF4D5A]/10 rounded-xl transition-colors"
                      title="Remove task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] mb-1 font-mono">
                      Task
                    </label>
                    <input
                      type="text"
                      value={item.task}
                      onChange={(e) =>
                        handleActionItemChange(idx, 'task', e.target.value)
                      }
                      className="w-full text-xs font-bold text-[#F5F7FA] bg-[#050505] px-3 py-2 rounded-xl border border-[#171B20] focus:outline-none focus:border-[#B8FF00]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] mb-1 font-mono">
                        Assignee
                      </label>
                      <input
                        type="text"
                        value={item.assignee}
                        onChange={(e) =>
                          handleActionItemChange(idx, 'assignee', e.target.value)
                        }
                        className="w-full text-xs font-bold text-[#FFD166] bg-[#050505] px-3 py-1.5 rounded-xl border border-[#171B20] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] mb-1 font-mono">
                        Deadline
                      </label>
                      <input
                        type="text"
                        value={item.deadline}
                        onChange={(e) =>
                          handleActionItemChange(idx, 'deadline', e.target.value)
                        }
                        className="w-full text-xs font-bold text-[#B8FF00] bg-[#050505] px-3 py-1.5 rounded-xl border border-[#171B20] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#171B20]">
                    <PriorityBadge priority={item.priority} isInferred={item.is_inferred_priority} />
                    <TaskStatusBadge status={item.status} />
                  </div>

                  {item.source_context && (
                    <div className="text-[11px] text-[#9CA3AF] italic bg-[#050505] p-2.5 rounded-xl border border-[#171B20] font-medium leading-relaxed">
                      "{item.source_context}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddMeetingPage;
