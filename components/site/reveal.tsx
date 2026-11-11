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

/** Pulls its content a few pixels towards the pointer, like a magnet. Mouse only, and not under reduced motion. */
export function Magnetic({ children, className, strength = 0.3 }: { children: React.ReactNode; className?: string; strength?: number }) {
  const inner = React.useRef<HTMLSpanElement>(null);
  const move = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!inner.current || e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - box.left - box.width / 2) * strength;
    const y = (e.clientY - box.top - box.height / 2) * strength;
    inner.current.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  };
  return (
    // the outer box stays put and takes the pointer, so moving the inner one cannot make it flicker
    <span onPointerMove={move} onPointerLeave={() => inner.current && (inner.current.style.transform = '')} className={cn('inline-block', className)}>
      <span ref={inner} className="inline-block transition-transform duration-300 ease-out">
        {children}
      </span>
    </span>
  );
}

/**
 * A sentence whose words rise into place one after another when it scrolls into view. Screen readers get the
 * sentence whole; the split words are decoration.
 */
export function Words({ text, highlight = [] }: { text: string; highlight?: string[] }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && (setShown(true), observer.disconnect()), { rootMargin: '0px 0px -15% 0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <span ref={ref}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.split(' ').map((word, i) => (
          <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom">
            <span
              style={{ transitionDelay: `${i * 55}ms` }}
              className={cn(
                'inline-block transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none',
                shown ? 'translate-y-0' : 'translate-y-[110%] motion-reduce:translate-y-0',
                highlight.includes(word) && 'text-liquid',
              )}
            >
              {word}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
