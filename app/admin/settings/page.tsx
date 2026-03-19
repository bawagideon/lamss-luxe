"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your store ecosystem and infrastructure connections.</p>
      </div>

      <div className="grid gap-8">
        {/* Store Details Box */}
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase tracking-tight">General Information</CardTitle>
            <CardDescription>Primary store details utilized across external communications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="storeName" className="text-xs uppercase font-bold text-gray-500">Store Name</Label>
                <Input id="storeName" defaultValue="Lamssé Luxe" className="border-gray-200 focus-visible:ring-black" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founderEmail" className="text-xs uppercase font-bold text-gray-500">Contact Email</Label>
                <Input id="founderEmail" defaultValue="founder@lamsseluxe.com" className="border-gray-200 focus-visible:ring-black" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-xs uppercase font-bold text-gray-500">Industry Tag</Label>
              <Input id="industry" defaultValue="Luxury Fashion & Community Network" className="border-gray-200 focus-visible:ring-black" />
            </div>
          </CardContent>
        </Card>

        {/* API Connections */}
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase tracking-tight">API & Payment Gateways</CardTitle>
            <CardDescription>Secure credential configurations for external service providers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-gray-500 flex items-center justify-between">
                    Stripe Public Key
                    <span className="text-[10px] text-green-500 bg-green-50 px-2 py-0.5 rounded-full">Connected</span>
                  </Label>
                  <Input type="password" defaultValue="pk_live_00000000000000000" className="border-gray-200 focus-visible:ring-black font-mono text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-gray-500 flex items-center justify-between">
                    Stripe Secret Key
                    <span className="text-[10px] text-green-500 bg-green-50 px-2 py-0.5 rounded-full">Connected</span>
                  </Label>
                  <Input type="password" defaultValue="sk_live_00000000000000000" className="border-gray-200 focus-visible:ring-black font-mono text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-gray-500 flex items-center justify-between">
                  Supabase Backend Project URL
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Pending</span>
                </Label>
                <Input type="text" placeholder="https://your-project.supabase.co" className="border-gray-200 focus-visible:ring-black font-mono text-sm" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Save Execution */}
        <div className="flex justify-end pt-4">
          <Button className="bg-black hover:bg-black/80 font-bold uppercase tracking-wide px-8 h-12 rounded-lg">
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
