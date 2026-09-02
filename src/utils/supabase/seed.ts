import { supabase } from './client';

// Initial Mock Data from context
const initialMembers = [
  {
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

const initialReports = [
  {
    mockMemberIndex: 0, // Maps to 'Eshwaraiah Buddolla'
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
    mockMemberIndex: 1, // Maps to 'Suvarna Buddolla'
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
    mockMemberIndex: 3, // Maps to 'Sarweshwar Buddolla'
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

const initialTimeline = [
  {
    mockMemberIndex: 0,
    date: '2021-04-12',
    year: '2021',
    title: 'Hypertension Diagnosis',
    type: 'diagnosis',
    description: 'Diagnosed with Primary Essential Hypertension after multiple high readings. Prescribed Lisinopril 10mg daily.',
    icon: 'activity'
  },
  {
    mockMemberIndex: 0,
    date: '2024-03-10',
    year: '2024',
    title: 'High Cholesterol Diagnosed',
    type: 'diagnosis',
    description: 'Routine blood screening showed elevated LDL cholesterol (145 mg/dL). Started Atorvastatin 20mg daily.',
    icon: 'heart'
  },
  {
    mockMemberIndex: 1,
    date: '2018-06-15',
    year: '2018',
    title: 'Total Left Knee Replacement',
    type: 'surgery',
    description: 'Performed at Metro Orthopedic Center by Dr. Keith Thomas. Uncomplicated recovery with 8 weeks of physical therapy.',
    icon: 'wrench'
  },
  {
    mockMemberIndex: 1,
    date: '2020-11-20',
    year: '2020',
    title: 'Type 2 Diabetes Diagnosed',
    type: 'diagnosis',
    description: 'Diagnosed following standard glucose tolerance test. Initial HbA1c was 8.2%. Prescribed Metformin 500mg twice daily and active exercise plan.',
    icon: 'activity'
  },
  {
    mockMemberIndex: 3,
    date: '2022-09-08',
    year: '2022',
    title: 'Asthma Diagnosis',
    type: 'diagnosis',
    description: 'Diagnosed following acute bronchial spasm event triggered by seasonal dander. Prescribed Albuterol rescue inhaler and Fluticasone control.',
    icon: 'wind'
  }
];

const initialReminders = [
  {
    mockMemberIndex: 0,
    medicine: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    timing: ['Morning'],
    taken: {}
  },
  {
    mockMemberIndex: 0,
    medicine: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily at night',
    timing: ['Night'],
    taken: {}
  },
  {
    mockMemberIndex: 1,
    medicine: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    timing: ['Morning', 'Night'],
    taken: {}
  },
  {
    mockMemberIndex: 1,
    medicine: 'Glipizide',
    dosage: '5mg',
    frequency: 'Once daily',
    timing: ['Morning'],
    taken: {}
  },
  {
    mockMemberIndex: 3,
    medicine: 'Fluticasone',
    dosage: '1 puff',
    frequency: 'Once daily',
    timing: ['Morning'],
    taken: {}
  }
];

const initialAppointments = [
  {
    mockMemberIndex: 0,
    doctor: 'Dr. Evelyn Martinez',
    specialty: 'Primary Care Physician',
    hospital: 'Metro Family Medicine Group',
    date: '2026-07-20',
    time: '10:00 AM',
    notes: 'Annual routine physical checkup, review blood pressure readings and refill prescription.',
    status: 'Upcoming'
  },
  {
    mockMemberIndex: 1,
    doctor: 'Dr. Alan Vance',
    specialty: 'Endocrinologist',
    hospital: 'Metro Endocrine Specialty Clinic',
    date: '2026-08-15',
    time: '02:30 PM',
    notes: 'Three-month diabetes follow-up. Please bring fasting glucose logs and recent lab panels.',
    status: 'Upcoming'
  },
  {
    mockMemberIndex: 3,
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
    title: 'Upcoming Appointment',
    message: 'Sarweshwar has an appointment with Dr. Sandra Reynolds on July 12th.',
    date: '2026-07-05',
    read: false,
    type: 'appointment'
  },
  {
    title: 'Medication Due',
    message: 'Morning medicines are ready for Suvarna Buddolla (Metformin, Glipizide).',
    date: '2026-07-05',
    read: false,
    type: 'medication'
  },
  {
    title: 'Document Extracted',
    message: 'Annual Blood Work Panel for Eshwaraiah Buddolla successfully processed via AI OCR.',
    date: '2026-07-04',
    read: true,
    type: 'upload'
  }
];

const defaultChatHistory = [
  {
    sender: 'assistant',
    text: 'Hello! I am your Family Health Concierge AI. I have cataloged health profiles and medical histories for Eshwaraiah, Suvarna, Gayathri, Sarweshwar, and Bhuvaneshwari.\n\nHow can I help you today? You can query active medications, chronic conditions, allergy profiles, or prepare an Emergency Summary.',
    timestamp: '9:45 AM',
    attachments: [],
    clinical_cards: []
  }
];

/**
 * Checks if the user's family_members table is empty and seeds initial data if needed.
 * Returns true if seeding occurred, false if data already existed.
 */
export const checkAndSeedUserData = async (userId: string): Promise<boolean> => {
  try {
    // 1. Check if user already has family members
    const { data: existingMembers, error: checkError } = await supabase
      .from('family_members')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (checkError) {
      console.error('Error checking user family members:', checkError);
      return false;
    }

    if (existingMembers && existingMembers.length > 0) {
      // User already has data in the tables, do not re-seed
      return false;
    }

    console.log('Seeding initial mock data to Supabase for user:', userId);

    // 2. Seed family members
    const membersToInsert = initialMembers.map(m => ({
      user_id: userId,
      name: m.name,
      relation: m.relation,
      age: m.age,
      dob: m.dob,
      gender: m.gender,
      blood_group: m.bloodGroup,
      insurance_provider: m.insuranceProvider,
      insurance_id: m.insuranceId,
      allergies: m.allergies,
      chronic_diseases: m.chronicDiseases,
      current_medications: m.currentMedications,
      height: m.height,
      weight: m.weight,
      avatar: m.avatar,
      emergency_contact: m.emergencyContact,
      vaccinations: m.vaccinations
    }));

    const { data: insertedMembers, error: membersError } = await supabase
      .from('family_members')
      .insert(membersToInsert)
      .select('id, name');

    if (membersError || !insertedMembers) {
      throw membersError || new Error('Failed to retrieve inserted members');
    }

    // Create mapping from initialMembers index to inserted UUID
    const idMap: { [index: number]: string } = {};
    insertedMembers.forEach(inserted => {
      const originalIndex = initialMembers.findIndex(m => m.name === inserted.name);
      if (originalIndex !== -1) {
        idMap[originalIndex] = inserted.id;
      }
    });

    // Helper to get mapped member ID
    const getMemberId = (mockIndex: number): string | null => {
      return idMap[mockIndex] || null;
    };

    // 3. Seed medical reports
    const reportsToInsert: any[] = [];
    for (const r of initialReports) {
      const memberId = getMemberId(r.mockMemberIndex);
      if (memberId) {
        reportsToInsert.push({
          user_id: userId,
          member_id: memberId,
          title: r.title,
          date: r.date,
          category: r.category,
          hospital: r.hospital,
          doctor: r.doctor,
          summary: r.summary,
          extracted_data: r.extractedData,
          file_size: r.fileSize,
          file_type: r.fileType
        });
      }
    }

    if (reportsToInsert.length > 0) {
      await supabase.from('medical_reports').insert(reportsToInsert);
    }

    // 4. Seed timeline events
    const timelineToInsert: any[] = [];
    for (const t of initialTimeline) {
      const memberId = getMemberId(t.mockMemberIndex);
      if (memberId) {
        timelineToInsert.push({
          user_id: userId,
          member_id: memberId,
          date: t.date,
          year: t.year,
          title: t.title,
          type: t.type,
          description: t.description,
          icon: t.icon
        });
      }
    }

    if (timelineToInsert.length > 0) {
      await supabase.from('timeline_events').insert(timelineToInsert);
    }

    // 5. Seed medication reminders
    const remindersToInsert: any[] = [];
    for (const rem of initialReminders) {
      const memberId = getMemberId(rem.mockMemberIndex);
      if (memberId) {
        remindersToInsert.push({
          user_id: userId,
          member_id: memberId,
          medicine: rem.medicine,
          dosage: rem.dosage,
          frequency: rem.frequency,
          timing: rem.timing,
          taken: rem.taken
        });
      }
    }

    if (remindersToInsert.length > 0) {
      await supabase.from('medication_reminders').insert(remindersToInsert);
    }

    // 6. Seed appointments
    const appointmentsToInsert: any[] = [];
    for (const a of initialAppointments) {
      const memberId = getMemberId(a.mockMemberIndex);
      if (memberId) {
        appointmentsToInsert.push({
          user_id: userId,
          member_id: memberId,
          doctor: a.doctor,
          specialty: a.specialty,
          hospital: a.hospital,
          date: a.date,
          time: a.time,
          notes: a.notes,
          status: a.status
        });
      }
    }

    if (appointmentsToInsert.length > 0) {
      await supabase.from('appointments').insert(appointmentsToInsert);
    }

    // 7. Seed notifications
    const notificationsToInsert = initialNotifications.map(n => ({
      user_id: userId,
      title: n.title,
      message: n.message,
      date: n.date,
      read: n.read,
      type: n.type
    }));

    await supabase.from('notifications').insert(notificationsToInsert);

    // 8. Seed chat messages
    const chatToInsert = defaultChatHistory.map(c => ({
      user_id: userId,
      sender: c.sender,
      text: c.text,
      timestamp: c.timestamp,
      attachments: c.attachments,
      clinical_cards: c.clinical_cards
    }));

    await supabase.from('chat_messages').insert(chatToInsert);

    console.log('Successfully completed seeding user data!');
    return true;
  } catch (err) {
    console.error('Error seeding user database data:', err);
    return false;
  }
};
