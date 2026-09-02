import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFamilyState } from '../context/FamilyStateContext';
import { 
  LayoutDashboard, Users, Upload, ShieldAlert, MessageSquare, 
  Menu, X, Search, Sun, Moon, ChevronDown, Sparkles, ClipboardList, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarLinkProps {
  to: string;
  icon: React.ComponentType<any>;
  label: string;
  badge?: string;
  isEmergency?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, label, badge, isEmergency, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${
        isEmergency
          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-455 font-bold border border-rose-500/20'
          : isActive
          ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
          : 'text-slate-750 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-semibold'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={isEmergency ? 'text-rose-500 animate-pulse' : ''} />
        <span className="text-sm sm:text-base">{label}</span>
      </div>
      {badge && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
          isEmergency ? 'bg-rose-500 text-white' : isActive ? 'bg-emerald-600 text-white' : 'bg-slate-205 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
        }`}>
          {badge}
        </span>
      )}
    </Link>
  );
};

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    members, 
    activeMemberId, 
    setActiveMemberId, 
    activeMember, 
    isDarkMode, 
    toggleDarkMode,
    logout
  } = useFamilyState();
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();

  const sidebarLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/chat', icon: MessageSquare, label: 'AI Health Assistant', badge: 'AI' },
    { to: '/upload', icon: Upload, label: 'Records Vault' },
    { to: '/family', icon: Users, label: 'Family Profiles' },
    { to: '/todos', icon: ClipboardList, label: 'Supabase Sandbox', badge: 'New' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/chat?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <div className={`min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 ${isDarkMode ? 'dark' : ''}`}>
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 fixed h-screen z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              HealthConcierge
            </h1>
            <p className="text-xs text-slate-400 font-semibold">Family AI Health Assistant</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
          {sidebarLinks.map(link => (
            <SidebarLink key={link.to} {...link} />
          ))}
        </nav>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
          <SidebarLink 
            to="/emergency" 
            icon={ShieldAlert} 
            label="Emergency Summary" 
            isEmergency={true} 
          />

          <div className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-850">
            <img 
              src={activeMember.avatar} 
              alt={activeMember.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-slate-450 dark:text-slate-505 font-bold uppercase tracking-wider">Active Member</p>
              <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 truncate">{activeMember.name}</h2>
            </div>
            <button 
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Slide-Over Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 z-50 lg:hidden flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-555 to-teal-400 flex items-center justify-center text-white">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">HealthConcierge</h1>
                    <p className="text-xs text-slate-400">Family AI Health Assistant</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-650 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
                {sidebarLinks.map(link => (
                  <SidebarLink 
                    key={link.to} 
                    {...link} 
                    onClick={() => setIsMobileOpen(false)} 
                  />
                ))}
              </nav>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                <SidebarLink 
                  to="/emergency" 
                  icon={ShieldAlert} 
                  label="Emergency Summary" 
                  isEmergency={true} 
                  onClick={() => setIsMobileOpen(false)}
                />
                
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                  <img 
                    src={activeMember.avatar} 
                    alt={activeMember.name} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Member</p>
                    <h2 className="text-sm font-extrabold text-slate-850 dark:text-slate-200 truncate">{activeMember.name}</h2>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 glass-nav h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 lg:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu size={20} />
            </button>
            
            {/* Ask AI Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50 px-4 py-2 rounded-full max-w-md w-full focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all duration-150">
              <Search size={18} className="text-slate-450 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Ask AI: 'Dad ki medications list karo' or 'Does Mom take Metformin?'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full text-slate-800 dark:text-slate-200 placeholder-slate-450 font-medium"
              />
            </form>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Global Family Member Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-150 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-full text-sm font-bold border border-slate-200/50 dark:border-slate-700/50 transition-colors duration-150"
              >
                <img 
                  src={activeMember.avatar} 
                  alt={activeMember.name} 
                  className="w-5 h-5 rounded-full object-cover border border-emerald-500"
                />
                <span className="max-w-[100px] truncate">{activeMember.name.split(' ')[0]}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>
              
              <AnimatePresence>
                {isMemberDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsMemberDropdownOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-20"
                    >
                      <p className="text-[10px] text-slate-400 font-bold px-3 py-2 uppercase tracking-wider">Switch Family Member</p>
                      <div className="flex flex-col gap-1">
                        {members.map(member => (
                          <button
                            key={member.id}
                            onClick={() => {
                              setActiveMemberId(member.id);
                              setIsMemberDropdownOpen(false);
                            }}
                            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-colors duration-150 ${
                              member.id === activeMemberId 
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-semibold'
                            }`}
                          >
                            <img 
                              src={member.avatar} 
                              alt={member.name} 
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold truncate leading-none">{member.name}</p>
                              <p className="text-[10px] text-slate-400 mt-1 truncate leading-none">{member.relation}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-450 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors duration-150"
              title="Toggle Dark/Light Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
};
