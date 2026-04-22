"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDraft } from "@/hooks/useAdminDraft";
import { CloudSync, CheckCircle2, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { useState, useEffect, useMemo } from "react";

interface SettingsState {
  storeName: string;
  contactEmail: string;
  industryTag: string;
  stripePublic: string;
  stripeSecret: string;
  supabaseUrl: string;
}

export default function AdminSettingsPage() {
  const defaultValues: SettingsState = useMemo(() => ({
    storeName: "Lamssé Luxe",
    contactEmail: "founder@lamsseluxe.com",
    industryTag: "Luxury Fashion & Community Network",
    stripePublic: "pk_live_00000000000000000",
    stripeSecret: "sk_live_00000000000000000",
    supabaseUrl: "https://your-project.supabase.co"
  }), []);

  const { draft, updateDraft, clearDraft, isLoaded } = useAdminDraft<SettingsState>(
    'admin_settings',
    defaultValues
  );

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    const isDifferent = Object.entries(draft).some(([key, val]) => val !== defaultValues[key as keyof SettingsState]);
    setHasChanges(isDifferent);
  }, [draft, isLoaded, defaultValues]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Settings synced to cloud!");
    setIsSaving(false);
    // In a real app, we'd update the DB here.
    // For now, we'll keep the draft as the truth.
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Configure your store ecosystem and infrastructure connections.</p>
        </div>

        {isLoaded && hasChanges && (
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100 text-[10px] font-black uppercase tracking-widest animate-pulse">
                <CloudSync className="w-3 h-3" />
                Unsaved Changes
             </div>
             <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearDraft}
                className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500"
              >
                <RotateCcw className="w-3 h-3 mr-2" /> Reset
             </Button>
          </div>
        )}
      </div>

      <div className="grid gap-8">
        {/* Store Details Box */}
        <Card className="rounded-xl border-gray-100 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-gray-50 bg-gray-50/30">
            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              General Information
              <Badge variant="secondary" className="text-[9px] h-4">Core</Badge>
            </CardTitle>
            <CardDescription>Primary store details utilized across external communications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="storeName" className="text-xs uppercase font-bold text-gray-500">Store Name</Label>
                <Input 
                  id="storeName" 
                  value={isLoaded ? draft.storeName : defaultValues.storeName}
                  onChange={(e) => updateDraft({ storeName: e.target.value })}
                  className="border-gray-200 focus-visible:ring-black h-12" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founderEmail" className="text-xs uppercase font-bold text-gray-500">Contact Email</Label>
                <Input 
                  id="founderEmail" 
                  value={isLoaded ? draft.contactEmail : defaultValues.contactEmail}
                  onChange={(e) => updateDraft({ contactEmail: e.target.value })}
                  className="border-gray-200 focus-visible:ring-black h-12" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-xs uppercase font-bold text-gray-500">Industry Tag</Label>
              <Input 
                id="industry" 
                value={isLoaded ? draft.industryTag : defaultValues.industryTag}
                onChange={(e) => updateDraft({ industryTag: e.target.value })}
                className="border-gray-200 focus-visible:ring-black h-12" 
              />
            </div>
          </CardContent>
        </Card>

        {/* API Connections */}
        <Card className="rounded-xl border-gray-100 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-gray-50 bg-gray-50/30">
            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              API & Payment Gateways
              <Badge variant="outline" className="text-[9px] h-4 border-zinc-200">Secure</Badge>
            </CardTitle>
            <CardDescription>Secure credential configurations for external service providers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-gray-500 flex items-center justify-between">
                    Stripe Public Key
                    <span className="text-[10px] text-green-500 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                       <CheckCircle2 className="w-2 h-2" /> Live
                    </span>
                  </Label>
                  <Input 
                    type="password" 
                    value={isLoaded ? draft.stripePublic : defaultValues.stripePublic}
                    onChange={(e) => updateDraft({ stripePublic: e.target.value })}
                    className="border-gray-200 focus-visible:ring-black font-mono text-sm h-12" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-gray-500 flex items-center justify-between">
                    Stripe Secret Key
                    <span className="text-[10px] text-green-500 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                       <CheckCircle2 className="w-2 h-2" /> Encrypted
                    </span>
                  </Label>
                  <Input 
                    type="password" 
                    value={isLoaded ? draft.stripeSecret : defaultValues.stripeSecret}
                    onChange={(e) => updateDraft({ stripeSecret: e.target.value })}
                    className="border-gray-200 focus-visible:ring-black font-mono text-sm h-12" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-gray-500 flex items-center justify-between">
                  Supabase Backend Project URL
                  <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Endpoint</span>
                </Label>
                <Input 
                  type="text" 
                  value={isLoaded ? draft.supabaseUrl : defaultValues.supabaseUrl}
                  onChange={(e) => updateDraft({ supabaseUrl: e.target.value })}
                  placeholder="https://your-project.supabase.co" 
                  className="border-gray-200 focus-visible:ring-black font-mono text-sm h-12" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Save Execution */}
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="bg-black hover:bg-black/80 font-bold uppercase tracking-widest px-8 h-14 rounded-xl shadow-xl transition-all active:scale-95 disabled:opacity-30"
          >
            {isSaving ? "Syncing..." : "Save Configuration"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Badge({ children, variant = "default", className = "" }: { children: React.ReactNode, variant?: "default" | "secondary" | "outline", className?: string }) {
  const styles = {
    default: "bg-black text-white",
    secondary: "bg-gray-100 text-gray-900 border-none",
    outline: "bg-transparent text-gray-500 border border-gray-200"
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-black uppercase tracking-tighter ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
