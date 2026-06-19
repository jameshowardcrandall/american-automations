import { useState } from 'react';
import { FAQ } from './config';
import { Reveal } from './motion';

const SAIRA = "'Saira Semi Condensed',sans-serif";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" style={{ maxWidth: 820, margin: '0 auto', padding: '64px 24px 24px' }}>
      <Reveal style={{ textAlign: 'center', marginBottom: 32 }}>
        <p style={{ fontFamily: SAIRA, fontWeight: 600, fontSize: 14, textTransform: 'uppercase', color: '#9C3B2C', margin: '0 0 8px', letterSpacing: '.16em' }}>Questions</p>
        <h2 style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 30, margin: 0, color: 'var(--ink)' }}>Straight answers.</h2>
      </Reveal>
      <Reveal style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FAQ.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="lf-faq" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, background: 'transparent', border: 'none', cursor: 'pointer', padding: '18px 20px', textAlign: 'left', font: 'inherit', color: 'var(--ink)' }}
              >
                <span style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 17 }}>{f.q}</span>
                <span style={{ flex: 'none', width: 26, height: 26, borderRadius: 6, background: isOpen ? '#9C3B2C' : 'rgba(120,140,170,.14)', color: isOpen ? '#fff' : 'var(--muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, transition: 'all .2s ease', transform: isOpen ? 'rotate(45deg)' : 'none' }}>+</span>
              </button>
              <div style={{ maxHeight: isOpen ? 240 : 0, overflow: 'hidden', transition: 'max-height .3s ease' }}>
                <p style={{ margin: 0, padding: '0 20px 20px', fontSize: 15.5, lineHeight: 1.6, color: 'var(--muted)' }}>{f.a}</p>
              </div>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
