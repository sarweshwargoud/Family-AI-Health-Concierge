import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase/client';
import { Sparkles, AlertCircle } from 'lucide-react';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Exchange session code/hash from URL
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (session) {
          navigate('/dashboard', { replace: true });
        } else {
          // Listen for onAuthStateChange if token exchange is asynchronous
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
            if (newSession) {
              subscription.unsubscribe();
              navigate('/dashboard', { replace: true });
            }
          });

          // Timeout fallback if no session received
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 2500);
        }
      } catch (err: any) {
        console.error('OAuth Callback Error:', err);
        setError(err.message || 'Authentication failed. Please try again.');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 mb-6 animate-pulse">
        <Sparkles size={32} />
      </div>

      {error ? (
        <div className="max-w-md p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 flex items-center gap-3">
          <AlertCircle size={20} className="flex-shrink-0" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-850 dark:text-white">
            Authenticating your Family Health Session
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Establishing secure end-to-end encrypted connection...
          </p>
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mt-4" />
        </div>
      )}
    </div>
  );
};
