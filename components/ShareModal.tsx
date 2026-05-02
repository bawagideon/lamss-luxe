"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle, Facebook, X as XIcon } from "lucide-react";
import { toast } from "react-hot-toast";

export function ShareModal({ children, productId, productName }: { children: React.ReactNode, productId: string, productName: string }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}/product/${productId}`);
  }, [productId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  const handleShare = async (platform: string) => {
    const text = `Check out ${productName} on Lamssé Luxe!`;
    let shareUrl = "";

    switch (platform) {
      case "text":
        shareUrl = `sms:?body=${encodeURIComponent(text + " " + url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case "pinterest":
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[400px] w-[90vw] sm:w-[95vw] rounded-[24px] p-6 bg-white dark:bg-zinc-950 border-none shadow-2xl overflow-hidden flex flex-col min-w-0">
        <DialogHeader className="mb-2 min-w-0 w-full">
          <DialogTitle className="text-center text-[15px] font-black uppercase tracking-widest text-black dark:text-white truncate">Share This</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 min-w-0 w-full">
          <div className="p-4 border border-border rounded-xl bg-zinc-50 dark:bg-zinc-900 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] text-muted-foreground font-medium w-full">
            {url || "Loading..."}
          </div>
          
          <button 
            onClick={handleCopy}
            className="w-full bg-black text-white dark:bg-white dark:text-black py-3.5 rounded-full font-bold text-[13px] transition-transform active:scale-[0.98] truncate px-4"
          >
            Copy URL
          </button>
          
          <button 
            onClick={() => handleShare("text")}
            className="w-full bg-white dark:bg-zinc-950 text-black dark:text-white border border-border py-3.5 rounded-full font-bold text-[13px] flex items-center justify-center gap-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 truncate px-4"
          >
            <MessageCircle className="w-5 h-5 shrink-0" /> Share via Text
          </button>
          
          <button 
            onClick={() => handleShare("facebook")}
            className="w-full bg-white dark:bg-zinc-950 text-black dark:text-white border border-border py-3.5 rounded-full font-bold text-[13px] flex items-center justify-center gap-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 truncate px-4"
          >
            <Facebook className="w-5 h-5 text-blue-600 shrink-0" /> Share via Facebook
          </button>
          
          <button 
            onClick={() => handleShare("pinterest")}
            className="w-full bg-white dark:bg-zinc-950 text-black dark:text-white border border-border py-3.5 rounded-full font-bold text-[13px] flex items-center justify-center gap-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 truncate px-4"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-600 shrink-0"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z"/></svg> Share via Pinterest
          </button>
          
          <button 
            onClick={() => handleShare("twitter")}
            className="w-full bg-white dark:bg-zinc-950 text-black dark:text-white border border-border py-3.5 rounded-full font-bold text-[13px] flex items-center justify-center gap-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 truncate px-4"
          >
            <XIcon className="w-4 h-4 shrink-0" /> Share via X
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
