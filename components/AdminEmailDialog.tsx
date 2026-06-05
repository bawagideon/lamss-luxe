'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Sparkles, Loader2 } from "lucide-react";
import { sendAdminEmail } from "@/app/actions/admin-emails";
import toast from "react-hot-toast";

interface AdminEmailDialogProps {
  recipients: { email: string; name?: string }[];
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function AdminEmailDialog({ recipients, trigger, onSuccess }: AdminEmailDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    title: "",
    message: "",
    buttonText: "",
    buttonUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (recipients.length === 0) {
      toast.error("No recipients selected.");
      return;
    }
    if (!formData.subject || !formData.title || !formData.message) {
      toast.error("Please fill out the subject, headline, and message fields.");
      return;
    }

    setLoading(true);
    const res = await sendAdminEmail({
      to: recipients.map(r => r.email),
      ...formData
    });
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(`Email dispatched to ${recipients.length} recipient(s).`);
      setIsOpen(false);
      setFormData({ subject: "", title: "", message: "", buttonText: "", buttonUrl: "" });
      onSuccess?.();
    }
  };

  const handleSendTest = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!testEmail) {
      toast.error("Please enter a test email address first.");
      return;
    }

    setTestLoading(true);
    const res = await sendAdminEmail({
      to: [testEmail],
      ...formData
    });
    setTestLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(`Test proof sent successfully to ${testEmail}!`, {
        icon: '🚀',
        style: { borderRadius: '0px', background: '#000', color: '#fff' }
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="font-bold uppercase text-[10px] tracking-widest border-black hover:bg-black hover:text-white transition-all">
            <Mail className="w-3.5 h-3.5 mr-2" /> Send High-Fidelity Email
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-2">
            <Sparkles className="w-3 h-3" /> 10/10 Email Experience
          </div>
          <DialogTitle className="text-3xl font-black uppercase tracking-tight">Compose Brand Outreach</DialogTitle>
          <DialogDescription className="text-sm font-medium">
            You are sending this email to <span className="text-black font-black">{recipients.length}</span> recipient(s).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Email Subject</label>
              <Input 
                placeholder="e.g. Exclusive Access: The Soft Life Drop is Here" 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="font-bold h-12"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Email Headline (H1)</label>
              <Input 
                placeholder="e.g. YOU'RE INVITED, QUEEN." 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="font-bold h-12"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Body Message</label>
              <Textarea 
                placeholder="Craft your premium message here..." 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="font-medium min-h-[150px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Button Text (Optional)</label>
                <Input 
                  placeholder="e.g. SHOP THE DROP" 
                  value={formData.buttonText}
                  onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                  className="font-bold h-12"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Button URL</label>
                <Input 
                  placeholder="https://lamsseluxe.ca/shop" 
                  value={formData.buttonUrl}
                  onChange={(e) => setFormData({...formData, buttonUrl: e.target.value})}
                  className="font-medium h-12"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200 pt-6 mt-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">Proofing / Test Mode</h4>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Test Recipient Email</label>
                <Input 
                  placeholder="your-email@example.com" 
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="font-bold h-12"
                />
              </div>
              <Button
                type="button"
                onClick={handleSendTest}
                disabled={testLoading || !testEmail}
                className="h-12 px-6 bg-zinc-900 text-white font-black uppercase tracking-wider text-[10px] hover:bg-zinc-800 transition-all rounded-none shrink-0 animate-in fade-in duration-300"
              >
                {testLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Test Proof"}
              </Button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 font-medium">
              Send a draft proof to your personal email to verify layout, titles, and button URLs before launching to the active email list.
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 bg-black text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-primary transition-all shadow-xl"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Dispatch Email Campaign"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
