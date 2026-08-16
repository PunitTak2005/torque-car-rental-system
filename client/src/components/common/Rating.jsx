import React, { useState } from 'react';
import { Star } from 'lucide-react';

const Rating = ({
  rating,
  setRating,
  maxStars = 5,
  interactive = false,
  size = 'w-5 h-5',
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (val) => {
    if (interactive && setRating) {
      setRating(val);
    }
  };

  const handleStarHover = (val) => {
    if (interactive) {
      setHoverRating(val);
    }
  };

  const handleStarLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div
      className={`flex items-center gap-1.5 ${className}`}
      onMouseLeave={handleStarLeave}
    >
      {[...Array(maxStars)].map((_, i) => {
        const starVal = i + 1;
        const isActive = hoverRating > 0 ? starVal <= hoverRating : starVal <= rating;
        
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => handleStarClick(starVal)}
            onMouseEnter={() => handleStarHover(starVal)}
            className={`transition-transform duration-100 focus:outline-none ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
            aria-label={interactive ? `Rate ${starVal} out of ${maxStars} stars` : undefined}
          >
            <Star
              className={`${size} ${
                isActive ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
              } shrink-0`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default Rating;
