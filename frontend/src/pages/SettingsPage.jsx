import React, { useState } from 'react';
import {
  Settings,
  Bot,
  Database,
  Key,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Server,
  Layers,
  Sparkles,
  Cpu
} from 'lucide-react';
import { api } from '../services/api';

export function SettingsPage({ onDataReset }) {
  const [provider, setProvider] = useState(
    localStorage.getItem('ai_provider') || 'demo'
  );
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('ai_api_key') || ''
  );
  const [savingKey, setSavingKey] = useState(false);
  const [reseeding, setReseeding] = useState(false);
  const [message, setMessage] = useState('');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('ai_provider', provider);
    localStorage.setItem('ai_api_key', apiKey);
    setMessage('Settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleReseed = async () => {
    if (!confirm('Reset workspace database to default demo data? All custom meetings will be refreshed.')) {
      return;
    }
    setReseeding(true);
    setMessage('');
    try {
      await api.reseedDatabase();
      setMessage('Database successfully reset and re-seeded with demo meetings!');
      if (onDataReset) onDataReset();
    } catch (err) {
      setMessage('Error resetting database: ' + err.message);
    } finally {
      setReseeding(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111418] text-[#B8FF00] text-xs font-bold border border-[#B8FF00]/30 shadow-[0_0_12px_rgba(184,255,0,0.15)] mb-2">
          <Settings className="w-3.5 h-3.5 text-[#B8FF00]" />
          <span>System & Engine Preferences</span>
        </div>
        <h2 className="text-2xl font-black text-[#F5F7FA] tracking-tight flex items-center gap-2">
          <span>Engine Settings</span>
        </h2>
        <p className="text-xs text-[#9CA3AF] font-medium mt-1">
          Configure AI extraction modes, manage local SQLite database, and review system configuration.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-[#B8FF00]/15 border border-[#B8FF00]/40 text-[#B8FF00] text-xs rounded-2xl flex items-center gap-2 animate-fade-in font-bold shadow-[0_0_15px_rgba(184,255,0,0.2)]">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#B8FF00]" />
          <span>{message}</span>
        </div>
      )}

      {/* AI Engine Configuration */}
      <div className="bg-[#0B0D0F]/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-[#171B20] shadow-card-dark space-y-6 hover:border-[#B8FF00]/30 transition-all duration-300">
        <div>
          <h3 className="text-sm font-black text-[#F5F7FA] flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#B8FF00]" />
            <span>AI Extraction Engine</span>
          </h3>
          <p className="text-xs text-[#9CA3AF] font-medium mt-1">
            Select runtime model architecture: zero-dependency offline rule engine or cloud LLM.
          </p>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-5">
          {/* Radio options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {[
              {
                id: 'demo',
                name: 'Obsidian Rule Core',
                badge: 'Recommended',
                desc: 'Rule-based NLP & regex entity extractor. Works 100% offline with zero external latency.',
                badgeClass: 'bg-[#B8FF00]/15 text-[#B8FF00] border-[#B8FF00]/40',
              },
              {
                id: 'gemini',
                name: 'Google Gemini Flash',
                badge: 'LLM Cloud',
                desc: 'Uses Gemini 1.5 Flash via REST API with structured JSON output schema.',
                badgeClass: 'bg-[#FFD166]/15 text-[#FFD166] border-[#FFD166]/40',
              },
              {
                id: 'openai',
                name: 'OpenAI GPT-4o',
                badge: 'LLM Cloud',
                desc: 'Connects to OpenAI API using gpt-4o-mini with json_object enforcement.',
                badgeClass: 'bg-[#FF2DA6]/15 text-[#FF2DA6] border-[#FF2DA6]/40',
              },
            ].map((opt) => (
              <label
                key={opt.id}
                className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                  provider === opt.id
                    ? 'border-[#B8FF00] bg-[#B8FF00]/5 shadow-[0_0_20px_rgba(184,255,0,0.15)] ring-1 ring-[#B8FF00]/30'
                    : 'border-[#171B20] bg-[#111418]/60 hover:border-[#171B20] hover:bg-[#111418]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="radio"
                      name="provider"
                      value={opt.id}
                      checked={provider === opt.id}
                      onChange={(e) => setProvider(e.target.value)}
                      className="accent-[#B8FF00]"
                    />
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${opt.badgeClass}`}
                    >
                      {opt.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-[#F5F7FA]">{opt.name}</h4>
                  <p className="text-[11px] text-[#9CA3AF] font-medium mt-1.5 leading-relaxed">
                    {opt.desc}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {/* API Key Input */}
          {provider !== 'demo' && (
            <div className="pt-2 animate-fade-in">
              <label className="block text-xs font-bold text-[#F5F7FA] mb-1.5">
                {provider === 'gemini' ? 'Google Gemini API Key' : 'OpenAI API Key'}
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Enter your ${provider === 'gemini' ? 'AI Studio Gemini' : 'OpenAI'} API key...`}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#111418] border border-[#171B20] text-[#F5F7FA] rounded-2xl focus:outline-none focus:border-[#B8FF00] focus:ring-2 focus:ring-[#B8FF00]/20 transition-all placeholder-[#9CA3AF]/60"
                />
              </div>
              <p className="text-[11px] text-[#9CA3AF] font-medium mt-1">
                API keys are kept strictly within your client session.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary-command"
          >
            Save Configuration
          </button>
        </form>
      </div>

      {/* Database Management & Demo Reset */}
      <div className="bg-[#0B0D0F]/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-[#171B20] shadow-card-dark flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#B8FF00]/30 transition-all duration-300">
        <div>
          <h3 className="text-sm font-black text-[#F5F7FA] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#FFD166]" />
            <span>SQLite Local Database Management</span>
          </h3>
          <p className="text-xs text-[#9CA3AF] font-medium mt-1">
            Connected to <code className="text-[#B8FF00] bg-[#111418] px-2 py-0.5 rounded-lg border border-[#171B20] font-mono font-bold">sqlite:///./meetings.db</code> via SQLAlchemy ORM.
          </p>
        </div>

        <button
          onClick={handleReseed}
          disabled={reseeding}
          className="px-5 py-2.5 bg-[#111418] hover:bg-[#171B20] text-[#F5F7FA] font-extrabold text-xs rounded-2xl border border-[#171B20] hover:border-[#B8FF00]/40 transition-all flex items-center gap-2 flex-shrink-0 disabled:opacity-50 hover:scale-105 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${reseeding ? 'animate-spin text-[#B8FF00]' : ''}`} />
          <span>{reseeding ? 'Resetting Data...' : 'Reset & Reload Demo Data'}</span>
        </button>
      </div>

      {/* Technical Specs */}
      <div className="bg-[#0B0D0F]/90 backdrop-blur-xl rounded-3xl p-6 border border-[#171B20] text-xs text-[#9CA3AF] space-y-3 shadow-card-dark">
        <h4 className="font-black text-[#F5F7FA] flex items-center gap-2">
          <Server className="w-4 h-4 text-[#B8FF00]" />
          <span>System Architecture & Verification</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px]">
          <div className="p-3 bg-[#111418] rounded-2xl border border-[#171B20]">
            <span className="text-[#9CA3AF] font-bold uppercase tracking-wider block">Backend</span>
            <strong className="text-[#F5F7FA] text-xs font-mono">FastAPI (Python 3.11)</strong>
          </div>
          <div className="p-3 bg-[#111418] rounded-2xl border border-[#171B20]">
            <span className="text-[#9CA3AF] font-bold uppercase tracking-wider block">Frontend</span>
            <strong className="text-[#B8FF00] text-xs font-mono">React 18 + Tailwind</strong>
          </div>
          <div className="p-3 bg-[#111418] rounded-2xl border border-[#171B20]">
            <span className="text-[#9CA3AF] font-bold uppercase tracking-wider block">Database</span>
            <strong className="text-[#FFD166] text-xs font-mono">SQLite + SQLAlchemy</strong>
          </div>
          <div className="p-3 bg-[#111418] rounded-2xl border border-[#171B20]">
            <span className="text-[#9CA3AF] font-bold uppercase tracking-wider block">NLP Engine</span>
            <strong className="text-[#FF2DA6] text-xs font-mono">NER & Context Classifier</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
