import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase/client';
import { 
  CheckCircle, Plus, Trash2, RefreshCw, Database, 
  AlertCircle, ShieldCheck, Sparkles, Check, ClipboardList, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Todo {
  id: string | number;
  name: string;
  is_completed?: boolean;
  created_at?: string;
}

const defaultDemoTodos: Todo[] = [
  { id: 1, name: 'Refill Lisinopril 10mg prescription for Eshwaraiah Buddolla', is_completed: false, created_at: new Date().toISOString() },
  { id: 2, name: 'Schedule quarterly HbA1c glucose review for Suvarna Buddolla', is_completed: true, created_at: new Date().toISOString() },
  { id: 3, name: 'Check Albuterol Inhaler expiration date for Sarweshwar Buddolla', is_completed: false, created_at: new Date().toISOString() },
  { id: 4, name: 'Upload annual health checkup lab report to Records Vault', is_completed: false, created_at: new Date().toISOString() }
];

export const Todos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(defaultDemoTodos);
  const [newTodoName, setNewTodoName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: selectError } = await supabase
        .from('todos')
        .select('*')
        .order('id', { ascending: true });

      if (selectError) {
        throw selectError;
      }

      if (data && data.length > 0) {
        setTodos(data);
        setIsDemoMode(false);
      } else {
        // If connected table is empty, set empty array
        setTodos([]);
        setIsDemoMode(false);
      }
    } catch (err: any) {
      // Graceful fallback to local interactive demo mode without red crash
      console.warn('Supabase todos table not found. Using local interactive tasks mode:', err?.message);
      setIsDemoMode(true);
      // Retain or load default demo tasks
      setTodos(prev => prev.length > 0 ? prev : defaultDemoTodos);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoName.trim()) return;

    setIsAdding(true);
    setError(null);

    const newTodoItem: Todo = {
      id: Date.now(),
      name: newTodoName.trim(),
      is_completed: false,
      created_at: new Date().toISOString()
    };

    setTodos(prev => [...prev, newTodoItem]);
    setNewTodoName('');
    setSuccessMsg('Task added successfully!');
    setTimeout(() => setSuccessMsg(null), 3000);

    if (!isDemoMode) {
      try {
        const { error: insertError } = await supabase
          .from('todos')
          .insert([{ name: newTodoName.trim() }]);

        if (insertError) throw insertError;
      } catch (err: any) {
        console.error('Error adding todo to Supabase:', err);
      }
    }

    setIsAdding(false);
  };

  const handleDeleteTodo = async (id: string | number) => {
    setError(null);
    setTodos(prev => prev.filter(todo => todo.id !== id));
    setSuccessMsg('Task deleted successfully!');
    setTimeout(() => setSuccessMsg(null), 3000);

    if (!isDemoMode) {
      try {
        await supabase.from('todos').delete().eq('id', id);
      } catch (err: any) {
        console.error('Error deleting todo from Supabase:', err);
      }
    }
  };

  const handleToggleTodo = async (id: string | number, currentCompleted: boolean) => {
    setError(null);
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, is_completed: !currentCompleted } : todo
    ));

    if (!isDemoMode) {
      try {
        await supabase
          .from('todos')
          .update({ is_completed: !currentCompleted })
          .eq('id', id);
      } catch (err: any) {
        console.error('Error toggling todo in Supabase:', err);
      }
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-full text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3">
          <Database size={14} />
          <span>Supabase Real-Time Integration</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Supabase Health Tasks Sandbox
        </h2>
        <p className="text-slate-550 dark:text-slate-400 mt-1 text-sm font-semibold">
          Interactive task manager with dual-mode support (Local In-Memory & Live Supabase Cloud Sync).
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main interactive panel */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-6">
            
            {/* Input Form */}
            <form onSubmit={handleAddTodo} className="flex gap-3">
              <input 
                type="text" 
                value={newTodoName}
                onChange={(e) => setNewTodoName(e.target.value)}
                placeholder="Enter new health todo task..."
                disabled={isAdding}
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl text-slate-850 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm font-medium"
              />
              <button 
                type="submit"
                disabled={isAdding || !newTodoName.trim()}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-emerald-500/10 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAdding ? <RefreshCw size={18} className="animate-spin" /> : <Plus size={18} />}
                <span>Add</span>
              </button>
            </form>

            {/* Mode Indicator Pill */}
            {isDemoMode && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex gap-2.5 text-emerald-700 dark:text-emerald-400 text-xs font-semibold leading-relaxed items-center">
                <Sparkles size={16} className="flex-shrink-0" />
                <span>
                  <strong>Interactive Sandbox Active:</strong> Tasks are operational in-memory. Run the SQL on the right in your Supabase SQL Editor to persist to cloud tables.
                </span>
              </div>
            )}

            {/* Messages */}
            <AnimatePresence>
              {successMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex gap-2 text-emerald-600 dark:text-emerald-400 text-sm items-center font-medium"
                >
                  <CheckCircle size={16} />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Todo List */}
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <ClipboardList size={16} />
                  <span>Active Tasks ({todos.length})</span>
                </span>
                <button 
                  onClick={fetchTodos}
                  disabled={isLoading}
                  className="text-xs font-bold text-slate-500 hover:text-emerald-500 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                  <span>Sync</span>
                </button>
              </div>

              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <RefreshCw size={36} className="animate-spin text-emerald-500" />
                  <span className="text-sm font-medium">Syncing with Supabase...</span>
                </div>
              ) : todos.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 space-y-3">
                  <CheckCircle size={40} className="mx-auto text-slate-300 dark:text-slate-700" />
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-350">All caught up!</p>
                    <p className="text-xs text-slate-455 mt-1">No pending health tasks.</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[450px] overflow-y-auto pr-1">
                  {todos.map(todo => {
                    const isCompleted = !!todo.is_completed;
                    return (
                      <div 
                        key={todo.id}
                        className="flex items-center justify-between py-3.5 group hover:bg-slate-50/40 dark:hover:bg-slate-800/10 px-2 rounded-xl transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <button 
                            type="button"
                            onClick={() => handleToggleTodo(todo.id, isCompleted)}
                            className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                              isCompleted 
                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                : 'border-slate-300 hover:border-emerald-500 dark:border-slate-700'
                            }`}
                          >
                            {isCompleted && <Check size={14} strokeWidth={3} />}
                          </button>
                          <span className={`text-sm font-medium transition-all break-words ${
                            isCompleted 
                              ? 'text-slate-400 dark:text-slate-500 line-through' 
                              : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {todo.name}
                          </span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="text-slate-300 hover:text-rose-500 p-1.5 opacity-0 group-hover:opacity-100 transition-all cursor-pointer flex-shrink-0"
                          title="Delete task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Database setup SQL info panel */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={20} />
              <h3 className="text-sm font-bold text-slate-850 dark:text-white">SQL Database Setup</h3>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Execute this SQL script inside your Supabase project's <strong>SQL Editor</strong> to create the necessary table and enable RLS policies:
            </p>

            <pre className="p-3 bg-slate-900 text-slate-300 rounded-xl text-[11px] overflow-x-auto font-mono leading-relaxed border border-slate-800">
{`-- 1. Create table
create table todos (
  id bigint generated always as identity primary key,
  name text not null,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table todos enable row level security;

-- 3. Create permissive client policy
create policy "Allow all actions"
  on todos
  for all
  using (true)
  with check (true);`}
            </pre>

            <div className="p-3 bg-emerald-500/10 rounded-xl flex gap-2 text-emerald-600 dark:text-emerald-400 text-xs">
              <Sparkles size={16} className="flex-shrink-0" />
              <span>After running the SQL script, you can immediately begin adding and syncing tasks to your Supabase project!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
