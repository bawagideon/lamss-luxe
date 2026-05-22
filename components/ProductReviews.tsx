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
    <div className="mt-16 border-t border-zinc-800 pt-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-100">Customer Reviews</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-4 h-4 ${Number(averageRating) >= s ? 'fill-current text-amber-400' : 'text-zinc-800'}`} />
              ))}
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-zinc-100">{averageRating} / 5.0</span>
            <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">({reviews.length} Reviews)</span>
          </div>
        </div>

        {userReviewStatus?.hasReviewed ? (
          <div className="flex items-center gap-3 bg-zinc-950 px-5 py-3 border border-zinc-800 rounded-none">
             <div className={`w-2 h-2 rounded-full ${userReviewStatus.isVerified ? 'bg-green-500' : 'bg-zinc-500 animate-pulse'}`} />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">
               {userReviewStatus.isVerified 
                 ? "You have already reviewed this piece" 
                 : "Review Approval Pending"}
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
            className="bg-zinc-100 text-black hover:bg-zinc-200 font-black uppercase tracking-widest text-[10px] h-11 px-6 rounded-none transition-all"
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
            className="overflow-hidden mb-12 bg-zinc-950 border border-zinc-800 p-6 md:p-8 relative rounded-none"
          >
            <div className="absolute top-0 left-0 w-full h-0.5 bg-zinc-100 opacity-80" />

            <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Overall Rating */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 block">Overall Vibe</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={`transition-all hover:scale-110 ${rating >= s ? 'text-amber-400' : 'text-zinc-800'}`}
                      >
                        <Star className={`w-8 h-8 ${rating >= s ? 'fill-current text-amber-400' : ''}`} />
                      </button>
                    ))}
                  </div>
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-1">Select stars to rate</p>
                </div>

                {/* Fit Selector */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 block">Fit Experience</label>
                  <div className="flex bg-zinc-900 p-0.5 rounded-none border border-zinc-800">
                    {["Runs Small", "True To Size", "Runs Large"].map((fit) => (
                      <label key={fit} className="flex-1 cursor-pointer">
                        <input type="radio" name="fit_rating" value={fit} defaultChecked={fit === "True To Size"} className="sr-only peer" />
                        <div className="text-[9px] font-black uppercase tracking-widest py-3 text-center transition-all peer-checked:bg-zinc-100 peer-checked:text-black hover:bg-zinc-800 text-zinc-400">
                          {fit}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 block">Your Story</label>
                <textarea
                  name="comment"
                  required
                  placeholder="Tell us about the fabric, the silhouette, and the moments you created in this piece..."
                  className="w-full p-4 bg-zinc-900 border border-zinc-800 text-sm font-medium text-zinc-100 focus:bg-zinc-950 focus:border-zinc-500 focus:ring-0 outline-none min-h-[120px] transition-all italic placeholder:text-zinc-500 placeholder:not-italic rounded-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Posting as {userName || "Verified Guest"}
                </div>
                <Button type="submit" className="bg-zinc-100 text-black font-black uppercase tracking-[0.2em] h-11 px-8 rounded-none hover:bg-zinc-200 transition-colors text-[10px]">
                  Post Your Review
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review.id} className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-8 border-b border-zinc-900">
            <div className="md:col-span-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm uppercase tracking-tight text-zinc-100">{review.user_name}</span>
                {review.is_verified && <CircleCheck className="w-3.5 h-3.5 text-zinc-300" />}
              </div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
              <div className="flex text-amber-400 pt-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-3 h-3 ${review.rating >= s ? 'fill-current text-amber-400' : 'text-zinc-800'}`} />
                ))}
              </div>
            </div>

            <div className="md:col-span-3 space-y-3">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-[9px] uppercase font-black px-2 py-0.5 border-zinc-800 text-zinc-400 rounded-none bg-zinc-900/40">
                  Fit: {review.fit_rating}
                </Badge>
                {review.is_verified && (
                  <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-1">
                    <CircleCheck className="w-2.5 h-2.5 text-zinc-400" /> Verified Purchase
                  </span>
                )}
              </div>
              <p className="text-[15px] leading-relaxed text-zinc-300 font-medium italic">&quot;{review.comment}&quot;</p>
            </div>
          </div>
        ))}

        {reviews.length === 0 && !loading && (
          <div className="py-8 text-center bg-zinc-900/30 border border-zinc-800 rounded-none">
            <MessageSquare className="w-6 h-6 mx-auto text-zinc-700 mb-3" />
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Be the first to share your Luxe experience.</p>
          </div>
        )}
      </div>
    </div>
  );
}

