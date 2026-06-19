import { useState } from 'react';
import { LEAKS } from './config';
import { Reveal } from './motion';

const SAIRA = "'Saira Semi Condensed',sans-serif";

/** Animated dripping pipe-joint icon — drips harder when the leak is active. */
function DripIcon({ active }: { active: boolean }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', flex: 'none', width: 26, height: 26, borderRadius: 6, background: active ? '#9C3B2C' : '#16243F', alignItems: 'center', justifyContent: 'center', marginTop: 2, transition: 'background .2s ease' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11Z" fill="#fff" /></svg>
      {/* falling drop */}
      <span style={{ position: 'absolute', bottom: -4, left: '50%', width: 5, height: 7, marginLeft: -2.5, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: '#E0795C', animation: `lfdrop ${active ? 1 : 1.8}s ease-in infinite`, animationDelay: active ? '0s' : '.4s' }} />
    </span>
  );
}

export default function LeaksDiagram() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px 24px' }}>
      <Reveal style={{ textAlign: 'center', marginBottom: 14 }}>
        <h2 style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 30, margin: '0 0 10px', color: 'var(--ink)' }}>Where the money leaks out</h2>
        <p style={{ fontSize: 16.5, color: 'var(--muted)', margin: 0 }}>The same six taps drip in every service business. Tap one to see how we plug it.</p>
      </Reveal>

      {/* decorative pressure-line: a pipe with six valves */}
      <Reveal style={{ margin: '8px auto 26px', maxWidth: 760 }}>
        <svg viewBox="0 0 760 40" width="100%" height="40" fill="none" aria-hidden style={{ display: 'block' }}>
          <rect x="0" y="16" width="760" height="8" rx="4" fill="#C2C8D1" />
          <rect x="0" y="16" width="760" height="3" rx="1.5" fill="#fff" opacity=".5" />
          {LEAKS.map((_, i) => {
            const x = 70 + i * 124;
            const on = active === i;
            return (
              <g key={i}>
                <rect x={x - 7} y="10" width="14" height="20" rx="3" fill={on ? '#9C3B2C' : '#16243F'} />
                <circle cx={x} cy={on ? 36 : 33} r={on ? 3.5 : 2.5} fill="#E0795C" opacity={on ? 1 : .5} />
              </g>
            );
          })}
        </svg>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
        {LEAKS.map((leak, i) => {
          const on = active === i;
          return (
            <button
              key={leak.title}
              onClick={() => setActive(on ? null : i)}
              className="lf-card"
              aria-expanded={on}
              style={{ textAlign: 'left', font: 'inherit', cursor: 'pointer', background: 'var(--card)', border: `1px solid ${on ? '#9C3B2C' : 'var(--border)'}`, borderRadius: 6, padding: 20, display: 'flex', gap: 14, alignItems: 'flex-start', boxShadow: on ? '0 16px 36px -20px rgba(156,59,44,.5)' : undefined }}
            >
              <DripIcon active={on} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{i + 1}. {leak.title}</div>
                  <span style={{ flex: 'none', color: on ? '#9C3B2C' : 'var(--muted)', fontSize: 18, fontWeight: 700, transition: 'transform .2s ease', transform: on ? 'rotate(45deg)' : 'none' }}>+</span>
                </div>
                <div className="lf-body" style={{ fontSize: 14.5, color: 'var(--muted)', marginTop: 3 }}>{leak.body}</div>
                <div style={{ maxHeight: on ? 120 : 0, overflow: 'hidden', transition: 'max-height .3s ease' }}>
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--border)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginTop: 2, flex: 'none' }}><path d="M20 6 9 17l-5-5" stroke="#9C3B2C" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <div style={{ fontSize: 14, color: 'var(--ink)' }}><strong style={{ fontFamily: SAIRA }}>We plug it: </strong>{leak.fix}</div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
