import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFamilyState } from '../context/FamilyStateContext';
import { 
  Plus, ShieldAlert, Heart, Activity, 
  Clock, FileText, Sparkles, Send, 
  ChevronRight, Users, UserPlus, X, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard: React.FC = () => { 
  const { 
    members, 
    activeMemberId,
    setActiveMemberId, 
    activeMember, 
    reports, 
    timelineEvents,
    askAI,
    addMember
  } = useFamilyState();

  const [chatInput, setChatInput] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  // Add Member Form State
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Self');
  const [age, setAge] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergiesText, setAllergiesText] = useState('');
  const [diseasesText, setDiseasesText] = useState('');
  const [medsText, setMedsText] = useState('');
  const [insuranceProv, setInsuranceProv] = useState('Star Health Insurance');
  const [insuranceNum, setInsuranceNum] = useState('');

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

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age || !dob) return;

    addMember({
      name: name.trim(),
      relation,
      age: parseInt(age) || 0,
      dob,
      gender,
      bloodGroup,
      allergies: allergiesText ? allergiesText.split(',').map(s => s.trim()).filter(Boolean) : ['None'],
      chronicDiseases: diseasesText ? diseasesText.split(',').map(s => s.trim()).filter(Boolean) : ['None'],
      currentMedications: medsText ? medsText.split(',').map(s => s.trim()).filter(Boolean) : [],
      height: '170 cm',
      weight: '68 kg',
      avatar: gender === 'Male' 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' 
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      insuranceProvider: insuranceProv,
      insuranceId: insuranceNum || 'N/A',
      emergencyContact: { name: 'Emergency Contact', relation: 'Family', phone: '+91 98765 43210' },
      vaccinations: []
    });

    setName('');
    setAge('');
    setDob('');
    setAllergiesText('');
    setDiseasesText('');
    setMedsText('');
    setInsuranceNum('');
    setIsAddModalOpen(false);
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
            {members.length > 0 
              ? `Health catalog for ${activeMember.name} • ${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}`
              : `Welcome to your private family workspace • ${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}`}
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

      {/* When NO members enrolled yet (Fresh User Onboarding) */}
      {members.length === 0 ? (
        <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-100/50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-950 border border-emerald-500/20 rounded-[32px] p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 animate-pulse">
            <Users size={32} />
          </div>
          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Welcome to your Family Space!
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              You haven't enrolled any family members yet. Add yourself and your loved ones (Father, Mother, Spouse, Children) to start organizing prescriptions, clinical OCR scans, and emergency medical cards.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center gap-2 hover:translate-y-[-2px] transition-all cursor-pointer text-base"
            >
              <UserPlus size={20} />
              <span>Enroll Your First Family Member</span>
            </button>
            <Link
              to="/family"
              className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold px-6 py-4 rounded-2xl flex items-center gap-2 transition-all text-base"
            >
              <span>Manage Family Profiles</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Family Member Quick Selector Row */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs sm:text-sm font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Family Members Switcher</h3>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Member</span>
                </button>
                <Link to="/family" className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 hover:underline">
                  <span>Manage Profiles</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
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
                        src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
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
                    <p className="text-base font-extrabold text-slate-800 dark:text-slate-105 mt-2">Height: {activeMember.height || '170 cm'}</p>
                    <p className="text-base font-extrabold text-slate-800 dark:text-slate-105 mt-0.5">Weight: {activeMember.weight || '68 kg'}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Blood Type</p>
                    <p className="text-2xl font-black text-rose-500 mt-2">🩸 {activeMember.bloodGroup}</p>
                    <p className="text-xs text-slate-400 font-bold mt-1">Verified Clinical File</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Emergency Contact</p>
                    <p className="text-sm font-extrabold text-slate-800 dark:text-slate-105 mt-2 truncate">{activeMember.emergencyContact?.name || 'Not Listed'}</p>
                    <p className="text-xs text-slate-500 font-bold mt-0.5">{activeMember.emergencyContact?.phone || 'N/A'}</p>
                  </div>
                </div>

                {/* Chronic conditions and allergies tags */}
                <div className="space-y-4 pt-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Diagnosed Chronic Conditions</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeMember.chronicDiseases && activeMember.chronicDiseases.length > 0 ? (
                        activeMember.chronicDiseases.map((dis, idx) => (
                          <span key={idx} className="text-xs font-bold px-3 py-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-500/10">
                            {dis}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">None Recorded</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Documented Allergies</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeMember.allergies && activeMember.allergies.length > 0 ? (
                        activeMember.allergies.map((all, idx) => (
                          <span key={idx} className="text-xs font-bold px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-500/10">
                            ⚠️ {all}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">No Known Drug/Food Allergies</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Prescriptions list */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Activity className="text-emerald-500" size={20} />
                      <span>Active Medications</span>
                    </h3>
                    <p className="text-xs text-slate-450 mt-0.5">Tracked for daily compliance and emergency records</p>
                  </div>
                  <Link to="/upload" className="text-xs font-bold text-emerald-500 flex items-center gap-1 hover:underline">
                    <span>Upload RX</span>
                    <Plus size={14} />
                  </Link>
                </div>

                {activeMember.currentMedications && activeMember.currentMedications.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {activeMember.currentMedications.map((med, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl flex items-center gap-3 border border-slate-100 dark:border-slate-800">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                          💊
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{med}</h4>
                          <p className="text-[11px] text-slate-400 font-semibold">Active Prescription</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <p className="text-sm text-slate-450 font-medium">No active medications registered for this member.</p>
                  </div>
                )}
              </div>

              {/* Recent Diagnostic Reports */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <FileText className="text-teal-500" size={20} />
                      <span>Recent Medical Reports</span>
                    </h3>
                    <p className="text-xs text-slate-450 mt-0.5">Parsed via OCR and indexed in memory</p>
                  </div>
                  <Link to="/upload" className="text-xs font-bold text-emerald-500 hover:underline">
                    View All Vault Files
                  </Link>
                </div>

                {activeReports.length === 0 ? (
                  <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <FileText size={32} className="text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                    <p className="text-sm text-slate-455 font-medium">No medical documents uploaded yet.</p>
                    <Link to="/upload" className="inline-block mt-3 text-xs font-bold text-emerald-500 hover:underline">
                      + Upload First Lab Report
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeReports.map(rep => (
                      <div key={rep.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm text-slate-800 dark:text-white">{rep.title}</h4>
                            <p className="text-xs text-slate-400 font-semibold">{rep.hospital} • {rep.doctor} • {rep.date}</p>
                          </div>
                          <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                            {rep.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{rep.summary}</p>
                        {rep.extractedData?.values && Object.keys(rep.extractedData.values).length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                            {Object.entries(rep.extractedData.values).map(([k, v], i) => (
                              <span key={i} className="text-[11px] bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                {k}: <span className="text-emerald-500 font-extrabold">{v}</span>
                              </span>
                            ))}
                          </div>
                        )}
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
                      placeholder="e.g. What medicines does Dad take?"
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
        </>
      )}

      {/* Add Member Modal Dialog */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-10 max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-[32px] shadow-2xl p-6 sm:p-8 z-50 overflow-y-auto max-h-[85vh]"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                <h3 className="font-extrabold text-xl text-slate-850 dark:text-white">Enroll Family Member</h3>
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Relation</label>
                    <select
                      value={relation}
                      onChange={(e) => setRelation(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option>Self</option>
                      <option>Father</option>
                      <option>Mother</option>
                      <option>Elder Sister</option>
                      <option>Younger Sister</option>
                      <option>Son</option>
                      <option>Daughter</option>
                      <option>Spouse</option>
                      <option>Grandparent</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Age</label>
                    <input 
                      type="number" 
                      required 
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 30"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">DOB</label>
                    <input 
                      type="date" 
                      required 
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Known Allergies (comma-separated)</label>
                  <input 
                    type="text" 
                    value={allergiesText}
                    onChange={(e) => setAllergiesText(e.target.value)}
                    placeholder="e.g. Penicillin, Peanuts"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Chronic Diseases (comma-separated)</label>
                  <input 
                    type="text" 
                    value={diseasesText}
                    onChange={(e) => setDiseasesText(e.target.value)}
                    placeholder="e.g. Hypertension, Diabetes"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Current Medications (comma-separated)</label>
                  <input 
                    type="text" 
                    value={medsText}
                    onChange={(e) => setMedsText(e.target.value)}
                    placeholder="e.g. Lisinopril 10mg, Metformin 500mg"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    Enroll Member
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
