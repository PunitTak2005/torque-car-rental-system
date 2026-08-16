import React from 'react';
import { Star, MapPin, Sparkles, Check, Info } from 'lucide-react';

/**
 * CarGallery – renders the main image and a row of thumbnails.
 * Props:
 *   images: array of image URLs
 *   activeImage: currently selected image URL
 *   setActiveImage: function to update the active image
 */
const CarGallery = ({ images = [], activeImage, setActiveImage }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-4 sm:p-6 shadow-sm space-y-4 transition-colors">
      {/* Main Image */}
      <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-850 border border-slate-50 dark:border-slate-800">
        <img src={activeImage} alt="Car" className="w-full h-full object-cover" />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(img)}
              className={`w-20 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                activeImage === img
                  ? 'border-accent-600'
                  : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarGallery;
