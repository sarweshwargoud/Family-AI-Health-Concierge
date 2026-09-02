import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase/client';
import { 
  CheckCircle, Plus, Trash2, RefreshCw, Database, 
  AlertCircle, ShieldCheck, Sparkles, Check, ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Todo {
  id: string | number;
  name: string;
  is_completed?: boolean;
  created_at?: string;
}

export const Todos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoName, setNewTodoName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
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
      setTodos(data || []);
    } catch (err: any) {
      console.error('Error fetching todos:', err);
      setError(err.message || 'Failed to load todos from Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoName.trim()) return;

    setIsAdding(true);
    setError(null);
    try {
      const { error: insertError } = await supabase
        .from('todos')
        .insert([{ name: newTodoName.trim() }]);

      if (insertError) {
        throw insertError;
      }

      setNewTodoName('');
      setSuccessMsg('Todo added successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
      await fetchTodos();
    } catch (err: any) {
      console.error('Error adding todo:', err);
      setError(err.message || 'Failed to add todo.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (id: string | number) => {
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setTodos(prev => prev.filter(todo => todo.id !== id));
      setSuccessMsg('Todo deleted successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error('Error deleting todo:', err);
      setError(err.message || 'Failed to delete todo.');
    }
  };

  const handleToggleTodo = async (id: string | number, currentCompleted: boolean) => {
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('todos')
        .update({ is_completed: !currentCompleted })
        .eq('id', id);

      if (updateError) {
        // Fallback in case table doesn't have is_completed column
        throw updateError;
      }

      setTodos(prev => prev.map(todo => 
        todo.id === id ? { ...todo, is_completed: !currentCompleted } : todo
      ));
    } catch (err: any) {
      console.error('Error toggling todo:', err);
      // We don't block UI if it's just columns missing, but alert in console
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
          Supabase Todos Sandbox
        </h2>
        <p className="text-slate-550 dark:text-slate-400 mt-1 text-sm font-semibold">
          Perform live REST/Data operations against your connected database instance.
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
                placeholder="Enter new todo task..."
                disabled={isAdding}
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl text-slate-850 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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

            {/* Messages */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex gap-3 text-rose-600 dark:text-rose-400 text-sm leading-normal items-start"
                >
                  <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <span className="font-bold">Database Access Error:</span>
                    <p className="mt-1">{error}</p>
                    <p className="mt-2 text-xs opacity-80">Make sure the `todos` table is created in your Supabase database and has appropriate Row-Level Security (RLS) policies. Check the SQL setup panel on the right.</p>
                  </div>
                </motion.div>
              )}

              {successMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex gap-2 text-emerald-600 dark:text-emerald-400 text-sm items-center"
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
                  <span>Active Tasks</span>
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
                    <p className="text-xs text-slate-455 mt-1">No items found in the `todos` table.</p>
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
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleToggleTodo(todo.id, isCompleted)}
                            className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                              isCompleted 
                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                : 'border-slate-300 hover:border-emerald-500 dark:border-slate-700'
                            }`}
                          >
                            {isCompleted && <Check size={14} strokeWidth={3} />}
                          </button>
                          <span className={`text-sm sm:text-base font-medium transition-all ${
                            isCompleted 
                              ? 'text-slate-400 dark:text-slate-500 line-through' 
                              : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {todo.name}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
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

        {/* SQL Schema helper card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={20} />
              <span>SQL Database Setup</span>
            </h3>
            <p className="text-xs text-slate-500 leading-normal">
              Execute this SQL script inside your Supabase project's <strong>SQL Editor</strong> to create the necessary table and enable RLS policies:
            </p>
            <div className="relative">
              <pre className="text-[10px] bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl overflow-x-auto text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-850 max-h-[220px] select-all font-mono leading-relaxed">
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
on todos for all 
using (true) 
with check (true);`}
              </pre>
            </div>
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-[11px] text-slate-500 dark:text-slate-400 flex gap-2">
              <Sparkles className="text-emerald-500 flex-shrink-0 mt-0.5" size={14} />
              <span>After running the SQL script, you can immediately begin adding and managing tasks from this dashboard!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
