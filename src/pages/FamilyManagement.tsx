import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFamilyState, type FamilyMember } from '../context/FamilyStateContext';
import { 
  Users, Plus, Trash2, Edit3, ShieldAlert, Heart, 
  ChevronRight, Calendar, UserPlus, X, Check, Phone, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FamilyManagement: React.FC = () => {
  const { members, addMember, updateMember, deleteMember, activeMemberId, setActiveMemberId } = useFamilyState();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Add Form State
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Child');
  const [age, setAge] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [allergiesText, setAllergiesText] = useState('');
  const [diseasesText, setDiseasesText] = useState('');
  const [medsText, setMedsText] = useState('');
  const [insuranceProv, setInsuranceProv] = useState('Star Health Insurance');
  const [insuranceNum, setInsuranceNum] = useState('');
  const [height, setHeight] = useState('170 cm');
  const [weight, setWeight] = useState('68 kg');
  const [emerContactName, setEmerContactName] = useState('Eshwaraiah Buddolla');
  const [emerContactPhone, setEmerContactPhone] = useState('+91 98765 43210');

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editRelation, setEditRelation] = useState('');
  const [editAge, setEditAge] = useState(0);
  const [editDob, setEditDob] = useState('');
  const [editGender, setEditGender] = useState('');
  const [editBloodGroup, setEditBloodGroup] = useState('');
  const [editAllergiesText, setEditAllergiesText] = useState('');
  const [editDiseasesText, setEditDiseasesText] = useState('');
  const [editMedsText, setEditMedsText] = useState('');
  const [editInsuranceProv, setEditInsuranceProv] = useState('');
  const [editInsuranceNum, setEditInsuranceNum] = useState('');
  const [editHeight, setEditHeight] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editEmerName, setEditEmerName] = useState('');
  const [editEmerPhone, setEditEmerPhone] = useState('');

  const handleOpenEdit = (member: FamilyMember) => {
    setEditingMember(member);
    setEditName(member.name);
    setEditRelation(member.relation);
    setEditAge(member.age);
    setEditDob(member.dob);
    setEditGender(member.gender);
    setEditBloodGroup(member.bloodGroup);
    setEditAllergiesText(member.allergies.join(', '));
    setEditDiseasesText(member.chronicDiseases.join(', '));
    setEditMedsText(member.currentMedications.join(', '));
    setEditInsuranceProv(member.insuranceProvider);
    setEditInsuranceNum(member.insuranceId);
    setEditHeight(member.height || '170 cm');
    setEditWeight(member.weight || '68 kg');
    setEditEmerName(member.emergencyContact?.name || '');
    setEditEmerPhone(member.emergencyContact?.phone || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editName.trim()) return;

    updateMember(editingMember.id, {
      name: editName.trim(),
      relation: editRelation,
      age: editAge,
      dob: editDob,
      gender: editGender,
      bloodGroup: editBloodGroup,
      allergies: editAllergiesText ? editAllergiesText.split(',').map(s => s.trim()).filter(Boolean) : ['None'],
      chronicDiseases: editDiseasesText ? editDiseasesText.split(',').map(s => s.trim()).filter(Boolean) : ['None'],
      currentMedications: editMedsText ? editMedsText.split(',').map(s => s.trim()).filter(Boolean) : [],
      insuranceProvider: editInsuranceProv,
      insuranceId: editInsuranceNum,
      height: editHeight,
      weight: editWeight,
      emergencyContact: {
        name: editEmerName,
        relation: 'Emergency Contact',
        phone: editEmerPhone
      }
    });

    setEditingMember(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !dob) return;

    const allergies = allergiesText ? allergiesText.split(',').map(s => s.trim()).filter(Boolean) : ['None'];
    const chronicDiseases = diseasesText ? diseasesText.split(',').map(s => s.trim()).filter(Boolean) : ['None'];
    const currentMedications = medsText ? medsText.split(',').map(s => s.trim()).filter(Boolean) : [];

    addMember({
      name,
      relation,
      age: parseInt(age) || 0,
      dob,
      gender,
      bloodGroup,
      allergies,
      chronicDiseases,
      currentMedications,
      height,
      weight,
      avatar: gender === 'Male' 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' 
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      insuranceProvider: insuranceProv,
      insuranceId: insuranceNum || 'N/A',
      emergencyContact: { name: emerContactName, relation: 'Family Contact', phone: emerContactPhone },
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

  const handleConfirmDelete = (id: string) => {
    deleteMember(id);
    setDeletingMemberId(null);
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
                isActive ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200/60 dark:border-slate-800'
              }`}
            >
              <div className="flex gap-4 items-start pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-4">
                <img 
                  src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                  alt={member.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-850"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-850 dark:text-white text-base truncate">{member.name}</h3>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(member)}
                        className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Edit profile"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingMemberId(member.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Remove member"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-500 font-bold mt-0.5">{member.relation}</p>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">{member.age} yrs • {member.gender} • {member.dob}</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span className="font-medium">Blood Type</span>
                  <span className="font-bold text-rose-500">🩸 {member.bloodGroup}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span className="font-medium">Allergies</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 max-w-[140px] truncate">
                    {member.allergies.join(', ') || 'None'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span className="font-medium">Chronic</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 max-w-[140px] truncate">
                    {member.chronicDiseases.join(', ') || 'None'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span className="font-medium">Medications</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {member.currentMedications.length} active
                  </span>
                </div>
              </div>

              <div className="flex gap-2.5 mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMemberId(member.id);
                    navigate(`/family/${member.id}`);
                  }}
                  className="flex-1 text-center py-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-250 text-xs font-bold rounded-xl border border-slate-150 dark:border-slate-850 transition-colors cursor-pointer"
                >
                  View Health File
                </button>
                {!isActive ? (
                  <button
                    type="button"
                    onClick={() => setActiveMemberId(member.id)}
                    className="py-2.5 px-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white text-xs font-bold rounded-xl border border-emerald-500/10 transition-colors cursor-pointer"
                  >
                    Select Active
                  </button>
                ) : (
                  <span className="py-2.5 px-3 bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1">
                    <Check size={12} strokeWidth={3} />
                    <span>Active</span>
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingMemberId && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingMemberId(null)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-1/3 max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-50 space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-500">
                <ShieldAlert size={24} />
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Remove Family Member?</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Are you sure you want to remove this profile? This will delete the member's associated timeline entries and health reports from your workspace.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingMemberId(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmDelete(deletingMemberId)}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Member Drawer / Modal */}
      <AnimatePresence>
        {editingMember && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingMember(null)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-10 max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-[32px] shadow-2xl p-6 sm:p-8 z-50 overflow-y-auto max-h-[85vh]"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                <h3 className="font-extrabold text-xl text-slate-850 dark:text-white">Edit Medical Profile</h3>
                <button 
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Relation</label>
                    <input 
                      type="text" 
                      required 
                      value={editRelation}
                      onChange={(e) => setEditRelation(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Age</label>
                    <input 
                      type="number" 
                      required 
                      value={editAge}
                      onChange={(e) => setEditAge(parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">DOB</label>
                    <input 
                      type="date" 
                      required 
                      value={editDob}
                      onChange={(e) => setEditDob(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Blood Group</label>
                    <select
                      value={editBloodGroup}
                      onChange={(e) => setEditBloodGroup(e.target.value)}
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
                    value={editAllergiesText}
                    onChange={(e) => setEditAllergiesText(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Chronic Diseases (comma-separated)</label>
                  <input 
                    type="text" 
                    value={editDiseasesText}
                    onChange={(e) => setEditDiseasesText(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Current Medications (comma-separated)</label>
                  <input 
                    type="text" 
                    value={editMedsText}
                    onChange={(e) => setEditMedsText(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Emergency Contact Name</label>
                    <input 
                      type="text" 
                      value={editEmerName}
                      onChange={(e) => setEditEmerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Emergency Contact Phone</label>
                    <input 
                      type="text" 
                      value={editEmerPhone}
                      onChange={(e) => setEditEmerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setEditingMember(null)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add New Member Modal */}
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
                  type="button"
                  onClick={() => setIsAddOpen(false)}
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
                      placeholder="e.g. Ramesh Buddolla"
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
                      <option>Father</option>
                      <option>Mother</option>
                      <option>Elder Sister</option>
                      <option>Younger Sister</option>
                      <option>Son</option>
                      <option>Daughter</option>
                      <option>Grandfather</option>
                      <option>Grandmother</option>
                      <option>Spouse</option>
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
                      placeholder="e.g. 25"
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
                    placeholder="e.g. Hypertension, Asthma"
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

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Emergency Contact Name</label>
                    <input 
                      type="text" 
                      value={emerContactName}
                      onChange={(e) => setEmerContactName(e.target.value)}
                      placeholder="e.g. Suvarna Buddolla"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5">Emergency Contact Phone</label>
                    <input 
                      type="text" 
                      value={emerContactPhone}
                      onChange={(e) => setEmerContactPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsAddOpen(false)}
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
