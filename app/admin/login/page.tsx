"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    // Simulate Supabase signInWithOtp API delay
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 800);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) return;
    setIsLoading(true);
    // Simulate Supabase verifyOtp API delay
    setTimeout(() => {
      setIsLoading(false);
      router.push("/admin");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm bg-white border border-gray-100 shadow-sm rounded-2xl p-8">
        <div className="flex flex-col items-center justify-center space-y-4 mb-8">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-black text-center">Admin Portal</h1>
          <p className="text-sm text-gray-500 text-center leading-relaxed">
            {step === 1 ? "Enter your authorized admin email address to receive an access token." : "Enter the strict 6-digit OTP sent securely to your email."}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase font-bold text-gray-500 tracking-wider">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="founder@lamsseluxe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 border-gray-200 focus-visible:ring-black rounded-lg"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-black hover:bg-black/80 font-bold uppercase tracking-wide rounded-lg">
              {isLoading ? "Generating Token..." : "Send Magic Link"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pin" className="text-xs uppercase font-bold text-gray-500 tracking-wider">6-Digit Access PIN</Label>
              <Input
                id="pin"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                className="h-12 border-gray-200 focus-visible:ring-black rounded-lg text-center text-lg font-mono tracking-widest"
              />
            </div>
            <Button type="submit" disabled={isLoading || pin.length !== 6} className="w-full h-12 bg-black hover:bg-black/80 font-bold uppercase tracking-wide rounded-lg">
              {isLoading ? "Verifying Keys..." : "Authenticate"}
            </Button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-gray-500 hover:text-black font-medium transition-colors"
            >
              &larr; Back to Email
            </button>
          </form>
        )}
      </div>
      
      <p className="mt-8 text-xs text-gray-400 font-medium tracking-wide uppercase">
        Secure Infrastructure &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
}
