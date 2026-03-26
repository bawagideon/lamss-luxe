"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, ExternalLink, Camera } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { getCommunityMoments, uploadCommunityMoment, deleteCommunityMoment } from "@/app/actions/community";
import toast from "react-hot-toast";

export default function AdminCommunityPage() {
  const [moments, setMoments] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getCommunityMoments().then(setMoments);
  }, []);

  const handleUpload = (formData: FormData) => {
    const loader = toast.loading("Uploading community moment...");
    startTransition(async () => {
      try {
        const res = await uploadCommunityMoment(formData);
        if (res?.error) {
          toast.error(res.error, { id: loader });
        } else {
          toast.success("Moment uploaded successfully!", { id: loader });
          getCommunityMoments().then(setMoments);
          setIsDialogOpen(false);
        }
      } catch {
        toast.error("An unexpected error occurred", { id: loader });
      }
    });
  };

  const handleDelete = (id: string, imageUrl: string) => {
    if (confirm("Delete this community moment? This will remove it from the storefront instantly.")) {
      const loader = toast.loading("Deleting moment...");
      startTransition(async () => {
        try {
          const res = await deleteCommunityMoment(id, imageUrl);
          if (res?.error) {
            toast.error(res.error, { id: loader });
          } else {
            toast.success("Moment deleted.", { id: loader });
            setMoments(prev => prev.filter(m => m.id !== id));
          }
        } catch {
          toast.error("Failed to delete", { id: loader });
        }
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Community Moments</h1>
          <p className="text-gray-500 text-sm mt-1">Manage user-generated content, event recaps, and social proof.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-black/80 font-bold tracking-wide uppercase rounded-lg shadow-sm">
              <Plus className="w-4 h-4 mr-2" /> Upload Media
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight">New Media Moment</DialogTitle>
              <DialogDescription>Upload a photo or video to feature on the community storefront.</DialogDescription>
            </DialogHeader>
            <form action={handleUpload} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="image" className="text-xs uppercase font-bold text-gray-500">Moment Media (Image or Video)</Label>
                <Input id="image" name="image" type="file" accept="image/*,video/mp4,video/quicktime,video/webm" required className="border-gray-200 focus-visible:ring-black" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram_link" className="text-xs uppercase font-bold text-gray-500">Instagram Link (Optional)</Label>
                <Input id="instagram_link" name="instagram_link" placeholder="https://instagram.com/p/..." className="border-gray-200 focus-visible:ring-black" />
              </div>
              <Button type="submit" disabled={isPending} className="w-full bg-black hover:bg-black/80 font-bold uppercase tracking-wide h-12">
                {isPending ? "Uploading..." : "Publish To Storefront"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {moments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-card rounded-2xl border border-dashed border-border text-center px-6">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Camera className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold uppercase tracking-tight">No moments published</h3>
          <p className="text-muted-foreground text-sm max-w-xs mt-2">
            Upload your first community moment to show off your Soft Life Queens.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {moments.map((moment) => {
            const isVideo = moment.image_url?.match(/\.(mp4|mov|webm)$|video/i);
            return (
              <div key={moment.id} className="group relative bg-card rounded-xl overflow-hidden border border-border aspect-[4/5] shadow-sm hover:shadow-md transition-all">
                {isVideo ? (
                  <video 
                    src={moment.image_url} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                ) : (
                  <Image 
                    src={moment.image_url} 
                    alt="Community Moment" 
                    fill 
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  {moment.instagram_link && (
                    <a href={moment.instagram_link} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full text-black hover:scale-110 transition-transform shadow-lg">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  <button 
                    onClick={() => handleDelete(moment.id, moment.image_url)}
                    className="p-2 bg-red-500 rounded-full text-white hover:scale-110 transition-transform shadow-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
