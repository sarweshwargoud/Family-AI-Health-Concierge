import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFamilyState } from '../context/FamilyStateContext';
import { 
  LayoutDashboard, Users, Upload, Clock, Calendar, 
  Pill, ShieldAlert, Settings, MessageSquare, 
  Menu, X, Bell, Search, Sun, Moon, ChevronDown, 
  User, Sparkles, AlertCircle
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
      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
        isEmergency
          ? 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-semibold border border-red-500/20'
          : isActive
          ? 'bg-emerald-500 text-white font-medium shadow-md shadow-emerald-500/20'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={isEmergency ? 'text-red-500 animate-pulse' : ''} />
        <span>{label}</span>
      </div>
      {badge && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          isEmergency ? 'bg-red-500 text-white' : isActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
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
    notifications,
    markNotificationsAsRead,
    isDarkMode, 
    toggleDarkMode 
  } = useFamilyState();
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const sidebarLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/chat', icon: MessageSquare, label: 'AI Health Concierge', badge: 'AI' },
    { to: '/family', icon: Users, label: 'Family Members' },
    { to: '/upload', icon: Upload, label: 'Upload Medical Report' },
    { to: '/timeline', icon: Clock, label: 'Medical Timeline' },
    { to: '/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/reminders', icon: Pill, label: 'Medication Reminders' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Direct query to AI Assistant
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
            <p className="text-xs text-slate-400 font-medium">Family AI Assistant</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-1">
          {sidebarLinks.map(link => (
            <SidebarLink key={link.to} {...link} />
          ))}
        </nav>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
          {/* Emergency Summary Action */}
          <SidebarLink 
            to="/emergency" 
            icon={ShieldAlert} 
            label="Emergency Summary" 
            isEmergency={true} 
          />

          <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-850">
            <img 
              src={activeMember.avatar} 
              alt={activeMember.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Active Patient</p>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{activeMember.name}</h2>
            </div>
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
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">HealthConcierge</h1>
                    <p className="text-xs text-slate-400">Family AI Assistant</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
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
                
                <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <img 
                    src={activeMember.avatar} 
                    alt={activeMember.name} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Patient</p>
                    <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{activeMember.name}</h2>
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
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50 px-3 py-1.5 rounded-full max-w-md w-full focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all duration-150">
              <Search size={18} className="text-slate-400 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Ask AI: 'What medicines does Mom take?'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full text-slate-800 dark:text-slate-200 placeholder-slate-400"
              />
            </form>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Global Family Member Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 rounded-full text-sm font-medium border border-slate-200/50 dark:border-slate-700/50 transition-colors duration-150"
              >
                <img 
                  src={activeMember.avatar} 
                  alt={activeMember.name} 
                  className="w-5 h-5 rounded-full object-cover border border-emerald-500"
                />
                <span className="max-w-[80px] sm:max-w-[120px] truncate">{activeMember.name.split(' ')[0]}</span>
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
                      <p className="text-[10px] text-slate-400 font-semibold px-3 py-2 uppercase tracking-wider">Switch Family Member</p>
                      <div className="flex flex-col gap-1">
                        {members.map(member => (
                          <button
                            key={member.id}
                            onClick={() => {
                              setActiveMemberId(member.id);
                              setIsMemberDropdownOpen(false);
                            }}
                            className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-left transition-colors duration-150 ${
                              member.id === activeMemberId 
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-350'
                            }`}
                          >
                            <img 
                              src={member.avatar} 
                              alt={member.name} 
                              className="w-8 h-8 rounded-full object-cover border border-slate-205"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate leading-none">{member.name}</p>
                              <p className="text-xs text-slate-400 mt-1 truncate leading-none">{member.relation}</p>
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
              className="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors duration-150"
              title="Toggle Dark/Light Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  if (!isNotificationsOpen) markNotificationsAsRead();
                }}
                className="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 relative transition-colors duration-150"
              >
                <Bell size={20} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-20 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                        <span className="text-xs text-slate-400 font-medium">All marked as read</span>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                        {notifications.map(notif => (
                          <div key={notif.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 flex gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <AlertCircle size={18} className="text-emerald-500" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{notif.title}</p>
                              <p className="text-xs text-slate-550 dark:text-slate-400 mt-1 leading-normal">{notif.message}</p>
                              <span className="text-[10px] text-slate-400 mt-2 block">{notif.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mini Profile Indicator */}
            <Link 
              to="/settings" 
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150"
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold overflow-hidden border border-slate-250 dark:border-slate-750">
                <User size={18} />
              </div>
            </Link>
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
