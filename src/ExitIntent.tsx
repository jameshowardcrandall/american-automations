import { useEffect, useState } from 'react';

const SAIRA = "'Saira Semi Condensed',sans-serif";

/**
 * Fires once when the cursor leaves the top of the viewport (desktop intent to
 * leave). Suppressed on touch devices and after a single show per session.
 */
export default function ExitIntent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = matchMedia('(hover: none)').matches;
    if (isTouch) return;
    let fired = false;
    try { if (sessionStorage.getItem('lf_exit_shown')) fired = true; } catch { /* ignore */ }
    const onLeave = (e: MouseEvent) => {
      if (fired) return;
      if (e.clientY <= 0) {
        fired = true;
        try { sessionStorage.setItem('lf_exit_shown', '1'); } catch { /* ignore */ }
        setOpen(true);
      }
    };
    document.addEventListener('mouseout', onLeave);
    return () => document.removeEventListener('mouseout', onLeave);
  }, []);

  if (!open) return null;

  return (
    <div
      onClick={() => setOpen(false)}
      style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(8,16,32,.62)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', display: 'grid', placeItems: 'center', padding: 20, animation: 'lfrise .25s ease' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', maxWidth: 460, width: '100%', background: 'radial-gradient(120% 120% at 100% 0%, #21365C 0%, #16243F 55%, #0E1A30 100%)', border: '1px solid #2B3C5C', borderRadius: 14, padding: '38px 34px', color: '#fff', textAlign: 'center', boxShadow: '0 40px 90px -30px rgba(0,0,0,.7)' }}
      >
        <button onClick={() => setOpen(false)} aria-label="Close" style={{ position: 'absolute', top: 12, right: 14, background: 'transparent', border: 'none', color: 'rgba(255,255,255,.5)', fontSize: 24, cursor: 'pointer', lineHeight: 1 }}>×</button>
        <div style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 12.5, letterSpacing: '.16em', textTransform: 'uppercase', color: '#E0795C', marginBottom: 10 }}>Before you go —</div>
        <h3 style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 28, lineHeight: 1.1, margin: '0 0 12px' }}>Want the 60-second version?</h3>
        <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,.74)', margin: '0 0 22px', lineHeight: 1.55 }}>
          Run the leak calculator — drag three sliders and see what your shop is losing every month. No call, no email required.
        </p>
        <a href="#calc" onClick={() => setOpen(false)} className="lf-cta-red" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#9C3B2C', color: '#fff', fontFamily: SAIRA, fontWeight: 700, fontSize: 16, padding: '14px 24px', borderRadius: 8, textDecoration: 'none', letterSpacing: '.04em', textTransform: 'uppercase', boxShadow: '0 8px 22px -6px rgba(156,59,44,.5)' }}>
          Show me my leak →
        </a>
        <div style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,.45)' }}>Veteran-owned · zero obligation</div>
      </div>
    </div>
  );
}
