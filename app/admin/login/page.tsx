"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import Image from "next/image";
import { performAdminLogin } from "@/app/actions/auth";

export default function AdminLogin() {
  const [operatorName, setOperatorName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // We pass the operator name and password. 
    // The device name is automatically detected as 'Desktop/Browser' for now.
    const res = await performAdminLogin(operatorName, password, 'Web Console Node');
    
    if (res.success) {
       window.location.href = "/admin";
    } else {
       setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-secondary relative z-50">
      <div className="absolute inset-0 bg-background/50 backdrop-blur-3xl z-0" />
      <div className="bg-background max-w-sm w-full p-8 md:p-10 rounded-3xl shadow-2xl flex flex-col items-center relative z-10 border border-border">
        <div className="w-40 h-10 relative mb-8 -ml-4">
           <Image src="/Logo.jpeg" alt="Logo" fill sizes="160px" className="object-contain" priority />
        </div>
        <div className="rounded-full bg-primary/10 p-5 text-primary mb-6 ring-8 ring-primary/5">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black tracking-tight mb-2 uppercase">System Access</h1>
        <p className="text-muted-foreground text-sm text-center mb-8 font-medium">Identify your node to enter the logistics matrix.</p>
        
        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Operator Name" 
                className="w-full p-4 rounded-xl border-2 border-transparent bg-muted focus:border-black focus:outline-none text-sm font-bold transition-all"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <input 
                type="password" 
                placeholder="Secure Passcode" 
                className={`w-full p-4 rounded-xl border-2 text-sm font-bold bg-muted focus:outline-none transition-colors ${error ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-black'}`}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-[11px] uppercase font-black tracking-widest text-center mt-2 animate-in slide-in-from-top-1">Access Denied: Node Rejected</p>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black hover:bg-black/80 text-white p-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all mt-4 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
          >
            {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Authorize Entry"}
          </button>
        </form>
      </div>
    </div>
  );
}
