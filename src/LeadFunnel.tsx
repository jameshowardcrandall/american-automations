import { useMemo, useState, type CSSProperties } from 'react';
import { Reveal, CountUp, LiveLeak, RotatingWord, Marquee } from './motion';
import LeakCalculator from './LeakCalculator';

const TRADES = ['plumbers', 'roofers', 'electricians', 'HVAC shops', 'landscapers', 'cleaning crews', 'pest pros', 'contractors'];
const INDUSTRIES = ['Plumbing', 'HVAC', 'Roofing', 'Electrical', 'Landscaping', 'Cleaning', 'Pest Control', 'Garage Doors', 'Painting', 'Auto Repair', 'Med Spa', 'Dental', 'Fitness', 'Salons'];

/* ============================================================================
   American Automations — Lead Funnel
   Faithful React recreation of "Lead Funnel.dc.html" (Claude Design handoff).

   Fonts (loaded in index.html): Saira Semi Condensed (headings/wordmark),
   IBM Plex Sans (body/UI).
   Palette: Navy #16243F · Oxidized Red #9C3B2C · Graphite #2E3641 ·
            Steel #6B7480 · borders #E2E5EA · page bg #F4F5F7.
   ========================================================================== */

const SAIRA = "'Saira Semi Condensed',sans-serif";

type HeroMode = 'compare' | 'hookA' | 'hookB';

export interface LeadFunnelProps {
  /** 'hookB' (money) is the live default; 'compare' shows both hooks with labels. */
  heroMode?: HeroMode;
  showVideo?: boolean;
  showLeaks?: boolean;
}

/* Chevron-"A" brand mark (no circuit nodes — matches the funnel's usage). */
function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ flex: 'none' }}>
      <path d="M18 14 L82 14 L82 54 L50 90 L18 54 Z" fill="#16243F" />
      <path d="M50 34 L33 62 M50 34 L67 62" stroke="#fff" strokeWidth="11" strokeLinejoin="miter" />
      <path d="M40 53 H60" stroke="#9C3B2C" strokeWidth="10" />
    </svg>
  );
}

function Check({ size = 15, color = '#16243F', sw = 2.6 }: { size?: number; color?: string; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M20 6 9 17l-5-5" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TIMES = ['9:00 AM', '9:30 AM', '10:30 AM', '11:00 AM', '1:00 PM', '2:30 PM'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// June 1 2026 = Monday (index 1, Sun=0).
const weekdayName = (d: number) => WEEKDAYS[(1 + (d - 1)) % 7];

function dayStyle(disabled: boolean, selected: boolean): CSSProperties {
  const base: CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '1',
    borderRadius: '9px', fontSize: '14.5px', fontWeight: 600, fontFamily: "'IBM Plex Sans',sans-serif",
  };
  if (selected) return { ...base, background: '#16243F', color: '#fff', border: '1px solid #16243F', cursor: 'pointer', boxShadow: '0 4px 10px -3px rgba(22,36,63,.6)' };
  if (disabled) return { ...base, color: '#C2C8D1', border: '1px solid transparent', cursor: 'default' };
  return { ...base, color: '#2E3641', border: '1px solid #E2E5EA', cursor: 'pointer', background: '#fff' };
}
function timeStyle(selected: boolean): CSSProperties {
  const base: CSSProperties = {
    textAlign: 'center', padding: '11px 6px', borderRadius: '9px', fontSize: '14px',
    fontWeight: 600, cursor: 'pointer', fontFamily: "'IBM Plex Sans',sans-serif",
  };
  if (selected) return { ...base, background: '#EEF1F5', border: '1px solid #16243F', color: '#0E1A30' };
  return { ...base, background: '#fff', border: '1px solid #E2E5EA', color: '#2E3641' };
}

export default function LeadFunnel({ heroMode = 'hookB', showVideo = true, showLeaks = true }: LeadFunnelProps) {
  const [selectedDay, setSelectedDay] = useState(23);
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const isCompare = heroMode === 'compare';
  const showA = heroMode !== 'hookB';
  const showB = heroMode !== 'hookA';
  const showDivider = isCompare && showA && showB;

  const colStyle: CSSProperties = {
    flex: '1 1 0', minWidth: '300px', maxWidth: isCompare ? '540px' : '720px',
    padding: '34px 40px 38px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
  };

  const days = useMemo(() => {
    const out: { key: string; empty: boolean; day?: number; disabled?: boolean; selected?: boolean }[] = [
      { key: 'e0', empty: true },
    ];
    for (let d = 1; d <= 30; d++) {
      const wi = (1 + (d - 1)) % 7;
      const weekend = wi === 0 || wi === 6;
      const past = d < 19;
      out.push({ key: 'd' + d, empty: false, day: d, disabled: weekend || past, selected: d === selectedDay });
    }
    return out;
  }, [selectedDay]);

  const dateStr = `${weekdayName(selectedDay)}, Jun ${selectedDay}`;
  const confirmLabel = `Confirm — ${dateStr} · ${selectedTime}`;
  const bookedLabel = `${dateStr} at ${selectedTime} — check your email for the calendar invite.`;

  const redCta: CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
    background: '#9C3B2C', color: '#fff', fontFamily: SAIRA, fontWeight: 700, fontSize: 17,
    padding: '15px 26px', borderRadius: 6, textDecoration: 'none', letterSpacing: '.04em',
    textTransform: 'uppercase', boxShadow: '0 8px 22px -6px rgba(156,59,44,.5)',
  };

  return (
    <div style={{ fontFamily: "'IBM Plex Sans',-apple-system,sans-serif", background: '#F4F5F7', color: '#16243F', lineHeight: 1.55, WebkitFontSmoothing: 'antialiased', minHeight: '100vh', fontSize: 16 }}>

      {/* NAV */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(244,245,247,.9)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderBottom: '1px solid #E2E5EA' }}>
        <div style={{ height: 3, display: 'flex' }}>
          <div style={{ flex: 1, background: '#16243F' }} />
          <div style={{ width: 90, background: '#9C3B2C' }} />
          <div style={{ width: 46, background: '#C2C8D1' }} />
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <BrandMark size={34} />
            <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 17, lineHeight: 0.88, letterSpacing: '.02em', textTransform: 'uppercase', color: '#16243F' }}>American<br />Automations</span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
            <a href="#calc" className="lf-nav-link" style={{ textDecoration: 'none', fontWeight: 500, fontSize: 15 }}>Calculator</a>
            <a href="#how" className="lf-nav-link" style={{ textDecoration: 'none', fontWeight: 500, fontSize: 15 }}>How it works</a>
            <a href="#proof" className="lf-nav-link" style={{ textDecoration: 'none', fontWeight: 500, fontSize: 15 }}>Results</a>
            <a href="#book" className="lf-cta-nav" style={{ fontFamily: SAIRA, background: '#16243F', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 14, padding: '10px 18px', borderRadius: 6, letterSpacing: '.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Book free audit</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '54px 24px 20px' }}>
        <Reveal style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 28px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: SAIRA, fontWeight: 700, fontSize: 13, letterSpacing: '.12em', textTransform: 'uppercase', color: '#9C3B2C', background: '#F6E9E6', padding: '8px 16px', borderRadius: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#9C3B2C', display: 'inline-block', animation: 'lfpulse 2.2s ease-in-out infinite' }} />
            Veteran-Owned · Free Lead-Leak Audit for service businesses
          </span>
        </Reveal>

        {/* Dark "command panel" hero — blueprint grid + glowing red accents. */}
        <Reveal>
          <div style={{
            position: 'relative', borderRadius: 10, overflow: 'hidden',
            background: 'radial-gradient(120% 120% at 80% -10%, #21365C 0%, #16243F 46%, #0E1A30 100%)',
            border: '1px solid #2B3C5C',
            boxShadow: '0 1px 2px rgba(0,0,0,.3), 0 40px 90px -40px rgba(8,16,32,.85)',
          }}>
            {/* blueprint grid texture */}
            <div aria-hidden style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .5,
              backgroundImage: 'linear-gradient(rgba(120,150,200,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(120,150,200,.10) 1px, transparent 1px)',
              backgroundSize: '44px 44px, 44px 44px', animation: 'lfgrid 18s linear infinite',
            }} />
            {/* corner ticker tape (brand stripe) */}
            <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, display: 'flex' }}>
              <div style={{ flex: 1, background: '#16243F' }} /><div style={{ width: 120, background: '#9C3B2C' }} /><div style={{ width: 56, background: '#C2C8D1' }} />
            </div>

            {/* LEAK METER band */}
            <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '6px 16px', padding: '18px 24px 0', textAlign: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: SAIRA, fontWeight: 700, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)' }}>
                <span style={{ position: 'relative', width: 9, height: 9 }}>
                  <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#E0795C', animation: 'lfblink 1.4s steps(1) infinite' }} />
                  <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#E0795C', animation: 'lfleak 1.6s ease-out infinite' }} />
                </span>
                Industry avg leaking this month
              </span>
              <LiveLeak style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 30, letterSpacing: '.01em', color: '#E0795C', fontVariantNumeric: 'tabular-nums' }} />
            </div>

            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'stretch', flexWrap: 'wrap' }}>

              {/* HOOK A — lead with the leak */}
              {showA && (
                <div style={colStyle}>
                  {isCompare && <div style={{ fontFamily: SAIRA, fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 18 }}>Hook A · lead with the leak</div>}
                  <h1 style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 40, lineHeight: 1.06, margin: '0 0 18px', color: '#fff', textWrap: 'balance' }}>You're paying to generate jobs — <span style={{ color: '#E0795C' }}>then losing them</span> before they're booked.</h1>
                  <p style={{ fontSize: 17, color: 'rgba(255,255,255,.72)', margin: '0 0 26px', textWrap: 'pretty' }}>Missed calls, web leads that sit for hours, estimates that go cold. Every shop leaks revenue in the same predictable spots. We map yours and put a dollar figure on it — in one 20-minute call.</p>
                  <a href="#book" className="lf-cta-red" style={redCta}>Get my free lead-leak audit →</a>
                  <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.5)', margin: '14px 0 0' }}>No obligation. You keep the findings either way.</p>
                </div>
              )}

              {showDivider && <div style={{ width: 1, background: 'rgba(255,255,255,.12)', alignSelf: 'stretch' }} />}

              {/* HOOK B — lead with the money */}
              {showB && (
                <div style={colStyle}>
                  {isCompare && <div style={{ fontFamily: SAIRA, fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 18 }}>Hook B · lead with the money</div>}
                  <h1 style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 40, lineHeight: 1.06, margin: '0 0 18px', color: '#fff', textWrap: 'balance' }}>Most <RotatingWord words={TRADES} style={{ color: '#E0795C' }} /> are losing <span style={{ color: '#E0795C' }}>$3,000+ a month</span> in jobs they already paid to get.</h1>
                  <p style={{ fontSize: 17, color: 'rgba(255,255,255,.72)', margin: '0 0 26px', textWrap: 'pretty' }}>Whatever you run — home services, trades, local shops — we find exactly where it's leaking — missed calls, slow replies, dead estimates — then plug the biggest one first. No new ad spend. No risk.</p>
                  <a href="#book" className="lf-cta-red" style={redCta}>Show me what I'm losing →</a>
                  <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.5)', margin: '14px 0 0' }}>20-minute audit. We do the math, you keep the report.</p>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {/* guarantee badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 24 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: SAIRA, fontWeight: 700, fontSize: 12.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#fff', background: '#16243F', border: '1px solid #16243F', padding: '9px 15px', borderRadius: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z" fill="#fff" /><path d="m9 12 2 2 4-4" stroke="#16243F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Veteran-Owned
          </span>
          {['Free audit — zero obligation', 'You only pay for booked jobs', '30-day pilot — cancel anytime'].map((t) => (
            <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, color: '#2E3641', background: '#fff', border: '1px solid #E2E5EA', padding: '9px 15px', borderRadius: 6 }}>
              <Check size={15} sw={2.6} />{t}
            </span>
          ))}
        </div>

        {/* industries strip — show the breadth without listing forever */}
        <div style={{ marginTop: 30 }}>
          <p style={{ textAlign: 'center', fontFamily: SAIRA, fontWeight: 600, fontSize: 12.5, letterSpacing: '.16em', textTransform: 'uppercase', color: '#9AA3AE', margin: '0 0 14px' }}>One playbook · every service business</p>
          <Marquee items={INDUSTRIES} />
        </div>
      </section>

      {/* VSL VIDEO */}
      {showVideo && (
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '40px 24px 8px', textAlign: 'center' }}>
          <p style={{ fontFamily: SAIRA, fontWeight: 600, fontSize: 14, letterSpacing: '.04em', textTransform: 'uppercase', color: '#9AA3AE', margin: '0 0 14px' }}>Watch the 2-minute breakdown</p>
          <div onClick={() => setVideoPlaying(true)} style={{ position: 'relative', aspectRatio: '16 / 9', borderRadius: 6, overflow: 'hidden', cursor: 'pointer', background: 'linear-gradient(135deg,#16243F,#2E3641)', border: '1px solid #E2E5EA', boxShadow: '0 24px 60px -30px rgba(22,36,63,.5)' }}>
            {!videoPlaying ? (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
                <div style={{ width: 74, height: 74, borderRadius: '50%', background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,.35)' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="#16243F"><path d="M8 5.5v13l11-6.5z" /></svg>
                </div>
                <div style={{ color: 'rgba(255,255,255,.92)', fontFamily: SAIRA, fontWeight: 600, fontSize: 17 }}>How we find — and recover — your leaking jobs</div>
                <div style={{ position: 'absolute', bottom: 16, left: 18, color: 'rgba(255,255,255,.6)', fontSize: 13, fontWeight: 600 }}>2:14</div>
              </div>
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.55)', fontSize: 14, fontFamily: SAIRA }}>▸ Your VSL plays here — drop in your video embed</div>
            )}
          </div>
        </section>
      )}

      {/* WHERE THE MONEY LEAKS */}
      {showLeaks && (
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px 24px' }}>
          <Reveal style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 30, margin: '0 0 10px' }}>Where the money leaks out</h2>
            <p style={{ fontSize: 16.5, color: '#6B7480', margin: 0 }}>It's almost always the same six spots — in order of how much it hurts.</p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
            {[
              ['Missed calls', 'The caller dials your competitor in seconds. The #1 leak in home services.'],
              ['Slow lead response', "Web leads sit for hours while you're in the field. First to reply usually wins."],
              ['Estimates never followed up', 'A few nudges would close them. Nobody has time. Silent lost revenue.'],
              ['No-shows & unconfirmed jobs', 'An idle tech window is expensive. Unconfirmed appointments waste them daily.'],
              ['Reviews nobody asks for', "They've got 14, the competitor has 300. That gap costs you LSA ranking."],
              ['Flying blind', 'No clear view of revenue, job margin, or which marketing actually works.'],
            ].map(([title, body], i) => (
              <div key={title} className="lf-card" style={{ background: '#fff', border: '1px solid #E2E5EA', borderRadius: 6, padding: 20, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 14, color: '#fff', background: '#16243F', minWidth: 26, height: 26, borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>{i + 1}</span>
                <div>
                  <div style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 16, marginBottom: 3 }}>{title}</div>
                  <div style={{ fontSize: 14.5, color: '#6B7480' }}>{body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LEAK CALCULATOR */}
      <LeakCalculator />

      {/* HOW IT WORKS */}
      <section id="how" style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 24px 24px' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 44 }}>
          <p style={{ fontFamily: SAIRA, fontWeight: 600, fontSize: 14, textTransform: 'uppercase', color: '#9C3B2C', margin: '0 0 8px', letterSpacing: '.16em' }}>How it works</p>
          <h2 style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 32, margin: 0 }}>We diagnose first. We don't pitch.</h2>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {[
            ['01', 'We run the audit', 'A 20-minute call where we map where jobs leak out and turn it into a dollar number. Keep the report either way.'],
            ['02', 'We plug the biggest leak first', 'Usually missed calls + instant lead response. We fix the #1 leak and prove the ROI before anything else.'],
            ['03', 'We automate the rest', "Follow-ups, review requests, and reactivating old leads you'd written off — all running in the background."],
          ].map(([num, title, body]) => (
            <div key={num} className="lf-card" style={{ background: '#fff', border: '1px solid #E2E5EA', borderRadius: 6, padding: 30 }}>
              <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 15, color: '#16243F', background: '#EEF1F5', width: 44, height: 44, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>{num}</div>
              <h3 style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 20, margin: '0 0 9px' }}>{title}</h3>
              <p style={{ fontSize: 15.5, color: '#6B7480', margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RESULTS / CASE STUDY */}
      <section id="proof" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px 24px' }}>
        <Reveal style={{ background: '#16243F', borderRadius: 6, padding: 48, color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <span style={{ position: 'absolute', top: 20, right: 22, fontSize: 11.5, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', border: '1px solid rgba(255,255,255,.18)', padding: '5px 10px', borderRadius: 6 }}>Sample result — swap in your case study</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 40, alignItems: 'center' }}>
            <div>
              <CountUp value={11400} prefix="$" duration={1700} style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 64, lineHeight: 1, color: '#fff', display: 'block', fontVariantNumeric: 'tabular-nums' }} />
              <div style={{ fontSize: 16, color: 'rgba(255,255,255,.7)', marginTop: 8 }}>recovered in the first 90 days — with zero new ad spend.</div>
              <div style={{ display: 'flex', gap: 28, marginTop: 28, flexWrap: 'wrap' }}>
                <div>
                  <CountUp value={147} style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 26, color: '#E0795C', display: 'block', fontVariantNumeric: 'tabular-nums' }} />
                  <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.6)' }}>jobs booked from<br />leads they'd written off</div>
                </div>
                <div>
                  <CountUp value={92} prefix="14 → " style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 26, color: '#E0795C', display: 'block', fontVariantNumeric: 'tabular-nums' }} />
                  <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.6)' }}>Google reviews<br />in 4 months</div>
                </div>
              </div>
            </div>
            <div style={{ borderLeft: '2px solid rgba(224,121,92,.5)', paddingLeft: 26 }}>
              <p style={{ fontSize: 20, lineHeight: 1.5, fontWeight: 500, margin: '0 0 18px', color: 'rgba(255,255,255,.95)', textWrap: 'pretty' }}>"We weren't missing leads — we were missing the follow-up. The audit showed us exactly where, down to the dollar."</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#E0795C,#16243F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SAIRA, fontWeight: 700, color: '#fff' }}>MR</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Mike R.</div>
                  <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.6)' }}>Owner · Service business (placeholder)</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#F5A623', fontSize: 18, letterSpacing: '2px' }}>★★★★★</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>4.9</span>
            <span style={{ color: '#9AA3AE', fontSize: 14.5 }}>from 60+ owners (placeholder)</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          {[
            ['"Found $4k/month walking out the door on the first call. We\'d been blaming our ad budget the whole time."', 'Dave T.', 'HVAC, Ohio'],
            ['"No pressure, no jargon. They fixed the missed-call thing first and it paid for itself in two weeks."', 'Carla M.', 'Cleaning service, Texas'],
            ['"Finally know my numbers. The audit alone was worth more than what three \'marketing guys\' sold me."', 'Sam P.', 'Electrical & Solar, Florida'],
          ].map(([quote, name, loc]) => (
            <div key={name} className="lf-card" style={{ background: '#fff', border: '1px solid #E2E5EA', borderRadius: 6, padding: 24 }}>
              <p style={{ fontSize: 15.5, color: '#2E3641', margin: '0 0 16px', lineHeight: 1.6 }}>{quote}</p>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{name} <span style={{ color: '#9AA3AE', fontWeight: 500 }}>· {loc}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING */}
      <section id="book" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px 24px' }}>
        <div style={{ background: '#fff', border: '1px solid #E2E5EA', borderRadius: 6, boxShadow: '0 1px 2px rgba(22,36,63,.04),0 30px 70px -36px rgba(22,36,63,.22)', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>

          {/* left: meeting info */}
          <div style={{ padding: '42px 38px', borderRight: '1px solid #E2E5EA', background: '#F4F5F7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <BrandMark size={30} />
              <span style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 15, letterSpacing: '.06em', textTransform: 'uppercase', color: '#16243F' }}>American Automations</span>
            </div>
            <h2 style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 27, margin: '0 0 14px', lineHeight: 1.15 }}>Book your free lead-leak audit</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11, margin: '20px 0 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#6B7480', fontSize: 15 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#16243F" strokeWidth="2" /><path d="M12 7v5l3 2" stroke="#16243F" strokeWidth="2" strokeLinecap="round" /></svg>20 minutes
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#6B7480', fontSize: 15 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="13" height="12" rx="2.5" stroke="#16243F" strokeWidth="2" /><path d="m16 10 5-3v10l-5-3z" stroke="#16243F" strokeWidth="2" strokeLinejoin="round" /></svg>Phone or video — your call
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: '#6B7480', fontSize: 15 }}>
                <span style={{ marginTop: 2 }}><Check size={17} sw={2.4} /></span>You leave with a dollar figure and the one fix that recovers the most.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, borderTop: '1px solid #E2E5EA', paddingTop: 20 }}>
              {['Free — zero obligation', 'You only pay for booked jobs', '30-day pilot — cancel anytime'].map((t) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, color: '#2E3641' }}>
                  <Check size={14} sw={2.6} />{t}
                </span>
              ))}
            </div>
          </div>

          {/* right: calendar */}
          <div style={{ padding: '34px 32px' }}>
            {!confirmed ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <span style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 16 }}>June 2026</span>
                  <div style={{ display: 'flex', gap: 6, color: '#9AA3AE' }}>
                    <span style={{ width: 30, height: 30, border: '1px solid #E2E5EA', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>‹</span>
                    <span style={{ width: 30, height: 30, border: '1px solid #E2E5EA', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>›</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5, marginBottom: 6 }}>
                  {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
                    <div key={d} style={{ textAlign: 'center', fontSize: 11.5, fontWeight: 600, color: '#9AA3AE' }}>{d}</div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5 }}>
                  {days.map((d) => d.empty ? (
                    <div key={d.key} />
                  ) : (
                    <div key={d.key} onClick={d.disabled ? undefined : () => setSelectedDay(d.day!)} style={dayStyle(!!d.disabled, !!d.selected)}>{d.day}</div>
                  ))}
                </div>
                <div style={{ marginTop: 18, fontSize: 13, color: '#9AA3AE', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#16243F" strokeWidth="2" /><path d="M12 7v5l3 2" stroke="#16243F" strokeWidth="2" strokeLinecap="round" /></svg>Times shown in your local time
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7, marginTop: 14 }}>
                  {TIMES.map((label) => (
                    <div key={label} onClick={() => setSelectedTime(label)} style={timeStyle(label === selectedTime)}>{label}</div>
                  ))}
                </div>
                <button onClick={() => setConfirmed(true)} className="lf-cta-red" style={{ width: '100%', marginTop: 18, background: '#9C3B2C', color: '#fff', fontFamily: SAIRA, fontWeight: 700, fontSize: 16, padding: 15, borderRadius: 6, border: 'none', cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase', boxShadow: '0 8px 22px -6px rgba(156,59,44,.5)' }}>{confirmLabel}</button>
                <p style={{ textAlign: 'center', fontSize: 12.5, color: '#9AA3AE', margin: '12px 0 0' }}>Scheduler placeholder — connect Calendly / Cal.com here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 340, animation: 'lfrise .4s ease' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#EEF1F5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="#16243F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <h3 style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 23, margin: '0 0 8px' }}>You're booked.</h3>
                <p style={{ fontSize: 15.5, color: '#6B7480', margin: '0 0 4px' }}>{bookedLabel}</p>
                <p style={{ fontSize: 13.5, color: '#9AA3AE', margin: '14px 0 0' }}>(Demo confirmation — wire up your real scheduler.)</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ maxWidth: 1100, margin: '48px auto 0', padding: '48px 24px 56px', borderTop: '1px solid #E2E5EA', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BrandMark size={28} />
          <span style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 14, letterSpacing: '.06em', textTransform: 'uppercase', color: '#16243F' }}>American Automations</span>
        </div>
        <span style={{ fontSize: 13.5, color: '#9AA3AE' }}>Stop losing jobs you already paid to get. · © 2026 · placeholder copy</span>
      </footer>
    </div>
  );
}
