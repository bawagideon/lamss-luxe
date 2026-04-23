"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSync, CheckCircle2, RotateCcw, ShieldCheck, Key } from "lucide-react";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { getAdminSettings, updateAdminSettings, Settings } from "@/app/actions/settings";
import { StaffSecuritySettings } from "@/components/StaffSecuritySettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [userRole, setUserRole] = useState<string>("editor");
  const [originalSettings, setOriginalSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getAdminSettings();
      if (data) {
        setSettings(data.settings);
        setOriginalSettings(data.settings);
        setUserRole(data.userRole);
      }
      setLoading(false);
    }
    load();
  }, []);

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    
    // The server action handles the logic of not overwriting masked keys
    const res = await updateAdminSettings(settings);
    
    if (res.success) {
      toast.success("Infrastructure security protocols updated!");
      setOriginalSettings(settings);
    } else {
      toast.error(res.error || "Failed to sync settings.");
    }
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-pulse text-xs font-black uppercase tracking-[0.3em] text-zinc-300">Decrypting Environment...</div>
      </div>
    );
  }

  if (!settings) return <div>Failed to load settings.</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <Tabs defaultValue="general" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
              Settings
              <ShieldCheck className="w-6 h-6 text-green-500" />
            </h1>
            <p className="text-gray-500 text-sm mt-1">Configure your store ecosystem and secure infrastructure connections.</p>
          </div>

          <div className="flex items-center gap-4">
            <TabsList className="bg-gray-100 p-1 rounded-lg h-12">
              <TabsTrigger value="general" className="rounded-md px-6 font-black uppercase text-[10px] tracking-widest">General</TabsTrigger>
              {userRole === 'admin' && (
                <TabsTrigger value="security" className="rounded-md px-6 font-black uppercase text-[10px] tracking-widest">Staff & Security</TabsTrigger>
              )}
            </TabsList>
            
            {hasChanges && (
              <div className="flex items-center gap-3">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSettings(originalSettings)}
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500"
                  >
                    <RotateCcw className="w-3 h-3 mr-2" /> Reset
                </Button>
              </div>
            )}
          </div>
        </div>

        <TabsContent value="general" className="space-y-8">

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
                  value={settings.store_name || ""}
                  onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                  className="border-gray-200 focus-visible:ring-black h-12" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founderEmail" className="text-xs uppercase font-bold text-gray-500">Contact Email</Label>
                <Input 
                  id="founderEmail" 
                  value={settings.contact_email || ""}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  className="border-gray-200 focus-visible:ring-black h-12" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-xs uppercase font-bold text-gray-500">Industry Tag</Label>
              <Input 
                id="industry" 
                value={settings.industry_tag || ""}
                onChange={(e) => setSettings({ ...settings, industry_tag: e.target.value })}
                className="border-gray-200 focus-visible:ring-black h-12" 
              />
            </div>
          </CardContent>
        </Card>

        {/* API Connections */}
        <Card className="rounded-xl border-gray-100 shadow-sm overflow-hidden ring-2 ring-primary/5">
          <CardHeader className="border-b border-gray-50 bg-gray-50/30">
            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              API & Payment Gateways
              <Badge variant="outline" className="text-[9px] h-4 border-zinc-200">Secure</Badge>
            </CardTitle>
            <CardDescription>Secure credential configurations. Sensitive keys are masked for protection.</CardDescription>
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
                    type="text" 
                    value={settings.stripe_public_key || ""}
                    onChange={(e) => setSettings({ ...settings, stripe_public_key: e.target.value })}
                    className="border-gray-200 focus-visible:ring-black font-mono text-sm h-12" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-gray-500 flex items-center justify-between">
                    Stripe Secret Key
                    <span className="text-[10px] text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                       <Key className="w-2 h-2" /> Masked for Security
                    </span>
                  </Label>
                  <Input 
                    type="password" 
                    placeholder="Enter new secret key to update..."
                    value={settings.stripe_secret_key || ""}
                    onChange={(e) => setSettings({ ...settings, stripe_secret_key: e.target.value })}
                    className="border-gray-200 focus-visible:ring-black font-mono text-sm h-12 bg-zinc-50" 
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
                  value={settings.supabase_url || ""}
                  onChange={(e) => setSettings({ ...settings, supabase_url: e.target.value })}
                  placeholder="https://your-project.supabase.co" 
                  className="border-gray-200 focus-visible:ring-black font-mono text-sm h-12" 
                />
              </div>

              {userRole === 'admin' && (
                <div className="pt-4 border-t border-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs uppercase font-black tracking-widest text-black">Device Security Policy</Label>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">Maximum concurrent logins allowed per staff member.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Input 
                        type="number" 
                        min={1}
                        max={10}
                        value={settings.max_admin_devices}
                        onChange={(e) => setSettings({ ...settings, max_admin_devices: parseInt(e.target.value) })}
                        className="w-20 text-center font-black h-10 border-gray-200"
                      />
                    </div>
                  </div>
                </div>
              )}
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
      </TabsContent>

      {userRole === 'admin' && (
        <TabsContent value="security">
          <StaffSecuritySettings />
        </TabsContent>
      )}
    </Tabs>
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
