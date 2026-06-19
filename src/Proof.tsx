import { CASE_STUDY, fmtMoney } from './config';
import { Reveal, useInView } from './motion';

const SAIRA = "'Saira Semi Condensed',sans-serif";

/* Recognizable platform marks — we automate ON TOP of the tools shops already
   run, so this is an honest "works with" strip (no fabricated client logos). */
const INTEGRATIONS: { name: string; mark: React.ReactNode }[] = [
  { name: 'Twilio', mark: (
    <svg width="22" height="22" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#F22F46" /><g fill="#fff"><circle cx="11" cy="11" r="3" /><circle cx="21" cy="11" r="3" /><circle cx="11" cy="21" r="3" /><circle cx="21" cy="21" r="3" /></g></svg>
  ) },
  { name: 'HighLevel', mark: (
    <svg width="22" height="22" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#155EEF" /><text x="16" y="21" textAnchor="middle" fontFamily="Saira Semi Condensed,sans-serif" fontWeight="800" fontSize="13" fill="#fff">HL</text></svg>
  ) },
  { name: 'Calendly', mark: (
    <svg width="22" height="22" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#006BFF" /><circle cx="16" cy="16" r="7" fill="none" stroke="#fff" strokeWidth="3" /></svg>
  ) },
  { name: 'QuickBooks', mark: (
    <svg width="22" height="22" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#2CA01C" /><text x="16" y="21" textAnchor="middle" fontFamily="Saira Semi Condensed,sans-serif" fontWeight="800" fontSize="13" fill="#fff">qb</text></svg>
  ) },
  { name: 'Zapier', mark: (
    <svg width="22" height="22" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#FF4F00" /><g stroke="#fff" strokeWidth="2.6" strokeLinecap="round"><path d="M16 8v16M8 16h16M10.3 10.3l11.4 11.4M21.7 10.3 10.3 21.7" /></g></svg>
  ) },
  { name: 'Google Business', mark: (
    <svg width="22" height="22" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#fff" stroke="#E2E5EA" /><path d="M16 14.5v3h4.2c-.2 1-1.4 3-4.2 3a4.5 4.5 0 1 1 0-9c1.3 0 2.2.5 2.7 1l2-2A7.5 7.5 0 1 0 23.5 16c0-.5 0-.9-.1-1.5H16Z" fill="#4285F4" /></svg>
  ) },
];

/** "Works with" integrations strip — recognizable platforms, no fake clients. */
export function LogoWall() {
  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 8px' }}>
      <Reveal>
        <p style={{ textAlign: 'center', fontFamily: SAIRA, fontWeight: 600, fontSize: 12.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 18px' }}>Works with the tools you already run</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px 30px' }}>
          {INTEGRATIONS.map((it) => (
            <span key={it.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, color: 'var(--ink)', fontFamily: SAIRA, fontWeight: 700, fontSize: 18, letterSpacing: '.01em' }}>
              {it.mark}{it.name}
            </span>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', margin: '16px 0 0' }}>No rip-and-replace — we layer automation on top of your existing stack.</p>
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
            <p style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 12.5, letterSpacing: '.16em', textTransform: 'uppercase', color: '#E0795C', margin: '0 0 10px' }}>Modeled · same ad budget · 90 days</p>
            <h3 style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 30, lineHeight: 1.08, margin: '0 0 12px' }}>What plugging the leaks does to monthly revenue.</h3>
            <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,.72)', margin: '0 0 16px' }}>A typical shop, modeled from the leaks above — no new spend, just fewer jobs dripping out the bottom.</p>
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
