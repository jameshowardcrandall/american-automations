import { CASE_STUDY, LOGOS, fmtMoney } from './config';
import { Reveal, useInView } from './motion';

const SAIRA = "'Saira Semi Condensed',sans-serif";

/** "As seen in" / trusted-by strip of placeholder wordmark logos. */
export function LogoWall() {
  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 8px' }}>
      <Reveal>
        <p style={{ textAlign: 'center', fontFamily: SAIRA, fontWeight: 600, fontSize: 12.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 18px' }}>Trusted by operators across the trades</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '20px 36px', opacity: .85 }}>
          {LOGOS.map((name) => (
            <span key={name} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, color: 'var(--muted)', fontFamily: SAIRA, fontWeight: 800, fontSize: 19, letterSpacing: '.02em', textTransform: 'uppercase', filter: 'grayscale(1)' }}>
              <svg width="20" height="20" viewBox="0 0 100 100" fill="none"><path d="M18 14 L82 14 L82 54 L50 90 L18 54 Z" fill="currentColor" opacity=".55" /></svg>
              {name}
            </span>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', opacity: .7, margin: '16px 0 0' }}>Placeholder logos — swap in real client or press marks in <code>config.ts</code>.</p>
      </Reveal>
    </section>
  );
}

/** Animated before→after monthly-revenue bars. Grows when scrolled into view. */
export function BeforeAfter() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const { beforeRevenue, afterRevenue } = CASE_STUDY;
  const max = afterRevenue * 1.12;
  const delta = afterRevenue - beforeRevenue;
  const pct = Math.round((delta / beforeRevenue) * 100);

  const bar = (value: number, color: string, label: string, sub: string, delay: number) => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 130, height: 200, display: 'flex', alignItems: 'flex-end' }}>
        <div style={{
          width: '100%', height: `${(value / max) * 100}%`, background: color, borderRadius: '8px 8px 0 0',
          transformOrigin: 'bottom', transform: inView ? 'scaleY(1)' : 'scaleY(0)',
          transition: `transform .9s cubic-bezier(.2,.8,.2,1) ${delay}ms`,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 10,
        }}>
          <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 19, color: '#fff' }}>{fmtMoney(value)}</span>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 15, color: '#fff', textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</div>
        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.55)' }}>{sub}</div>
      </div>
    </div>
  );

  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px' }}>
      <Reveal style={{ background: 'radial-gradient(120% 120% at 0% 0%, #21365C 0%, #16243F 55%, #0E1A30 100%)', border: '1px solid #2B3C5C', borderRadius: 10, padding: 40, color: '#fff' }}>
        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 36, alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 12.5, letterSpacing: '.16em', textTransform: 'uppercase', color: '#E0795C', margin: '0 0 10px' }}>Same ad budget · 90 days later</p>
            <h3 style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 30, lineHeight: 1.08, margin: '0 0 12px' }}>Monthly revenue, before and after we plugged the leaks.</h3>
            <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,.72)', margin: '0 0 16px' }}>No new spend. We just stopped the jobs from dripping out the bottom.</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(224,121,92,.16)', border: '1px solid rgba(224,121,92,.4)', borderRadius: 8, padding: '10px 16px' }}>
              <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 22, color: '#E0795C' }}>+{fmtMoney(delta)}/mo</span>
              <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,.7)' }}>(+{pct}%)</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 18, justifyContent: 'center' }}>
            {bar(beforeRevenue, '#5B6B86', 'Before', 'leaking', 0)}
            {bar(afterRevenue, '#E0795C', 'After', 'sealed', 180)}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
