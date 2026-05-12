"use client";
import React from 'react';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
  const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Use window.location.origin to ensure it works on any port (5000, 3000, etc.)
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) console.error('Error:', error.message);
};

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white font-sans">
      <div className="w-full max-w-md space-y-8 bg-zinc-900 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
        
        {/* Branding */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tighter">Get Started</h1>
          <p className="text-zinc-400 text-sm">Your AI Command Center awaits.</p>
        </div>

        {/* Inputs (Mock/UI only for now) */}
        <div className="space-y-4 pt-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <input 
            type="password" 
            placeholder="Create Password" 
            className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all">
            Create Account
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-zinc-800"></div>
          <span className="flex-shrink mx-4 text-zinc-500 text-xs uppercase tracking-widest">Secure Social Login</span>
          <div className="flex-grow border-t border-zinc-800"></div>
        </div>

        {/* Google Login Button */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all"
        >
          <img 
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" 
            alt="Google Logo" 
            className="w-6 h-6"
          />
          Continue with Google
        </button>

        <p className="text-center text-zinc-500 text-sm">
          Already a member? <span className="text-blue-400 cursor-pointer hover:underline">Sign In</span>
        </p>
      </div>
    </div>
  );
}