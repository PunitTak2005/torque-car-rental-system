import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
  closeOnBackdrop = true
}) => {
  const modalRef = useRef(null);

  // Escape key binding to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-asphalt/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-hidden transition-opacity duration-200"
    >
      <div
        ref={modalRef}
        className={`bg-graphite/95 backdrop-blur-xl border border-white/10 w-full ${maxWidth} max-h-[85vh] p-6 sm:p-8 flex flex-col shadow-2xl relative rounded-3xl animate-modal-enter overflow-hidden`}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10 shrink-0 mb-4">
          {title && (
            <h3 id="modal-title" className="text-xs font-extrabold uppercase tracking-widest text-chalk font-display pr-6">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 text-silver hover:text-neon-accent hover:bg-asphalt rounded-xl focus:outline-none transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto max-h-[60vh] sm:max-h-[65vh] pr-2 text-chalk/90 text-xs focus:outline-none">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
