import React, { useState } from 'react';
import { useFamilyState } from '../context/FamilyStateContext';
import { 
  Calendar, Clock, User, Plus, X, 
  MapPin, Clipboard, AlertCircle, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Appointments: React.FC = () => {
  const { appointments, addAppointment, members, activeMemberId, setActiveMemberId } = useFamilyState();
  const [isOpen, setIsOpen] = useState(false);

  // Form State
  const [doctor, setDoctor] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [hospital, setHospital] = useState('Metro Medical Center');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  // Filter based on active family member
  const filteredAppointments = appointments.filter(a => a.memberId === activeMemberId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor || !date || !time) return;

    addAppointment({
      memberId: activeMemberId,
      doctor,
      specialty,
      hospital,
      date,
      time,
      notes: notes || 'Routine checkup consult.',
      status: 'Upcoming'
    });

    // Reset Form
    setDoctor('');
    setSpecialty('');
    setNotes('');
    setIsOpen(false);
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Consultations & Appointments
          </h2>
          <p className="text-slate-550 dark:text-slate-400 mt-1">
            Keep track of doctor visits, checkups, and imaging appointments.
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-2xl shadow-lg shadow-emerald-500/10 hover:shadow-xl transition-all text-sm cursor-pointer"
        >
          <Plus size={18} />
          <span>Schedule Visit</span>
        </button>
      </div>

      {/* Member Selection Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm">
        <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-3">
          Select Member to Filter Schedule
        </label>
        <div className="flex flex-wrap gap-2.5">
          {members.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveMemberId(m.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                m.id === activeMemberId
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                  : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-855 border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-350'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredAppointments.map(app => (
            <motion.div
              layout
              key={app.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-[32px] shadow-sm flex flex-col justify-between gap-5 relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-550 dark:text-emerald-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Calendar size={22} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-850 dark:text-white text-base leading-snug">{app.doctor}</h3>
                    <p className="text-xs text-emerald-500 font-bold mt-0.5">{app.specialty}</p>
                    <p className="text-xs text-slate-450 mt-1 font-semibold flex items-center gap-1">
                      <MapPin size={12} />
                      <span>{app.hospital}</span>
                    </p>
                  </div>
                </div>

                <span className="text-[10px] px-2.5 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full font-bold uppercase">
                  {app.status}
                </span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 rounded-2xl">
                <p className="text-[10px] text-slate-450 font-bold uppercase">Clinical Notes</p>
                <p className="text-xs text-slate-650 dark:text-slate-400 mt-1.5 leading-relaxed font-semibold italic">
                  "{app.notes}"
                </p>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">
                  📅 {new Date(app.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="text-slate-450 flex items-center gap-1 font-bold">
                  <Clock size={12} />
                  <span>{app.time}</span>
                </span>
              </div>

            </motion.div>
          ))}
        </AnimatePresence>

        {filteredAppointments.length === 0 && (
          <div className="md:col-span-2 py-12 text-center bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-[32px]">
            <Calendar size={48} className="text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">No Consultations Scheduled</h4>
            <p className="text-xs text-slate-450 mt-1 font-medium">Create a booking on the right or change member filters.</p>
          </div>
        )}
      </div>

      {/* Interactive Modal Booking Form */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-20 max-w-lg mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-[32px] shadow-2xl p-6 sm:p-8 z-50 overflow-y-auto max-h-[80vh]"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                <h3 className="font-extrabold text-xl text-slate-850 dark:text-white">Schedule Consultation</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Doctor Name</label>
                  <input 
                    type="text" 
                    required 
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    placeholder="e.g. Dr. Arthur Pendelton"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Medical Specialty</label>
                    <input 
                      type="text" 
                      required 
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="e.g. General Practitioner"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Clinic/Hospital</label>
                    <input 
                      type="text" 
                      required 
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      placeholder="e.g. Saint Jude Clinic"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
                    <input 
                      type="date" 
                      required 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Time</label>
                    <input 
                      type="text" 
                      required 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="e.g. 10:30 AM"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Appointment Reason & Notes</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe symptoms, requirements, or refill checkouts."
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    type="button" 
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-3 text-xs font-bold rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-650 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 text-xs font-bold rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                  >
                    Confirm Appointment
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
