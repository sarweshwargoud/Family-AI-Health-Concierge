import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFamilyState } from '../context/FamilyStateContext';
import { 
  Plus, ShieldAlert, Heart, Activity, 
  Clock, FileText, Sparkles, Send, 
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => { 
  const { 
    members, 
    activeMemberId,
    setActiveMemberId, 
    activeMember, 
    reports, 
    timelineEvents,
    askAI
  } = useFamilyState();

  const [chatInput, setChatInput] = useState('');
  const navigate = useNavigate();

  // Filter records specifically for active family member
  const activeReports = reports.filter(r => r.memberId === activeMemberId).slice(0, 3);
  const activeTimeline = timelineEvents.filter(e => e.memberId === activeMemberId);

  const handleQuickChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      askAI(chatInput);
      setChatInput('');
      navigate(`/chat?q=${encodeURIComponent(chatInput)}`);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Family health board
          </h2>
          <p className="text-slate-655 dark:text-slate-400 mt-1 text-sm sm:text-base font-semibold">
            Health catalog for {activeMember.name} • {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-3">
          <Link 
            to="/upload" 
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-emerald-500/10 hover:shadow-xl transition-all text-sm sm:text-base cursor-pointer"
          >
            <Plus size={20} />
            <span>Upload Document</span>
          </Link>
          <Link 
            to="/emergency" 
            className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-rose-500/10 hover:shadow-xl transition-all text-sm sm:text-base cursor-pointer animate-pulse"
          >
            <ShieldAlert size={20} />
            <span>Emergency Info</span>
          </Link>
        </div>
      </div>

      {/* Family Member Quick Selector Row */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs sm:text-sm font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Family Members Switcher</h3>
          <Link to="/family" className="text-xs sm:text-sm font-bold text-emerald-500 flex items-center gap-1 hover:underline">
            <span>Manage Profiles</span>
            <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {members.map(member => {
            const isActive = member.id === activeMemberId;
            return (
              <motion.div
                key={member.id}
                whileHover={{ y: -4 }}
                onClick={() => setActiveMemberId(member.id)}
                className={`p-4 rounded-3xl border text-center cursor-pointer transition-all duration-200 relative overflow-hidden ${
                  isActive 
                    ? 'bg-white dark:bg-slate-900 border-emerald-500 dark:border-emerald-500/50 shadow-md shadow-emerald-500/5 ring-2 ring-emerald-500' 
                    : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 shadow-sm'
                }`}
              >
                <div className="relative inline-block mx-auto mb-3">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 dark:border-slate-800"
                  />
                  {isActive && (
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center text-[8px] text-white">
                      ✓
                    </span>
                  )}
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-850 dark:text-slate-100 truncate">{member.name.split(' ')[0]}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate font-semibold">{member.relation}</p>
                
                <div className="flex justify-center gap-1.5 mt-2">
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-355 rounded-full font-bold">
                    {member.bloodGroup}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left column: Key Health Card, Prescriptions & Reports */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Key Clinical Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Heart size={20} className="text-rose-500" />
                <span>Clinical Profile: {activeMember.name}</span>
              </h3>
              <p className="text-xs text-slate-450 mt-1">Primary details registered for healthcare review</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4 text-sm font-semibold">
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Vitals Summary</p>
                <p className="text-base font-extrabold text-slate-800 dark:text-slate-105 mt-2">Height: {activeMember.height}</p>
                <p className="text-base font-extrabold text-slate-800 dark:text-slate-105 mt-0.5">Weight: {activeMember.weight}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-855 rounded-2xl">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Blood Group</p>
                <p className="text-xl font-extrabold text-rose-500 mt-2">🩸 {activeMember.bloodGroup}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Allergies</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {activeMember.allergies.map(a => (
                    <span key={a} className="text-[10px] px-2 py-0.5 bg-red-100/80 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-md font-bold">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Chronic Diagnoses</p>
              <div className="flex flex-wrap gap-2">
                {activeMember.chronicDiseases.map(d => (
                  <span key={d} className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold border border-slate-200 dark:border-slate-700">
                    {d}
                  </span>
                ))}
                {activeMember.chronicDiseases.length === 0 && (
                  <p className="text-xs text-slate-500 font-semibold">No chronic diagnoses documented.</p>
                )}
              </div>
            </div>
          </div>

          {/* Active Prescriptions list */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-850 dark:text-white flex items-center gap-2 mb-6">
              <Activity className="text-emerald-500" size={20} />
              <span>Active Prescriptions ({activeMember.currentMedications.length})</span>
            </h3>

            <div className="flex flex-col gap-3">
              {activeMember.currentMedications.map((med, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-2xl flex gap-3.5 items-center justify-between"
                >
                  <div className="flex gap-3 items-center min-w-0">
                    <span className="text-emerald-500 font-bold">💊</span>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-white truncate">{med}</h4>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-extrabold">Active</span>
                </div>
              ))}
              {activeMember.currentMedications.length === 0 && (
                <p className="text-xs text-slate-450 italic py-4">No active prescriptions cataloged.</p>
              )}
            </div>
          </div>

          {/* Recent Medical Reports & OCR Feed */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-850 dark:text-white flex items-center gap-2">
                  <FileText className="text-emerald-500" size={20} />
                  <span>Clinical Records & Vault Reports</span>
                </h3>
                <p className="text-xs text-slate-450 mt-1">Structured medical files and lab metric readings</p>
              </div>
              <Link to="/upload" className="text-xs sm:text-sm font-bold text-emerald-555 hover:underline flex items-center gap-0.5">
                <span>Go to Vault</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            {activeReports.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <FileText size={32} className="text-slate-350 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-sm text-slate-450 font-medium">No clinical reports uploaded yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {activeReports.map(rep => (
                  <div 
                    key={rep.id} 
                    className="p-4 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-2xl"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/40 dark:border-slate-800 mb-3">
                      <div>
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-bold">{rep.category}</span>
                        <h4 className="font-extrabold text-slate-800 dark:text-white text-sm sm:text-base mt-1.5">{rep.title}</h4>
                      </div>
                      <span className="text-xs text-slate-400 font-bold">{new Date(rep.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI OCR Extraction Summary</p>
                        <p className="text-xs text-slate-650 dark:text-slate-355 leading-relaxed mt-1 font-semibold">{rep.summary}</p>
                      </div>

                      {rep.extractedData.values && Object.keys(rep.extractedData.values).length > 0 && (
                        <div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {Object.entries(rep.extractedData.values).map(([metric, val]) => (
                              <span key={metric} className="text-[10px] px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold">
                                {metric}: <span className="text-emerald-500">{val}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right column: Quick AI Search, Timeline Feed */}
        <div className="space-y-8">
          
          {/* Quick AI Search Input */}
          <div className="bg-gradient-to-tr from-slate-900 to-emerald-950 text-white p-6 rounded-[32px] shadow-xl border border-emerald-500/10 relative overflow-hidden">
            <div className="absolute w-[200px] h-[200px] bg-emerald-500/10 rounded-full blur-[40px] -top-12 -right-12" />
            
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base tracking-tight leading-none text-white">AI Health Assistant</h3>
                  <p className="text-[10px] text-emerald-400 font-bold mt-1 uppercase tracking-wider">Search Clinical Memory</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-normal font-semibold">
                Ask conversational questions about active prescriptions, allergies, or diagnostic tests.
              </p>

              <form onSubmit={handleQuickChatSubmit} className="flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="e.g. Does Mom take Metformin?"
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-450 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-semibold"
                />
                <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-xl transition-colors cursor-pointer">
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>

          {/* Unified Medical Timeline directly in the Overview */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-850 dark:text-white flex items-center gap-2 mb-6">
              <Clock className="text-emerald-500" size={20} />
              <span>Medical History Timeline</span>
            </h3>

            {activeTimeline.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Clock size={32} className="text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-sm text-slate-455 font-medium">No medical events recorded</p>
              </div>
            ) : (
              <div className="relative pl-4 border-l border-slate-200 dark:border-slate-800 flex flex-col gap-6 ml-2">
                {activeTimeline.map(evt => (
                  <div key={evt.id} className="relative">
                    <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                    <div>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold px-2.5 py-0.5 rounded-full">{evt.year}</span>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-850 dark:text-white mt-1.5">{evt.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal font-semibold">{evt.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
