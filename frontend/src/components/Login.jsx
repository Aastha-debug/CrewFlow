import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Mail, Layers, ShieldCheck, HelpCircle } from 'lucide-react';

const Login = ({ onSwitchToSignup }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin'); // Helps evaluate admin/member roles out of the box in mock auth
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const VITE_USE_FIREBASE = import.meta.env.VITE_USE_FIREBASE === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password, role);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-72 w-72 rounded-full bg-rose-500/5 blur-3xl"></div>

      <div className="w-full max-w-md space-y-8 glass p-8 rounded-2xl glow-border shadow-2xl">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-500/25">
            <Layers className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight font-sans">
            Welcome back to <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-indigo-400">CrewFlow</span>
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Securely log in to manage team projects and tasks
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="glass-input block w-full rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <KeyRound className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input block w-full rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Role Select (Only for offline mock mode evaluation) */}
            {!VITE_USE_FIREBASE && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    <ShieldCheck className="h-3.5 w-3.5" /> Dev Mode Role
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-400" title="Select a role to verify different permissions easily without creating accounts.">
                    <HelpCircle className="h-3 w-3" /> Info
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setRole('Admin')}
                    className={`rounded-lg py-2 text-xs font-semibold border transition-all ${
                      role === 'Admin' 
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300' 
                        : 'border-slate-800 text-slate-400 hover:bg-slate-800/40'
                    }`}
                  >
                    Admin Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Member')}
                    className={`rounded-lg py-2 text-xs font-semibold border transition-all ${
                      role === 'Member' 
                        ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300' 
                        : 'border-slate-800 text-slate-400 hover:bg-slate-800/40'
                    }`}
                  >
                    Member Mode
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all shadow-lg shadow-indigo-600/25"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline transition-all"
            >
              Sign up free
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
