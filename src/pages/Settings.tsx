import React, { useState } from 'react';
import { useFamilyState } from '../context/FamilyStateContext';
import { 
  Settings as SettingsIcon, Sun, Moon, Shield, 
  Key, Database, Lock, Eye, Save, Sparkles, Check
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useFamilyState();
  const [workspaceName, setWorkspaceName] = useState("Doe's Family Health Workspace");
  const [isSaved, setIsSaved] = useState(false);

  // Mock security logs
  const auditLogs = [
    { timestamp: '2026-07-05 21:30:12', event: 'HIPAA Consent Verified', user: 'Robert Doe', ip: '192.168.1.104' },
    { timestamp: '2026-07-05 18:22:45', event: 'Document Upload & Parsing', user: 'Sarah Doe', ip: '192.168.1.108' },
    { timestamp: '2026-07-05 09:12:00', event: 'Authorized User Login Session', user: 'Robert Doe', ip: '192.168.1.104' },
    { timestamp: '2026-07-04 14:05:32', event: 'Vector Store DB Embedding Sync', user: 'System Agent', ip: 'Local' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Workspace Settings
        </h2>
        <p className="text-slate-550 dark:text-slate-400 mt-1">
          Customize UI theme, configure workspace permissions, and audit security access logs.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: General Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Workspace Settings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm">
            <h3 className="text-base font-extrabold text-slate-850 dark:text-white mb-6 flex items-center gap-2">
              <Database size={18} className="text-emerald-500" />
              <span>Workspace Details</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-2">Workspace Identifier</label>
                <input 
                  type="text" 
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-450 font-bold">Workspace ID: <span className="font-mono">FC-8827-X</span></span>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2 shadow-md"
                >
                  {isSaved ? <Check size={14} /> : <Save size={14} />}
                  <span>{isSaved ? 'Details Saved' : 'Save Details'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Theme custom settings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm">
            <h3 className="text-base font-extrabold text-slate-850 dark:text-white mb-6 flex items-center gap-2">
              <Sun size={18} className="text-emerald-500" />
              <span>UI Themes & Styling</span>
            </h3>

            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Light / Dark Appearance</h4>
                <p className="text-xs text-slate-450 mt-1">Adjust visual styling themes according to environment comfort.</p>
              </div>
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 py-2 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-xl text-xs font-bold transition-all"
              >
                {isDarkMode ? (
                  <>
                    <Sun size={14} className="text-emerald-500" />
                    <span>Set Light theme</span>
                  </>
                ) : (
                  <>
                    <Moon size={14} className="text-emerald-500" />
                    <span>Set Dark theme</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* HIPAA & Security Details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm">
            <h3 className="text-base font-extrabold text-slate-850 dark:text-white mb-6 flex items-center gap-2">
              <Shield size={18} className="text-emerald-500" />
              <span>HIPAA Compliance & Permissions</span>
            </h3>

            <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="flex justify-between items-center py-3 first:pt-0">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Encrypted Document Storage</h4>
                  <p className="text-[11px] text-slate-450 mt-0.5">Files uploaded are cryptographically hashed using AES-256 standards.</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-bold">ACTIVE</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Audit Logging Trails</h4>
                  <p className="text-[11px] text-slate-450 mt-0.5">Trace and record all patient document accesses, searches, and queries.</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-bold">ACTIVE</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Audit Logs */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm">
            <h3 className="text-base font-extrabold text-slate-855 dark:text-white mb-4 flex items-center gap-2">
              <Lock size={18} className="text-rose-500" />
              <span>Security Access Logs</span>
            </h3>

            <div className="space-y-3.5">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-850 rounded-xl space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>{log.timestamp}</span>
                    <span className="font-mono text-[9px]">{log.ip}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{log.event}</h4>
                  <p className="text-[10px] text-slate-400">Authorized by {log.user}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
