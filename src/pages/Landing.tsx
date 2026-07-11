import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ShieldCheck, Heart, Search, FileText, 
  Smartphone, Zap, ChevronDown, MessageSquare, 
  ArrowRight, Users, UserPlus, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300"
  >
    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-2 text-slate-850 dark:text-slate-100">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const BenefitRow = ({ number, title, description }: { number: string, title: string, description: string }) => (
  <div className="flex gap-4 items-start py-4 border-b border-slate-100 dark:border-slate-800/80">
    <span className="text-emerald-500 font-extrabold text-lg mt-0.5">{number}</span>
    <div>
      <h4 className="font-bold text-slate-800 dark:text-white mb-1">{title}</h4>
      <p className="text-slate-550 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 dark:border-slate-800">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-5 text-left font-semibold text-slate-800 dark:text-white"
      >
        <span>{question}</span>
        <ChevronDown size={18} className={`text-slate-450 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Landing: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { title: 'Upload Files', desc: 'Drag prescriptions, scans, or lab reports. Supporting PDF, JPG, and PNG.' },
    { title: 'AI Extraction', desc: 'Our clinical OCR agent converts text, values, and drugs into a structured memory.' },
    { title: 'RAG Ingestion', desc: 'Secure indexing inside your private, family-isolated vector workspace.' },
    { title: 'Ask Anything', desc: 'Retrieve summaries, allergy profiles, or schedules instantly via chat or voice.' }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
      
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <span className="font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">HealthConcierge</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold hover:text-emerald-500 transition-colors">Sign In</Link>
          <Link to="/register" className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md shadow-emerald-500/10 hover:shadow-lg transition-all">Get Started</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-full text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-6">
            <Sparkles size={14} />
            <span>Introducing Agentic Medical Memory</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white mb-6">
            Your Family's <br />
            <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
              AI Health Concierge
            </span>
          </h1>
          <p className="text-slate-550 dark:text-slate-400 text-lg leading-relaxed mb-8 max-w-xl">
            A secure AI-powered dashboard that parses prescriptions, creates interactive medical timelines, and answers critical health history questions in emergencies. One login for the whole family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 text-center flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-all">
              <span>Get Started</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold px-8 py-4 rounded-2xl text-center flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-all">
              <Play size={16} className="fill-current text-slate-500" />
              <span>View Demo</span>
            </Link>
          </div>
        </div>

        {/* Modern Medical Illustration via SVG */}
        <div className="relative flex justify-center items-center">
          <div className="absolute w-[350px] h-[350px] rounded-full bg-emerald-400/20 dark:bg-emerald-500/5 blur-[80px]" />
          <motion.div 
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="w-full max-w-[460px] bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/50 dark:border-slate-800 shadow-2xl relative z-10"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">R</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">Robert Doe</h4>
                  <p className="text-[10px] text-slate-400">Father, Active Patient</p>
                </div>
              </div>
              <span className="bg-red-500/10 text-red-500 text-[10px] px-2 py-0.5 rounded-full font-bold">A+ Blood Group</span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-850">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-450 dark:text-slate-400 font-medium">Chronic Diseases</span>
                  <ShieldCheck size={14} className="text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Essential Hypertension</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-850">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-450 dark:text-slate-400 font-medium">Active Prescriptions</span>
                  <Heart size={14} className="text-rose-500" />
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Lisinopril 10mg <span className="text-xs text-slate-450 font-normal">once daily</span></p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">Atorvastatin 20mg <span className="text-xs text-slate-450 font-normal">at night</span></p>
              </div>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex gap-3">
                <Sparkles className="text-emerald-500 flex-shrink-0" size={18} />
                <div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">AI Clinical Analysis</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">Elevated cholesterol values identified on 2025 Annual Blood Work. Lisinopril adherence monitored.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-slate-100/50 dark:bg-slate-900/20 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Equipped with Specialized Clinical Agents
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Our framework uses isolated agent modules to read records, track trends, and provide context during clinical visits.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Search} 
              title="Semantic Medical Search" 
              description="Ask questions in plain English. The retrieval agent indexes your timeline and retrieves documents using RAG pipeline." 
            />
            <FeatureCard 
              icon={FileText} 
              title="Agentic OCR Parser" 
              description="Upload scans and PDFs. The Document Processing Agent extracts diagnostics, doctors, dosages, and test results into structured schemas." 
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Privacy-Isolated Architecture" 
              description="Each family profile is strictly isolated. All records are securely indexed under localized workspace permission controls." 
            />
            <FeatureCard 
              icon={Smartphone} 
              title="Mobile Care Companion" 
              description="Fully responsive design optimized for tablet, desktop, and mobile. Quickly check alerts, pill counters, and active schedules on-the-go." 
            />
            <FeatureCard 
              icon={Heart} 
              title="Emergency Clinician Card" 
              description="A single-click clinical dashboard containing blood group, drug allergies, diagnoses, and current medications, ready for EMT personnel." 
            />
            <FeatureCard 
              icon={Zap} 
              title="Medication & Vax Trackers" 
              description="Never miss doses or booster cycles. The Scheduler Agent monitors vaccination schedules and logs daily medication check-offs." 
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            How The Concierge Engine Works
          </h2>
          <p className="text-slate-550 dark:text-slate-400">
            From raw paper reports to an interactive, searchable knowledge base.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              onMouseEnter={() => setActiveStep(idx)}
              className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${
                activeStep === idx 
                  ? 'bg-white dark:bg-slate-900 border-emerald-500/30 shadow-lg' 
                  : 'bg-transparent border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 font-bold flex items-center justify-center mb-4">
                {idx + 1}
              </div>
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 bg-slate-100/50 dark:bg-slate-900/20 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
              A Unified Medical Dashboard Designed for Families
            </h2>
            <p className="text-slate-550 dark:text-slate-400 mb-8 leading-relaxed">
              Managing health reports across multiple portals is exhausting. HealthConcierge brings the entire family's active history together, creating a unified clinical profile that goes anywhere you do.
            </p>
            <div className="flex flex-col">
              <BenefitRow 
                number="01" 
                title="Single Portal for All Members" 
                description="Manage profiles for parents, children, and elderly relatives under one login. Switch active views globally." 
              />
              <BenefitRow 
                number="02" 
                title="Instant Emergency Extraction" 
                description="Retrieve medication history, surgeries, and drug allergies in under 10 seconds during critical clinical visits." 
              />
              <BenefitRow 
                number="03" 
                title="Historical Trend Monitoring" 
                description="Monitor lab values like HbA1c, cholesterol, and blood pressure with graphical trend tracking." 
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/50 dark:border-slate-850 shadow-xl">
            <h3 className="font-extrabold text-xl text-slate-850 dark:text-white mb-4">RAG Query Evaluation</h3>
            <div className="space-y-4">
              <div className="flex justify-end">
                <div className="bg-emerald-500 text-white rounded-2xl rounded-tr-none px-4 py-2 text-sm max-w-[80%] shadow-sm">
                  What medicines did Margaret start after her surgery in 2018?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl rounded-tl-none px-4 py-3 text-sm max-w-[85%]">
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 text-xs mb-1">HealthConcierge AI</p>
                  <p className="text-xs leading-normal">Based on Margaret Smith's timeline history: Following her **Left Knee Surgery** on June 15, 2018, she was prescribed Metformin 500mg twice daily in 2020 following diabetes diagnostics. Her current pain profile for knee arthritis is managed without narcotics.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Loved by Caregivers and Families
          </h2>
          <p className="text-slate-550 dark:text-slate-400">
            Real stories from families who use our concierge assistant.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl">
            <p className="text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed mb-6">
              "Being able to pull up my elderly mother's complete medication schedule and drug allergies during an emergency room visit was an absolute lifesaver. The doctors knew exactly what they were working with."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">Marcus Vance</h4>
                <p className="text-xs text-slate-450">Family Caregiver</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl">
            <p className="text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed mb-6">
              "With two children with food allergies and asthma, keeping track of doctor appointments, immunizations, and prescription refills was chaotic. HealthConcierge keeps everything in one searchable place."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">Elena Rostova</h4>
                <p className="text-xs text-slate-450">Parent of two</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl">
            <p className="text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed mb-6">
              "As a diabetic, my lab reports were spread across three clinic systems. The OCR parsed my historical glucose charts instantly, and now I can view my trend analysis lines on a single clean page."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">Thomas Wright</h4>
                <p className="text-xs text-slate-450">Health Enthusiast</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-slate-100/50 dark:bg-slate-900/20 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Clear answers regarding privacy, data security, and medical guidelines.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-[32px] p-6 sm:p-8 shadow-sm">
            <FAQItem 
              question="Does the AI diagnose diseases or prescribe medications?" 
              answer="No. HealthConcierge is strictly an organizational assistant. It parses, indexes, and retrieves your family's actual clinical documents. It does not provide medical diagnoses, clinical guidance, or therapeutic prescriptions." 
            />
            <FAQItem 
              question="How secure are our family medical records?" 
              answer="Data security is our primary focus. All profiles are isolated using strict namespace controls, and records are encrypted at rest and in transit. Your details are never used to train public LLM weights." 
            />
            <FAQItem 
              question="What file types can I upload to the platform?" 
              answer="You can upload PDFs, JPGs, and PNGs. Our clinical OCR parser processes standard blood reports, physician logs, immunization charts, and prescription forms." 
            />
            <FAQItem 
              question="Can I download or share emergency summaries?" 
              answer="Yes. The Emergency Summary provides a printable clinical layout and features a one-click export option suitable for sending directly to healthcare professionals." 
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
              <Sparkles size={16} />
            </div>
            <span className="font-extrabold text-slate-800 dark:text-white">HealthConcierge</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Contact Support</a>
          </div>
          <p className="text-xs text-slate-400">
            &copy; 2026 Family Health Concierge AI. Built for secure clinical coordination.
          </p>
        </div>
      </footer>

    </div>
  );
};
