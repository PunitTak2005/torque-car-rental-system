import React, { useState } from 'react';
import { MessageSquare, Star, Send, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { createReview } from '../../services/api';
import Button from '../common/Button';

const ReviewsSection = ({ carId, reviews: initialReviews = [], onReviewAdded }) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [reviewsList, setReviewsList] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Sync state if prop changes
  React.useEffect(() => {
    setReviewsList(initialReviews);
  }, [initialReviews]);

  // Calculate dynamic rating breakdown stats
  const totalCount = reviewsList.length;
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sumRating = 0;

  reviewsList.forEach(rev => {
    const r = Math.min(Math.max(Math.round(rev.rating || 5), 1), 5);
    ratingCounts[r] = (ratingCounts[r] || 0) + 1;
    sumRating += rev.rating || 5;
  });

  const avgRating = totalCount > 0 ? (sumRating / totalCount).toFixed(1) : '5.0';

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      addToast('Please login to submit a review', 'warning');
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      addToast('Please select a star rating between 1 and 5', 'warning');
      return;
    }

    if (!comment.trim()) {
      addToast('Please enter your review comments', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await createReview({
        carId,
        rating,
        comment: comment.trim()
      });

      if (data.success) {
        addToast('Review submitted successfully!', 'success');
        setComment('');
        setShowReviewForm(false);
        const updated = [data.review, ...reviewsList];
        setReviewsList(updated);
        if (onReviewAdded) onReviewAdded(data.review, updated);
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to submit review';
      addToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-graphite/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-neon-accent" />
            <h3 className="text-base font-display uppercase tracking-widest text-chalk">CLIENT RATINGS & REVIEWS</h3>
          </div>
          <p className="text-[10px] text-silver/70 uppercase tracking-widest mt-1 font-sans flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Client Feedback & Authentic Driver Ratings</span>
          </p>
        </div>

        {user && (
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            variant="secondary"
            className="self-start sm:self-auto text-xs py-2.5 px-4"
          >
            {showReviewForm ? 'CANCEL REVIEW' : 'WRITE A REVIEW'}
          </Button>
        )}
      </div>

      {/* Write a Review Modal / Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="bg-asphalt/80 border border-white/15 p-6 rounded-2xl space-y-4 animate-page-enter">
          <h4 className="text-xs font-bold uppercase tracking-widest text-chalk">SUBMIT YOUR RATING & FEEDBACK</h4>

          {/* Interactive Star Picker */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-silver uppercase tracking-widest">RATING SCORE</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-neon-accent fill-neon-accent'
                        : 'text-silver/40'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-chalk ml-2 font-sans">{rating} / 5 STARS</span>
            </div>
          </div>

          {/* Review Text Area */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-silver uppercase tracking-widest">YOUR EXPERIENCE / COMMENT</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your driving experience, vehicle condition, or trip feedback..."
              className="block w-full px-4 py-3 bg-graphite border border-white/15 text-xs text-chalk focus:outline-none focus:border-neon-accent rounded-xl font-sans"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="submit"
              loading={isSubmitting}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
            >
              <Send className="w-3.5 h-3.5" />
              <span>SUBMIT REVIEW</span>
            </Button>
          </div>
        </form>
      )}

      {/* Ratings Breakdown & Summary Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-asphalt/50 border border-white/10 p-6 rounded-2xl">
        
        {/* Left score card */}
        <div className="md:col-span-4 text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
          <span className="text-4xl sm:text-5xl font-extrabold text-neon-accent font-sans">{avgRating}</span>
          <div className="flex justify-center md:justify-start gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(Number(avgRating))
                    ? 'text-neon-accent fill-neon-accent'
                    : 'text-silver/30'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-silver uppercase tracking-widest block font-sans">
            BASED ON {totalCount} DRIVER REVIEWS
          </span>
        </div>

        {/* Right 5-star distribution bar graph */}
        <div className="md:col-span-8 space-y-2">
          {[5, 4, 3, 2, 1].map((starNum) => {
            const count = ratingCounts[starNum] || 0;
            const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
            return (
              <div key={starNum} className="flex items-center gap-3 text-[10px] font-bold text-silver uppercase tracking-wider font-sans">
                <span className="w-8 shrink-0 flex items-center gap-1">
                  {starNum} <Star className="w-3 h-3 text-neon-accent fill-neon-accent inline" />
                </span>
                <div className="flex-grow h-2 bg-asphalt rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-neon-accent rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-12 text-right text-chalk font-mono shrink-0">{pct}% ({count})</span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Individual Review Cards List */}
      <div className="space-y-4">
        {reviewsList.length === 0 ? (
          <div className="p-8 text-center bg-asphalt/40 border border-white/10 rounded-2xl space-y-2">
            <AlertCircle className="w-6 h-6 text-silver/60 mx-auto" />
            <p className="text-xs text-silver uppercase tracking-widest font-bold">No reviews registered yet for this vehicle.</p>
            <p className="text-[10px] text-silver/60">Be the first client to submit a review after your rental drive!</p>
          </div>
        ) : (
          reviewsList.map((rev) => {
            const authorName = rev.reviewerName || rev.name || rev.userName || rev.author || (rev.user && rev.user.name && !['John Doe', 'Administrator', 'admin', 'User'].includes(rev.user.name) ? rev.user.name : null) || 'Verified Client';

            const getInitials = (str) => {
              if (!str) return 'VC';
              const parts = str.trim().split(' ').filter(Boolean);
              if (parts.length >= 2) {
                return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
              }
              return parts[0] ? parts[0].slice(0, 2).toUpperCase() : 'VC';
            };

            const initials = getInitials(authorName);

            return (
              <div
                key={rev._id || Math.random()}
                className="p-5 sm:p-6 bg-asphalt/60 border border-white/10 rounded-2xl space-y-3 transition-all hover:border-white/20"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-graphite border border-white/15 rounded-full flex items-center justify-center text-neon-accent font-bold text-xs uppercase shadow-inner shrink-0">
                      {initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-chalk uppercase tracking-wider">{authorName}</h4>
                      <span className="text-[9px] text-silver/60 font-mono">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 px-2.5 py-1 bg-graphite border border-white/10 rounded-full">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < (rev.rating || 5)
                            ? 'text-neon-accent fill-neon-accent'
                            : 'text-silver/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-silver/90 text-xs leading-relaxed font-sans italic pl-1 border-l-2 border-neon-accent/40">
                  "{rev.comment}"
                </p>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default ReviewsSection;
