import { useState } from 'react';
import { FOUNDING } from './config';

const SAIRA = "'Saira Semi Condensed',sans-serif";
const KEY = 'lf_founding_dismissed';

/** Slim top-of-page scarcity bar. Dismissible (remembered for the session). */
export default function FoundingBanner() {
  const [open, setOpen] = useState(() => {
    try { return sessionStorage.getItem(KEY) !== '1'; } catch { return true; }
  });
  if (!open) return null;

  const dismiss = () => {
    try { sessionStorage.setItem(KEY, '1'); } catch { /* ignore */ }
    setOpen(false);
  };

  return (
    <div style={{ position: 'relative', zIndex: 55, background: 'linear-gradient(90deg,#16243F,#0E1A30)', borderBottom: '1px solid #2B3C5C', color: '#fff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '9px 40px 9px 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', textAlign: 'center' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E0795C', display: 'inline-block', animation: 'lfpulse 2.2s ease-in-out infinite' }} />
          <span style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 12.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#E0795C' }}>{FOUNDING.lead} · {FOUNDING.spots} spots</span>
        </span>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,.85)' }}>{FOUNDING.offer}</span>
        <a href="#book" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: SAIRA, fontWeight: 700, fontSize: 12.5, letterSpacing: '.06em', textTransform: 'uppercase', color: '#16243F', background: '#fff', padding: '6px 13px', borderRadius: 999, textDecoration: 'none', whiteSpace: 'nowrap' }}>{FOUNDING.cta} →</a>
      </div>
      <button onClick={dismiss} aria-label="Dismiss" style={{ position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(255,255,255,.55)', fontSize: 20, lineHeight: 1, cursor: 'pointer', padding: 4 }}>×</button>
    </div>
  );
}
