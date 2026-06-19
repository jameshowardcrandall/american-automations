import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Reveal } from './motion';
import { monthlyLeak, fmtMoney } from './config';
import { useFunnel } from './state';

const SAIRA = "'Saira Semi Condensed',sans-serif";

function Slider({
  label, value, min, max, step, suffix, onChange,
}: { label: string; value: number; min: number; max: number; step: number; suffix: string; onChange: (n: number) => void }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>{label}</span>
        <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 19, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{suffix}</span>
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

const field: CSSProperties = {
  width: '100%', padding: '11px 13px', borderRadius: 8, border: '1px solid rgba(255,255,255,.18)',
  background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: 14.5, fontFamily: "'IBM Plex Sans',sans-serif", outline: 'none',
};

export default function LeakCalculator() {
  const { industry } = useFunnel();
  const [ticket, setTicket] = useState(industry.avgTicket);
  const [missed, setMissed] = useState(industry.missedPerWeek);
  const [deadQuotes, setDeadQuotes] = useState(industry.deadQuotesPerWeek);
  const [sent, setSent] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // When the visitor picks a different industry, re-seat the sliders on its benchmarks.
  useEffect(() => {
    setTicket(industry.avgTicket);
    setMissed(industry.missedPerWeek);
    setDeadQuotes(industry.deadQuotesPerWeek);
  }, [industry.key, industry.avgTicket, industry.missedPerWeek, industry.deadQuotesPerWeek]);

  const { fromCalls, fromQuotes, total } = monthlyLeak({ avgTicket: ticket, missedPerWeek: missed, deadQuotesPerWeek: deadQuotes });
  const yearly = total * 12;
  const barMissedPct = total ? (fromCalls / total) * 100 : 50;

  const openForm = () => {
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST to your CRM / webhook (HighLevel, Zapier, etc.). Payload below.
    // { name, email, business, phone, industry: industry.key, ticket, missed, deadQuotes, monthly: total }
    setSent(true);
  };

  const panel: CSSProperties = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', boxShadow: '0 1px 2px rgba(22,36,63,.04),0 30px 70px -40px rgba(22,36,63,.22)' };

  return (
    <section id="calc" style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 24px 24px' }}>
      <Reveal style={{ textAlign: 'center', marginBottom: 36 }}>
        <p style={{ fontFamily: SAIRA, fontWeight: 600, fontSize: 14, textTransform: 'uppercase', color: '#9C3B2C', margin: '0 0 8px', letterSpacing: '.16em' }}>Leak calculator</p>
        <h2 style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 32, margin: '0 0 10px', color: 'var(--ink)' }}>Put a number on your leak in 10 seconds.</h2>
        <p style={{ fontSize: 16.5, color: 'var(--muted)', margin: 0 }}>Pre-filled with <strong>{industry.label}</strong> benchmarks — drag to your reality. The audit gets you the exact figure.</p>
      </Reveal>

      <Reveal style={panel}>
        {/* inputs */}
        <div style={{ padding: '38px 36px' }}>
          <Slider label="Average job value" value={ticket} min={100} max={5000} step={50} suffix={fmtMoney(ticket)} onChange={setTicket} />
          <Slider label="Calls you miss per week" value={missed} min={0} max={60} step={1} suffix={String(missed)} onChange={setMissed} />
          <Slider label="Quotes you never follow up" value={deadQuotes} min={0} max={40} step={1} suffix={`${deadQuotes}/wk`} onChange={setDeadQuotes} />
          <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '6px 0 0', lineHeight: 1.5 }}>
            Assumes ~35% of missed calls and ~22% of dead quotes would have booked. Conservative on purpose.
          </p>
        </div>

        {/* result */}
        <div style={{ padding: '38px 36px', background: 'radial-gradient(120% 120% at 100% 0%, #21365C 0%, #16243F 55%, #0E1A30 100%)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 12.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)' }}>You're likely leaking</div>
          <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 56, lineHeight: 1.02, color: '#E0795C', fontVariantNumeric: 'tabular-nums', margin: '4px 0 2px' }}>{fmtMoney(total)}<span style={{ fontSize: 22, color: 'rgba(255,255,255,.55)', fontWeight: 700 }}>/mo</span></div>
          <div style={{ fontSize: 14.5, color: 'rgba(255,255,255,.7)' }}>≈ {fmtMoney(yearly)} a year walking out the door.</div>

          {/* split bar */}
          <div style={{ margin: '22px 0 8px' }}>
            <div style={{ display: 'flex', height: 10, borderRadius: 999, overflow: 'hidden', background: 'rgba(255,255,255,.12)' }}>
              <div style={{ width: `${barMissedPct}%`, background: '#E0795C', transition: 'width .25s ease' }} />
              <div style={{ flex: 1, background: '#5B6B86', transition: 'width .25s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'rgba(255,255,255,.65)', marginTop: 9 }}>
              <span><span style={{ color: '#E0795C', fontWeight: 700 }}>■</span> Missed calls {fmtMoney(fromCalls)}</span>
              <span><span style={{ color: '#5B6B86', fontWeight: 700 }}>■</span> Dead quotes {fmtMoney(fromQuotes)}</span>
            </div>
          </div>

          {/* lead capture */}
          {!sent && !showForm && (
            <button onClick={openForm} className="lf-cta-red" style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: '#9C3B2C', color: '#fff', fontFamily: SAIRA, fontWeight: 700, fontSize: 16, padding: '14px 22px', borderRadius: 6, border: 'none', cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase', boxShadow: '0 8px 22px -6px rgba(156,59,44,.5)' }}>
              Email me the full breakdown →
            </button>
          )}

          {!sent && showForm && (
            <div ref={formRef} style={{ marginTop: 18, animation: 'lfrise .3s ease' }}>
              <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.7)', marginBottom: 12 }}>Where should we send your itemized leak report + the exact recoverable number?</div>
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <input style={field} placeholder="Your name" required autoComplete="name" />
                <input style={field} type="email" placeholder="Email" required autoComplete="email" />
                <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
                  <input style={{ ...field, flex: 1, minWidth: 120 }} placeholder="Business name" required />
                  <input style={{ ...field, flex: 1, minWidth: 120 }} type="tel" placeholder="Phone (optional)" autoComplete="tel" />
                </div>
                <button type="submit" className="lf-cta-red" style={{ marginTop: 4, background: '#9C3B2C', color: '#fff', fontFamily: SAIRA, fontWeight: 700, fontSize: 15, padding: '13px', borderRadius: 6, border: 'none', cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase', boxShadow: '0 8px 22px -6px rgba(156,59,44,.5)' }}>
                  Send my leak report →
                </button>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', textAlign: 'center' }}>No spam. Veteran-owned. Unsubscribe anytime.</div>
              </form>
            </div>
          )}

          {sent && (
            <div style={{ marginTop: 18, animation: 'lfrise .3s ease', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 10, padding: '20px 18px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, margin: '0 auto 12px', borderRadius: '50%', background: 'rgba(224,121,92,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="#E0795C" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 20 }}>On its way.</div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', margin: '6px 0 14px' }}>Check your inbox for the full {fmtMoney(total)}/mo breakdown. Want the fastest path? Book the audit.</p>
              <a href="#book" className="lf-cta-red" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#9C3B2C', color: '#fff', fontFamily: SAIRA, fontWeight: 700, fontSize: 14, padding: '11px 20px', borderRadius: 6, textDecoration: 'none', letterSpacing: '.04em', textTransform: 'uppercase' }}>Book the free audit →</a>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
