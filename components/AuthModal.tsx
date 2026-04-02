"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { syncCartOnAuth, syncWishlistOnAuth, signUpUser } from "@/app/actions/auth-actions";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/hooks/useWishlist";

// --- SCHEMAS ---
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const checkoutSchema = z.object({
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Must be 8 characters").regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  phone: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof checkoutSchema>;

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      setMode(customEvent.detail?.mode || "signIn");
      setIsOpen(true);
    };
    document.addEventListener("open-auth-modal", handleOpen as EventListener);
    return () => document.removeEventListener("open-auth-modal", handleOpen as EventListener);
  }, []);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", phone: "" },
  });

  const watchPassword = signupForm.watch("password");

  // Visual Password Checkmarks
  const has8Chars = watchPassword?.length >= 8;
  const hasUpper = /[A-Z]/.test(watchPassword || "");
  const hasLower = /[a-z]/.test(watchPassword || "");
  const hasNumber = /[0-9]/.test(watchPassword || "");
  const { wishlistIds: wishlistItems } = useWishlist();
  const cartItems = useCart((state) => state.cartItems);

  const onLoginSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      // Sync cart & wishlist after login
      const syncs = [];
      if (cartItems.length > 0) syncs.push(syncCartOnAuth(cartItems));
      if (wishlistItems.length > 0) syncs.push(syncWishlistOnAuth(wishlistItems));
      
      if (syncs.length > 0) await Promise.all(syncs);
      
      toast.success("Welcome back!");
      setIsOpen(false);
      window.location.reload(); // Hard reload to force server hydration
    }
    setIsLoading(false);
  };

  const onSignupSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      const result = await signUpUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Welcome! Check your email for a special invitation.");
        setMode("signIn");
        loginForm.setValue("email", data.email);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white text-black [&>button]:hidden">
        <DialogDescription className="sr-only">Authenticate to access or create your Lamssé Luxe account.</DialogDescription>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="w-6" /> {/* Spacer */}
          <DialogTitle className="text-[14px] font-black uppercase tracking-widest text-center flex-1">
            {mode === "signIn" ? "Welcome!" : "Create Account"}
          </DialogTitle>
          <button onClick={() => setIsOpen(false)} className="hover:opacity-70 transition p-1 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {mode === "signIn" && (
            <div className="space-y-6">
              <div className="flex items-center text-[15px] font-bold">
                <span>Sign In or <button onClick={() => setMode("signUp")} className="underline ml-1 hover:text-gray-600 transition">Create an Account</button></span>
              </div>
              
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Input 
                    {...loginForm.register("email")}
                    type="email" 
                    placeholder="Email" 
                    className="h-12 border-gray-200 focus-visible:ring-black placeholder:text-gray-400"
                  />
                  {loginForm.formState.errors.email && <p className="text-red-500 text-xs font-medium">{loginForm.formState.errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Input 
                    {...loginForm.register("password")}
                    type="password" 
                    placeholder="Password" 
                    className="h-12 border-gray-200 focus-visible:ring-black placeholder:text-gray-400"
                  />
                </div>
                
                <div className="pt-1">
                  <button type="button" className="text-[13px] text-gray-500 underline hover:text-black transition">Forgot password?</button>
                </div>

                <Button disabled={isLoading} type="submit" className="w-full h-[52px] bg-black hover:bg-black/90 text-white font-bold tracking-wide mt-2 text-[15px] rounded-full">
                  {isLoading ? "Authenticating..." : "Continue"}
                </Button>
              </form>
            </div>
          )}

          {mode === "signUp" && (
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
              <div className="space-y-3">
                <Input {...signupForm.register("email")} type="email" placeholder="Email" className="h-12 border-gray-200 focus-visible:ring-black" />
                <Input {...signupForm.register("firstName")} type="text" placeholder="First Name" className="h-12 border-gray-200 focus-visible:ring-black" />
                <Input {...signupForm.register("lastName")} type="text" placeholder="Last Name" className="h-12 border-gray-200 focus-visible:ring-black" />
                <Input {...signupForm.register("password")} type="password" placeholder="Password" className="h-12 border-gray-200 focus-visible:ring-black" />
                
                {/* Password Strength Matrix */}
                <div className="px-1 py-1">
                  <p className="text-[11px] text-gray-500 mb-2 font-medium">Your password must contain at least</p>
                  <div className="grid grid-cols-2 gap-y-2 text-[11px] font-medium text-gray-500">
                    <div className="flex items-center gap-2">
                      <X className={`w-3.5 h-3.5 ${has8Chars ? "text-green-500" : "text-gray-400"}`} />
                      <span className={has8Chars ? "text-green-600" : ""}>8 characters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <X className={`w-3.5 h-3.5 ${hasUpper ? "text-green-500" : "text-gray-400"}`} />
                      <span className={hasUpper ? "text-green-600" : ""}>1 uppercase letter</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <X className={`w-3.5 h-3.5 ${hasLower ? "text-green-500" : "text-gray-400"}`} />
                      <span className={hasLower ? "text-green-600" : ""}>1 lowercase letter</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <X className={`w-3.5 h-3.5 ${hasNumber ? "text-green-500" : "text-gray-400"}`} />
                      <span className={hasNumber ? "text-green-600" : ""}>1 number</span>
                    </div>
                  </div>
                </div>

                <Input {...signupForm.register("phone")} type="tel" placeholder="Phone Number (optional)" className="h-12 border-gray-200 focus-visible:ring-black" />
              </div>

              <div className="pt-2 pb-2">
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                  By selecting Continue you agree to our <a href="/privacy-policy" className="underline font-bold">Privacy Policy</a> and <a href="/terms-of-service" className="underline font-bold">Terms & Conditions</a>.
                </p>
              </div>

              <Button disabled={isLoading} type="submit" className="w-full h-[52px] bg-black hover:bg-black/90 text-white font-bold tracking-wide text-[15px] rounded-full">
                {isLoading ? "Processing..." : "Continue"}
              </Button>

              <div className="text-center pt-2">
                 <button type="button" onClick={() => setMode("signIn")} className="text-[13px] font-bold text-gray-500 hover:text-black underline transition">Always have an account? Sign In</button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
