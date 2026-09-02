import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { checkAndSeedUserData } from '../utils/supabase/seed';

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  dob: string;
  gender: string;
  bloodGroup: string;
  insuranceProvider: string;
  insuranceId: string;
  allergies: string[];
  chronicDiseases: string[];
  currentMedications: string[];
  vaccinations: { name: string; date: string; status: 'Completed' | 'Upcoming' | 'Overdue' }[];
  avatar: string;
  emergencyContact: { name: string; relation: string; phone: string };
  height: string;
  weight: string;
}

export interface MedicalReport {
  id: string;
  memberId: string;
  title: string;
  date: string;
  category: 'Prescription' | 'Blood Test' | 'MRI Scan' | 'Cardiology' | 'Vaccination' | 'Other';
  hospital: string;
  doctor: string;
  summary: string;
  extractedData: {
    diseases: string[];
    medications: string[];
    values?: { [key: string]: string };
  };
  fileSize: string;
  fileType: string;
}

export interface TimelineEvent {
  id: string;
  memberId: string;
  date: string;
  year: string;
  title: string;
  type: 'diagnosis' | 'surgery' | 'medication' | 'report' | 'vaccination';
  description: string;
  icon: string;
}

export interface MedicationReminder {
  id: string;
  memberId: string;
  medicine: string;
  dosage: string;
  frequency: string;
  timing: ('Morning' | 'Afternoon' | 'Night')[];
  taken: { [dateKey: string]: { [timeKey: string]: boolean } };
}

export interface Appointment {
  id: string;
  memberId: string;
  doctor: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  notes: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  attachments?: { name: string; type: string }[];
  clinicalCards?: {
    title: string;
    items: { label: string; value: string }[];
  }[];
}

interface FamilyStateContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  members: FamilyMember[];
  activeMemberId: string;
  activeMember: FamilyMember;
  setActiveMemberId: (id: string) => void;
  reports: MedicalReport[];
  timelineEvents: TimelineEvent[];
  medicationReminders: MedicationReminder[];
  appointments: Appointment[];
  chatMessages: ChatMessage[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  addMember: (member: Omit<FamilyMember, 'id'>) => Promise<void>;
  updateMember: (id: string, updatedData: Partial<FamilyMember>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  uploadReport: (report: Omit<MedicalReport, 'id'>) => Promise<void>;
  toggleMedication: (reminderId: string, time: 'Morning' | 'Afternoon' | 'Night') => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
  askAI: (text: string) => Promise<void>;
  clearChat: () => Promise<void>;
  notifications: { id: string; title: string; message: string; date: string; read: boolean; type: string }[];
  markNotificationsAsRead: () => Promise<void>;
}

// Initial Buddolla Mock Data for Guest / Demo Mode
const demoMembers: FamilyMember[] = [
  {
    id: 'm1',
    name: 'Eshwaraiah Buddolla',
    relation: 'Father (Account Owner)',
    age: 54,
    dob: '1972-04-10',
    gender: 'Male',
    bloodGroup: 'O+',
    insuranceProvider: 'Star Health Insurance',
    insuranceId: 'SHI-99281-99',
    allergies: ['Penicillin', 'Sulfa Drugs'],
    chronicDiseases: ['Essential Hypertension', 'Mild Hypercholesterolemia'],
    currentMedications: ['Lisinopril 10mg (Once daily)', 'Atorvastatin 20mg (At night)'],
    height: "172 cm",
    weight: "76 kg",
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    emergencyContact: { name: 'Suvarna Buddolla', relation: 'Spouse', phone: '+91 98765 43210' },
    vaccinations: [
      { name: 'Flu Vaccine', date: '2025-10-10', status: 'Completed' },
      { name: 'Tdap Booster', date: '2022-04-12', status: 'Completed' },
      { name: 'COVID-19 Booster', date: '2026-09-15', status: 'Upcoming' }
    ]
  },
  {
    id: 'm2',
    name: 'Suvarna Buddolla',
    relation: 'Mother',
    age: 48,
    dob: '1978-08-22',
    gender: 'Female',
    bloodGroup: 'O+',
    insuranceProvider: 'Star Health Insurance',
    insuranceId: 'SHI-99281-98',
    allergies: ['Shellfish', 'Bee Venom'],
    chronicDiseases: ['Type 2 Diabetes Mellitus', 'Osteoarthritis of Knee'],
    currentMedications: ['Metformin 500mg (Twice daily)', 'Glipizide 5mg (Once daily)', 'Atorvastatin 10mg (At night)'],
    height: "160 cm",
    weight: "62 kg",
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    emergencyContact: { name: 'Eshwaraiah Buddolla', relation: 'Spouse', phone: '+91 98765 43210' },
    vaccinations: [
      { name: 'Flu Vaccine', date: '2025-10-12', status: 'Completed' },
      { name: 'MMR Vaccine', date: '2019-06-15', status: 'Completed' }
    ]
  },
  {
    id: 'm3',
    name: 'Gayathri Buddolla',
    relation: 'Elder Sister',
    age: 22,
    dob: '2004-03-12',
    gender: 'Female',
    bloodGroup: 'B+',
    insuranceProvider: 'Star Health Insurance',
    insuranceId: 'SHI-99281-97',
    allergies: ['Dust Mites'],
    chronicDiseases: ['None'],
    currentMedications: ['None'],
    height: "162 cm",
    weight: "54 kg",
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    emergencyContact: { name: 'Eshwaraiah Buddolla', relation: 'Father', phone: '+91 98765 43210' },
    vaccinations: [
      { name: 'Flu Vaccine', date: '2025-10-18', status: 'Completed' },
      { name: 'HPV Vaccine Series', date: '2025-05-14', status: 'Completed' }
    ]
  },
  {
    id: 'm4',
    name: 'Sarweshwar Buddolla',
    relation: 'Me (Son)',
    age: 21,
    dob: '2005-07-05',
    gender: 'Male',
    bloodGroup: 'A+',
    insuranceProvider: 'Star Health Insurance',
    insuranceId: 'SHI-99281-96',
    allergies: ['Peanuts', 'Tree Nuts', 'Cat Dander'],
    chronicDiseases: ['Mild Asthma'],
    currentMedications: ['Albuterol Inhaler (As needed for wheezing)', 'Fluticasone Propionate (1 puff daily)'],
    height: "178 cm",
    weight: "70 kg",
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    emergencyContact: { name: 'Eshwaraiah Buddolla', relation: 'Father', phone: '+91 98765 43210' },
    vaccinations: [
      { name: 'Flu Vaccine', date: '2025-10-18', status: 'Completed' },
      { name: 'Meningococcal ACWY', date: '2026-08-20', status: 'Upcoming' }
    ]
  },
  {
    id: 'm5',
    name: 'Bhuvaneshwari Buddolla',
    relation: 'Younger Sister',
    age: 19,
    dob: '2007-11-20',
    gender: 'Female',
    bloodGroup: 'O+',
    insuranceProvider: 'Star Health Insurance',
    insuranceId: 'SHI-99281-95',
    allergies: ['None'],
    chronicDiseases: ['Atopic Dermatitis (Eczema)'],
    currentMedications: ['Hydrocortisone Topical Cream (As needed)'],
    height: "158 cm",
    weight: "50 kg",
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    emergencyContact: { name: 'Eshwaraiah Buddolla', relation: 'Father', phone: '+91 98765 43210' },
    vaccinations: [
      { name: 'Flu Vaccine', date: '2025-10-18', status: 'Completed' },
      { name: 'Hepatitis B Booster', date: '2024-03-10', status: 'Completed' }
    ]
  }
];

const demoReports: MedicalReport[] = [
  {
    id: 'r1',
    memberId: 'm1',
    title: 'Comprehensive Metabolic & Lipid Panel',
    date: '2026-05-14',
    category: 'Blood Test',
    hospital: 'Metro Medical Center Group',
    doctor: 'Dr. Evelyn Martinez',
    summary: 'Blood chemistry panel. Elevated Total Cholesterol (210 mg/dL) and LDL (130 mg/dL). Liver and kidney function normal.',
    extractedData: {
      diseases: ['Mild Hypercholesterolemia'],
      medications: ['Atorvastatin 20mg'],
      values: {
        'Total Cholesterol': '210 mg/dL',
        'LDL Cholesterol': '130 mg/dL',
        'HDL Cholesterol': '48 mg/dL',
        'Fasting Glucose': '94 mg/dL'
      }
    },
    fileSize: '1.4 MB',
    fileType: 'PDF'
  },
  {
    id: 'r2',
    memberId: 'm2',
    title: 'HbA1c & Fasting Glucose Glycemic Profile',
    date: '2026-06-02',
    category: 'Blood Test',
    hospital: 'Metro Endocrine Specialty Clinic',
    doctor: 'Dr. Alan Vance',
    summary: 'Quarterly diabetic monitoring. HbA1c at 6.8% (improved from 7.4%). Fasting glucose at 128 mg/dL. Metformin therapy effective.',
    extractedData: {
      diseases: ['Type 2 Diabetes Mellitus'],
      medications: ['Metformin 500mg', 'Glipizide 5mg'],
      values: {
        'HbA1c': '6.8%',
        'Fasting Glucose': '128 mg/dL',
        'eGFR': '>90 mL/min'
      }
    },
    fileSize: '2.1 MB',
    fileType: 'PDF'
  },
  {
    id: 'r3',
    memberId: 'm4',
    title: 'Pulmonary Function & Spirometry Test',
    date: '2026-04-18',
    category: 'Prescription',
    hospital: 'Allergy and Immunology Associates',
    doctor: 'Dr. Sandra Reynolds',
    summary: 'Mild bronchial constriction observed during allergen challenge. FEV1/FVC ratio 76%. Continue daily inhaled corticosteroid control.',
    extractedData: {
      diseases: ['Mild Asthma'],
      medications: ['Albuterol Inhaler', 'Fluticasone Propionate'],
      values: {
        'FEV1': '82% Predicted',
        'FEV1/FVC': '76%'
      }
    },
    fileSize: '950 KB',
    fileType: 'PDF'
  }
];

const demoTimeline: TimelineEvent[] = [
  {
    id: 't1',
    memberId: 'm1',
    date: '2021-04-12',
    year: '2021',
    title: 'Hypertension Diagnosis',
    type: 'diagnosis',
    description: 'Diagnosed with Primary Essential Hypertension. Prescribed Lisinopril 10mg daily.',
    icon: 'activity'
  },
  {
    id: 't2',
    memberId: 'm1',
    date: '2024-03-10',
    year: '2024',
    title: 'High Cholesterol Diagnosed',
    type: 'diagnosis',
    description: 'Screening showed elevated LDL cholesterol (145 mg/dL). Started Atorvastatin 20mg daily.',
    icon: 'heart'
  },
  {
    id: 't3',
    memberId: 'm2',
    date: '2018-06-15',
    year: '2018',
    title: 'Total Left Knee Replacement',
    type: 'surgery',
    description: 'Performed at Metro Orthopedic Center. Full recovery with 8 weeks of physical therapy.',
    icon: 'wrench'
  },
  {
    id: 't4',
    memberId: 'm2',
    date: '2020-11-20',
    year: '2020',
    title: 'Type 2 Diabetes Diagnosed',
    type: 'diagnosis',
    description: 'Diagnosed following glucose tolerance test. Initial HbA1c 8.2%. Prescribed Metformin 500mg twice daily.',
    icon: 'activity'
  },
  {
    id: 't5',
    memberId: 'm4',
    date: '2022-09-08',
    year: '2022',
    title: 'Asthma Diagnosis',
    type: 'diagnosis',
    description: 'Diagnosed following acute bronchial spasm event. Prescribed Albuterol rescue inhaler and Fluticasone control.',
    icon: 'wind'
  }
];

const demoReminders: MedicationReminder[] = [
  {
    id: 'rem1',
    memberId: 'm1',
    medicine: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    timing: ['Morning'],
    taken: {}
  },
  {
    id: 'rem2',
    memberId: 'm1',
    medicine: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily at night',
    timing: ['Night'],
    taken: {}
  },
  {
    id: 'rem3',
    memberId: 'm2',
    medicine: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    timing: ['Morning', 'Night'],
    taken: {}
  },
  {
    id: 'rem4',
    memberId: 'm2',
    medicine: 'Glipizide',
    dosage: '5mg',
    frequency: 'Once daily',
    timing: ['Morning'],
    taken: {}
  },
  {
    id: 'rem5',
    memberId: 'm4',
    medicine: 'Fluticasone',
    dosage: '1 puff',
    frequency: 'Once daily',
    timing: ['Morning'],
    taken: {}
  }
];

const demoAppointments: Appointment[] = [
  {
    id: 'a1',
    memberId: 'm1',
    doctor: 'Dr. Evelyn Martinez',
    specialty: 'Primary Care Physician',
    hospital: 'Metro Family Medicine Group',
    date: '2026-07-20',
    time: '10:00 AM',
    notes: 'Annual routine physical checkup, review blood pressure readings and refill prescription.',
    status: 'Upcoming'
  },
  {
    id: 'a2',
    memberId: 'm2',
    doctor: 'Dr. Alan Vance',
    specialty: 'Endocrinologist',
    hospital: 'Metro Endocrine Specialty Clinic',
    date: '2026-08-15',
    time: '02:30 PM',
    notes: 'Three-month diabetes follow-up. Please bring fasting glucose logs and recent lab panels.',
    status: 'Upcoming'
  },
  {
    id: 'a3',
    memberId: 'm4',
    doctor: 'Dr. Sandra Reynolds',
    specialty: 'Pediatric Allergist',
    hospital: 'Allergy and Immunology Associates',
    date: '2026-07-12',
    time: '11:15 AM',
    notes: 'Follow-up for seasonal asthma control. Check inhaler technique and pulmonary health.',
    status: 'Upcoming'
  }
];

const demoNotifications = [
  {
    id: 'n1',
    title: 'Upcoming Appointment',
    message: 'Sarweshwar has an appointment with Dr. Sandra Reynolds on July 12th.',
    date: '2026-07-05',
    read: false,
    type: 'appointment'
  },
  {
    id: 'n2',
    title: 'Medication Due',
    message: 'Morning medicines are ready for Suvarna Buddolla (Metformin, Glipizide).',
    date: '2026-07-05',
    read: false,
    type: 'medication'
  },
  {
    id: 'n3',
    title: 'Document Extracted',
    message: 'Annual Blood Work Panel for Eshwaraiah Buddolla successfully processed via AI OCR.',
    date: '2026-07-04',
    read: true,
    type: 'upload'
  }
];

const demoChatHistory: ChatMessage[] = [
  {
    id: 'c1',
    sender: 'assistant',
    text: 'Hello! I am your Family Health Concierge AI. I have cataloged health profiles and medical histories for Eshwaraiah, Suvarna, Gayathri, Sarweshwar, and Bhuvaneshwari.\n\nHow can I help you today? You can query active medications, chronic conditions, allergy profiles, or prepare an Emergency Summary.',
    timestamp: '9:45 AM'
  }
];

const FamilyStateContext = createContext<FamilyStateContextType | undefined>(undefined);

export const FamilyStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<FamilyMember[]>(demoMembers);
  const [activeMemberId, setActiveMemberId] = useState<string>('m1');
  const [reports, setReports] = useState<MedicalReport[]>(demoReports);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(demoTimeline);
  const [medicationReminders, setMedicationReminders] = useState<MedicationReminder[]>(demoReminders);
  const [appointments, setAppointments] = useState<Appointment[]>(demoAppointments);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(demoChatHistory);
  const [notifications, setNotifications] = useState<any[]>(demoNotifications);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const activeMember = members.find(m => m.id === activeMemberId) || members[0] || demoMembers[0];

  const handleUserSession = async (currentUser: User) => {
    try {
      await checkAndSeedUserData(currentUser.id);

      const [
        { data: dbMembers },
        { data: dbReports },
        { data: dbTimeline },
        { data: dbReminders },
        { data: dbAppointments },
        { data: dbNotifications },
        { data: dbChat }
      ] = await Promise.all([
        supabase.from('family_members').select('*').eq('user_id', currentUser.id),
        supabase.from('medical_reports').select('*').eq('user_id', currentUser.id),
        supabase.from('timeline_events').select('*').eq('user_id', currentUser.id),
        supabase.from('medication_reminders').select('*').eq('user_id', currentUser.id),
        supabase.from('appointments').select('*').eq('user_id', currentUser.id),
        supabase.from('notifications').select('*').eq('user_id', currentUser.id),
        supabase.from('chat_messages').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: true })
      ]);

      if (dbMembers && dbMembers.length > 0) {
        setMembers(dbMembers.map(m => ({
          id: m.id,
          name: m.name,
          relation: m.relation,
          age: m.age,
          dob: m.dob,
          gender: m.gender,
          bloodGroup: m.blood_group,
          insuranceProvider: m.insurance_provider,
          insuranceId: m.insurance_id,
          allergies: m.allergies || [],
          chronicDiseases: m.chronic_diseases || [],
          currentMedications: m.current_medications || [],
          height: m.height || '',
          weight: m.weight || '',
          avatar: m.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          emergencyContact: m.emergency_contact || { name: '', relation: '', phone: '' },
          vaccinations: m.vaccinations || []
        })));
        setActiveMemberId(dbMembers[0].id);
      }

      if (dbReports && dbReports.length > 0) {
        setReports(dbReports.map(r => ({
          id: r.id,
          memberId: r.member_id,
          title: r.title,
          date: r.date,
          category: r.category,
          hospital: r.hospital,
          doctor: r.doctor,
          summary: r.summary,
          extractedData: r.extracted_data || { diseases: [], medications: [] },
          fileSize: r.file_size || '1 MB',
          fileType: r.file_type || 'PDF'
        })));
      }

      if (dbTimeline && dbTimeline.length > 0) {
        setTimelineEvents(dbTimeline.map(t => ({
          id: t.id,
          memberId: t.member_id,
          date: t.date,
          year: t.year,
          title: t.title,
          type: t.type,
          description: t.description,
          icon: t.icon
        })));
      }

      if (dbReminders && dbReminders.length > 0) {
        setMedicationReminders(dbReminders.map(rem => ({
          id: rem.id,
          memberId: rem.member_id,
          medicine: rem.medicine,
          dosage: rem.dosage,
          frequency: rem.frequency,
          timing: rem.timing,
          taken: rem.taken || {}
        })));
      }

      if (dbAppointments && dbAppointments.length > 0) {
        setAppointments(dbAppointments.map(a => ({
          id: a.id,
          memberId: a.member_id,
          doctor: a.doctor,
          specialty: a.specialty,
          hospital: a.hospital,
          date: a.date,
          time: a.time,
          notes: a.notes,
          status: a.status
        })));
      }

      if (dbNotifications && dbNotifications.length > 0) {
        setNotifications(dbNotifications.map(n => ({
          id: n.id,
          title: n.title,
          message: n.message,
          date: n.date,
          read: n.read,
          type: n.type
        })));
      }

      if (dbChat && dbChat.length > 0) {
        setChatMessages(dbChat.map(c => ({
          id: c.id,
          sender: c.sender,
          text: c.text,
          timestamp: c.timestamp,
          attachments: c.attachments,
          clinicalCards: c.clinical_cards
        })));
      }
    } catch (err) {
      console.error('Error fetching database records:', err);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.body.classList.remove('dark');
    }

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await handleUserSession(currentUser);
        }
      } catch (err) {
        console.error('Session retrieval error:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        setLoading(true);
        await handleUserSession(currentUser);
        setLoading(false);
      } else {
        // Restore demo mock data on sign out
        setMembers(demoMembers);
        setActiveMemberId('m1');
        setReports(demoReports);
        setTimelineEvents(demoTimeline);
        setMedicationReminders(demoReminders);
        setAppointments(demoAppointments);
        setChatMessages(demoChatHistory);
        setNotifications(demoNotifications);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  const addMember = async (member: Omit<FamilyMember, 'id'>) => {
    const newId = `m${Date.now()}`;
    const newMember: FamilyMember = { id: newId, ...member };

    setMembers(prev => [...prev, newMember]);
    if (!activeMemberId) {
      setActiveMemberId(newId);
    }

    const notifItem = {
      id: `n${Date.now()}`,
      title: 'New Member Added',
      message: `${member.name} has been added as a family member (${member.relation}).`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      type: 'member'
    };
    setNotifications(prev => [notifItem, ...prev]);

    if (user) {
      try {
        await supabase.from('family_members').insert([{
          user_id: user.id,
          name: member.name,
          relation: member.relation,
          age: member.age,
          dob: member.dob,
          gender: member.gender,
          blood_group: member.bloodGroup,
          insurance_provider: member.insuranceProvider,
          insurance_id: member.insuranceId,
          allergies: member.allergies,
          chronic_diseases: member.chronicDiseases,
          current_medications: member.currentMedications,
          height: member.height,
          weight: member.weight,
          avatar: member.avatar,
          emergency_contact: member.emergencyContact,
          vaccinations: member.vaccinations
        }]);

        await supabase.from('notifications').insert([{
          user_id: user.id,
          title: notifItem.title,
          message: notifItem.message,
          date: notifItem.date,
          read: false,
          type: 'member'
        }]);
      } catch (err) {
        console.error('Error adding member to Supabase:', err);
      }
    }
  };

  const updateMember = async (id: string, updatedData: Partial<FamilyMember>) => {
    // Optimistic UI state update
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updatedData } : m));

    const notifItem = {
      id: `n${Date.now()}`,
      title: 'Member Profile Updated',
      message: `Medical file for ${updatedData.name || 'family member'} has been updated.`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      type: 'member'
    };
    setNotifications(prev => [notifItem, ...prev]);

    if (user) {
      try {
        const payload: any = {};
        if (updatedData.name !== undefined) payload.name = updatedData.name;
        if (updatedData.relation !== undefined) payload.relation = updatedData.relation;
        if (updatedData.age !== undefined) payload.age = updatedData.age;
        if (updatedData.dob !== undefined) payload.dob = updatedData.dob;
        if (updatedData.gender !== undefined) payload.gender = updatedData.gender;
        if (updatedData.bloodGroup !== undefined) payload.blood_group = updatedData.bloodGroup;
        if (updatedData.insuranceProvider !== undefined) payload.insurance_provider = updatedData.insuranceProvider;
        if (updatedData.insuranceId !== undefined) payload.insurance_id = updatedData.insuranceId;
        if (updatedData.allergies !== undefined) payload.allergies = updatedData.allergies;
        if (updatedData.chronicDiseases !== undefined) payload.chronic_diseases = updatedData.chronicDiseases;
        if (updatedData.currentMedications !== undefined) payload.current_medications = updatedData.currentMedications;
        if (updatedData.height !== undefined) payload.height = updatedData.height;
        if (updatedData.weight !== undefined) payload.weight = updatedData.weight;
        if (updatedData.avatar !== undefined) payload.avatar = updatedData.avatar;
        if (updatedData.emergencyContact !== undefined) payload.emergency_contact = updatedData.emergencyContact;
        if (updatedData.vaccinations !== undefined) payload.vaccinations = updatedData.vaccinations;
        payload.updated_at = new Date().toISOString();

        await supabase
          .from('family_members')
          .update(payload)
          .eq('id', id)
          .eq('user_id', user.id);
      } catch (err) {
        console.error('Error updating family member in Supabase:', err);
      }
    }
  };

  const deleteMember = async (id: string) => {
    // Optimistic UI state removal
    const memberToDelete = members.find(m => m.id === id);
    setMembers(prev => {
      const filtered = prev.filter(m => m.id !== id);
      if (activeMemberId === id && filtered.length > 0) {
        setActiveMemberId(filtered[0].id);
      }
      return filtered;
    });

    const notifItem = {
      id: `n${Date.now()}`,
      title: 'Member Removed',
      message: `${memberToDelete?.name || 'Member'} was removed from your family space.`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      type: 'member'
    };
    setNotifications(prev => [notifItem, ...prev]);

    if (user) {
      try {
        await supabase
          .from('family_members')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
      } catch (err) {
        console.error('Error deleting family member in Supabase:', err);
      }
    }
  };

  const uploadReport = async (report: Omit<MedicalReport, 'id'>) => {
    const reportId = `r${Date.now()}`;
    const newReport: MedicalReport = { id: reportId, ...report };

    const newTimeline: TimelineEvent = {
      id: `t${Date.now()}`,
      memberId: report.memberId,
      date: report.date,
      year: report.date.split('-')[0],
      title: report.title,
      type: 'report',
      description: `Uploaded document: ${report.category} from ${report.hospital} under ${report.doctor}.`,
      icon: 'file'
    };

    const memberName = members.find(m => m.id === report.memberId)?.name || 'member';
    const notifItem = {
      id: `n${Date.now()}`,
      title: 'OCR Parsing Complete',
      message: `Successfully processed "${report.title}" for ${memberName}.`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      type: 'upload'
    };

    setReports(prev => [newReport, ...prev]);
    setTimelineEvents(prev => [newTimeline, ...prev]);
    setNotifications(prev => [notifItem, ...prev]);

    if (user) {
      try {
        await supabase.from('medical_reports').insert([{
          user_id: user.id,
          member_id: report.memberId,
          title: report.title,
          date: report.date,
          category: report.category,
          hospital: report.hospital,
          doctor: report.doctor,
          summary: report.summary,
          extracted_data: report.extractedData,
          file_size: report.fileSize,
          file_type: report.fileType
        }]);

        await supabase.from('timeline_events').insert([{
          user_id: user.id,
          member_id: report.memberId,
          date: newTimeline.date,
          year: newTimeline.year,
          title: newTimeline.title,
          type: 'report',
          description: newTimeline.description,
          icon: newTimeline.icon
        }]);

        await supabase.from('notifications').insert([{
          user_id: user.id,
          title: notifItem.title,
          message: notifItem.message,
          date: notifItem.date,
          read: false,
          type: 'upload'
        }]);
      } catch (err) {
        console.error('Error saving report to Supabase:', err);
      }
    }
  };

  const toggleMedication = async (reminderId: string, time: 'Morning' | 'Afternoon' | 'Night') => {
    const today = new Date().toISOString().split('T')[0];
    let updatedReminders = medicationReminders.map(rem => {
      if (rem.id === reminderId) {
        const currentDateMap = rem.taken[today] || {};
        const isCurrentTaken = !!currentDateMap[time];
        return {
          ...rem,
          taken: {
            ...rem.taken,
            [today]: {
              ...currentDateMap,
              [time]: !isCurrentTaken
            }
          }
        };
      }
      return rem;
    });

    setMedicationReminders(updatedReminders);

    if (user) {
      const targetReminder = updatedReminders.find(r => r.id === reminderId);
      if (targetReminder) {
        try {
          await supabase
            .from('medication_reminders')
            .update({ taken: targetReminder.taken })
            .eq('id', reminderId)
            .eq('user_id', user.id);
        } catch (err) {
          console.error('Error syncing medication reminder to Supabase:', err);
        }
      }
    }
  };

  const addAppointment = async (appointment: Omit<Appointment, 'id'>) => {
    const newId = `a${Date.now()}`;
    const newAppointment: Appointment = { id: newId, ...appointment };

    const memberName = members.find(m => m.id === appointment.memberId)?.name || 'Family member';
    const notifItem = {
      id: `n${Date.now()}`,
      title: 'New Appointment Scheduled',
      message: `${memberName} has an appointment with ${appointment.doctor} on ${appointment.date}.`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      type: 'appointment'
    };

    setAppointments(prev => [...prev, newAppointment]);
    setNotifications(prev => [notifItem, ...prev]);

    if (user) {
      try {
        await supabase.from('appointments').insert([{
          user_id: user.id,
          member_id: appointment.memberId,
          doctor: appointment.doctor,
          specialty: appointment.specialty,
          hospital: appointment.hospital,
          date: appointment.date,
          time: appointment.time,
          notes: appointment.notes,
          status: appointment.status
        }]);

        await supabase.from('notifications').insert([{
          user_id: user.id,
          title: notifItem.title,
          message: notifItem.message,
          date: notifItem.date,
          read: false,
          type: 'appointment'
        }]);
      } catch (err) {
        console.error('Error adding appointment to Supabase:', err);
      }
    }
  };

  const askAI = async (text: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = `c_${Date.now()}`;
    
    setChatMessages(prev => [...prev, {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: timeStr,
      attachments: [],
      clinicalCards: []
    }]);

    if (user) {
      try {
        await supabase.from('chat_messages').insert([{
          user_id: user.id,
          sender: 'user',
          text,
          timestamp: timeStr,
          attachments: [],
          clinical_cards: []
        }]);
      } catch (err) {
        console.error('Error syncing user message:', err);
      }
    }

    // AI response simulation with clinical RAG heuristics
    setTimeout(async () => {
      let reply = '';
      let clinicalCards: ChatMessage['clinicalCards'] = undefined;
      const normText = text.toLowerCase();

      const mentionedMember = members.find(m =>
        normText.includes(m.name.toLowerCase()) ||
        (m.relation.toLowerCase().includes('father') && (normText.includes('dad') || normText.includes('eshwaraiah'))) ||
        (m.relation.toLowerCase().includes('mother') && (normText.includes('mom') || normText.includes('suvarna'))) ||
        (m.relation.toLowerCase().includes('sister') && (normText.includes('gayathri') || normText.includes('bhuvaneshwari') || normText.includes('sister'))) ||
        (m.relation.toLowerCase().includes('son') && (normText.includes('sarweshwar') || normText.includes('me')))
      );

      const target = mentionedMember || activeMember;

      if (normText.includes('emergency') || normText.includes('summary')) {
        reply = `🚨 **EMERGENCY SUMMARY EXTRACTED** for **${target.name}** (${target.relation}).\n\nI have generated a clinical summary outlining current diagnosis profiles, allergies, active medications, and urgent contacts. You can export this to a printable card.`;
        clinicalCards = [
          {
            title: `Emergency Clinical Summary - ${target.name}`,
            items: [
              { label: 'Relation', value: target.relation },
              { label: 'Blood Group', value: `🩸 ${target.bloodGroup}` },
              { label: 'Allergies', value: target.allergies.join(', ') || 'None Known' },
              { label: 'Chronic Conditions', value: target.chronicDiseases.join(', ') || 'None' },
              { label: 'Active Medications', value: target.currentMedications.join('; ') || 'None' },
              { label: 'Emergency Contact', value: `${target.emergencyContact.name} (${target.emergencyContact.relation}) - ${target.emergencyContact.phone}` }
            ]
          }
        ];
      } else if (normText.includes('medication') || normText.includes('medicine') || normText.includes('pill')) {
        const medsList = target.currentMedications.length > 0
          ? target.currentMedications.map(m => `- ${m}`).join('\n')
          : 'No active medications documented.';
        reply = `Here are the active medications currently recorded for **${target.name}**:\n\n${medsList}\n\n*Refilled & cross-checked with recent diagnostics.*`;
      } else if (normText.includes('allergy') || normText.includes('allergies')) {
        const allergiesList = target.allergies.length > 0
          ? target.allergies.map(a => `- ${a}`).join('\n')
          : 'No active drug, environmental, or food allergies recorded.';
        reply = `Here are the recorded allergies for **${target.name}**:\n\n${allergiesList}\n\n⚠️ **Clinical Note**: Make sure emergency personnel are alerted to these agents before prescribing new medications.`;
      } else if (normText.includes('timeline') || normText.includes('history') || normText.includes('surgery')) {
        const memberEvents = timelineEvents.filter(e => e.memberId === target.id);
        const timelineList = memberEvents.length > 0
          ? memberEvents.map(e => `* **${e.year}** - ${e.title}: ${e.description}`).join('\n')
          : 'No historical health events on the timeline yet.';
        reply = `Here is the medical timeline history of **${target.name}**:\n\n${timelineList}`;
      } else if (normText.includes('report') || normText.includes('blood') || normText.includes('mri')) {
        const memberReports = reports.filter(r => r.memberId === target.id);
        const reportsList = memberReports.length > 0
          ? memberReports.map(r => `* **${r.date}**: ${r.title} (${r.category}) from ${r.hospital} (Doctor: ${r.doctor})`).join('\n')
          : 'No uploaded medical reports found for this member.';
        reply = `Found the following medical documents and clinical extractions for **${target.name}**:\n\n${reportsList}\n\nI can perform deep queries on these test values if you specify.`;
      } else {
        reply = `I have scanned the health catalog for **${target.name}** (${target.relation}). He/she is a **${target.age}** year old **${target.gender}** with **${target.bloodGroup}** blood group.\n\n* **Allergies**: ${target.allergies.join(', ') || 'None'}\n* **Chronic Conditions**: ${target.chronicDiseases.join(', ') || 'None'}\n* **Active Medications**: ${target.currentMedications.join('; ') || 'None'}\n\nIs there a specific detail, recent lab trend, or timeline event you'd like me to fetch?`;
      }

      const asstMsgId = `c_asst_${Date.now()}`;
      setChatMessages(prev => [...prev, {
        id: asstMsgId,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        attachments: [],
        clinicalCards
      }]);

      if (user) {
        try {
          await supabase.from('chat_messages').insert([{
            user_id: user.id,
            sender: 'assistant',
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            attachments: [],
            clinical_cards: clinicalCards || []
          }]);
        } catch (err) {
          console.error('Error syncing assistant reply:', err);
        }
      }
    }, 1000);
  };

  const clearChat = async () => {
    setChatMessages([]);
    if (user) {
      try {
        await supabase.from('chat_messages').delete().eq('user_id', user.id);
      } catch (err) {
        console.error('Error clearing chat history:', err);
      }
    }
  };

  const markNotificationsAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (user) {
      try {
        await supabase.from('notifications').update({ read: true }).eq('user_id', user.id);
      } catch (err) {
        console.error('Error marking notifications as read:', err);
      }
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setMembers(demoMembers);
      setActiveMemberId('m1');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <FamilyStateContext.Provider
      value={{
        user,
        loading,
        logout,
        members,
        activeMemberId,
        activeMember,
        setActiveMemberId,
        reports,
        timelineEvents,
        medicationReminders,
        appointments,
        chatMessages,
        isDarkMode,
        toggleDarkMode,
        addMember,
        updateMember,
        deleteMember,
        uploadReport,
        toggleMedication,
        addAppointment,
        askAI,
        clearChat,
        notifications,
        markNotificationsAsRead
      }}
    >
      {children}
    </FamilyStateContext.Provider>
  );
};

export const useFamilyState = () => {
  const context = useContext(FamilyStateContext);
  if (context === undefined) {
    throw new Error('useFamilyState must be used within a FamilyStateProvider');
  }
  return context;
};
