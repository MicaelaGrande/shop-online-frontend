import { useEffect, useRef, useState } from 'react';

export default function RevealOnScroll({ children, className = '', delay = 0 }) {
  const elementRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
      className={[
        'transition-[opacity,transform] duration-700 ease-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className
      ].join(' ')}
    >
      {children}
    </div>
  );
}
