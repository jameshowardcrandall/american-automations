import { PRICING_FEATURES, PRICING_TIERS, PRICING_META, ADDONS, fmtMoney } from './config';
import { Reveal } from './motion';

const SAIRA = "'Saira Semi Condensed',sans-serif";

export default function Pricing() {
  return (
    <section id="pricing" style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 24px 24px' }}>
      <Reveal style={{ textAlign: 'center', marginBottom: 14 }}>
        <p style={{ fontFamily: SAIRA, fontWeight: 600, fontSize: 14, textTransform: 'uppercase', color: '#9C3B2C', margin: '0 0 8px', letterSpacing: '.16em' }}>Pricing</p>
        <h2 style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 32, margin: '0 0 10px', color: 'var(--ink)' }}>Priced against what you recover — not hours.</h2>
        <p style={{ fontSize: 16.5, color: 'var(--muted)', margin: '0 auto', maxWidth: 600 }}>
          Start with the free audit. Plug the first leak with a one-time {fmtMoney(PRICING_META.setupPrice)} setup, then pick a plan. Month-to-month, cancel anytime.
        </p>
      </Reveal>

      {/* free-audit + setup ribbon */}
      <Reveal style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, margin: '22px 0 30px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: SAIRA, fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase', color: '#fff', background: '#16243F', padding: '10px 16px', borderRadius: 999 }}>
          Revenue Leak Audit · {PRICING_META.auditPrice}
        </span>
        <span className="lf-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', background: 'var(--card)', border: '1px solid var(--border)', padding: '10px 16px', borderRadius: 999 }}>
          First-fix setup · {fmtMoney(PRICING_META.setupPrice)} one-time
        </span>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 18, alignItems: 'stretch' }}>
        {PRICING_TIERS.map((tier) => {
          const featured = !!tier.featured;
          return (
            <div key={tier.key} className="lf-card" style={{
              position: 'relative', display: 'flex', flexDirection: 'column',
              background: featured ? 'radial-gradient(140% 120% at 100% 0%, #21365C 0%, #16243F 60%, #0E1A30 100%)' : 'var(--card)',
              color: featured ? '#fff' : 'var(--ink)',
              border: featured ? '1px solid #2B3C5C' : '1px solid var(--border)',
              borderRadius: 10, padding: '30px 26px',
              boxShadow: featured ? '0 30px 70px -34px rgba(8,16,32,.8)' : undefined,
              transform: featured ? 'translateY(-6px)' : undefined,
            }}>
              {tier.badge && (
                <span style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', fontFamily: SAIRA, fontWeight: 700, fontSize: 11.5, letterSpacing: '.12em', textTransform: 'uppercase', color: '#fff', background: featured ? '#9C3B2C' : '#16243F', padding: '6px 14px', borderRadius: 999, whiteSpace: 'nowrap', boxShadow: featured ? '0 6px 16px -6px rgba(156,59,44,.6)' : '0 6px 16px -6px rgba(22,36,63,.5)' }}>{featured ? '★ ' : ''}{tier.badge}</span>
              )}
              <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 22, textTransform: 'uppercase', letterSpacing: '.02em' }}>{tier.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '10px 0 4px' }}>
                {tier.custom ? (
                  <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 34, lineHeight: 1.2, color: featured ? '#E0795C' : 'var(--ink)' }}>{tier.priceLabel}</span>
                ) : (
                  <>
                    <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 46, lineHeight: 1, color: featured ? '#E0795C' : 'var(--ink)' }}>{fmtMoney(tier.price)}</span>
                    <span style={{ fontSize: 15, color: featured ? 'rgba(255,255,255,.6)' : 'var(--muted)', fontWeight: 600 }}>/mo</span>
                  </>
                )}
              </div>
              <p style={{ fontSize: 14.5, color: featured ? 'rgba(255,255,255,.72)' : 'var(--muted)', margin: '0 0 18px', minHeight: 42 }}>{tier.blurb}</p>

              <a href="#book" className={featured ? 'lf-cta-red' : undefined} style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none',
                fontFamily: SAIRA, fontWeight: 700, fontSize: 15, padding: '13px 18px', borderRadius: 8, letterSpacing: '.04em', textTransform: 'uppercase',
                background: featured ? '#9C3B2C' : 'transparent',
                color: featured ? '#fff' : 'var(--ink)',
                border: featured ? 'none' : '1px solid var(--border)',
                boxShadow: featured ? '0 8px 22px -6px rgba(156,59,44,.5)' : undefined,
              }}>{tier.custom ? 'Talk to us →' : 'Book your free audit →'}</a>

              <div style={{ height: 1, background: featured ? 'rgba(255,255,255,.14)' : 'var(--border)', margin: '20px 0 16px' }} />
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {PRICING_FEATURES.map((feat, i) => {
                  const on = tier.has[i];
                  const dim = featured ? 'rgba(255,255,255,.4)' : '#C2C8D1';
                  const txt = featured ? (on ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.4)') : (on ? 'var(--ink)' : 'var(--muted)');
                  return (
                    <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 14, color: txt, opacity: on ? 1 : 0.65 }}>
                      {on ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flex: 'none', marginTop: 2 }}><path d="M20 6 9 17l-5-5" stroke="#9C3B2C" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flex: 'none', marginTop: 2 }}><path d="M6 12h12" stroke={dim} strokeWidth="2.4" strokeLinecap="round" /></svg>
                      )}
                      {feat}
                    </li>
                  );
                })}
              </ul>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: featured ? '1px solid rgba(255,255,255,.14)' : '1px solid var(--border)', fontSize: 13, fontWeight: 600, color: featured ? 'rgba(255,255,255,.7)' : 'var(--muted)' }}>{tier.sms}</div>
            </div>
          );
        })}
      </div>

      <Reveal style={{ textAlign: 'center', marginTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 18px', fontSize: 13.5, color: 'var(--muted)' }}>
        <span><strong style={{ color: 'var(--ink)' }}>Annual:</strong> {PRICING_META.annualNote}</span>
        <span style={{ opacity: .5 }}>·</span>
        <span>{PRICING_META.usageNote}</span>
        <span style={{ opacity: .5 }}>·</span>
        <span>You only pay for booked jobs the system recovers.</span>
      </Reveal>

      {/* add-ons */}
      <Reveal style={{ marginTop: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <p style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 12.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--muted)', margin: 0 }}>Bolt-on anytime</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14 }}>
          {ADDONS.map((a) => (
            <div key={a.name} className="lf-card" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
                <span style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{a.name}</span>
                <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 16, color: '#9C3B2C', whiteSpace: 'nowrap' }}>{a.price}</span>
              </div>
              <p className="lf-body" style={{ fontSize: 13.5, color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>{a.note}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
