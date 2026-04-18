"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProductReviews, submitReview } from "@/app/actions/reviews";
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

  useEffect(() => {
    if (productId) {
      getProductReviews(productId).then((data) => {
        setReviews(data as Review[]);
        setLoading(false);
      });
    }
  }, [productId]);

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
      // Wait a moment for revalidation path to potentially trigger (though it won't show yet)
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

        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white hover:bg-zinc-800 font-bold uppercase tracking-widest text-[10px] h-12 px-8 rounded-none transition-all"
        >
          {showForm ? "Close Form" : "Write a Review"}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-16 bg-zinc-50 border border-zinc-100 p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">How would you rate it?</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button 
                      key={s} 
                      type="button" 
                      onClick={() => setRating(s)}
                      className={`p-2 transition-colors ${rating >= s ? 'text-black' : 'text-zinc-200'}`}
                    >
                      <Star className={`w-6 h-6 ${rating >= s ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Fit Experience</label>
                <select name="fit_rating" required className="w-full h-12 bg-white border border-zinc-200 px-4 text-sm font-medium focus:ring-1 focus:ring-black outline-none">
                  <option value="True to size">True to size</option>
                  <option value="Runs small">Runs small</option>
                  <option value="Runs large">Runs large</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Your Story</label>
                <textarea 
                  name="comment" 
                  required 
                  placeholder="Tell us about the fabric, the fit, and how it makes you feel..."
                  className="w-full p-4 bg-white border border-zinc-200 text-sm font-medium focus:ring-1 focus:ring-black outline-none min-h-[120px]"
                />
              </div>

              <Button type="submit" className="w-full bg-black text-white font-black uppercase tracking-widest h-14 rounded-none">
                Post Review
              </Button>
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
