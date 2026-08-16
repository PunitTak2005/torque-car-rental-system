// src/hooks/useReducedMotion.js
import { useState, useEffect } from 'react';

/**
 * Hook that detects if the user prefers reduced motion.
 * Respects the OS-level `prefers-reduced-motion` media query.
 * @returns {{ prefersReducedMotion: boolean, shouldAnimate: boolean }}
 */
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mq.matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return {
    prefersReducedMotion,
    shouldAnimate: !prefersReducedMotion
  };
}

export default useReducedMotion;
