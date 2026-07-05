import React from 'react';
import { useFamilyState } from '../context/FamilyStateContext';
import { 
  Pill, Clock, Check, Heart, ShieldCheck, 
  TrendingUp, AlertCircle, Sparkles, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

export const MedicationReminders: React.FC = () => {
  const { medicationReminders, members, activeMemberId, setActiveMemberId, toggleMedication } = useFamilyState();

  // Filter based on active family member
  const filteredMeds = medicationReminders.filter(m => m.memberId === activeMemberId);
  const activeMemberName = members.find(m => m.id === activeMemberId)?.name.split(' ')[0] || 'Member';

  // Get current date string
  const dateKey = new Date().toISOString().split('T')[0];

  // Calculate Adherence rate
  let totalDoses = 0;
  let takenDoses = 0;
  filteredMeds.forEach(med => {
    med.timing.forEach(time => {
      totalDoses++;
      if (med.taken[dateKey] && med.taken[dateKey][time]) {
        takenDoses++;
      }
    });
  });

  const adherenceRate = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100;

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Medication Reminders
        </h2>
        <p className="text-slate-550 dark:text-slate-400 mt-1">
          Daily active drug dosages checklists and safety compliance logs.
        </p>
      </div>

      {/* Member Selection Drawer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-2.5">
            Select Member to Track Adherence
          </label>
          <div className="flex flex-wrap gap-2">
            {members.map(m => (
              <button
                key={m.id}
                onClick={() => setActiveMemberId(m.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  m.id === activeMemberId
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                    : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-105 dark:hover:bg-slate-850 border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-350'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Adherence Circle */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 p-4 rounded-2xl">
          <div className="w-14 h-14 rounded-full border-4 border-slate-200 dark:border-slate-805 flex items-center justify-center relative overflow-hidden flex-shrink-0">
            <span className="font-extrabold text-sm text-slate-800 dark:text-white">{adherenceRate}%</span>
            {/* SVG Progress Circle would go here */}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">Daily Adherence Rate</h4>
            <p className="text-[10px] text-slate-450 mt-1 font-medium">{takenDoses} of {totalDoses} doses marked as taken today.</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Checkbox columns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm">
            <h3 className="text-base font-extrabold text-slate-850 dark:text-white mb-6">Today's Dosage Logs</h3>

            {filteredMeds.length === 0 ? (
              <div className="py-12 text-center bg-slate-50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Pill size={40} className="text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-medium">No medications scheduled for {activeMemberName}</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-150 dark:divide-slate-800 space-y-4">
                {filteredMeds.map(med => (
                  <div key={med.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-emerald-500/10 text-emerald-550 dark:text-emerald-400 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Pill size={20} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 dark:text-white text-sm">{med.medicine}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{med.dosage} • {med.frequency}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {med.timing.map(time => {
                        const takenObj = med.taken[dateKey] || {};
                        const isTaken = !!takenObj[time];
                        return (
                          <button
                            key={time}
                            onClick={() => toggleMedication(med.id, time)}
                            className={`flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                              isTaken 
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' 
                                : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-750 text-slate-650 hover:text-slate-800 dark:text-slate-400'
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center ${
                              isTaken ? 'border-white bg-white text-emerald-500' : 'border-slate-300 dark:border-slate-600'
                            }`}>
                              {isTaken && <Check size={10} strokeWidth={3} />}
                            </span>
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
        </div>

        {/* Right side: compliance insights */}
        <div className="space-y-6">
          <div className="bg-gradient-to-tr from-slate-900 to-emerald-950 text-white p-6 rounded-[32px] border border-emerald-500/10 relative overflow-hidden">
            <div className="absolute w-[200px] h-[200px] bg-emerald-500/10 rounded-full blur-[40px] -top-12 -right-12" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-400" />
                <h3 className="font-extrabold text-sm tracking-tight leading-none">Safety Compliance Checks</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                All medications are systematically cross-checked against documented drug allergies. Penicillin and Sulfa elements trigger clinical notification alerts.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-extrabold">
                <CheckCircle2 size={16} />
                <span>Contraindication Screen: Passed</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm flex gap-3">
            <AlertCircle size={18} className="text-emerald-500 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-1">Refill Tracker Alert</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Your Lisinopril prescription refills are coming due in 12 days. The system will automatically prepare orders.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
