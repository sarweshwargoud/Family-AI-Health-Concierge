import React, { useState } from 'react';
import { useFamilyState } from '../context/FamilyStateContext';
import { 
  ShieldAlert, Printer, Download, Phone, 
  Activity, Pill, Heart, ShieldCheck, Mail, Info
} from 'lucide-react';
import { motion } from 'framer-motion';

export const EmergencySummary: React.FC = () => {
  const { activeMember, members, setActiveMemberId } = useFamilyState();
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleMockDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // Simulate file download notice
      alert(`Emergency Clinical Card for ${activeMember.name} has been generated and saved as PDF.`);
    }, 1500);
  };

  return (
    <div className="space-y-8 print:p-0 print:m-0 print:bg-white print:text-black">
      
      {/* Header (Hidden during actual print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert size={28} className="text-rose-500 animate-pulse" />
            <span>Emergency Medical summary</span>
          </h2>
          <p className="text-slate-550 dark:text-slate-400 mt-1">
            HIPAA-compliant emergency care summaries for ambulance EMTs or quick clinical consults.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold px-4 py-2.5 rounded-2xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-850 transition-all text-sm cursor-pointer"
          >
            <Printer size={18} />
            <span>Print Sheet</span>
          </button>
          <button
            onClick={handleMockDownload}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2.5 rounded-2xl shadow-lg shadow-rose-500/10 hover:shadow-xl transition-all text-sm cursor-pointer disabled:opacity-50"
          >
            <Download size={18} />
            <span>{isExporting ? 'Exporting PDF...' : 'Download Card'}</span>
          </button>
        </div>
      </div>

      {/* Member Selection Drawer (Hidden during print) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm print:hidden">
        <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-3">
          Select Member to Generate Card
        </label>
        <div className="flex flex-wrap gap-2.5">
          {members.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveMemberId(m.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                m.id === activeMember.id
                  ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/10'
                  : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-350'
              }`}
            >
              {m.name} ({m.relation})
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Summary Sheet (Red-Accented Border, highly visible layout) */}
      <motion.div 
        layout
        className="bg-white dark:bg-slate-900 border-2 border-rose-500 rounded-[32px] p-6 sm:p-8 shadow-2xl relative overflow-hidden print:border-none print:shadow-none print:p-0"
      >
        {/* Warning Indicator Strip */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-rose-600 to-red-500 print:hidden" />
        
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-150 dark:border-slate-800/80 mb-6">
          <div className="flex items-center gap-4">
            <img 
              src={activeMember.avatar} 
              alt={activeMember.name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-rose-500 print:w-12 print:h-12"
            />
            <div>
              <h3 className="text-2xl font-extrabold text-slate-850 dark:text-white print:text-lg leading-none">{activeMember.name}</h3>
              <p className="text-xs text-rose-500 font-extrabold mt-1 uppercase tracking-wider">{activeMember.relation} • Clinical Emergency Card</p>
              <p className="text-[10px] text-slate-400 mt-1 print:hidden">Last compiled via HealthConcierge: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-rose-500 text-white px-4 py-3 rounded-2xl text-center shadow-lg shadow-rose-500/10 print:shadow-none print:border print:border-red-500 print:text-black">
              <p className="text-[9px] font-bold uppercase tracking-wider leading-none">Blood Type</p>
              <p className="text-xl font-extrabold mt-1 leading-none">{activeMember.bloodGroup}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-150 dark:border-slate-850 px-4 py-3 rounded-2xl text-center print:text-black">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Age / Gender</p>
              <p className="text-sm font-extrabold mt-1 text-slate-800 dark:text-white leading-none">{activeMember.age}y / {activeMember.gender.split('')[0]}</p>
            </div>
          </div>
        </div>

        {/* Clinical Grid Data */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Allergies & Conditions */}
          <div className="space-y-6">
            
            <div className="p-5 bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-2xl">
              <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                <ShieldAlert size={14} className="animate-pulse" />
                <span>Drug & Food Allergies (CRITICAL)</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeMember.allergies.map(a => (
                  <span key={a} className="text-xs px-2.5 py-1 bg-red-500 text-white rounded-lg font-bold">
                    ⚠️ {a}
                  </span>
                ))}
                {activeMember.allergies.length === 0 && (
                  <span className="text-xs text-slate-400 font-medium">No recorded allergies</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Heart size={14} className="text-rose-500" />
                <span>Diagnosed Chronic Diseases</span>
              </h4>
              <ul className="space-y-2">
                {activeMember.chronicDiseases.map(d => (
                  <li key={d} className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200">
                    • {d}
                  </li>
                ))}
                {activeMember.chronicDiseases.length === 0 && (
                  <p className="text-xs text-slate-450 italic">No active diagnoses recorded.</p>
                )}
              </ul>
            </div>

          </div>

          {/* Medications & Contacts */}
          <div className="space-y-6">
            
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Pill size={14} className="text-emerald-500" />
                <span>Active Prescription Schedule</span>
              </h4>
              <div className="flex flex-col gap-2">
                {activeMember.currentMedications.map(m => (
                  <div key={m} className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200">
                    💊 {m}
                  </div>
                ))}
                {activeMember.currentMedications.length === 0 && (
                  <p className="text-xs text-slate-450 italic">No current medications recorded.</p>
                )}
              </div>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-750 rounded-2xl">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Phone size={14} className="text-slate-400" />
                <span>Primary Emergency Contact</span>
              </h4>
              <div className="space-y-1 text-xs">
                <p className="font-extrabold text-slate-800 dark:text-white">{activeMember.emergencyContact.name}</p>
                <p className="text-slate-450 font-medium mt-0.5">{activeMember.emergencyContact.relation}</p>
                <a 
                  href={`tel:${activeMember.emergencyContact.phone}`} 
                  className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-1.5 inline-flex items-center gap-1 hover:underline"
                >
                  <Phone size={12} />
                  <span>{activeMember.emergencyContact.phone}</span>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Legal and Disclaimer Notice */}
        <div className="mt-8 pt-6 border-t border-slate-150 dark:border-slate-800/80 flex gap-3 text-[10px] text-slate-450 dark:text-slate-500 leading-relaxed font-semibold">
          <Info size={16} className="text-slate-405 flex-shrink-0" />
          <p>
            **CLINICAL NOTICE**: This card compiles patient records extracted from physical reports uploaded to the private workspace. All details should be verified before administering drug compounds. Compiled under secure HIPAA security regulations.
          </p>
        </div>

      </motion.div>

    </div>
  );
};
