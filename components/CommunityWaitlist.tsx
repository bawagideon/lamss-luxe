"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function CommunityWaitlist() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="community" className="relative w-full py-32 md:py-48 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543269664-7eef42226a21?q=80&w=2000&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/60" /> {/* Dark elegant overlay */}
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-primary mb-4">The Experience</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">Her Elegance Series</h3>
          <h4 className="text-xl md:text-2xl font-bold text-gray-300 mb-8">by Lamssé Network</h4>
          <div className="text-lg text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto space-y-4">
            <p>A curated experience for women who move with presence, confidence, and intention.</p>
            <p>A space to connect, express, and step fully into who you are becoming.</p>
            <p className="font-bold text-white tracking-wide pt-4">Join the waitlist to be the first to experience it.</p>
          </div>

          {!submitted ? (
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="flex flex-col md:flex-row gap-3 w-full bg-background/10 p-2 md:p-3 rounded-xl backdrop-blur-md shadow-2xl border border-border"
            >
              <Input 
                type="text" 
                placeholder="Name" 
                required 
                className="bg-background border-0 h-12 text-foreground placeholder:text-muted-foreground rounded-lg focus-visible:ring-primary focus-visible:ring-offset-0" 
              />
              <Input 
                type="email" 
                placeholder="Email Address" 
                required 
                className="bg-background border-0 h-12 text-foreground placeholder:text-muted-foreground rounded-lg focus-visible:ring-primary focus-visible:ring-offset-0" 
              />
              <Input 
                type="text" 
                placeholder="City" 
                required 
                className="bg-background border-0 h-12 text-foreground placeholder:text-muted-foreground rounded-lg focus-visible:ring-primary focus-visible:ring-offset-0" 
              />
              <Button type="submit" size="lg" className="h-12 bg-primary hover:bg-primary/90 text-white font-bold tracking-wide rounded-lg whitespace-nowrap">
                Join Waitlist
              </Button>
            </motion.form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card p-8 rounded-xl shadow-2xl"
            >
              <h4 className="text-2xl font-bold text-card-foreground mb-2">Welcome to the inner circle!</h4>
              <p className="text-muted-foreground">You&apos;re on the list. We&apos;ll email you the soonest tickets drop for your city.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
