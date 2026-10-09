'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Fades and lifts its content in the first time it scrolls into view. The content is in the HTML from the start
 * (search engines and people without JavaScript see it); only its entrance is animated, and not at all for people
 * who asked for reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  /** Seconds to wait once in view: stagger siblings with 0, 0.08, 0.16 */
  delay?: number;
  as?: 'div' | 'li' | 'section' | 'article' | 'span' | 'p' | 'h2';
}) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <Tag
      ref={ref as React.Ref<never>}
      style={{ transitionDelay: `${delay}s` }}
      className={cn(
        'transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none',
        shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * A card that leans towards the pointer, with its children able to float above it (`translateZ` on a child).
 * Purely decorative: it does nothing on touch screens or under reduced motion.
 */
export function Tilt({ children, className, max = 9 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const frame = React.useRef(0);
  const move = (e: React.PointerEvent) => {
    const element = ref.current;
    if (!element || e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = element.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - 0.5;
    const y = (e.clientY - box.top) / box.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      element.style.transform = `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg)`;
    });
  };
  const rest = () => {
    cancelAnimationFrame(frame.current);
    if (ref.current) ref.current.style.transform = '';
  };
  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={rest}
      className={cn('preserve-3d transition-transform duration-300 ease-out will-change-transform', className)}
    >
      {children}
    </div>
  );
}
