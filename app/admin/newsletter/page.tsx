"use client";

import { useState, useEffect, useTransition } from "react";
import { 
  getNewsletterStats, 
  sendTestEmail, 
  sendLiveNewsletter 
} from "@/app/actions/newsletter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Send, 
  TestTube, 
  AlertTriangle,
  Info,
  Package
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function NewsletterStudioPage() {
  const [stats, setStats] = useState({ totalSubscribers: 0, newThisWeek: 0 });
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [isLiveOpen, setIsLiveOpen] = useState(false);

  useEffect(() => {
    getNewsletterStats().then(setStats);
  }, []);

  const handleTestSend = () => {
    if (!testEmail) return toast.error("Please provide a test email address.");
    
    startTransition(async () => {
      const result = await sendTestEmail(testEmail, subject || "Test Newsletter", content || "This is a test message.");
      if (result.success) {
        toast.success(`Test sent to ${testEmail}`);
        setIsTestOpen(false);
      } else {
        toast.error(result.error || "Failed to send test.");
      }
    });
  };

  const handleLiveSend = () => {
    if (!subject || !content) return toast.error("Please fill in both subject and body.");

    startTransition(async () => {
      const result = await sendLiveNewsletter(subject, content);
      if (result.success) {
        toast.success(`Newsletter dispatched to ${result.count} subscribers!`);
        setSubject("");
        setContent("");
        setIsLiveOpen(false);
      } else {
        toast.error(result.error || "Failed to dispatch newsletter.");
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight italic">Newsletter Studio</h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-medium italic">Draft, test, and broadcast your brand story.</p>
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="rounded-none border-black border-2 bg-black text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest">
              Live Campaign Engine
           </Badge>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-none border-black border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-5 h-5 text-gray-400" />
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Audience Growth</p>
            <h3 className="text-4xl font-black italic tracking-tighter">{stats.totalSubscribers}</h3>
          </CardContent>
        </Card>

        <Card className="rounded-none border-black border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-black text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Weekly Tier</p>
            <h3 className="text-4xl font-black italic tracking-tighter">+{stats.newThisWeek} New</h3>
          </CardContent>
        </Card>

        <Card className="rounded-none border-gray-100 border bg-gray-50/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Channel Status</p>
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
               Resend API ACTIVE
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* Composer Section */}
      <Card className="rounded-none border-black border-2">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-xl font-black uppercase tracking-widest italic">Campaign Studio</CardTitle>
          <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
             Your header and sign-off (Warmly, The Lamssé Luxe Team) are applied automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Campaign Subject</label>
            </div>
            <Input 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. THE SPRING DROP: UNLEASH YOUR SOFT LIFE"
              className="rounded-none border-black h-12 font-black italic uppercase tracking-widest text-sm focus-visible:ring-black"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Brand Story / Message</label>
               <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                  <Info className="w-3 h-3" /> RTF Auto-Wrap Active
               </div>
            </div>
            <Textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell your story. Describe the new collection, share upcoming events, or simply say hello..."
              className="rounded-none border-black min-h-[400px] font-medium leading-relaxed p-6 text-sm focus-visible:ring-black"
            />
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">
               <AlertTriangle className="w-5 h-5 flex-shrink-0" /> Safety First: Dispatch a test before the live broadcast.
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              {/* Test Dialog */}
              <Dialog open={isTestOpen} onOpenChange={setIsTestOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex-1 md:flex-none h-14 rounded-none border-black border-2 hover:bg-black hover:text-white font-black uppercase tracking-widest text-[11px] px-10 transition-all active:scale-95"
                  >
                    <TestTube className="w-4 h-4 mr-2" /> Dispatch Test
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-none border-2 border-black p-0 overflow-hidden">
                  <div className="bg-black text-white p-6">
                    <DialogTitle className="font-black uppercase tracking-tight italic text-2xl">Quality Assurance</DialogTitle>
                    <DialogDescription className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mt-1">
                      Check for typos and spacing on your personal device.
                    </DialogDescription>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Recipient Email</label>
                        <Input 
                          placeholder="your-email@gmail.com"
                          value={testEmail}
                          onChange={(e) => setTestEmail(e.target.value)}
                          className="rounded-none border-black focus-visible:ring-black font-bold h-12"
                        />
                    </div>
                    <Button 
                      onClick={handleTestSend}
                      disabled={isPending}
                      className="w-full bg-black text-white rounded-none hover:bg-gray-800 font-black uppercase tracking-widest text-[11px] h-12"
                    >
                      {isPending ? "Dispatching..." : "Send Test Now"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Live Dialog */}
              <Dialog open={isLiveOpen} onOpenChange={setIsLiveOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="default" 
                    className="flex-1 md:flex-none h-14 rounded-none bg-black text-white hover:bg-gray-900 font-black uppercase tracking-widest text-[11px] px-10 border-2 border-black transition-all active:scale-95"
                  >
                    <Send className="w-4 h-4 mr-2" /> BLAST TO AUDIENCE
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-none border-2 border-black p-0 overflow-hidden">
                  <div className="bg-red-600 text-white p-6">
                    <DialogTitle className="font-black uppercase tracking-tight italic text-2xl flex items-center gap-3">
                       <AlertTriangle className="w-8 h-8" /> DESTINATION: ALL SUBSCRIBERS
                    </DialogTitle>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="bg-gray-50 p-6 border-l-4 border-red-600 space-y-2">
                       <p className="text-sm font-black uppercase tracking-tight">Crucial Warning</p>
                       <p className="text-sm font-medium leading-relaxed">
                          This action is IRREVERSIBLE. You are about to broadcast this campaign to all <strong>{stats.totalSubscribers}</strong> active subscribers.
                       </p>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <Button 
                        onClick={handleLiveSend}
                        disabled={isPending}
                        className="w-full bg-red-600 text-white rounded-none hover:bg-red-700 font-black uppercase tracking-widest text-[11px] h-14"
                      >
                        {isPending ? "BROADCASTING ENGINE ACTIVE..." : "YES, DISPATCH LIVE CAMPAIGN"}
                      </Button>
                      <Button 
                        variant="ghost"
                        onClick={() => setIsLiveOpen(false)}
                        className="w-full font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-black"
                      >
                        Wait, I need to check something
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Visual Integrity Footer */}
      <div className="flex items-center gap-3 bg-gray-50 border border-border p-4">
         <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <Package className="w-5 h-5 text-gray-500" />
         </div>
         <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-black">Visual Integrity</p>
            <p className="text-xs text-gray-500 font-medium italic">React Email components are pre-compiled for cross-client compatibility.</p>
         </div>
      </div>
    </div>
  );
}
