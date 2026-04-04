"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommandCenter() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvedCount, setResolvedCount] = useState(0);

  // --- HELPER FUNCTION FOR DYNAMIC GLOW ---
  const getBorderColor = (cat: string) => {
    if (cat === 'IMMEDIATE') return 'border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.2)]';
    if (cat === 'ACADEMIC') return 'border-blue-500/50 shadow-[0_0_25px_rgba(59,130,246,0.2)]';
    return 'border-white/10 shadow-none';
  };

  useEffect(() => {
    fetch('http://localhost:8000/command-center')
      .then(res => res.json())
      .then(data => {
        setEmails(data.focus_queue);
        setLoading(false);
      })
      .catch(err => console.error("Backend Error:", err));
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6">
      <div className="text-center mb-16">
        <h1 className="text-white text-4xl font-bold tracking-tighter sm:text-6xl">
          INBOX <span className="text-blue-500">COMMAND</span>
        </h1>
        <div className="flex flex-col items-center gap-2 mt-2">
          <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.2em]">
            Powered by Gemini 1.5 Flash
          </p>
          {/* Progress Counter */}
          {resolvedCount > 0 && (
            <p className="text-green-500 font-mono text-[10px] tracking-widest uppercase animate-pulse">
              {resolvedCount} Emails Neutralized
            </p>
          )}
        </div>
      </div>

      <div className="relative w-full max-w-sm h-[450px] flex items-center justify-center">
        {loading ? (
          <div className="text-blue-400 font-mono text-sm animate-pulse">TRIAGING INBOX...</div>
        ) : (
          <AnimatePresence mode="wait">
            {emails.length > 0 ? (
              <motion.div
                key={emails[0].id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={async (event, info) => {
                  const currentEmail = emails[0];
                  
                  if (info.offset.x > 150) {
                    // SWIPE RIGHT: ARCHIVE
                    try {
                      await fetch('http://127.0.0.1:8000/triage-action', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email_id: currentEmail.id, action: 'archive' })
                      });
                      setResolvedCount(prev => prev + 1);
                      setEmails(emails.slice(1));
                    } catch (err) {
                      console.error("Failed to archive:", err);
                    }

                  } else if (info.offset.x < -150) {
                    // SWIPE LEFT: MARK AS READ
                    try {
                      await fetch('http://127.0.0.1:8000/triage-action', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email_id: currentEmail.id, action: 'read' })
                      });
                      setEmails(emails.slice(1));
                    } catch (err) {
                      console.error("Failed to mark as read:", err);
                    }
                  }
                }}
                whileTap={{ scale: 0.98 }}
                // Replace line 88 with this:
exit={{ scale: 0.8, opacity: 0 }}
                // --- DYNAMIC CLASSNAME APPLIED HERE ---
                className={`absolute w-full h-full bg-white/5 backdrop-blur-2xl border-2 rounded-[2.5rem] p-8 transition-all duration-500 flex flex-col justify-between cursor-grab active:cursor-grabbing ${getBorderColor(emails[0].category)}`}
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      emails[0].category === 'IMMEDIATE' ? 'bg-red-500/10 border-red-500/40 text-red-400' : 
                      emails[0].category === 'ACADEMIC' ? 'bg-blue-500/10 border-blue-500/40 text-blue-400' : 
                      'bg-white/5 border-white/10 text-gray-400'
                    }`}>
                      {emails[0].category || "UNCATEGORIZED"}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse" />
                  </div>
                  
                  <h2 className="text-white text-2xl font-semibold leading-tight tracking-tight">
                    {emails[0].subject}
                  </h2>
                  <p className="text-gray-400 mt-4 text-sm font-medium opacity-80">
                    {emails[0].sender}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-600 font-bold tracking-widest uppercase">
                  <span className="hover:text-red-400 transition-colors">← Mark Read</span>
                  <span className="hover:text-blue-400 transition-colors">Archive →</span>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-green-500 font-mono text-sm uppercase flex flex-col items-center gap-4"
              >
                <span>Inbox Zero Achieved 🏆</span>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-[10px] text-gray-500 border border-gray-800 px-4 py-2 rounded-full hover:bg-white/5 transition-all"
                >
                  Refresh Feed
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}