import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useFamilyState } from '../context/FamilyStateContext';
import { 
  Sparkles, Send, Mic, FileUp, Trash2, 
  ArrowRight, Check, Heart, ShieldAlert, 
  RefreshCw, ClipboardList, Info, Volume2, VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AIChat: React.FC = () => {
  const { chatMessages, askAI, clearChat, activeMember } = useFamilyState();
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  // Stop speech synthesis when navigating away
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingMsgId === id) {
        window.speechSynthesis.cancel();
        setSpeakingMsgId(null);
      } else {
        window.speechSynthesis.cancel();
        // Remove markdown tags for cleaner speech
        const cleanedText = text.replace(/[*#`🚨⚠️💊]/g, '').trim();
        const utterance = new SpeechSynthesisUtterance(cleanedText);
        utterance.onend = () => setSpeakingMsgId(null);
        utterance.onerror = () => setSpeakingMsgId(null);
        setSpeakingMsgId(id);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Suggested prompt pills
  const suggestions = [
    `What medications does ${activeMember.name.split(' ')[0]} take?`,
    `Does ${activeMember.name.split(' ')[0]} have any drug allergies?`,
    `Show emergency clinical details for ${activeMember.name.split(' ')[0]}.`,
    `Review historical scan and blood reports.`
  ];

  // Capture search query from location params (e.g. from the search bar redirect)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      handleQuerySend(query);
    }
  }, [location]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleQuerySend = (text: string) => {
    if (!text.trim()) return;
    setIsTyping(true);
    askAI(text);
    
    // Simulate thinking delay to match context typing timeout
    setTimeout(() => {
      setIsTyping(false);
    }, 1100);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleQuerySend(input);
      setInput('');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate speech-to-text response after 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        setInput(`Show ${activeMember.name.split(' ')[0]}'s chronic conditions and medications.`);
      }, 3000);
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm relative">
      
      {/* Sidebar Chat Sessions list (ChatGPT style) */}
      <div className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 p-4">
        <button 
          onClick={clearChat}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors shadow-sm"
        >
          <Trash2 size={14} />
          <span>Clear Active Dialog</span>
        </button>

        <div className="flex-1 mt-6 overflow-y-auto space-y-2">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-2 mb-2">Conversations</p>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-xl border border-emerald-550/10 cursor-pointer">
            ✨ Clinical Retrieval Session
          </div>
          <div className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-xs rounded-xl cursor-pointer">
            Medication adherence logs
          </div>
          <div className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-xs rounded-xl cursor-pointer">
            Blood pressure trends check
          </div>
        </div>

        <div className="p-2 bg-slate-100 dark:bg-slate-850 rounded-xl flex gap-2 items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-slate-400 font-bold uppercase">RAG Engine: Connected</span>
        </div>
      </div>

      {/* Main Chat Dialog Box */}
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900">
        
        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <AnimatePresence initial={false}>
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${isUser ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs border ${
                      isUser 
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-850 dark:text-white border-slate-300' 
                        : 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/10'
                    }`}>
                      {isUser ? 'U' : <Sparkles size={14} />}
                    </div>

                    <div className="space-y-3">
                      <div className={`p-4 rounded-3xl text-sm leading-relaxed relative group ${
                        isUser 
                          ? 'bg-emerald-500 text-white rounded-tr-none shadow-sm' 
                          : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-850 text-slate-800 dark:text-slate-200 rounded-tl-none pr-10'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        
                        {!isUser && (
                          <button
                            onClick={() => speakText(msg.id, msg.text)}
                            className="absolute right-3 bottom-2.5 p-1 text-slate-400 hover:text-emerald-500 dark:text-slate-550 transition-colors"
                            title="Read response aloud"
                          >
                            {speakingMsgId === msg.id ? (
                              <VolumeX size={14} className="text-rose-500 animate-pulse" />
                            ) : (
                              <Volume2 size={14} />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Render Clinical Summary Cards (RAG summaries) */}
                      {!isUser && msg.clinicalCards && (
                        <div className="grid gap-3">
                          {msg.clinicalCards.map((card, cIdx) => (
                            <div 
                              key={cIdx} 
                              className="p-4 bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-2xl space-y-3"
                            >
                              <div className="flex items-center gap-2 pb-2 border-b border-red-500/20">
                                <ShieldAlert className="text-red-500 animate-pulse" size={16} />
                                <h4 className="text-xs font-bold text-red-650 dark:text-red-400 uppercase tracking-wider">{card.title}</h4>
                              </div>
                              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                                {card.items.map((item, iIdx) => (
                                  <div key={iIdx} className="space-y-0.5">
                                    <p className="text-slate-400 font-semibold">{item.label}</p>
                                    <p className="font-bold text-slate-800 dark:text-slate-200 leading-normal">{item.value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <span className="text-[9px] text-slate-400 block px-1">{msg.timestamp}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Sparkles size={14} className="animate-spin" />
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-850 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompt list (Shown only when message list is small) */}
        {chatMessages.length === 1 && !isTyping && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2.5">Suggested Queries</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuerySend(sug)}
                  className="text-xs px-3 py-2 bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800/50 dark:hover:bg-emerald-500/10 border border-slate-200/50 dark:border-slate-800 text-slate-650 hover:text-emerald-550 dark:text-slate-350 dark:hover:text-emerald-400 rounded-xl text-left transition-colors font-semibold"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar Form */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900">
          <form onSubmit={handleFormSubmit} className="flex gap-2 items-center bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2.5 focus-within:ring-2 focus-within:ring-emerald-500/10 focus-within:border-emerald-500 transition-all">
            
            <button
              type="button"
              title="Attach Medical Report"
              className="p-2 text-slate-400 hover:text-emerald-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <FileUp size={18} />
            </button>

            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${activeMember.name.split(' ')[0]}'s medication, surgeries, or history...`}
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-850 dark:text-slate-200 placeholder-slate-400"
            />

            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2 rounded-lg transition-all ${
                isRecording 
                  ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/10' 
                  : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Voice Input dictation"
            >
              <Mic size={18} />
            </button>

            <button 
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
