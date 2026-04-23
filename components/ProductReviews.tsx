"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProductReviews, submitReview, checkUserReviewStatus } from "@/app/actions/reviews";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  fit_rating: string;
  created_at: string;
  is_verified: boolean;
}

export function ProductReviews({ productId, userId, userName }: { productId: string; userId?: string; userName?: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [userReviewStatus, setUserReviewStatus] = useState<{ hasReviewed: boolean; isVerified?: boolean } | null>(null);

  useEffect(() => {
    if (productId) {
      getProductReviews(productId).then((data) => {
        setReviews(data as Review[]);
        setLoading(false);
      });
      
      if (userId) {
        checkUserReviewStatus(productId, userId).then(setUserReviewStatus);
      }
    }
  }, [productId, userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      toast.error("Please sign in to leave a review.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("product_id", productId);
    formData.append("user_id", userId);
    formData.append("user_name", userName || "Anonymous");
    formData.append("rating", rating.toString());

    const loader = toast.loading("Submitting your voice...");
    const res = await submitReview(formData);

    if (res.error) {
      toast.error(res.error, { id: loader });
    } else {
      toast.success("Review submitted! Awaiting verification.", { id: loader });
      setShowForm(false);
      setUserReviewStatus({ hasReviewed: true, isVerified: false });
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <div className="mt-20 border-t border-border pt-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter">Customer Reviews</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex text-black">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-4 h-4 ${Number(averageRating) >= s ? 'fill-current' : 'text-zinc-200'}`} />
              ))}
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">{averageRating} / 5.0</span>
            <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">({reviews.length} Reviews)</span>
          </div>
        </div>

        {userReviewStatus?.hasReviewed ? (
          <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 px-6 py-3 border border-zinc-100 dark:border-zinc-800 rounded-sm shadow-sm">
             <div className={`w-2 h-2 rounded-full ${userReviewStatus.isVerified ? 'bg-green-500' : 'bg-primary animate-pulse'}`} />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200">
               {userReviewStatus.isVerified 
                 ? "You have already reviewed this piece" 
                 : "Come back later to see your review — Approval Pending"}
             </span>
          </div>
        ) : (
          <Button 
            onClick={() => {
              if (!userId) {
                document.dispatchEvent(new CustomEvent('open-auth-modal'));
                return;
              }
              setShowForm(!showForm);
            }}
            className="bg-black text-white hover:bg-zinc-800 font-bold uppercase tracking-widest text-[10px] h-12 px-8 rounded-none transition-all shadow-xl"
          >
            {showForm ? "Close Form" : userId ? "Share Your Experience" : "Sign in to Review"}
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showForm && userId && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="overflow-hidden mb-20 bg-white border border-zinc-100 shadow-2xl p-8 md:p-12 relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-black to-primary opacity-50" />

            <form onSubmit={handleSubmit} className="space-y-10 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Overall Rating */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800 block">Overall Vibe</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={`transition-all hover:scale-110 ${rating >= s ? 'text-primary' : 'text-zinc-200'}`}
                      >
                        <Star className={`w-8 h-8 ${rating >= s ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Select stars to rate</p>
                </div>

                {/* Fit Selector */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800 block">Fit Experience</label>
                  <div className="flex bg-zinc-50 p-1 rounded-sm border border-zinc-200">
                    {["Runs Small", "True To Size", "Runs Large"].map((fit) => (
                      <label key={fit} className="flex-1 cursor-pointer">
                        <input type="radio" name="fit_rating" value={fit} defaultChecked={fit === "True To Size"} className="sr-only peer" />
                        <div className="text-[9px] font-black uppercase tracking-widest py-3 text-center transition-all peer-checked:bg-black peer-checked:text-white hover:bg-zinc-100">
                          {fit}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800 block">Your Story</label>
                <textarea
                  name="comment"
                  required
                  placeholder="Tell us about the fabric, the silhouette, and the moments you created in this piece..."
                  className="w-full p-6 bg-zinc-50 border border-zinc-200 text-sm font-bold text-zinc-800 focus:bg-white focus:ring-1 focus:ring-primary outline-none min-h-[160px] transition-all italic placeholder:text-zinc-400 placeholder:not-italic"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Posting as {userName || "Verified Guest"}
                </div>
                <Button type="submit" className="bg-black text-white font-black uppercase tracking-[0.2em] h-14 px-12 rounded-none hover:bg-primary transition-colors text-xs">
                  Post Your Review
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-12">
        {reviews.map((review) => (
          <div key={review.id} className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-zinc-100">
            <div className="md:col-span-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm uppercase tracking-tight">{review.user_name}</span>
                {review.is_verified && <CircleCheck className="w-3.5 h-3.5 text-black" />}
              </div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
              <div className="flex text-black pt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-3 h-3 ${review.rating >= s ? 'fill-current' : 'text-zinc-200'}`} />
                ))}
              </div>
            </div>

            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-[9px] uppercase font-black px-2 py-0.5 border-zinc-200 text-zinc-500 rounded-none bg-zinc-50">
                  Fit: {review.fit_rating}
                </Badge>
                {review.is_verified && (
                  <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-1">
                    <CircleCheck className="w-2.5 h-2.5" /> Verified Purchase
                  </span>
                )}
              </div>
              <p className="text-[15px] leading-relaxed text-zinc-700 font-medium italic">&quot;{review.comment}&quot;</p>
            </div>
          </div>
        ))}

        {reviews.length === 0 && !loading && (
          <div className="py-12 text-center bg-zinc-50 border border-dashed border-zinc-200 rounded-lg">
            <MessageSquare className="w-8 h-8 mx-auto text-zinc-300 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Be the first to share your Luxe experience.</p>
          </div>
        )}
      </div>
    </div>
  );
}
