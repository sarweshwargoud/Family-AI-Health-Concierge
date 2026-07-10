# Family Health Concierge AI

A premium, modern, responsive healthcare SaaS web application prototype called **Family Health Concierge AI**. It securely organizes, indexes, retrieves, and summarizes medical records for an entire family under a single, unified account.
.
---


## 🌟 Product Vision

Medical records are fragmented across hospitals, lab reports, and physical paper prescriptions. During emergencies or routine consults, patient history is often forgotten or slow to find. 

**Family Health Concierge AI** resolves this fragmentation by building a long-term, searchable clinical memory workspace for each family member. 

---

## 🚀 Key Features


* **Multi-Member Family Profiles**: Easily toggle the active view between Father, Mother, Daughter, Son, and Grandmother.
* **Semantic Retrieval AI**: A ChatGPT-style dialog window to query allergies, surgeries, and drug history in plain English.
* **Document OCR Processor**: Upload scans or blood panels to simulate metadata extraction (tests, doctors, diagnoses, and meds).
* **Emergency Clinician summary**: A high-priority, print-ready page displaying critical clinical indicators (blood group, drug allergy warning triggers, active pills) for EMT staff.
* **Interactive Timeline**: A vertical chronological feed of diagnoses and procedures with filters.
* **Medication & Appointment Planners**: Active checkoffs for dose tracking and scheduler logs.
* **Double Mode Appearance**: Premium dark/light themes designed with glassmorphic cards, Outfit/Inter typography, and smooth page transitions.

---

## 🛠️ Technology Stack

* **Core UI**: React, TypeScript, Vite
* **Style System**: Tailwind CSS v3
* **Animations**: Framer Motion
* **Iconography**: Lucide React
* **Data Visualization**: Recharts (BP & Glucose trend charts)

---

## 📂 Project Structure


```
src/
├── context/         # FamilyStateContext (centralized state, OCR simulator, RAG mock responses)
├── layouts/         # DashboardLayout Shell (responsive sidebars, notification logs, global switcher)
├── pages/           # Page modules
│   ├── Landing.tsx             # Marketing Hero, CTA, Features, testimonials, FAQ
│   ├── Login.tsx / Register    # Glassmorphic auth portals
│   ├── Dashboard.tsx           # Home widgets (pill boxes, consultations, micro chat widget)
│   ├── MemberProfile.tsx       # Recharts trend lines, vitals, chronic tags, and booster logs
│   ├── AIChat.tsx              # Assistant ChatGPT-style console with voice recording animation
│   ├── UploadReport.tsx        # Drag & drop OCR status timeline parser
│   ├── EmergencySummary.tsx    # High contrast warning printable clinical card
│   ├── MedicalTimeline.tsx     # Chronological log with filters
│   ├── Appointments.tsx        # Booking schedule checklists
│   ├── MedicationReminders.tsx # Dosage checkoffs, adherence statistics
│   ├── Settings.tsx            # UI toggles, security audit logs
│   └── Notifications.tsx       # Scheduler alarm feed inbox
├── App.tsx          # Client-side react-router routes
└── index.css        # Tailwind layers and glassmorphism utilities
```

---

## 💻 How To Run Locally

Follow these steps to run the application on your system:

### 1. Prerequisite
Ensure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

### 2. Install Project Dependencies
Run this command from the root workspace directory to install all packages:
```bash
npm install
```

### 3. Start Development Server
Launch Vite's hot-reload server locally:
```bash
npm run dev
```

The application will start running. Open your browser and navigate to:
* **Local URL**: `http://localhost:5173/` (or the port specified in terminal output).

### 4. Build for Production
To package static minified bundles (outputs files to the `dist/` directory):
```bash
npm run build
```
