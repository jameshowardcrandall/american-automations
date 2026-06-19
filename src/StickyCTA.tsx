import { useEffect, useState } from 'react';
import { monthlyLeak, fmtMoney } from './config';
import { useFunnel } from './state';

const SAIRA = "'Saira Semi Condensed',sans-serif";

/** Slides up from the bottom once the visitor scrolls past the hero. */
export default function StickyCTA() {
  const { industry } = useFunnel();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 680);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const leak = monthlyLeak(industry).total;

  return (
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 60,
      transform: show ? 'translateY(0)' : 'translateY(120%)',
      transition: 'transform .35s cubic-bezier(.2,.8,.2,1)',
      pointerEvents: show ? 'auto' : 'none',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 16px 14px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap',
          background: 'rgba(14,23,38,.96)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid #2B3C5C', borderRadius: 12, padding: '12px 14px 12px 18px',
          boxShadow: '0 18px 50px -18px rgba(0,0,0,.6)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <span style={{ position: 'relative', width: 9, height: 9, flex: 'none' }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#E0795C', animation: 'lfblink 1.4s steps(1) infinite' }} />
            </span>
            <span style={{ color: 'rgba(255,255,255,.78)', fontSize: 14, lineHeight: 1.3 }}>
              You're likely leaking <strong style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 17, color: '#E0795C' }}>{fmtMoney(leak)}/mo</strong>
              <span style={{ color: 'rgba(255,255,255,.45)' }}> · {industry.label}</span>
            </span>
          </div>
          <a href="#book" className="lf-cta-red" style={{
            flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, background: '#9C3B2C', color: '#fff',
            fontFamily: SAIRA, fontWeight: 700, fontSize: 14, padding: '11px 18px', borderRadius: 8, textDecoration: 'none',
            letterSpacing: '.04em', textTransform: 'uppercase', boxShadow: '0 8px 22px -6px rgba(156,59,44,.5)', whiteSpace: 'nowrap',
          }}>Book free audit →</a>
        </div>
      </div>
    </div>
  );
}
