# Family Health Concierge AI
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/sarweshwargoud/Family-AI-Health-Concierge)

A premium, modern, responsive healthcare SaaS web application called **Family Health Concierge AI**. It securely organizes, indexes, retrieves, and summarizes medical records for an entire family under a single, unified account.

---

## 🏛️ Target System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                      React 19 Frontend                      │
│                                                             │
│  UI / Dashboards / Chat / Upload Form / Emergency Card      │
│  State Management (FamilyStateContext)                      │
└───────────────┬───────────────────────────────┬─────────────┘
                │ Direct Supabase (Auth & DB)   │ REST API Calls
                │                               │ (Authorization: Bearer JWT)
                ↓                               ↓
┌───────────────────────────────┐     ┌───────────────────────────────────────────────────────────┐
│     Supabase Auth & DB        │     │                    Python FastAPI Backend                 │
│                               │     │                                                           │
│  • Google OAuth / JWT Auth    │     │  ├── api/                                                 │
│  • PostgreSQL Tables (RLS)    │     │  │   ├── ai_chat.py       (POST /api/ai/chat)             │
│  • Storage: medical-documents │     │  │   ├── documents.py     (POST /api/documents/process)   │
└───────────────────────────────┘     │  │   ├── emergency.py     (POST /api/ai/emergency-summary)│
                                      │  │   └── health.py        (GET  /api/health)              │
                                      │  │                                                        │
                                      │  ├── ai/                                                  │
                                      │  │   ├── orchestrator.py  (Multi-Agent Coordinator)       │
                                      │  │   ├── gemini/client.py (Google GenAI 2.5/1.5 API)      │
                                      │  │   ├── rag/             (Chunking, Embeddings, Search)  │
                                      │  │   ├── document_proc/   (PDF/Image OCR & Entity Parser) │
                                      │  │   └── agents/          (Concierge, Emergency, Timeline)│
                                      │  │                                                        │
                                      │  └── services/                                            │
                                      │      ├── auth_service.py  (Supabase JWT Verification)     │
                                      │      └── record_service.py(Clinical Context Grounding)    │
                                      └───────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features

* **Python AI & RAG Engine**: Multi-turn conversational retrieval grounded strictly in verified patient files via Gemini and vector search.
* **Document OCR Processor**: Real PDF & image OCR text recognition and structured clinical JSON extraction (diagnoses, lab values, prescriptions).
* **Emergency Clinician Summary**: Instant high-contrast, print-ready emergency cards and shareable formats for EMT staff.
* **Multi-Member Family Profiles**: Dynamic family profile management with individual medical records.
* **Interactive Timeline**: Chronological feed of medical events, hospital visits, and procedures.
* **Medication & Appointment Planners**: Daily dosage adherence checkoffs and doctor visit scheduler.
* **Strict Security & RLS**: All PostgreSQL tables protected by Row-Level Security (`auth.uid() = user_id`) and secrets maintained exclusively on the backend.

---

## 🛠️ Technology Stack

* **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS, Framer Motion, Lucide React
* **AI / Backend**: Python 3.10+, FastAPI, Uvicorn, Google GenAI SDK (`google-genai`), PyPDF, PDFPlumber, Pillow, NumPy
* **Database & Auth**: Supabase PostgreSQL, Google OAuth, Supabase Storage (`medical-documents`)

---

## 📂 Project Structure

```text
Family Health Concierge AI/
├── backend/                       # Python AI/ML & FastAPI Backend
│   ├── ai/
│   │   ├── agents/                # Concierge, Emergency, Timeline agents
│   │   ├── document_processing/   # OCR & Structured Entity Extractor
│   │   ├── gemini/                # Google GenAI client wrapper
│   │   └── rag/                   # Chunking, Embeddings, Vector Store
│   ├── api/                       # API routes (/ai/chat, /documents/process, /ai/emergency-summary, /health)
│   ├── services/                  # Supabase JWT Auth & validation
│   ├── config.py                  # Pydantic settings & environment configuration
│   ├── main.py                    # FastAPI application entry point
│   └── requirements.txt           # Python dependencies
├── src/                           # React 19 Frontend
│   ├── context/                   # FamilyStateContext (state sync & API calls)
│   ├── layouts/                   # DashboardLayout Shell
│   ├── pages/                     # Dashboard, AIChat, UploadReport, EmergencySummary, FamilyManagement, etc.
│   ├── utils/
│   │   ├── api.ts                 # Python FastAPI client connector
│   │   └── supabase/              # Supabase auth and database client
│   ├── App.tsx                    # Route definitions
│   └── index.css                  # Tailwind styles
├── supabase/
│   └── schema.sql                 # PostgreSQL DDL, triggers, and RLS policies
└── package.json
```

---

## 💻 How To Run Locally

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (version 18+ recommended)
* [Python](https://www.python.org/) (version 3.10+)

---

### 2. Start Python AI Backend (FastAPI)

1. Navigate to the project root and create a Python virtual environment:
   ```bash
   python -m venv backend/.venv
   ```

2. Activate the virtual environment:
   - **Windows**: `.\backend\.venv\Scripts\activate`
   - **Linux/macOS**: `source backend/.venv/bin/activate`

3. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

4. Configure your `.env` in `backend/.env` (optional: add your `GEMINI_API_KEY` for live generative responses):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   SUPABASE_URL=https://losngojpoqiunigkqumq.supabase.co
   SUPABASE_ANON_KEY=sb_publishable_fm2uzzPc-n_JvNC17Kj3-A_nfIefowX
   ```

5. Launch the FastAPI server:
   ```bash
   uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   * **API Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
   * **Health Endpoint**: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

---

### 3. Start React Frontend (Vite)

In a separate terminal window:

1. Install frontend dependencies:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   * **Frontend UI**: [http://localhost:5173/](http://localhost:5173/) (or `http://localhost:5174/`)

---

### 4. Build for Production

* **Frontend Bundle**:
  ```bash
  npm run build
  ```
