import React from 'react';
import { useFamilyState } from '../context/FamilyStateContext';
import { 
  Bell, AlertCircle, Calendar, Pill, 
  Upload, Users, Check, Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Notifications: React.FC = () => {
  const { notifications, markNotificationsAsRead } = useFamilyState();

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar size={18} className="text-blue-500" />;
      case 'medication': return <Pill size={18} className="text-emerald-500" />;
      case 'upload': return <Upload size={18} className="text-purple-500" />;
      case 'member': return <Users size={18} className="text-teal-500" />;
      default: return <Bell size={18} className="text-slate-500" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'appointment': return 'bg-blue-500/10 border-blue-500/10';
      case 'medication': return 'bg-emerald-500/10 border-emerald-500/10';
      case 'upload': return 'bg-purple-500/10 border-purple-500/10';
      case 'member': return 'bg-teal-500/10 border-teal-500/10';
      default: return 'bg-slate-500/10 border-slate-500/10';
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bell size={28} className="text-emerald-555" />
            <span>Health Notifications</span>
          </h2>
          <p className="text-slate-550 dark:text-slate-400 mt-1">
            Review active warnings, dosage reminders, and diagnostic document parser events.
          </p>
        </div>
        <button
          onClick={markNotificationsAsRead}
          className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-250 font-bold px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors text-xs cursor-pointer"
        >
          <Check size={14} />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Notifications Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-[32px] p-6 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80">
        
        {notifications.map(notif => (
          <div key={notif.id} className="py-4.5 first:pt-0 last:pb-0 flex items-start gap-4 transition-all">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getBg(notif.type)}`}>
              {getIcon(notif.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="font-extrabold text-sm text-slate-850 dark:text-white flex items-center gap-2">
                  <span>{notif.title}</span>
                  {!notif.read && (
                    <span className="w-1.5 h-1.5 bg-emerald-555 rounded-full" />
                  )}
                </h4>
                <span className="text-[10px] text-slate-400 font-semibold">{notif.date}</span>
              </div>
              <p className="text-xs text-slate-550 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                {notif.message}
              </p>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="py-12 text-center">
            <Bell size={48} className="text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">All Caught Up!</h4>
            <p className="text-xs text-slate-450 mt-1 font-medium">You have no new health warnings or scheduler alerts.</p>
          </div>
        )}
      </div>

    </div>
  );
};
