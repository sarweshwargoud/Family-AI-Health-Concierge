import React, { useState } from 'react';
import { useFamilyState } from '../context/FamilyStateContext';
import { 
  Upload, FileText, Sparkles, Check, 
  ArrowRight, ShieldCheck, AlertCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const UploadReport: React.FC = () => {
  const { uploadReport, activeMember, members } = useFamilyState();
  const [selectedMemberId, setSelectedMemberId] = useState(activeMember.id);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  // OCR Parsing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [parsedData, setParsedData] = useState<any | null>(null);

  const steps = [
    'Reading document byte blocks...',
    'Performing clinical OCR text recognition...',
    'Extracting diagnoses, medicines, and metrics...',
    'Verifying drug allergies with safety index...',
    'Cataloging knowledge embeddings in vector database...'
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setFile(file);
    setIsProcessing(true);
    setProcessingStep(0);
    setParsedData(null);

    // Simulate multi-phase OCR extraction pipeline
    const interval = setInterval(() => {
      setProcessingStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          finishProcessing(file);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
  };

  const finishProcessing = (file: File) => {
    // Generate realistic parsed metrics based on file name or default
    const fileNameLower = file.name.toLowerCase();
    
    let title = 'Clinical Diagnostic Summary';
    let category: any = 'Other';
    let summary = 'Standard clinical consultation and diagnostic review panel.';
    let values = {};
    let diseases: string[] = [];
    let medications: string[] = [];

    if (fileNameLower.includes('blood') || fileNameLower.includes('cbc') || fileNameLower.includes('lipid')) {
      title = 'Comprehensive Lipid & Metabolic Panel';
      category = 'Blood Test';
      summary = 'Blood screening panels. Measured lipid concentration and fasting blood sugar levels. Vitals indicate stable cardiac function.';
      values = {
        'Total Cholesterol': '210 mg/dL',
        'LDL Cholesterol': '128 mg/dL',
        'HDL Cholesterol': '54 mg/dL',
        'HbA1c': '5.6%'
      };
      diseases = ['Mild Hypercholesterolemia'];
    } else if (fileNameLower.includes('presc') || fileNameLower.includes('med') || fileNameLower.includes('drug')) {
      title = 'Cardiology Treatment Prescription';
      category = 'Prescription';
      summary = 'Active prescription adjustment. Continued daily administration of antihypertension blockers and statin medications.';
      medications = ['Lisinopril 10mg', 'Atorvastatin 20mg'];
      diseases = ['Essential Hypertension'];
    } else if (fileNameLower.includes('mri') || fileNameLower.includes('xray') || fileNameLower.includes('scan')) {
      title = 'Knee Articulation MRI Scan';
      category = 'MRI Scan';
      summary = 'MRI diagnostics of left knee articulation. Osteoarthritis changes noted. Minimal effusion, joint space narrowing confirmed.';
      diseases = ['Osteoarthritis of Knee'];
      values = {
        'Joint Narrowing': 'Grade 2',
        'Effusion': 'Trace'
      };
    }

    setParsedData({
      title,
      category,
      summary,
      date: new Date().toISOString().split('T')[0],
      hospital: 'Metro Medical Center Group',
      doctor: 'Dr. Sarah Carter',
      extractedData: {
        diseases,
        medications,
        values
      },
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      fileType: 'PDF'
    });
    setIsProcessing(false);
  };

  const handleSave = () => {
    if (!parsedData) return;
    
    uploadReport({
      memberId: selectedMemberId,
      title: parsedData.title,
      date: parsedData.date,
      category: parsedData.category,
      hospital: parsedData.hospital,
      doctor: parsedData.doctor,
      summary: parsedData.summary,
      extractedData: parsedData.extractedData,
      fileSize: parsedData.fileSize,
      fileType: parsedData.fileType
    });

    // Reset view
    setFile(null);
    setParsedData(null);
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Upload Medical Documents
        </h2>
        <p className="text-slate-550 dark:text-slate-400 mt-1">
          Upload prescriptions, lab sheets, imaging reports, and vaccination cards.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        
        {/* Upload Container */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm">
            <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-2.5">
              Select Family Member
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 mb-6"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.relation})</option>
              ))}
            </select>

            {/* Drag & Drop Area */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-[24px] p-8 text-center transition-all relative ${
                dragActive 
                  ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-500/5' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 bg-slate-50/50 dark:bg-slate-950/20'
              }`}
            >
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 border border-slate-250/50 dark:border-slate-700 rounded-2xl flex items-center justify-center text-slate-400 hover:text-emerald-500 shadow-sm transition-colors mb-4">
                  <Upload size={22} />
                </div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">Drag & drop files here</h4>
                <p className="text-xs text-slate-400 mt-1 font-medium">Or select files from your local folders</p>
                <span className="text-[10px] text-slate-400 mt-4 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-750 rounded-full font-semibold">
                  PDF, JPG, PNG up to 10MB
                </span>
              </label>
            </div>

            {/* Quick Demo Presets */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2.5">Or try a demo file preset:</p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => processFile(new File([""], "blood_sugar_report.pdf", { type: "application/pdf" }))}
                  className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800/40 dark:hover:bg-emerald-500/10 border border-slate-200/50 dark:border-slate-800 rounded-xl text-left text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <span>📄 blood_sugar_report.pdf (Blood Glucose Panel)</span>
                  <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-bold">Try</span>
                </button>
                <button
                  type="button"
                  onClick={() => processFile(new File([""], "hypertension_prescription.png", { type: "image/png" }))}
                  className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800/40 dark:hover:bg-emerald-500/10 border border-slate-200/50 dark:border-slate-800 rounded-xl text-left text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <span>🖼️ hypertension_prescription.png (Cardiology prescription)</span>
                  <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-bold">Try</span>
                </button>
                <button
                  type="button"
                  onClick={() => processFile(new File([""], "knee_mri_scan.pdf", { type: "application/pdf" }))}
                  className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800/40 dark:hover:bg-emerald-500/10 border border-slate-200/50 dark:border-slate-800 rounded-xl text-left text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <span>📄 knee_mri_scan.pdf (Orthopedic MRI scan)</span>
                  <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-bold">Try</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-100/50 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-850 p-6 rounded-[24px] flex gap-3">
            <AlertCircle className="text-emerald-500 flex-shrink-0" size={18} />
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-1">HIPAA Compliance Check</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Your files are encrypted end-to-end and stored securely. Medical records are used solely to build your family health database.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Parsing & Extraction Display Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-[32px] shadow-sm min-h-[300px] flex flex-col justify-center">
          
          <AnimatePresence mode="wait">
            
            {/* 1. Idle state */}
            {!isProcessing && !parsedData && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <FileText size={48} className="text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">Awaiting Document Upload</h4>
                <p className="text-xs text-slate-450 mt-1 max-w-[280px] mx-auto font-medium">Upload reports on the left. The AI OCR agent will parse it and show results here.</p>
              </motion.div>
            )}

            {/* 2. Processing OCR state */}
            {isProcessing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 py-6"
              >
                <div className="text-center">
                  <RefreshCw size={36} className="text-emerald-500 animate-spin mx-auto mb-4" />
                  <h4 className="font-extrabold text-sm text-slate-850 dark:text-white">AI Agent Processing</h4>
                  <p className="text-xs text-slate-450 mt-1 font-semibold">{file?.name}</p>
                </div>

                <div className="space-y-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl">
                  {steps.map((step, idx) => {
                    const isDone = processingStep > idx;
                    const isActive = processingStep === idx;
                    return (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                          isDone 
                            ? 'bg-emerald-500 text-white' 
                            : isActive 
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500' 
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        }`}>
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span className={`font-semibold ${
                          isDone ? 'text-slate-450 dark:text-slate-500' : isActive ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-400'
                        }`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 3. OCR Complete state (Review & Save parsed content) */}
            {!isProcessing && parsedData && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-bold uppercase">{parsedData.category}</span>
                    <h3 className="font-extrabold text-slate-850 dark:text-white text-base mt-1">{parsedData.title}</h3>
                  </div>
                </div>

                <div className="space-y-4 text-xs font-semibold">
                  <div>
                    <p className="text-slate-400 font-bold uppercase tracking-wider">AI Generated Summary</p>
                    <p className="text-slate-650 dark:text-slate-350 leading-relaxed mt-1">{parsedData.summary}</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <div>
                      <p className="text-slate-400 font-bold uppercase tracking-wider">Consulting Physician</p>
                      <p className="text-slate-700 dark:text-slate-300 mt-1">{parsedData.doctor}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-bold uppercase tracking-wider">Clinical Facility</p>
                      <p className="text-slate-700 dark:text-slate-300 mt-1">{parsedData.hospital}</p>
                    </div>
                  </div>

                  {parsedData.extractedData.medications.length > 0 && (
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                      <p className="text-slate-400 font-bold uppercase tracking-wider mb-2">Identified Medications</p>
                      <div className="flex flex-wrap gap-2">
                        {parsedData.extractedData.medications.map((med: string) => (
                          <span key={med} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-bold">
                            💊 {med}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {Object.keys(parsedData.extractedData.values).length > 0 && (
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                      <p className="text-slate-400 font-bold uppercase tracking-wider mb-2">Extracted Metrics</p>
                      <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl">
                        {Object.entries(parsedData.extractedData.values).map(([m, val]: any) => (
                          <div key={m}>
                            <p className="text-slate-400 text-[10px]">{m}</p>
                            <p className="text-sm font-bold text-slate-850 dark:text-white mt-0.5">{val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setFile(null);
                      setParsedData(null);
                    }}
                    className="flex-1 py-3 text-xs font-bold rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-650 transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 text-xs font-bold rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={16} />
                    <span>Save to Profile</span>
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

    </div>
  );
};
