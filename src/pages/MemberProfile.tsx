import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFamilyState } from '../context/FamilyStateContext';
import { 
  User, ShieldAlert, Heart, Calendar, Pill, 
  FileText, Activity, TrendingUp, Info, Plus, 
  Droplet, AlertCircle, ChevronRight, CheckCircle2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export const MemberProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { members, reports, timelineEvents, activeMemberId } = useFamilyState();
  const [activeTab, setActiveTab] = useState<'overview' | 'meds' | 'trends' | 'vax'>('overview');

  // Find targeted member based on URL param or fallback to global active member
  const member = members.find(m => m.id === id) || members.find(m => m.id === activeMemberId) || members[0];

  const memberReports = reports.filter(r => r.memberId === member.id);
  const memberTimeline = timelineEvents.filter(e => e.memberId === member.id);

  // Mock lab trend values for charts
  const bloodSugarData = [
    { month: 'Jan', value: 112 },
    { month: 'Feb', value: 118 },
    { month: 'Mar', value: 125 },
    { month: 'Apr', value: 138 }, // HbA1c screening date
    { month: 'May', value: 128 },
    { month: 'Jun', value: 120 }
  ];

  const bloodPressureData = [
    { month: 'Jan', systolic: 138, diastolic: 88 },
    { month: 'Feb', systolic: 132, diastolic: 84 },
    { month: 'Mar', systolic: 135, diastolic: 85 },
    { month: 'Apr', systolic: 128, diastolic: 80 },
    { month: 'May', systolic: 126, diastolic: 78 },
    { month: 'Jun', systolic: 124, diastolic: 78 }
  ];

  return (
    <div className="space-y-8">
      
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-[32px] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <img 
            src={member.avatar} 
            alt={member.name} 
            className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500/20 shadow-md"
          />
          
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-extrabold text-slate-850 dark:text-white leading-none">{member.name}</h2>
              <span className="text-xs bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full font-bold">
                {member.relation}
              </span>
            </div>
            
            <p className="text-sm text-slate-450 font-medium">Date of Birth: {member.dob} ({member.age} years old) • Gender: {member.gender}</p>
            
            <div className="flex flex-wrap gap-4 pt-1 text-xs font-semibold text-slate-550 dark:text-slate-450">
              <span>Height: <span className="text-slate-800 dark:text-slate-200 font-bold">{member.height}</span></span>
              <span>Weight: <span className="text-slate-800 dark:text-slate-200 font-bold">{member.weight}</span></span>
              <span>Blood Group: <span className="text-rose-500 font-bold">🩸 {member.bloodGroup}</span></span>
            </div>
          </div>

          <div className="w-full md:w-auto p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 rounded-2xl">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Insurance Details</p>
            <p className="text-xs font-bold text-slate-750 dark:text-slate-250 mt-1">{member.insuranceProvider}</p>
            <p className="text-[11px] text-slate-450 font-mono mt-0.5">{member.insuranceId}</p>
          </div>
        </div>
      </div>

      {/* Grid Tabs layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Side: Medical Summary Panels & Insights */}
        <div className="space-y-6">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0">
                <Heart size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">BP Vitals</p>
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-1">124/78 <span className="text-[10px] font-normal text-slate-400">mmHg</span></p>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                <Activity size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Avg Glucose</p>
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-1">120 <span className="text-[10px] font-normal text-slate-400">mg/dL</span></p>
              </div>
            </div>
          </div>

          {/* Allergies & Chronic Conditions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert size={16} className="text-rose-500" />
                <span>Drug & Food Allergies</span>
              </h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {member.allergies.map(allergy => (
                  <span 
                    key={allergy} 
                    className="text-xs px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full font-bold border border-red-500/10"
                  >
                    ⚠️ {allergy}
                  </span>
                ))}
                {member.allergies.length === 0 && (
                  <p className="text-xs text-slate-450 font-medium">No recorded allergies</p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <h3 className="text-sm font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-500" />
                <span>Chronic Diagnoses</span>
              </h3>
              <ul className="space-y-2 mt-3">
                {member.chronicDiseases.map(disease => (
                  <li 
                    key={disease} 
                    className="text-xs text-slate-700 dark:text-slate-300 font-bold bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850"
                  >
                    {disease}
                  </li>
                ))}
                {member.chronicDiseases.length === 0 && (
                  <p className="text-xs text-slate-450 font-medium">No chronic conditions diagnosed</p>
                )}
              </ul>
            </div>
          </div>

          {/* AI Generated Clinical Insights Card */}
          <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white p-6 rounded-[32px] shadow-lg">
            <h3 className="font-extrabold text-base flex items-center gap-2">
              <CheckCircle2 size={18} />
              <span>AI Health Insights</span>
            </h3>
            <div className="mt-4 space-y-3 text-xs leading-relaxed text-emerald-50">
              <p>
                * **Lisinopril Adherence**: Compliance is high. BP trend lines show a 10% reduction in systolic pressure since January.
              </p>
              <p>
                * **Dietary Alert**: Reduce sodium intake to support cholesterol control. Next lipid scan recommended in November.
              </p>
            </div>
          </div>

        </div>

        {/* Right Side: Navigation Tabs Container (Details, Prescriptions, Trends, Vax) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tab Navigation buttons */}
          <div className="flex bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-1.5 rounded-2xl gap-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'meds', label: 'Medications' },
              { id: 'trends', label: 'Lab Trends' },
              { id: 'vax', label: 'Vaccination Log' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-750 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm">
            
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-4">Medical Timeline</h3>
                  {memberTimeline.length === 0 ? (
                    <p className="text-xs text-slate-450">No timeline history recorded yet.</p>
                  ) : (
                    <div className="relative pl-4 border-l border-slate-200 dark:border-slate-800 space-y-5">
                      {memberTimeline.map(item => (
                        <div key={item.id} className="relative">
                          <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                          <div className="text-xs">
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold px-2 py-0.5 rounded-full">{item.year}</span>
                            <h4 className="font-bold text-slate-800 dark:text-white mt-1.5">{item.title}</h4>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 leading-normal font-medium">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-4">Uploaded Reports</h3>
                  {memberReports.length === 0 ? (
                    <p className="text-xs text-slate-450">No reports uploaded yet.</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {memberReports.map(rep => (
                        <div key={rep.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <FileText size={18} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-850 dark:text-white truncate">{rep.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{rep.category} • {rep.hospital}</p>
                            <span className="text-[9px] text-slate-400 mt-2 block">{rep.date} • {rep.fileSize}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'meds' && (
              <div className="space-y-6">
                <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-4">Current Prescriptions</h3>
                <div className="flex flex-col gap-4">
                  {member.currentMedications.map((med, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 rounded-2xl flex gap-3.5 items-start"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                        <Pill size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white">{med}</h4>
                        <p className="text-xs text-slate-450 mt-1 leading-normal font-medium">Cross-referenced with active clinical warnings and allergy safety guidelines.</p>
                      </div>
                    </div>
                  ))}
                  {member.currentMedications.length === 0 && (
                    <p className="text-xs text-slate-450">No active medications documented.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'trends' && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white mb-3">Blood Pressure Vitals Trend (mmHg)</h3>
                  <div className="h-60 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={bloodPressureData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[60, 160]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="systolic" name="Systolic (Upper)" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="diastolic" name="Diastolic (Lower)" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white mb-3">Fasting Blood Sugar Trend (mg/dL)</h3>
                  <div className="h-60 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={bloodSugarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[80, 160]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" name="Glucose level" stroke="#10b981" strokeWidth={2} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vax' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-4">Immunization Tracker</h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {member.vaccinations.map((vax, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-800 dark:text-white">{vax.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{vax.date}</p>
                      </div>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold ${
                        vax.status === 'Completed' 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                          : vax.status === 'Upcoming' 
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                          : 'bg-red-500/10 text-red-650 dark:text-red-400'
                      }`}>
                        {vax.status}
                      </span>
                    </div>
                  ))}
                  {member.vaccinations.length === 0 && (
                    <p className="text-xs text-slate-450 py-4">No immunizations recorded.</p>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
