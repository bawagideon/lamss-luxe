"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Instagram, Mail, Briefcase } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="flex min-h-screen flex-col w-full bg-background pt-40 pb-24">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Get in Touch</h1>
          <p className="text-xl text-muted-foreground">We&apos;d love to hear from you. Reach out to the Lamssé Luxe team.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Methods */}
          <div className="flex flex-col space-y-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Connect With Us</h2>
              <div className="flex items-start space-x-4 mb-6">
                <Instagram className="w-6 h-6 text-primary mt-1" />
                <div>
                  <p className="font-bold text-lg">Instagram</p>
                  <p className="text-muted-foreground">Follow us @lamsseluxe.ca for drops and community events.</p>
                  <a href="#" className="text-primary hover:underline mt-2 inline-block">DM us on Instagram &rarr;</a>
                </div>
              </div>

              <div className="flex items-start space-x-4 mb-6">
                <Mail className="w-6 h-6 text-primary mt-1" />
                <div>
                  <p className="font-bold text-lg">Customer Support Email</p>
                  <p className="text-muted-foreground">Have a question about your order? We&apos;re here to help.</p>
                  <a href="mailto:support@lamsseluxe.com" className="text-primary hover:underline mt-2 inline-block">support@lamsseluxe.com</a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Briefcase className="w-6 h-6 text-primary mt-1" />
                <div>
                  <p className="font-bold text-lg">Business Inquiries & Collabs</p>
                  <p className="text-muted-foreground">For press, partnerships, and collabs.</p>
                  <a href="mailto:collab@lamsseluxe.com" className="text-primary hover:underline mt-2 inline-block">collab@lamsseluxe.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card p-8 rounded-2xl border border-border">
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            {!submitted ? (
              <form 
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                className="flex flex-col space-y-4"
              >
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                  <Input id="name" placeholder="E.g. Sarah Jenkins" required className="bg-background text-base" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                  <Input id="email" type="email" placeholder="sarah@example.com" required className="bg-background text-base" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input id="subject" placeholder="Order inquiry, Returns, etc." required className="bg-background text-base" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <textarea 
                    id="message" 
                    required 
                    rows={5}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="How can we help you today?"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full text-base font-bold bg-foreground text-background hover:bg-foreground/90 mt-2">
                  Send Message
                </Button>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Message Received!</h3>
                <p className="text-muted-foreground">We&apos;ll get back to you within 24-48 hours. Thank you, Queen.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
