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
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 backdrop-blur-md py-6 px-4 md:py-12">
          <div className="min-h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-[850px] bg-white dark:bg-zinc-950 overflow-hidden rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.4)] flex flex-col md:flex-row border border-zinc-200 dark:border-zinc-800"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-3 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 rounded-full transition-all hover:rotate-90"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
  
              {/* Image Side */}
              <div className="relative w-full md:w-[45%] aspect-[16/9] md:aspect-auto min-h-[250px] md:min-h-[550px]">
                <Image
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80"
                  alt="Luxe Network Exclusive"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12 text-white">
                   <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] mb-3 md:mb-4 opacity-90 text-primary">First Visit Reward</p>
                   <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.85]">Elevate Your Presence</h3>
                </div>
              </div>
  
              {/* Content Side */}
              <div className="w-full md:w-[55%] p-10 md:p-20 flex flex-col justify-center text-center md:text-left bg-zinc-50/50 dark:bg-zinc-900/30">
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10"
                    >
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-primary text-white rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest mb-2 shadow-xl shadow-primary/20">
                          <Sparkles className="w-4 h-4 md:w-5 md:h-5" /> Special Invitation
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">Unlock 30% Off Your First Look</h2>
                        <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">Join the Luxe Network for early access to drops and a one-time 30% discount code.</p>
                      </div>
  
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative group">
                          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-zinc-400 group-focus-within:text-primary transition-colors" />
                          <Input
                            type="email"
                            placeholder="Your Best Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-16 h-16 md:h-20 border-zinc-200 focus:border-primary dark:focus:border-primary rounded-3xl bg-white dark:bg-black font-bold text-lg md:text-xl shadow-inner transition-all focus:ring-4 focus:ring-primary/5"
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full h-16 md:h-20 bg-primary text-white font-black uppercase tracking-[0.25em] text-xs md:text-sm rounded-3xl shadow-2xl hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all transform hover:-translate-y-1 active:scale-95"
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
