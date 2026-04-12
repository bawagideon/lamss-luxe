"use client";

import { useState, useTransition } from "react";
import { sendContactMessage } from "@/app/actions/contact";
import { toast } from "react-hot-toast";
import { Instagram, Mail, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await sendContactMessage(formData);
      if (result.success) {
        setSubmitted(true);
        toast.success("Message sent! We'll get back to you soon.");
      } else {
        toast.error(result.error || "Something went wrong.");
      }
    });
  };

  return (
    <main className="flex min-h-screen flex-col w-full bg-background pt-32 md:pt-40 pb-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic">Stay Connected</h1>
          <p className="text-sm md:text-base text-muted-foreground uppercase tracking-[0.3em] font-bold">The Lamssé Luxe Concierge is at your service.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Info & Map */}
          <div className="flex flex-col space-y-12">
            <div className="space-y-10">
              <h2 className="text-2xl font-black uppercase tracking-tight">Direct Channels</h2>
              
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-black text-[11px] uppercase tracking-[0.2em] mb-1">Instagram</p>
                  <p className="text-muted-foreground text-sm mb-3">Follow us @lamsseluxe.ca for the latest drops.</p>
                  <a href="https://instagram.com/lamsseluxe.ca" target="_blank" rel="noopener noreferrer" className="text-primary font-black text-xs uppercase tracking-widest hover:underline decoration-2">Slide in our DMs &rarr;</a>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-black text-[11px] uppercase tracking-[0.2em] mb-1">Official Email</p>
                  <p className="text-muted-foreground text-sm mb-3">General inquiries, orders, and collaborations.</p>
                  <a href="mailto:lamsseluxe@gmail.com" className="text-primary font-black text-[13px] hover:underline decoration-2">lamsseluxe@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-black text-[11px] uppercase tracking-[0.2em] mb-1">Flagship Location</p>
                  <p className="text-muted-foreground text-sm italic font-medium mb-1">7, Exmouth street, St. John’s NL, A1B 2E1</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Appointment Only</p>
                </div>
              </div>
            </div>

            {/* Google Map Integration */}
            <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-border shadow-sm group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2690.418431055745!2d-52.7317768236104!3d47.5985399711915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4b0ca385da33fef7%3A0x8cf6c41d6dc76c4e!2s7%20Exmouth%20St%2C%20St.%20John&#39;s%2C%20NL%20A1B%202E1%2C%20Canada!5e0!3m2!1sen!2s!4v1712826456789!5m2!1sen!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'grayscale(100%) invert(90%)' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="transition-all duration-700 group-hover:filter-none dark:opacity-80"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-zinc-50 dark:bg-zinc-900/30 p-8 md:p-12 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-2xl">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 italic">Send a Message</h2>
            {!submitted ? (
              <form 
                onSubmit={handleSubmit}
                className="flex flex-col space-y-6"
              >
                <div className="space-y-3">
                  <label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Full Name</label>
                  <Input id="name" name="name" placeholder="E.g. Sarah Jenkins" required className="bg-background h-14 rounded-xl border-zinc-200 dark:border-zinc-800 focus:ring-black" />
                </div>
                <div className="space-y-3">
                  <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Address</label>
                  <Input id="email" name="email" type="email" placeholder="sarah@example.com" required className="bg-background h-14 rounded-xl border-zinc-200 dark:border-zinc-800 focus:ring-black" />
                </div>
                <div className="space-y-3">
                  <label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Subject</label>
                  <Input id="subject" name="subject" placeholder="Order inquiry, Returns, etc." required className="bg-background h-14 rounded-xl border-zinc-200 dark:border-zinc-800 focus:ring-black" />
                </div>
                <div className="space-y-3">
                  <label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Message</label>
                  <textarea 
                    id="message" 
                    name="message"
                    required 
                    rows={6}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                    placeholder="How can we help you today?"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isPending}
                  className="w-full h-16 text-[11px] font-black uppercase tracking-[0.25em] bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 mt-4 rounded-xl shadow-xl transition-all active:scale-[0.98]"
                >
                  {isPending ? "Sending..." : "Dispatch Message"}
                </Button>
              </form>
            ) : (
              <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-10">
                  <Mail className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-4">Message Dispatched!</h3>
                <p className="text-muted-foreground text-sm uppercase tracking-widest leading-relaxed">We&apos;ll get back to you within 24-48 hours.<br />Stay luxe, Queen.</p>
                <Button 
                  variant="ghost" 
                  onClick={() => setSubmitted(false)}
                  className="mt-10 text-[10px] font-black uppercase tracking-widest hover:bg-black/5"
                >
                  Send another message
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
