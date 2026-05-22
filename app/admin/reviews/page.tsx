"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Star, Check, Trash2, User, MessageSquare, AlertCircle } from "lucide-react";
import { getAdminReviews, updateReviewStatus, deleteReview } from "@/app/actions/reviews";
import toast from "react-hot-toast";
import NextImage from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminReview {
  id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  fit_rating: string;
  is_verified: boolean;
  created_at: string;
  products?: {
    name: string;
    image_url: string;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);

  const fetchReviews = async () => {
    const data = await getAdminReviews();
    setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string) => {
    const loader = toast.loading("Verifying review...");
    const res = await updateReviewStatus(id, true);
    if ('error' in res) {
      toast.error("Failed to verify.", { id: loader });
    } else {
      toast.success("Review published!", { id: loader });
      fetchReviews();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    
    const loader = toast.loading("Moderating content...");
    const res = await deleteReview(id);
    if ('error' in res) {
      toast.error("Failed to delete.", { id: loader });
    } else {
      toast.success("Review deleted.", { id: loader });
      fetchReviews();
    }
  };

  const pendingReviews = reviews.filter(r => !r.is_verified);
  const approvedReviews = reviews.filter(r => r.is_verified);

  const ReviewTable = ({ data }: { data: AdminReview[] }) => (
    <div className="bg-zinc-950 border border-zinc-800 rounded-none overflow-x-auto shadow-sm">
      <table className="w-full text-sm border-collapse text-left">
        <thead>
          <tr className="bg-zinc-900/60 border-b border-zinc-800">
            <th className="font-black uppercase text-[10px] tracking-widest py-4 px-4 text-zinc-300 border-b border-zinc-800">Shopper Detail</th>
            <th className="font-black uppercase text-[10px] tracking-widest py-4 px-4 text-zinc-300 border-b border-zinc-800">Product</th>
            <th className="font-black uppercase text-[10px] tracking-widest py-4 px-4 text-zinc-300 border-b border-zinc-800">Rating & Review</th>
            <th className="font-black uppercase text-[10px] tracking-widest py-4 px-4 text-zinc-300 border-b border-zinc-800 text-right">Moderation</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-20 border-b border-zinc-900/40">
                <div className="flex flex-col items-center opacity-40">
                  <MessageSquare className="w-8 h-8 mb-2 text-zinc-400" />
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-400">The review desk is currently clear.</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((review) => (
              <tr key={review.id} className="border-b border-zinc-900 hover:bg-zinc-900/20 transition-colors">
                <td className="p-4 align-top border-b border-zinc-900/50">
                  <div className="space-y-1">
                    <div className="font-bold text-sm uppercase flex items-center gap-1.5 text-zinc-100">
                      {review.user_name}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-bold tracking-tight mb-2 uppercase">{review.user_id?.slice(0, 8)}...</div>
                    <Link 
                      href={`/admin/customers?search=${encodeURIComponent(review.user_name)}`}
                      className="inline-flex items-center text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-none hover:bg-zinc-100 hover:text-black transition-all"
                    >
                      <User className="w-2.5 h-2.5 mr-1" /> View Profile
                    </Link>
                  </div>
                </td>
                <td className="p-4 align-top border-b border-zinc-900/50">
                  <div className="flex items-start gap-3">
                    <div className="relative w-12 h-16 bg-zinc-900 rounded-none overflow-hidden border border-zinc-800 flex-shrink-0">
                      {review.products?.image_url && (
                        <NextImage src={review.products.image_url} alt="Product" fill className="object-cover" />
                      )}
                    </div>
                    <div className="max-w-[150px]">
                      <p className="text-[10px] font-black uppercase leading-tight line-clamp-2 text-zinc-200">{review.products?.name}</p>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">Fit: {review.fit_rating || 'N/A'}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 align-top border-b border-zinc-900/50">
                  <div className="space-y-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${review.rating >= s ? 'fill-amber-400 text-amber-400' : 'text-zinc-800'}`} />
                      ))}
                    </div>
                    <p className="text-xs leading-relaxed text-zinc-300 italic">
                      &quot;{review.comment}&quot;
                    </p>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                      Submitted {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </td>
                <td className="p-4 align-top border-b border-zinc-900/50 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {!review.is_verified && (
                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(review.id)}
                        className="bg-zinc-100 text-black hover:bg-zinc-200 text-[10px] font-black uppercase px-4 h-8 rounded-none tracking-widest transition-all"
                      >
                        <Check className="w-3.5 h-3.5 mr-1.5" /> Approve
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(review.id)}
                      className="text-zinc-500 hover:text-red-400 hover:bg-red-950/20 transition-all h-8 w-8 p-0 rounded-none border border-transparent hover:border-red-900/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-100">Review Moderation</h1>
          <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest font-medium">Verify and manage customer feedback directly.</p>
        </div>
        
        <div className="bg-red-950/20 text-red-400 border border-red-900/50 px-4 py-2 rounded-none flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">{pendingReviews.length} Pending Approval</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Voices Card */}
        <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-none relative overflow-hidden backdrop-blur-md shadow-lg flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-pink-600"></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">Total Voices</p>
            <p className="text-4xl font-black text-zinc-100 tracking-tight font-sans">{reviews.length}</p>
          </div>
        </div>

        {/* Approval Rate Card */}
        <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-none relative overflow-hidden backdrop-blur-md shadow-lg flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-amber-500"></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">Approval Rate</p>
            <p className="text-4xl font-black text-zinc-100 tracking-tight font-sans">
              {reviews.length > 0 ? Math.round((approvedReviews.length / reviews.length) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Customer NPS Card */}
        <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-none relative overflow-hidden backdrop-blur-md shadow-lg flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500"></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">Customer NPS</p>
            <div className="text-4xl font-black text-zinc-100 tracking-tight font-sans flex items-baseline gap-1.5">
              {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0"}
              <Star className="w-5 h-5 fill-amber-400 text-amber-400 translate-y-[-2px]" />
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="bg-zinc-950 p-1 rounded-none border border-zinc-800">
          <TabsTrigger value="pending" className="rounded-none data-[state=active]:bg-zinc-100 data-[state=active]:text-black text-[10px] font-black uppercase tracking-[0.15em] px-6 text-zinc-400 bg-transparent hover:text-zinc-100 hover:bg-zinc-900/50 transition-all border-none">
            Pending ({pendingReviews.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="rounded-none data-[state=active]:bg-zinc-100 data-[state=active]:text-black text-[10px] font-black uppercase tracking-[0.15em] px-6 text-zinc-400 bg-transparent hover:text-zinc-100 hover:bg-zinc-900/50 transition-all border-none">
            Approved ({approvedReviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <ReviewTable data={pendingReviews} />
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <ReviewTable data={approvedReviews} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
