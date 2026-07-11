
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  addMember: (member: Omit<FamilyMember, 'id'>) => void;
  uploadReport: (report: Omit<MedicalReport, 'id'>) => void;
  toggleMedication: (reminderId: string, time: 'Morning' | 'Afternoon' | 'Night') => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  askAI: (text: string) => void;
  clearChat: () => void;
  notifications: { id: string; title: string; message: string; date: string; read: boolean; type: string }[];
  markNotificationsAsRead: () => void;
}

const FamilyStateContext = createContext<FamilyStateContextType | undefined>(undefined);

const initialMembers: FamilyMember[] = [
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
    currentMedications: ['Hydrocortisone 1% cream (Topical as needed)'],
    height: "158 cm",
    weight: "52 kg",
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    emergencyContact: { name: 'Eshwaraiah Buddolla', relation: 'Father', phone: '+91 98765 43210' },
    vaccinations: [
      { name: 'Flu Vaccine', date: '2025-10-18', status: 'Completed' },
      { name: 'DTaP Vaccine', date: '2023-11-05', status: 'Completed' },
      { name: 'Varicella (Chickenpox)', date: '2024-02-12', status: 'Completed' }
    ]
  }
];

const initialReports: MedicalReport[] = [
  {
    id: 'r1',
    memberId: 'm1',
    title: 'Annual Blood Work Panel',
    date: '2025-11-20',
    category: 'Blood Test',
    hospital: 'Metro Health Diagnostics',
    doctor: 'Dr. Evelyn Martinez',
    summary: 'Standard lipid profile and metabolic screen. Total cholesterol was 215 mg/dL (slightly elevated). HbA1c is normal at 5.4%. Creatinine and liver enzymes are within normal reference range. Recommended continuing current low-dose Atorvastatin and diet modification.',
    extractedData: {
      diseases: ['Mild Hypercholesterolemia'],
      medications: ['Atorvastatin 20mg'],
      values: {
        'Total Cholesterol': '215 mg/dL',
        'LDL Cholesterol': '132 mg/dL',
        'HDL Cholesterol': '52 mg/dL',
        'Triglycerides': '155 mg/dL',
        'HbA1c': '5.4%'
      }
    },
    fileSize: '1.8 MB',
    fileType: 'PDF'
  },
  {
    id: 'r2',
    memberId: 'm2',
    title: 'HbA1c & Blood Glucose Log',
    date: '2026-03-15',
    category: 'Blood Test',
    hospital: 'Senior Care Associates',
    doctor: 'Dr. Alan Vance (Endocrinologist)',
    summary: 'Routine review of diabetes control. HbA1c level measured at 7.1%, which indicates acceptable control but room for improvement. Kidney profiles are stable. Doctor recommended increasing Metformin dosage if fasting blood sugar remains consistently above 140 mg/dL.',
    extractedData: {
      diseases: ['Type 2 Diabetes Mellitus'],
      medications: ['Metformin 500mg', 'Glipizide 5mg'],
      values: {
        'HbA1c': '7.1%',
        'Fasting Blood Glucose': '138 mg/dL',
        'eGFR': '74 mL/min/1.73m²'
      }
    },
    fileSize: '1.2 MB',
    fileType: 'PDF'
  },
  {
    id: 'r3',
    memberId: 'm4',
    title: 'Pulmonary Function Spirometry Report',
    date: '2025-06-12',
    category: 'Other',
    hospital: 'Pediatric Allergy & Asthma Clinic',
    doctor: 'Dr. Sandra Reynolds',
    summary: 'Spirometry test shows FEV1/FVC ratio is 78%. Mild obstruction noted which resolves post-bronchodilator inhalation (+14% improvement). Clinically diagnostic of mild extrinsic asthma. Instructed to maintain daily steroid inhaler and use rescue inhaler on exertion.',
    extractedData: {
      diseases: ['Mild Asthma'],
      medications: ['Fluticasone Propionate', 'Albuterol Inhaler'],
      values: {
        'FEV1/FVC': '78%',
        'Reversibility': '14%'
      }
    },
    fileSize: '2.4 MB',
    fileType: 'PDF'
  }
];

const initialTimeline: TimelineEvent[] = [
  {
    id: 't1',
    memberId: 'm1',
    date: '2021-04-12',
    year: '2021',
    title: 'Hypertension Diagnosis',
    type: 'diagnosis',
    description: 'Diagnosed with Primary Essential Hypertension after multiple high readings. Prescribed Lisinopril 10mg daily.',
    icon: 'activity'
  },
  {
    id: 't2',
    memberId: 'm1',
    date: '2024-03-10',
    year: '2024',
    title: 'High Cholesterol Diagnosed',
    type: 'diagnosis',
    description: 'Routine blood screening showed elevated LDL cholesterol (145 mg/dL). Started Atorvastatin 20mg daily.',
    icon: 'heart'
  },
  {
    id: 't3',
    memberId: 'm2',
    date: '2018-06-15',
    year: '2018',
    title: 'Total Left Knee Replacement',
    type: 'surgery',
    description: 'Performed at Metro Orthopedic Center by Dr. Keith Thomas. Uncomplicated recovery with 8 weeks of physical therapy.',
    icon: 'wrench'
  },
  {
    id: 't4',
    memberId: 'm2',
    date: '2020-11-20',
    year: '2020',
    title: 'Type 2 Diabetes Diagnosed',
    type: 'diagnosis',
    description: 'Diagnosed following standard glucose tolerance test. Initial HbA1c was 8.2%. Prescribed Metformin 500mg twice daily and active exercise plan.',
    icon: 'activity'
  },
  {
    id: 't5',
    memberId: 'm4',
    date: '2022-09-08',
    year: '2022',
    title: 'Asthma Diagnosis',
    type: 'diagnosis',
    description: 'Diagnosed following acute bronchial spasm event triggered by seasonal dander. Prescribed Albuterol rescue inhaler and Fluticasone control.',
    icon: 'wind'
  }
];

const initialReminders: MedicationReminder[] = [
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

const initialAppointments: Appointment[] = [
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
    notes: 'Follow-up for seasonal asthma control. Check inhaler inhalation technique and pulmonary health.',
    status: 'Upcoming'
  }
];

const initialNotifications = [
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

const defaultChatHistory: ChatMessage[] = [
  {
    id: 'c1',
    sender: 'assistant',
    text: 'Hello! I am your Family Health Concierge AI. I have cataloged health profiles and medical histories for Eshwaraiah, Suvarna, Gayathri, Sarweshwar, and Bhuvaneshwari.\n\nHow can I help you today? You can query active medications, chronic conditions, allergy profiles, or prepare an Emergency Summary.',
    timestamp: '9:45 AM'
  }
];

export const FamilyStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<FamilyMember[]>(initialMembers);
  const [activeMemberId, setActiveMemberId] = useState<string>('m1');
  const [reports, setReports] = useState<MedicalReport[]>(initialReports);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(initialTimeline);
  const [medicationReminders, setMedicationReminders] = useState<MedicationReminder[]>(initialReminders);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(defaultChatHistory);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const activeMember = members.find(m => m.id === activeMemberId) || members[0];

  useEffect(() => {
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.body.classList.remove('dark');
    }
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

  const addMember = (member: Omit<FamilyMember, 'id'>) => {
    const id = `m${Date.now()}`;
    const newMember: FamilyMember = { ...member, id };
    setMembers(prev => [...prev, newMember]);
    setNotifications(prev => [
      {
        id: `n${Date.now()}`,
        title: 'New Member Added',
        message: `${member.name} has been added as a family member (${member.relation}).`,
        date: new Date().toISOString().split('T')[0],
        read: false,
        type: 'member'
      },
      ...prev
    ]);
  };

  const uploadReport = (report: Omit<MedicalReport, 'id'>) => {
    const id = `r${Date.now()}`;
    const newReport: MedicalReport = { ...report, id };
    setReports(prev => [newReport, ...prev]);

    // Automatically append to Timeline
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
    setTimelineEvents(prev => [newTimeline, ...prev]);

    // Trigger Notification
    setNotifications(prev => [
      {
        id: `n${Date.now()}`,
        title: 'OCR Parsing Complete',
        message: `Successfully processed "${report.title}" for ${members.find(m => m.id === report.memberId)?.name || 'member'}.`,
        date: new Date().toISOString().split('T')[0],
        read: false,
        type: 'upload'
      },
      ...prev
    ]);
  };

  const toggleMedication = (reminderId: string, time: 'Morning' | 'Afternoon' | 'Night') => {
    const dateKey = new Date().toISOString().split('T')[0];
    setMedicationReminders(prev =>
      prev.map(rem => {
        if (rem.id === reminderId) {
          const currentTaken = rem.taken[dateKey] || {};
          const isTaken = !!currentTaken[time];
          return {
            ...rem,
            taken: {
              ...rem.taken,
              [dateKey]: {
                ...currentTaken,
                [time]: !isTaken
              }
            }
          };
        }
        return rem;
      })
    );
  };

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const id = `a${Date.now()}`;
    const newAppointment: Appointment = { ...appointment, id, status: 'Upcoming' };
    setAppointments(prev => [...prev, newAppointment]);

    // Add notification
    setNotifications(prev => [
      {
        id: `n${Date.now()}`,
        title: 'Appointment Scheduled',
        message: `Appointment scheduled for ${members.find(m => m.id === appointment.memberId)?.name} with ${appointment.doctor}.`,
        date: new Date().toISOString().split('T')[0],
        read: false,
        type: 'appointment'
      },
      ...prev
    ]);
  };

  const askAI = (text: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `c_u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: timeStr
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Simulate AI response
    setTimeout(() => {
      let reply = '';
      let clinicalCards: ChatMessage['clinicalCards'] = undefined;

      const normText = text.toLowerCase();

      // Check member name mentioned
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

      const assistantMsg: ChatMessage = {
        id: `c_a_${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        clinicalCards
      };

      setChatMessages(prev => [...prev, assistantMsg]);
    }, 1200);
  };

  const clearChat = () => {
    setChatMessages([defaultChatHistory[0]]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <FamilyStateContext.Provider
      value={{
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
