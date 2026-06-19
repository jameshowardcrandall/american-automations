import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/**
 * Cycles through `words` in place with a quick fade/slide. Keeps the funnel
 * feeling tailored to whoever's reading — plumbers, roofers, electricians…
 */
export function RotatingWord({ words, interval = 2200, style }: { words: string[]; interval?: number; style?: CSSProperties }) {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(true);
  useEffect(() => {
    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = setInterval(() => {
      setShow(false);
      setTimeout(() => { setI((p) => (p + 1) % words.length); setShow(true); }, 240);
    }, interval);
    return () => clearInterval(id);
  }, [words.length, interval]);
  return (
    <span style={{ display: 'inline-block', transition: 'opacity .24s ease, transform .24s ease', opacity: show ? 1 : 0, transform: show ? 'none' : 'translateY(6px)', ...style }}>
      {words[i]}
    </span>
  );
}

/** Endless horizontal marquee of pills — duplicates children for a seamless loop. */
export function Marquee({ items }: { items: string[] }) {
  const row = (
    <div style={{ display: 'flex', gap: 10, paddingRight: 10, flex: 'none' }}>
      {items.map((t, k) => (
        <span key={k} style={{ flex: 'none', fontFamily: "'Saira Semi Condensed',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase', color: '#2E3641', background: '#fff', border: '1px solid #E2E5EA', padding: '8px 15px', borderRadius: 999, whiteSpace: 'nowrap' }}>{t}</span>
      ))}
    </div>
  );
  return (
    <div aria-hidden style={{ position: 'relative', overflow: 'hidden', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)', maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}>
      <div style={{ display: 'flex', width: 'max-content', animation: 'lfmarquee 32s linear infinite' }}>
        {row}{row}
      </div>
    </div>
  );
}

/** Returns a ref + whether it has scrolled into view (fires once). */
export function useInView<T extends HTMLElement>(rootMargin = '-12% 0px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return { ref, inView };
}

/** Scroll-reveal wrapper. Adds .is-in once the element enters the viewport. */
export function Reveal({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: CSSProperties }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={'lf-reveal' + (inView ? ' is-in' : '')} style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

/**
 * Live, ever-incrementing money odometer — an illustrative "revenue leaking
 * right now" ticker. Starts at `start` and adds `perSecond` every frame so the
 * cents visibly move. Purely a marketing visual (label it as an industry avg).
 */
export function LiveLeak({ start = 1840, perSecond = 1.15, style }: { start?: number; perSecond?: number; style?: CSSProperties }) {
  const [amount, setAmount] = useState(start);
  useEffect(() => {
    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setAmount((a) => a + perSecond * dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [perSecond]);
  const [dollars, cents] = amount.toFixed(2).split('.');
  return (
    <span style={style}>
      ${Number(dollars).toLocaleString('en-US')}<span style={{ opacity: .55, fontSize: '.62em' }}>.{cents}</span>
    </span>
  );
}

/**
 * Counts up to `value` once scrolled into view. `prefix`/`suffix` wrap the number;
 * `format` controls thousands separators. Respects prefers-reduced-motion.
 */
export function CountUp({
  value, prefix = '', suffix = '', duration = 1400, style,
}: { value: number; prefix?: string; suffix?: string; duration?: number; style?: CSSProperties }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setN(value); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setN(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);
  return (
    <span ref={ref} style={style}>{prefix}{n.toLocaleString('en-US')}{suffix}</span>
  );
}
