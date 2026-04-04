"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { subscribeToNewsletter } from "@/app/actions/community";
import { toast } from "react-hot-toast";

export function CommunityWaitlist() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await subscribeToNewsletter(formData);
    
    setLoading(false);
    
    if (result.success) {
      setSubmitted(true);
      toast.success("Welcome to the inner circle!", {
        style: {
          background: '#000',
          color: '#fff',
          borderRadius: '10px',
        }
      });
    } else {
      toast.error(result.error || "Failed to join waitlist.");
    }
  };

  return (
    <section id="community" className="relative w-full py-32 md:py-48 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543269664-7eef42226a21?q=80&w=2000&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/60" /> {/* Dark elegant overlay */}
      </div>

      <div className="container relative z-10 mx-auto px-8 sm:px-10 lg:px-16 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-primary mb-4">The Experience</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">Exclusive Event RSVP</h3>
          <h4 className="text-xl md:text-2xl font-bold text-gray-300 mb-8">by Luxe Network</h4>
          <div className="text-lg text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto space-y-4">
            <p>RSVP for our upcoming exclusive events and community gatherings.</p>
            <p>A space to connect, express, and step fully into who you are becoming.</p>
            <p className="font-bold text-white tracking-wide pt-4">Enter your details to secure your spot.</p>
          </div>

          {!submitted ? (
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-3 w-full bg-background/10 p-2 md:p-3 rounded-xl backdrop-blur-md shadow-2xl border border-border"
            >
              <Input 
                name="name"
                type="text" 
                placeholder="Full Name" 
                required 
                className="bg-background border-0 h-12 text-foreground placeholder:text-muted-foreground rounded-lg focus-visible:ring-primary focus-visible:ring-offset-0" 
              />
              <Input 
                name="email"
                type="email" 
                placeholder="Email Address" 
                required 
                className="bg-background border-0 h-12 text-foreground placeholder:text-muted-foreground rounded-lg focus-visible:ring-primary focus-visible:ring-offset-0" 
              />
              <Input 
                name="city"
                type="text" 
                placeholder="Your City" 
                required 
                className="bg-background border-0 h-12 text-foreground placeholder:text-muted-foreground rounded-lg focus-visible:ring-primary focus-visible:ring-offset-0" 
              />
              <Button 
                type="submit" 
                size="lg" 
                disabled={loading}
                className="h-12 bg-primary hover:bg-primary/90 text-white font-bold tracking-wide rounded-lg whitespace-nowrap"
              >
                {loading ? "Registering..." : "Secure My Spot"}
              </Button>
            </motion.form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card p-8 rounded-xl shadow-2xl"
            >
              <h4 className="text-2xl font-bold text-card-foreground mb-2">You&apos;re on the list!</h4>
              <p className="text-muted-foreground">Your spot is secured. We&apos;ll email you the exclusive details for the next event in your city.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
