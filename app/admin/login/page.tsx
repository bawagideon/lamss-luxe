"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import Image from "next/image";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "lamsseluxe") { // Static credential for the proxy wall
       document.cookie = "admin_session=lamsseluxe_auth_token_494; path=/; max-age=86400; SameSite=Strict;";
       window.location.href = "/admin"; // Force a hard refresh to re-evaluate middleware presence
    } else {
       setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-secondary relative z-50">
      <div className="absolute inset-0 bg-background/50 backdrop-blur-3xl z-0" />
      <div className="bg-background max-w-sm w-full p-8 md:p-10 rounded-3xl shadow-2xl flex flex-col items-center relative z-10 border border-border">
        <div className="w-40 h-10 relative mb-8 -ml-4">
           <Image src="/Logo.jpeg" alt="Logo" fill className="object-contain" priority />
        </div>
        <div className="rounded-full bg-primary/10 p-5 text-primary mb-6 ring-8 ring-primary/5">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black tracking-tight mb-2 uppercase">System Auth</h1>
        <p className="text-muted-foreground text-sm text-center mb-8 font-medium">Restricted. Identify yourself to access the logistics matrix.</p>
        
        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div>
            <input 
              type="password" 
              placeholder="Admin Passcode" 
              className={`w-full p-4 rounded-xl border-2 text-sm font-bold bg-muted focus:outline-none transition-colors ${error ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-black'}`}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
            />
          </div>
          {error && <p className="text-red-500 text-[11px] uppercase font-black tracking-widest text-center mt-2 animate-in slide-in-from-top-1">Unauthorized Entry</p>}
          <button type="submit" className="w-full bg-black hover:bg-black/80 text-white p-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all mt-4 hover:scale-[1.02] active:scale-[0.98]">
            Grant Access
          </button>
        </form>
      </div>
    </div>
  );
}
