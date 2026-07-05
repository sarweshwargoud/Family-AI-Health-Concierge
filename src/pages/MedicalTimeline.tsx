import React, { useState } from 'react';
import { useFamilyState } from '../context/FamilyStateContext';
import { 
  Clock, Activity, Heart, Wind, Wrench, 
  FileText, ShieldAlert, Filter, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MedicalTimeline: React.FC = () => {
  const { timelineEvents, members, activeMemberId, setActiveMemberId } = useFamilyState();
  const [selectedType, setSelectedType] = useState<string>('all');

  // Filter events by selected family member and selected event type
  const filteredEvents = timelineEvents.filter(evt => {
    const memberMatch = evt.memberId === activeMemberId;
    const typeMatch = selectedType === 'all' || evt.type === selectedType;
    return memberMatch && typeMatch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'diagnosis': return <Activity size={16} className="text-rose-500" />;
      case 'surgery': return <Wrench size={16} className="text-amber-500" />;
      case 'medication': return <Heart size={16} className="text-emerald-500" />;
      case 'report': return <FileText size={16} className="text-blue-500" />;
      case 'vaccination': return <Calendar size={16} className="text-indigo-500" />;
      default: return <Clock size={16} className="text-slate-500" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'diagnosis': return 'bg-rose-500/10 border-rose-500/20';
      case 'surgery': return 'bg-amber-500/10 border-amber-500/20';
      case 'medication': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'report': return 'bg-blue-500/10 border-blue-500/20';
      case 'vaccination': return 'bg-indigo-500/10 border-indigo-500/20';
      default: return 'bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Medical Timeline
          </h2>
          <p className="text-slate-550 dark:text-slate-400 mt-1">
            Chronological log of clinical developments, surgeries, and reports.
          </p>
        </div>
      </div>

      {/* Filter Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Family Selector */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mr-2">Member</span>
          {members.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveMemberId(m.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                m.id === activeMemberId
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/10'
                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-350'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Event Type Filter */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mr-2">Category</span>
          {[
            { id: 'all', label: 'All Events' },
            { id: 'diagnosis', label: 'Diagnoses' },
            { id: 'surgery', label: 'Surgeries' },
            { id: 'report', label: 'Lab Reports' }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedType === type.id
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-350'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

      </div>

      {/* Timeline Event Node Tree */}
      <div className="relative max-w-3xl mx-auto py-4 pl-8 sm:pl-10">
        
        {/* Central timeline line spacer */}
        <div className="absolute left-[19px] sm:left-[21px] inset-y-0 w-0.5 bg-slate-200 dark:bg-slate-800" />

        <div className="flex flex-col gap-8">
          <AnimatePresence initial={false}>
            {filteredEvents.map((evt, idx) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="relative"
              >
                {/* Node Dot Indicator */}
                <div className={`absolute -left-[30px] sm:-left-[32px] top-1.5 w-6 h-6 rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center shadow-sm ${getBg(evt.type)}`}>
                  {getIcon(evt.type)}
                </div>

                {/* Event Card Container */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800/80 mb-3">
                    <div>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold px-2 py-0.5 rounded-full">{evt.year}</span>
                      <h4 className="font-extrabold text-slate-850 dark:text-white text-base mt-2">{evt.title}</h4>
                    </div>
                    <span className="text-[11px] text-slate-400 font-semibold">{evt.date}</span>
                  </div>
                  <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-medium">
                    {evt.description}
                  </p>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>

          {filteredEvents.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl"
            >
              <Clock size={40} className="text-slate-355 dark:text-slate-700 mx-auto mb-3" />
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">No Matching Events</h4>
              <p className="text-xs text-slate-450 mt-1 max-w-[280px] mx-auto font-medium">Try changing filters or select another family member.</p>
            </motion.div>
          )}
        </div>

      </div>

    </div>
  );
};
