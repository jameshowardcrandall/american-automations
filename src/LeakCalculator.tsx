import { useState, type CSSProperties } from 'react';
import { Reveal } from './motion';

const SAIRA = "'Saira Semi Condensed',sans-serif";

/* Conservative, defensible assumptions for the estimate. The audit replaces
   these with the shop's real numbers — this is the "napkin math" version. */
const WEEKS_PER_MONTH = 4.33;
const MISSED_CALL_BOOK_RATE = 0.35;   // a missed call that would have booked
const DEAD_QUOTE_CLOSE_RATE = 0.22;   // an un-followed-up quote that would have closed

const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

function Slider({
  label, value, min, max, step, suffix, onChange,
}: { label: string; value: number; min: number; max: number; step: number; suffix: string; onChange: (n: number) => void }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontSize: 14.5, fontWeight: 600, color: '#2E3641' }}>{label}</span>
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 19, color: '#16243F', fontVariantNumeric: 'tabular-nums' }}>{suffix}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#9C3B2C', cursor: 'pointer', height: 6 }}
        aria-label={label}
      />
    </div>
  );
}

export default function LeakCalculator() {
  const [ticket, setTicket] = useState(400);       // average job value
  const [missed, setMissed] = useState(6);         // missed calls / week
  const [deadQuotes, setDeadQuotes] = useState(5); // quotes never followed up / week

  const monthlyMissed = missed * WEEKS_PER_MONTH * MISSED_CALL_BOOK_RATE * ticket;
  const monthlyQuotes = deadQuotes * WEEKS_PER_MONTH * DEAD_QUOTE_CLOSE_RATE * ticket;
  const monthly = monthlyMissed + monthlyQuotes;
  const yearly = monthly * 12;

  const barMissedPct = monthly ? (monthlyMissed / monthly) * 100 : 50;

  const panel: CSSProperties = { background: '#fff', border: '1px solid #E2E5EA', borderRadius: 10, overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', boxShadow: '0 1px 2px rgba(22,36,63,.04),0 30px 70px -40px rgba(22,36,63,.22)' };

  return (
    <section id="calc" style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 24px 24px' }}>
      <Reveal style={{ textAlign: 'center', marginBottom: 36 }}>
        <p style={{ fontFamily: SAIRA, fontWeight: 600, fontSize: 14, textTransform: 'uppercase', color: '#9C3B2C', margin: '0 0 8px', letterSpacing: '.16em' }}>Leak calculator</p>
        <h2 style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 32, margin: '0 0 10px' }}>Put a number on your leak in 10 seconds.</h2>
        <p style={{ fontSize: 16.5, color: '#6B7480', margin: 0 }}>Drag the sliders to your shop's reality. This is the napkin math — the audit gets you the exact figure.</p>
      </Reveal>

      <Reveal style={panel}>
        {/* inputs */}
        <div style={{ padding: '38px 36px' }}>
          <Slider label="Average job value" value={ticket} min={100} max={5000} step={50} suffix={fmt(ticket)} onChange={setTicket} />
          <Slider label="Calls you miss per week" value={missed} min={0} max={60} step={1} suffix={String(missed)} onChange={setMissed} />
          <Slider label="Quotes you never follow up" value={deadQuotes} min={0} max={40} step={1} suffix={`${deadQuotes}/wk`} onChange={setDeadQuotes} />
          <p style={{ fontSize: 12.5, color: '#9AA3AE', margin: '6px 0 0', lineHeight: 1.5 }}>
            Assumes ~35% of missed calls and ~22% of dead quotes would have booked. Conservative on purpose.
          </p>
        </div>

        {/* result */}
        <div style={{ padding: '38px 36px', background: 'radial-gradient(120% 120% at 100% 0%, #21365C 0%, #16243F 55%, #0E1A30 100%)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 12.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)' }}>You're likely leaking</div>
          <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 56, lineHeight: 1.02, color: '#E0795C', fontVariantNumeric: 'tabular-nums', margin: '4px 0 2px' }}>{fmt(monthly)}<span style={{ fontSize: 22, color: 'rgba(255,255,255,.55)', fontWeight: 700 }}>/mo</span></div>
          <div style={{ fontSize: 14.5, color: 'rgba(255,255,255,.7)' }}>≈ {fmt(yearly)} a year walking out the door.</div>

          {/* split bar */}
          <div style={{ margin: '22px 0 8px' }}>
            <div style={{ display: 'flex', height: 10, borderRadius: 999, overflow: 'hidden', background: 'rgba(255,255,255,.12)' }}>
              <div style={{ width: `${barMissedPct}%`, background: '#E0795C', transition: 'width .25s ease' }} />
              <div style={{ flex: 1, background: '#5B6B86', transition: 'width .25s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'rgba(255,255,255,.65)', marginTop: 9 }}>
              <span><span style={{ color: '#E0795C', fontWeight: 700 }}>■</span> Missed calls {fmt(monthlyMissed)}</span>
              <span><span style={{ color: '#5B6B86', fontWeight: 700 }}>■</span> Dead quotes {fmt(monthlyQuotes)}</span>
            </div>
          </div>

          <a href="#book" className="lf-cta-red" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 16, background: '#9C3B2C', color: '#fff', fontFamily: SAIRA, fontWeight: 700, fontSize: 16, padding: '14px 22px', borderRadius: 6, textDecoration: 'none', letterSpacing: '.04em', textTransform: 'uppercase', boxShadow: '0 8px 22px -6px rgba(156,59,44,.5)' }}>
            Get my exact number →
          </a>
        </div>
      </Reveal>
    </section>
  );
}
