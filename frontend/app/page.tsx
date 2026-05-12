"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/signup'); // Send to login if not authenticated
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [router]);

  if (!user) return (
    <div className="bg-black min-h-screen flex items-center justify-center text-white">
      <div className="animate-pulse">Verifying Identity...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter">Command Center</h1>
            <p className="text-zinc-500 mt-1">Logged in as {user.email}</p>
          </div>
          <button 
            onClick={async () => { await supabase.auth.signOut(); router.push('/signup'); }}
            className="text-xs border border-white/20 px-4 py-2 rounded-full hover:bg-white/10 transition-all"
          >
            Logout
          </button>
        </header>

        <div className="grid gap-6">
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
            <h2 className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-4">Phase 2: Gmail Integration</h2>
            <p className="text-2xl font-medium leading-tight">
              Ready to connect your Python backend and start triaging your inbox.
            </p>
            <button 
              className="mt-8 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all"
              onClick={() => alert("Connecting to Python Server...")}
            >
              Sync AI Inbox
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}