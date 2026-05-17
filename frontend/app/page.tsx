"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [emails, setEmails] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    fetch("/api/gmail")
      .then((res) => res.json())
      .then((data) => {
        setEmails(data);
      });
  }, []);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
        scopes: "https://www.googleapis.com/auth/gmail.readonly",
      },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    location.reload();
  }

  return (
    <div
      style={{
        background: "black",
        color: "white",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <h1>AI Command Center</h1>

      {user ? (
        <>
          <p>Logged in as: {user.email}</p>

          <button onClick={signOut}>Logout</button>

          <h2 style={{ marginTop: "30px" }}>
            Categorized Emails
          </h2>

          {emails.map((mail, index) => (
            <div
              key={index}
              style={{
                border: "1px solid white",
                padding: "10px",
                marginTop: "10px",
              }}
            >
              <h3>{mail.subject}</h3>

              <p>
                Category: {mail.category}
              </p>
            </div>
          ))}
        </>
      ) : (
        <button onClick={signInWithGoogle}>
          Login with Google
        </button>
      )}
    </div>
  );
}