// src/hooks/useIntersectionObserver.js
import { useState, useEffect, useRef } from 'react';

/**
 * Hook that observes when a DOM element enters the viewport.
 * Returns a ref to attach and a boolean indicating visibility.
 * Once visible, the element stays marked (one-shot trigger for entrance animations).
 *
 * @param {{ threshold?: number, rootMargin?: string, triggerOnce?: boolean }} options
 * @returns {{ ref: React.RefObject, isVisible: boolean }}
 */
function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '0px 0px -40px 0px',
  triggerOnce = true
} = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Fallback for environments without IntersectionObserver
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(node);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}

export default useIntersectionObserver;
