import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFamilyState } from '../context/FamilyStateContext';
import { 
  Calendar, Pill, Clock, FileText, ShieldAlert, 
  ArrowRight, Plus, Send, Mic, Sparkles, Check, 
  Heart, Activity, TrendingUp, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { 
    members, 
    activeMemberId, 
    setActiveMemberId, 
    activeMember, 
    appointments,
    medicationReminders, 
    reports, 
    timelineEvents,
    toggleMedication,
    askAI,
    chatMessages
  } = useFamilyState();

  const [chatInput, setChatInput] = useState('');
  const navigate = useNavigate();

  // Filter records specifically for active family member
  const activeAppointments = appointments
    .filter(a => a.memberId === activeMemberId && a.status === 'Upcoming')
    .slice(0, 2);

  const activeMeds = medicationReminders.filter(r => r.memberId === activeMemberId);
  const activeReports = reports.filter(r => r.memberId === activeMemberId).slice(0, 2);
  const activeTimeline = timelineEvents.filter(e => e.memberId === activeMemberId).slice(0, 3);

  // Generate date key for tracking taken status
  const todayDateKey = new Date().toISOString().split('T')[0];

  const handleQuickChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      askAI(chatInput);
      setChatInput('');
      // Redirect to full chat page to see response
      navigate('/chat');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Hello, {activeMember.name.split(' ')[0]} Workspace
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here is your family's health profile summary for today, {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}.
          </p>
        </div>
        
        {/* Quick Dashboard Action Cards */}
        <div className="flex gap-3">
          <Link 
            to="/upload" 
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-2xl shadow-lg shadow-emerald-500/10 hover:shadow-xl transition-all text-sm cursor-pointer"
          >
            <Plus size={18} />
            <span>Upload Document</span>
          </Link>
          <Link 
            to="/emergency" 
            className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2.5 rounded-2xl shadow-lg shadow-rose-500/10 hover:shadow-xl transition-all text-sm cursor-pointer animate-pulse"
          >
            <ShieldAlert size={18} />
            <span>Emergency Info</span>
          </Link>
        </div>
      </div>

      {/* Family Member Quick Selector Row */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Family Members</h3>
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
                    ? 'bg-white dark:bg-slate-900 border-emerald-500 dark:border-emerald-500/50 shadow-md shadow-emerald-500/5 ring-1 ring-emerald-500' 
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
                <h4 className="font-bold text-sm text-slate-850 dark:text-slate-100 truncate">{member.name.split(' ')[0]}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">{member.relation}</p>
                
                {/* Micro indicators */}
                <div className="flex justify-center gap-1.5 mt-2">
                  <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full font-semibold">
                    {member.bloodGroup}
                  </span>
                  {member.allergies.length > 0 && member.allergies[0] !== 'None' && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-rose-50 dark:bg-rose-500/10 text-rose-550 dark:text-rose-400 rounded-full font-semibold">
                      ⚠️ Allergy
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left column: Meds & Appointments */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Medications Reminders Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-850 dark:text-white flex items-center gap-2">
                  <Pill className="text-emerald-500" size={20} />
                  <span>Medication Checkoff</span>
                </h3>
                <p className="text-xs text-slate-450 mt-0.5">Toggle taken status for {activeMember.name.split(' ')[0]}'s medicines today</p>
              </div>
              <Link to="/reminders" className="text-xs text-emerald-500 font-bold flex items-center gap-1 hover:underline">
                <span>View Full Schedule</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {activeMeds.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Pill size={32} className="text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-medium">No medications scheduled for {activeMember.name.split(' ')[0]}</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {activeMeds.map(med => (
                  <div 
                    key={med.id} 
                    className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 rounded-2xl flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-slate-400 font-semibold">{med.dosage}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-bold uppercase tracking-wider">{med.frequency}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-800 dark:text-slate-200 mt-1">{med.medicine}</h4>
                    </div>

                    <div className="flex gap-2">
                      {med.timing.map(time => {
                        const takenObj = med.taken[todayDateKey] || {};
                        const isTaken = !!takenObj[time];
                        return (
                          <button
                            key={time}
                            onClick={() => toggleMedication(med.id, time)}
                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all border ${
                              isTaken 
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/10' 
                                : 'bg-white hover:bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-750'
                            }`}
                          >
                            {isTaken && <Check size={10} strokeWidth={3} />}
                            <span>{time}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appointments Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-850 dark:text-white flex items-center gap-2">
                  <Calendar className="text-emerald-500" size={20} />
                  <span>Upcoming Consultations</span>
                </h3>
                <p className="text-xs text-slate-450 mt-0.5">Scheduled clinical checks for {activeMember.name.split(' ')[0]}</p>
              </div>
              <Link to="/appointments" className="text-xs text-emerald-500 font-bold flex items-center gap-1 hover:underline">
                <span>All Appointments</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {activeAppointments.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Calendar size={32} className="text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-medium">No consultations scheduled soon</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {activeAppointments.map(app => (
                  <div 
                    key={app.id} 
                    className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 dark:text-white text-base leading-snug">{app.doctor}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{app.specialty} • {app.hospital}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 italic font-medium">"{app.notes}"</p>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/50 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-350">{new Date(app.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p className="text-xs text-slate-450 font-semibold mt-1 flex items-center sm:justify-end gap-1">
                        <Clock size={12} />
                        <span>{app.time}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Medical Reports & OCR Feed */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-850 dark:text-white flex items-center gap-2">
                  <FileText className="text-emerald-500" size={20} />
                  <span>Extracted Health Documents</span>
                </h3>
                <p className="text-xs text-slate-450 mt-0.5">Recent clinical reports and AI OCR structured details</p>
              </div>
              <Link to="/upload" className="text-xs text-emerald-500 font-bold flex items-center gap-1 hover:underline">
                <span>Upload Document</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {activeReports.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <FileText size={32} className="text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-medium">No clinical reports uploaded yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {activeReports.map(rep => (
                  <div 
                    key={rep.id} 
                    className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 rounded-2xl"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/40 dark:border-slate-800/80 mb-3">
                      <div>
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-550/10 text-emerald-600 dark:text-emerald-400 rounded-full font-bold">{rep.category}</span>
                        <h4 className="font-extrabold text-slate-800 dark:text-white text-base mt-1.5">{rep.title}</h4>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">{new Date(rep.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">AI Clinical Summary</p>
                        <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed mt-1 font-medium">{rep.summary}</p>
                      </div>

                      {rep.extractedData.values && Object.keys(rep.extractedData.values).length > 0 && (
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Extracted Test Metrics</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(rep.extractedData.values).map(([metric, val]) => (
                              <span key={metric} className="text-[10px] px-2 py-1 bg-white dark:bg-slate-850 border border-slate-200/50 dark:border-slate-750 text-slate-650 dark:text-slate-350 rounded-lg font-bold">
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

        {/* Right column: Quick Actions, AI Concierge Box & Timeline */}
        <div className="space-y-8">
          
          {/* Quick Actions Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-850 dark:text-white mb-4">Quick Health Actions</h3>
            <div className="flex flex-col gap-3">
              <Link 
                to={`/family/${activeMemberId}`}
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-150 dark:border-slate-850 rounded-2xl text-left transition-all hover:translate-x-1"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Heart size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">Active Member Profile</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Allergies, chronic conditions & vitals</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </Link>

              <Link 
                to="/timeline"
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-150 dark:border-slate-850 rounded-2xl text-left transition-all hover:translate-x-1"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Activity size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">Medical Timeline</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Chronological clinical milestones</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </Link>

              <Link 
                to="/family"
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-150 dark:border-slate-850 rounded-2xl text-left transition-all hover:translate-x-1"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Plus size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">Add Family Member</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Enroll children or grandparents</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Quick AI Concierge Assistant Chatbox */}
          <div className="bg-gradient-to-tr from-slate-900 to-emerald-950 text-white p-6 rounded-[32px] shadow-xl border border-emerald-500/10 relative overflow-hidden">
            <div className="absolute w-[200px] h-[200px] bg-emerald-500/10 rounded-full blur-[40px] -top-12 -right-12" />
            
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight leading-none text-white">AI Health Concierge</h3>
                  <p className="text-[10px] text-emerald-400 font-bold mt-1 uppercase tracking-wider">Semantic Retrieval Active</p>
                </div>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-[11px] text-slate-350 italic">Last response:</p>
                <p className="text-xs mt-1 leading-normal font-medium text-slate-205 truncate">
                  {chatMessages[chatMessages.length - 1]?.text}
                </p>
              </div>

              <form onSubmit={handleQuickChatSubmit} className="flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask anything about family health..."
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-xl transition-colors">
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>

          {/* Medical Timeline Preview Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-extrabold text-slate-850 dark:text-white flex items-center gap-2">
                <Clock className="text-emerald-500" size={20} />
                <span>Timeline Preview</span>
              </h3>
              <Link to="/timeline" className="text-xs text-emerald-500 font-bold flex items-center gap-1 hover:underline">
                <span>View Timeline</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {activeTimeline.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Clock size={32} className="text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-medium">No medical events recorded</p>
              </div>
            ) : (
              <div className="relative pl-4 border-l border-slate-200 dark:border-slate-800 flex flex-col gap-6 ml-2">
                {activeTimeline.map(evt => (
                  <div key={evt.id} className="relative">
                    <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-emerald-550 border-2 border-white dark:border-slate-900 rounded-full" />
                    <div>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold px-2 py-0.5 rounded-full">{evt.year}</span>
                      <h4 className="text-xs font-bold text-slate-850 dark:text-white mt-1.5">{evt.title}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-normal font-medium">{evt.description}</p>
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
