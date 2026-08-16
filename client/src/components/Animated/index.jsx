// src/components/Animated/index.jsx
// Reusable animation wrapper components for the global animation system.
// Each respects `prefers-reduced-motion` and uses Tailwind animation classes.

import React from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

/* ─── FadeIn ─── */
export const FadeIn = ({
  children,
  delay = 0,
  duration = 200,
  className = '',
  as: Tag = 'div',
  ...props
}) => {
  const { shouldAnimate } = useReducedMotion();

  return (
    <Tag
      className={`${shouldAnimate ? 'animate-fade-in' : ''} ${className}`}
      style={shouldAnimate ? { animationDelay: `${delay}ms`, animationDuration: `${duration}ms` } : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
};

/* ─── SlideUp ─── */
export const SlideUp = ({
  children,
  delay = 0,
  duration = 300,
  className = '',
  as: Tag = 'div',
  ...props
}) => {
  const { shouldAnimate } = useReducedMotion();

  return (
    <Tag
      className={`${shouldAnimate ? 'animate-slide-up' : ''} ${className}`}
      style={shouldAnimate ? { animationDelay: `${delay}ms`, animationDuration: `${duration}ms` } : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
};

/* ─── SlideDown ─── */
export const SlideDown = ({
  children,
  delay = 0,
  duration = 300,
  className = '',
  as: Tag = 'div',
  ...props
}) => {
  const { shouldAnimate } = useReducedMotion();

  return (
    <Tag
      className={`${shouldAnimate ? 'animate-slide-down' : ''} ${className}`}
      style={shouldAnimate ? { animationDelay: `${delay}ms`, animationDuration: `${duration}ms` } : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
};

/* ─── ScaleIn ─── */
export const ScaleIn = ({
  children,
  delay = 0,
  duration = 250,
  className = '',
  as: Tag = 'div',
  ...props
}) => {
  const { shouldAnimate } = useReducedMotion();

  return (
    <Tag
      className={`${shouldAnimate ? 'animate-scale-up' : ''} ${className}`}
      style={shouldAnimate ? { animationDelay: `${delay}ms`, animationDuration: `${duration}ms` } : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
};

/* ─── AnimateOnScroll ─── */
// Triggers an entrance animation when the element scrolls into the viewport.
export const AnimateOnScroll = ({
  children,
  animation = 'animate-slide-up',
  threshold = 0.1,
  rootMargin = '0px 0px -40px 0px',
  delay = 0,
  duration,
  className = '',
  as: Tag = 'div',
  ...props
}) => {
  const { shouldAnimate } = useReducedMotion();
  const { ref, isVisible } = useIntersectionObserver({ threshold, rootMargin });

  const baseStyle = !shouldAnimate
    ? {}
    : isVisible
      ? { animationDelay: `${delay}ms`, ...(duration ? { animationDuration: `${duration}ms` } : {}) }
      : { opacity: 0 };

  return (
    <Tag
      ref={ref}
      className={`${shouldAnimate && isVisible ? animation : ''} ${className}`}
      style={baseStyle}
      {...props}
    >
      {children}
    </Tag>
  );
};

/* ─── AnimatedPage ─── */
// Page-level fade-in wrapper for route transitions.
export const AnimatedPage = ({ children, className = '' }) => {
  const { shouldAnimate } = useReducedMotion();

  return (
    <div className={`${shouldAnimate ? 'animate-page-enter' : ''} ${className}`}>
      {children}
    </div>
  );
};

/* ─── Stagger Container ─── */
// Wraps children to apply staggered entrance delays.
export const StaggerContainer = ({
  children,
  staggerMs = 50,
  animation = 'animate-slide-up',
  className = '',
  as: Tag = 'div',
  ...props
}) => {
  const { shouldAnimate } = useReducedMotion();
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.05 });

  return (
    <Tag ref={ref} className={className} {...props}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        if (!shouldAnimate) return child;

        return React.cloneElement(child, {
          className: `${child.props.className || ''} ${isVisible ? animation : ''}`.trim(),
          style: {
            ...child.props.style,
            ...(isVisible
              ? { animationDelay: `${index * staggerMs}ms` }
              : { opacity: 0 }),
          },
        });
      })}
    </Tag>
  );
};
