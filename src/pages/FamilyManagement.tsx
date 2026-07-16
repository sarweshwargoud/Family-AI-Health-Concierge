import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFamilyState } from '../context/FamilyStateContext';

import { 
  Users, Plus, Trash2, ShieldAlert, Heart, 
  ChevronRight, Calendar, UserPlus, X, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FamilyManagement: React.FC = () => {
  const { members, addMember, activeMemberId, setActiveMemberId } = useFamilyState();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Child');
  const [age, setAge] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [allergiesText, setAllergiesText] = useState('');
  const [diseasesText, setDiseasesText] = useState('');
  const [medsText, setMedsText] = useState('');
  const [insuranceProv, setInsuranceProv] = useState('Medicare');
  const [insuranceNum, setInsuranceNum] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !dob) return;

    // Parse comma-separated inputs
    const allergies = allergiesText ? allergiesText.split(',').map(s => s.trim()) : ['None'];
    const chronicDiseases = diseasesText ? diseasesText.split(',').map(s => s.trim()) : ['None'];
    const currentMedications = medsText ? medsText.split(',').map(s => s.trim()) : [];

    addMember({
      name,
      relation,
      age: parseInt(age),
      dob,
      gender,
      bloodGroup,
      allergies,
      chronicDiseases,
      currentMedications,
      height: "170 cm", // mock default
      weight: "70 kg", // mock default
      avatar: gender === 'Male' 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' 
        : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      insuranceProvider: insuranceProv,
      insuranceId: insuranceNum || 'N/A',
      emergencyContact: { name: 'Robert Doe', relation: 'Father', phone: '+1 (555) 123-4567' },
      vaccinations: []
    });

    // Reset Form
    setName('');
    setAge('');
    setDob('');
    setAllergiesText('');
    setDiseasesText('');
    setMedsText('');
    setInsuranceNum('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-8">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Family Management
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Enroll family members, configure individual medical files, and handle sharing permissions.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-2xl shadow-lg shadow-emerald-500/10 hover:shadow-xl transition-all text-sm cursor-pointer"
        >
          <UserPlus size={18} />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Grid of members */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(member => {
          const isActive = member.id === activeMemberId;
          return (
            <motion.div
              key={member.id}
              whileHover={{ y: -4 }}
              className={`bg-white dark:bg-slate-900 border p-6 rounded-[32px] shadow-sm relative overflow-hidden transition-all duration-200 ${
                isActive ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200/60 dark:border-slate-800'
              }`}
            >
              <div className="flex gap-4 items-start pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-4">
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-850"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-slate-850 dark:text-white text-base truncate">{member.name}</h3>
                  <p className="text-xs text-emerald-500 font-bold mt-0.5">{member.relation}</p>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">{member.age} years old • {member.gender}</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span className="font-medium">Blood Type</span>
                  <span className="font-bold text-rose-500">🩸 {member.bloodGroup}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span className="font-medium">Allergies</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
                    {member.allergies.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span className="font-medium">Prescriptions</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {member.currentMedications.length} active
                  </span>
                </div>
              </div>

              <div className="flex gap-2.5 mt-5">
                <button
                  onClick={() => {
                    setActiveMemberId(member.id);
                    navigate(`/family/${member.id}`);
                  }}
                  className="flex-1 text-center py-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-250 text-xs font-bold rounded-xl border border-slate-150 dark:border-slate-850 transition-colors"
                >
                  View Health File
                </button>
                {!isActive && (
                  <button
                    onClick={() => setActiveMemberId(member.id)}
                    className="py-2 px-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white text-xs font-bold rounded-xl border border-emerald-500/10 transition-colors"
                  >
                    Select Active
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal drawer for adding new member */}
      <AnimatePresence>
        {isAddOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-10 max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-[32px] shadow-2xl p-6 sm:p-8 z-50 overflow-y-auto max-h-[85vh]"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                <h3 className="font-extrabold text-xl text-slate-850 dark:text-white">Enroll New Member</h3>
                <button 
                  onClick={() => setIsAddOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Grandma Smith"
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
                      <option>Spouse</option>
                      <option>Child</option>
                      <option>Grandparent</option>
                      <option>Parent</option>
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
                      placeholder="e.g. 7"
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

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Gender</label>
                    <div className="flex gap-2">
                      {['Male', 'Female'].map(g => (
                        <button
                          type="button"
                          key={g}
                          onClick={() => setGender(g)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                            gender === g 
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' 
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-650'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Insurance Provider</label>
                    <input 
                      type="text" 
                      value={insuranceProv}
                      onChange={(e) => setInsuranceProv(e.target.value)}
                      placeholder="e.g. Medicare"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Allergies (comma-separated)</label>
                  <input 
                    type="text" 
                    value={allergiesText}
                    onChange={(e) => setAllergiesText(e.target.value)}
                    placeholder="e.g. Peanuts, Penicillin"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Chronic Diseases (comma-separated)</label>
                  <input 
                    type="text" 
                    value={diseasesText}
                    onChange={(e) => setDiseasesText(e.target.value)}
                    placeholder="e.g. Type 2 Diabetes, Asthma"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Current Medications (comma-separated)</label>
                  <input 
                    type="text" 
                    value={medsText}
                    onChange={(e) => setMedsText(e.target.value)}
                    placeholder="e.g. Metformin 500mg, Lisinopril 10mg"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    type="button" 
                    onClick={() => setIsAddOpen(false)}
                    className="flex-1 py-3 text-xs font-bold rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-650 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 text-xs font-bold rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                  >
                    Register Member
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
