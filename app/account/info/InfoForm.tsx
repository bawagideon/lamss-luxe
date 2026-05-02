"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { CloudSync, KeyRound } from "lucide-react";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  twitter: z.string().optional(),
  birthday: z.string().optional(),
  gender: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type ProfileData = { 
  first_name?: string | null; 
  last_name?: string | null; 
  phone?: string | null; 
  address?: string | null; 
  instagram?: string | null;
  tiktok?: string | null;
  twitter?: string | null;
  birthday?: string | null;
  gender?: string | null;
};

export function InfoForm({ initialData, email }: { initialData: ProfileData, email: string }) {
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const supabase = createClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      instagram: initialData?.instagram || "",
      tiktok: initialData?.tiktok || "",
      twitter: initialData?.twitter || "",
      birthday: initialData?.birthday || "",
      gender: initialData?.gender || "",
    },
  });

  // PRESERVATION: Load drafts on mount
  useEffect(() => {
    const saved = localStorage.getItem('profile_draft');
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        form.reset({ ...form.getValues(), ...draft });
        toast.success("Recovered unsaved edits", { id: 'profile-recovery', duration: 2000 });
      } catch (e) {
        console.error("Draft recovery failed", e);
      }
    }
  }, [form]);

  // PERSISTENCE: Save drafts on every change
  const watchedValues = form.watch();
  useEffect(() => {
    const isDifferent = Object.entries(watchedValues).some(([key, val]) => val !== initialData?.[key as keyof ProfileData]);
    if (isDifferent) {
      localStorage.setItem('profile_draft', JSON.stringify(watchedValues));
    } else {
      localStorage.removeItem('profile_draft');
    }
  }, [watchedValues, initialData]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Session expired.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone,
        address: values.address,
        instagram: values.instagram,
        tiktok: values.tiktok,
        twitter: values.twitter,
        birthday: values.birthday,
        gender: values.gender,
      })
      .eq("id", user.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile updated successfully!");
      localStorage.removeItem('profile_draft');
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset email sent! Please check your inbox.");
    }
    setResetting(false);
  };

  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    setHasDraft(!!localStorage.getItem('profile_draft'));
  }, [watchedValues]);

  return (
    <div className="space-y-12">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 w-full">
        
        {/* ABOUT YOU Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <h2 className="text-xl font-black tracking-tight uppercase text-foreground">ABOUT YOU</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500" />
                Instagram
              </label>
              <Input 
                {...form.register("instagram")} 
                placeholder="@username"
                className="bg-muted/50 border-border focus:border-foreground transition-colors rounded-md h-12"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-black dark:bg-white" />
                TikTok
              </label>
              <Input 
                {...form.register("tiktok")} 
                placeholder="@username"
                className="bg-muted/50 border-border focus:border-foreground transition-colors rounded-md h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-sky-400" />
                Twitter
              </label>
              <Input 
                {...form.register("twitter")} 
                placeholder="@username"
                className="bg-muted/50 border-border focus:border-foreground transition-colors rounded-md h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center text-orange-500 text-[10px]">🎂</div>
                Birthday
              </label>
              <Input 
                {...form.register("birthday")} 
                type="date"
                className="bg-muted/50 border-border focus:border-foreground transition-colors rounded-md h-12 block"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center text-pink-500 text-[10px]">👤</div>
                Gender
              </label>
              <Input 
                {...form.register("gender")} 
                placeholder="E.g. Female, Male, Non-binary"
                className="bg-muted/50 border-border focus:border-foreground transition-colors rounded-md h-12"
              />
            </div>
          </div>
        </div>

        {/* CONTACT DETAILS Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <h2 className="text-xl font-black tracking-tight uppercase text-foreground">CONTACT DETAILS</h2>
            {(form.formState.isDirty || hasDraft) && (
              <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase tracking-widest animate-pulse">
                <CloudSync className="w-3 h-3" />
                {hasDraft ? "Recovered Draft" : "Auto-saving to browser..."}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">First Name</label>
              <Input 
                {...form.register("first_name")} 
                className="bg-muted/50 border-border focus:border-foreground transition-colors rounded-md h-12"
              />
              {form.formState.errors.first_name && (
                <p className="text-xs text-red-500">{form.formState.errors.first_name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Last Name</label>
              <Input 
                {...form.register("last_name")} 
                className="bg-muted/50 border-border focus:border-foreground transition-colors rounded-md h-12"
              />
              {form.formState.errors.last_name && (
                <p className="text-xs text-red-500">{form.formState.errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number</label>
              <Input 
                {...form.register("phone")} 
                className="bg-muted/50 border-border focus:border-foreground transition-colors rounded-md h-12"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Account Email</label>
              <Input 
                value={email}
                disabled
                className="bg-muted/30 border-border text-muted-foreground cursor-not-allowed rounded-md h-12"
              />
              <p className="text-[10px] text-muted-foreground">Your registered email cannot be changed.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Default Shipping Address</label>
            <Input 
              {...form.register("address")} 
              className="bg-muted/50 border-border focus:border-foreground transition-colors rounded-md h-12"
              placeholder="123 Luxury Ave, NY 10001"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 h-14 rounded-full font-bold tracking-wide uppercase text-xs hover:bg-black/90 bg-black text-white dark:bg-white dark:text-black dark:hover:bg-white/90 transition-all shadow-md hover:shadow-lg"
            >
              {loading ? "Saving..." : "Save All Changes"}
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              onClick={handleResetPassword}
              disabled={resetting}
              className="h-14 px-8 rounded-full font-bold tracking-wide text-xs hover:bg-muted transition-all flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              {resetting ? "Sending..." : "Reset Password"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
