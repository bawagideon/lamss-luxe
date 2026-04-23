"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

import { subscribeToNewsletter } from "@/app/actions/newsletter";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";

export function NewsletterPopup() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show popup after 3 seconds if NOT SUBMITTED
    const hasSubmitted = localStorage.getItem("newsletter_submitted");
    const hasDismissedSession = sessionStorage.getItem("newsletter_dismissed_session");

    if (!hasSubmitted && !hasDismissedSession && !isAdmin) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAdmin]);

  const handleClose = () => {
    setIsOpen(false);
    // Dismiss only for this session if they just closed it
    sessionStorage.setItem("newsletter_dismissed_session", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await subscribeToNewsletter(email);
    
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
      if (res.alreadySubscribed) {
        localStorage.setItem("newsletter_submitted", "true");
        setTimeout(() => setIsOpen(false), 2000);
      }
      return;
    }

    setIsSubmitted(true);
    localStorage.setItem("newsletter_submitted", "true");
    setTimeout(() => {
      setIsOpen(false);
    }, 4000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-[850px] bg-white dark:bg-zinc-950 overflow-hidden rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.3)] flex flex-col md:flex-row border border-zinc-200 dark:border-zinc-800"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 z-50 p-2 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Side */}
            <div className="relative w-full md:w-[45%] aspect-[4/5] md:aspect-auto min-h-[400px]">
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80"
                alt="Luxe Network Exclusive"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10 text-white">
                 <p className="text-[11px] font-black uppercase tracking-[0.4em] mb-3 opacity-90">First Visit Reward</p>
                 <h3 className="text-3xl font-black uppercase tracking-tighter leading-[0.9]">Elevate Your Presence</h3>
              </div>
            </div>

            {/* Content Side */}
            <div className="w-full md:w-[55%] p-10 md:p-16 flex flex-col justify-center text-center md:text-left bg-zinc-50/50 dark:bg-zinc-900/30">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-2 shadow-lg shadow-primary/20">
                        <Sparkles className="w-3.5 h-3.5" /> Special Invitation
                      </div>
                      <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">Unlock 30% Off Your First Look</h2>
                      <p className="text-base text-zinc-600 dark:text-zinc-400 font-medium">Join the Luxe Network for early access to drops and a one-time 30% discount code.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <Input
                          type="email"
                          placeholder="Your Best Email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-14 h-16 border-zinc-200 focus:border-primary dark:focus:border-primary rounded-2xl bg-white dark:bg-black font-bold text-lg shadow-inner transition-all"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 bg-primary text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 active:scale-95"
                      >
                        {loading ? "Joining the Network..." : "Send My 30% Discount"}
                      </Button>
                    </form>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest opacity-60">One Code Per Identity • Limited Time Invite</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center space-y-6"
                  >
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/30 mb-4 animate-bounce">
                       <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-4xl font-black uppercase tracking-tighter">You&apos;re In!</h2>
                       <p className="text-lg text-zinc-800 dark:text-zinc-200 font-black uppercase tracking-widest">Code: LUXE30</p>
                       <p className="text-sm text-zinc-500 font-medium italic">Your 30% discount has been dispatched to your inbox.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
