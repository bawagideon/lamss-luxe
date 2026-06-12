"use client";

import { useState } from "react";
import { Lock, CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { requestAdminMagicLink } from "@/app/actions/auth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await requestAdminMagicLink(email);
    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || "Authentication failed.");
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

        {success ? (
          <div className="w-full text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="rounded-full bg-green-500/10 p-5 text-green-500 mb-2 ring-8 ring-green-500/5 inline-block">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Link Dispatched</h1>
            <p className="text-muted-foreground text-sm font-medium">
              We have sent a secure entry link to <strong className="text-foreground">{email.toLowerCase().trim()}</strong>.
            </p>
            <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider bg-muted p-4 rounded-2xl border leading-relaxed">
              Check your inbox and spam folders to authorize entry.
            </div>
            <button 
              onClick={() => { setSuccess(false); setError(null); }}
              className="text-[10px] uppercase font-black tracking-widest text-muted-foreground hover:text-black transition-colors pt-4 block w-full text-center"
            >
              ← Try a different email
            </button>
          </div>
        ) : (
          <>
            <div className="rounded-full bg-primary/10 p-5 text-primary mb-6 ring-8 ring-primary/5">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tight mb-2 uppercase">System Access</h1>
            <p className="text-muted-foreground text-sm text-center mb-8 font-medium">Enter your operator email to request a secure one-click entry link.</p>
            
            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Operator Email" 
                  className={`w-full p-4 rounded-xl border-2 text-sm font-bold bg-muted focus:outline-none transition-colors ${error ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-300' : 'border-transparent focus:border-black'}`}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-[10px] uppercase font-black tracking-widest text-center mt-2 leading-relaxed animate-in slide-in-from-top-1">{error}</p>}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-black hover:bg-black/80 text-white p-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all mt-4 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                  <>
                    <span>Request Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

