"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { RotateCcw, CloudSync } from "lucide-react";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type ProfileData = { first_name?: string | null; last_name?: string | null; phone?: string | null; address?: string | null; };

export function InfoForm({ initialData }: { initialData: ProfileData }) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
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

  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    setHasDraft(!!localStorage.getItem('profile_draft'));
  }, [watchedValues]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight uppercase">CONTACT DETAILS</h2>
        {form.formState.isDirty && (
          <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase tracking-widest animate-pulse">
            <CloudSync className="w-3 h-3" />
            Auto-saving to browser...
          </div>
        )}
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">First Name</label>
            <Input 
              {...form.register("first_name")} 
              className="bg-gray-50/50 border-gray-200 focus:border-black transition-colors rounded-md h-12"
            />
            {form.formState.errors.first_name && (
              <p className="text-xs text-red-500">{form.formState.errors.first_name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Last Name</label>
            <Input 
              {...form.register("last_name")} 
              className="bg-gray-50/50 border-gray-200 focus:border-black transition-colors rounded-md h-12"
            />
            {form.formState.errors.last_name && (
              <p className="text-xs text-red-500">{form.formState.errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
          <Input 
            {...form.register("phone")} 
            className="bg-gray-50/50 border-gray-200 focus:border-black transition-colors rounded-md h-12"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Default Shipping Address</label>
          <Input 
            {...form.register("address")} 
            className="bg-gray-50/50 border-gray-200 focus:border-black transition-colors rounded-md h-12"
            placeholder="123 Luxury Ave, NY 10001"
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-12 mt-6 rounded-full font-bold tracking-wide uppercase text-xs hover:bg-black bg-black text-white transition-all shadow-md hover:shadow-lg"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
