import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../store/authStore';

export default function AuthPage() {
  const router = useRouter();
  const { signUp, signIn } = useAuthStore();
  
  const [isSignUp, setIsSignUp] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = (password) => password.length >= 6;
  const isNameValid = (name) => name.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setAuthError('');

    if (isSignUp && !isNameValid(form.name)) return;
    if (!isEmailValid(form.email) || !isPasswordValid(form.password)) return;

    try {
      if (isSignUp) {
        signUp(form);
      } else {
        signIn(form.email, form.password);
      }
      router.push('/posts');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  return (
    /* Outer Flex Container: Centers the card globally with a rich slate-blue background gradient */
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4 py-12">
      
      {/* Auth Card Element */}
      <div className="w-full max-w-md transform rounded-2xl bg-slate-800/80 p-8 shadow-2xl backdrop-blur-md border border-slate-700/50 transition-all duration-300">
        
        {/* Header */}
        <h2 className="mb-2 text-center text-3xl font-extrabold tracking-tight text-white">
          {isSignUp ? 'Create an Account' : 'Welcome Back'}
        </h2>
        <p className="mb-6 text-center text-sm text-slate-400">
          {isSignUp ? 'Sign up to manage your posts and comments' : 'Sign in to access your dashboard'}
        </p>

        {/* Dynamic Error Message Box */}
        {authError && (
          <div className="mb-5 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-center text-sm font-medium text-rose-400">
            {authError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full rounded-xl bg-slate-900/60 p-3 text-white placeholder-slate-500 border focus:outline-none focus:ring-2 transition-all ${
                  isSubmitted && !isNameValid(form.name) 
                    ? 'border-rose-500 focus:ring-rose-500/20' 
                    : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
              {isSubmitted && !isNameValid(form.name) && (
                <p className="mt-1.5 text-xs font-medium text-rose-400">Name is required.</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full rounded-xl bg-slate-900/60 p-3 text-white placeholder-slate-500 border focus:outline-none focus:ring-2 transition-all ${
                isSubmitted && !isEmailValid(form.email) 
                  ? 'border-rose-500 focus:ring-rose-500/20' 
                  : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
            {isSubmitted && !isEmailValid(form.email) && (
              <p className="mt-1.5 text-xs font-medium text-rose-400">Please enter a valid email address.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full rounded-xl bg-slate-900/60 p-3 text-white placeholder-slate-500 border focus:outline-none focus:ring-2 transition-all ${
                isSubmitted && !isPasswordValid(form.password) 
                  ? 'border-rose-500 focus:ring-rose-500/20' 
                  : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
            {isSubmitted && !isPasswordValid(form.password) && (
              <p className="mt-1.5 text-xs font-medium text-rose-400">Password must be at least 6 characters.</p>
            )}
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-violet-700 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 mt-2"
          >
            {isSignUp ? 'Create Free Account' : 'Sign In to Dashboard'}
          </button>
        </form>

        {/* Toggle Mode Button */}
        <div className="mt-6 border-t border-slate-700/60 pt-4 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setIsSubmitted(false);
              setAuthError('');
            }}
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account yet? Sign Up"}
          </button>
        </div>

      </div>
    </div>
  );
}