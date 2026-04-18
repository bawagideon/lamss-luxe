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
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
            <TableHead className="font-black uppercase text-[10px] tracking-widest py-4">Shopper Detail</TableHead>
            <TableHead className="font-black uppercase text-[10px] tracking-widest py-4">Product</TableHead>
            <TableHead className="font-black uppercase text-[10px] tracking-widest py-4">Rating & Review</TableHead>
            <TableHead className="font-black uppercase text-[10px] tracking-widest py-4 text-right">Moderation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-20">
                <div className="flex flex-col items-center opacity-40">
                    <MessageSquare className="w-8 h-8 mb-2" />
                    <p className="text-xs font-black uppercase tracking-widest">The review desk is currently clear.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((review) => (
              <TableRow key={review.id} className="group hover:bg-zinc-50/50 transition-colors">
                <TableCell className="align-top">
                  <div className="space-y-1">
                    <div className="font-bold text-sm uppercase flex items-center gap-1.5">
                      {review.user_name}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-bold tracking-tight mb-2 uppercase">{review.user_id?.slice(0, 8)}...</div>
                    <Link 
                        href={`/admin/customers?search=${encodeURIComponent(review.user_name)}`}
                        className="inline-flex items-center text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-zinc-100 rounded group-hover:bg-black group-hover:text-white transition-all"
                    >
                        <User className="w-2.5 h-2.5 mr-1" /> View Profile
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="align-top">
                   <div className="flex items-start gap-3">
                      <div className="relative w-12 h-16 bg-zinc-100 rounded overflow-hidden border">
                         {review.products?.image_url && (
                             <NextImage src={review.products.image_url} alt="Product" fill className="object-cover" />
                          )}
                      </div>
                      <div className="max-w-[150px]">
                        <p className="text-[10px] font-black uppercase leading-tight line-clamp-2">{review.products?.name}</p>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1">Fit: {review.fit_rating || 'N/A'}</p>
                      </div>
                   </div>
                </TableCell>
                <TableCell className="align-top">
                  <div className="space-y-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${review.rating >= s ? 'fill-black text-black' : 'text-zinc-200'}`} />
                      ))}
                    </div>
                    <p className="text-xs leading-relaxed text-zinc-600 italic">
                      &quot;{review.comment}&quot;
                    </p>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                       Submitted {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right align-top">
                  <div className="flex items-center justify-end gap-2">
                    {!review.is_verified && (
                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(review.id)}
                        className="bg-black text-white hover:bg-zinc-800 text-[10px] font-black uppercase px-4 h-8 rounded-none tracking-widest"
                      >
                        <Check className="w-3.5 h-3.5 mr-1.5" /> Approve
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(review.id)}
                      className="text-zinc-400 hover:text-red-600 transition-colors h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Review Moderation</h1>
          <p className="text-gray-500 text-sm mt-1">Verify and manage customer feedback directly.</p>
        </div>
        
        <div className="bg-black text-white px-4 py-2 rounded-none flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest">{pendingReviews.length} Pending Approval</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-black/5 shadow-none bg-zinc-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Voices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{reviews.length}</div>
          </CardContent>
        </Card>
        <Card className="border-black/5 shadow-none bg-zinc-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">Approval Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{reviews.length > 0 ? Math.round((approvedReviews.length / reviews.length) * 100) : 0}%</div>
          </CardContent>
        </Card>
        <Card className="border-black/5 shadow-none bg-zinc-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">Customer NPS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black flex items-baseline gap-1">
                {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0"}
                <Star className="w-4 h-4 fill-black text-black" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="bg-zinc-100 p-1 rounded-none border border-zinc-200">
          <TabsTrigger value="pending" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white text-[10px] font-black uppercase tracking-widest px-6">
            Pending ({pendingReviews.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white text-[10px] font-black uppercase tracking-widest px-6">
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
