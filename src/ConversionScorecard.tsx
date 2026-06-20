import { useMemo, useRef, useState, type CSSProperties } from 'react';
import { Reveal } from './motion';
import { SCORECARD, scoreToGrade, submitLead } from './config';

const SAIRA = "'Saira Semi Condensed',sans-serif";

const ALL_ITEMS = SCORECARD.flatMap((c) => c.items);
const OPTIONS: { v: 0 | 1 | 2; label: string }[] = [
  { v: 0, label: 'No' }, { v: 1, label: 'Sort of' }, { v: 2, label: 'Yes' },
];

function Seg({ value, onChange }: { value: number; onChange: (v: 0 | 1 | 2) => void }) {
  return (
    <div style={{ display: 'flex', flex: 'none', gap: 4 }}>
      {OPTIONS.map((o) => {
        const on = value === o.v;
        const tone = o.v === 2 ? '#1F7A52' : o.v === 0 ? '#9C3B2C' : '#6B7480';
        return (
          <button key={o.v} onClick={() => onChange(o.v)} aria-pressed={on}
            style={{ font: 'inherit', cursor: 'pointer', fontSize: 12, fontWeight: 700, padding: '5px 9px', borderRadius: 6, whiteSpace: 'nowrap',
              border: `1px solid ${on ? tone : 'var(--border)'}`, background: on ? tone : 'var(--card)', color: on ? '#fff' : 'var(--muted)', transition: 'all .12s ease' }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

const field: CSSProperties = {
  width: '100%', padding: '11px 13px', borderRadius: 8, border: '1px solid rgba(255,255,255,.18)',
  background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: 14.5, fontFamily: "'IBM Plex Sans',sans-serif", outline: 'none',
};

export default function ConversionScorecard() {
  const [answers, setAnswers] = useState<Record<string, 0 | 1 | 2>>(
    () => Object.fromEntries(ALL_ITEMS.map((i) => [i.id, 1])),
  );
  const [sent, setSent] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', business: '', website: '' });
  const formRef = useRef<HTMLDivElement>(null);
  const setField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const { pct, grade, weakest, needWork } = useMemo(() => {
    const total = ALL_ITEMS.reduce((s, i) => s + (answers[i.id] ?? 1), 0);
    const p = total / (ALL_ITEMS.length * 2);
    const ranked = [...ALL_ITEMS].sort((a, b) => (answers[a.id] ?? 1) - (answers[b.id] ?? 1));
    return { pct: p, grade: scoreToGrade(p), weakest: ranked.filter((i) => (answers[i.id] ?? 1) < 2).slice(0, 3), needWork: ALL_ITEMS.filter((i) => (answers[i.id] ?? 1) === 0).length };
  }, [answers]);

  const set = (id: string) => (v: 0 | 1 | 2) => setAnswers((a) => ({ ...a, [id]: v }));

  const openForm = () => { setShowForm(true); setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60); };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    await submitLead({
      name: form.name, email: form.email, business: form.business, website: form.website,
      scorecardGrade: grade.grade, scorecardScorePct: Math.round(pct * 100), scorecardWeakest: weakest.map((w) => w.label).join('; '),
      source: 'conversion-scorecard', pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    });
    setSubmitting(false);
    setSent(true);
  };

  return (
    <section id="scorecard" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px 24px' }}>
      <Reveal style={{ textAlign: 'center', marginBottom: 36 }}>
        <p style={{ fontFamily: SAIRA, fontWeight: 600, fontSize: 14, textTransform: 'uppercase', color: '#9C3B2C', margin: '0 0 8px', letterSpacing: '.16em' }}>Conversion scorecard</p>
        <h2 style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 32, margin: '0 0 10px', color: 'var(--ink)' }}>Is your website costing you calls?</h2>
        <p style={{ fontSize: 16.5, color: 'var(--muted)', margin: '0 auto', maxWidth: 620 }}>Answer honestly — it grades your page A–F and flags exactly what to fix. Two minutes, no signup to see your grade.</p>
      </Reveal>

      <Reveal style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', boxShadow: '0 1px 2px rgba(22,36,63,.04),0 30px 70px -40px rgba(22,36,63,.22)' }}>
        {/* checklist */}
        <div style={{ padding: '30px 32px' }}>
          {SCORECARD.map((cat) => (
            <div key={cat.key} style={{ marginBottom: 18 }}>
              <div style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: '#9C3B2C', marginBottom: 10 }}>{cat.title}</div>
              {cat.items.map((it) => (
                <div key={it.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.35 }}>{it.label}</span>
                  <Seg value={answers[it.id] ?? 1} onChange={set(it.id)} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* result */}
        <div style={{ padding: '32px 32px', background: 'radial-gradient(120% 120% at 100% 0%, #21365C 0%, #16243F 55%, #0E1A30 100%)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 12.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)' }}>Your page scores</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, margin: '6px 0 2px' }}>
            <span style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 64, lineHeight: 1, color: grade.color === '#1F7A52' ? '#34D399' : grade.color === '#0E7C86' ? '#5EEAD4' : '#E0795C' }}>{grade.grade}</span>
            <span style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 22, color: 'rgba(255,255,255,.85)' }}>{grade.label}</span>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)' }}>{Math.round(pct * 100)}% · {needWork} area{needWork === 1 ? '' : 's'} flagged as missing</div>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.8)', margin: '14px 0 0', lineHeight: 1.55 }}>{grade.verdict}</p>

          {weakest.length > 0 && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.14)' }}>
              <div style={{ fontFamily: SAIRA, fontWeight: 700, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: '#E0795C', marginBottom: 10 }}>Fix these first</div>
              {weakest.map((w) => (
                <div key={w.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13.5, color: 'rgba(255,255,255,.85)', marginBottom: 7 }}>
                  <span style={{ color: '#E0795C', flex: 'none' }}>→</span>{w.label}
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 14, fontSize: 12.5, color: 'rgba(255,255,255,.55)' }}>
            Want the dollar figure? <a href="#calc" style={{ color: '#E0795C', fontWeight: 600 }}>Run the leak calculator →</a>
          </div>

          {/* lead capture */}
          {!sent && !showForm && (
            <button onClick={openForm} className="lf-cta-red" style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: '#9C3B2C', color: '#fff', fontFamily: SAIRA, fontWeight: 700, fontSize: 15, padding: '13px 20px', borderRadius: 6, border: 'none', cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase', boxShadow: '0 8px 22px -6px rgba(156,59,44,.5)' }}>
              Send me the full fix list →
            </button>
          )}
          {!sent && showForm && (
            <div ref={formRef} style={{ marginTop: 16, animation: 'lfrise .3s ease' }}>
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <input style={field} placeholder="Your name" required autoComplete="name" value={form.name} onChange={setField('name')} />
                <input style={field} type="email" placeholder="Email" required autoComplete="email" value={form.email} onChange={setField('email')} />
                <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
                  <input style={{ ...field, flex: 1, minWidth: 120 }} placeholder="Business name" required value={form.business} onChange={setField('business')} />
                  <input style={{ ...field, flex: 1, minWidth: 120 }} placeholder="Website URL" value={form.website} onChange={setField('website')} />
                </div>
                <button type="submit" disabled={submitting} className="lf-cta-red" style={{ marginTop: 4, background: '#9C3B2C', color: '#fff', fontFamily: SAIRA, fontWeight: 700, fontSize: 15, padding: '13px', borderRadius: 6, border: 'none', cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.7 : 1, letterSpacing: '.04em', textTransform: 'uppercase', boxShadow: '0 8px 22px -6px rgba(156,59,44,.5)' }}>
                  {submitting ? 'Sending…' : `Send my ${grade.grade} scorecard →`}
                </button>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', textAlign: 'center' }}>We’ll send your grade + prioritized fixes. No spam.</div>
              </form>
            </div>
          )}
          {sent && (
            <div style={{ marginTop: 16, animation: 'lfrise .3s ease', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 10, padding: '20px 18px', textAlign: 'center' }}>
              <div style={{ fontFamily: SAIRA, fontWeight: 800, fontSize: 20 }}>On its way.</div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', margin: '6px 0 14px' }}>Check your inbox for your {grade.grade} scorecard and the prioritized fix list. Ready to plug it? Book the audit.</p>
              <a href="#book" className="lf-cta-red" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#9C3B2C', color: '#fff', fontFamily: SAIRA, fontWeight: 700, fontSize: 14, padding: '11px 20px', borderRadius: 6, textDecoration: 'none', letterSpacing: '.04em', textTransform: 'uppercase' }}>Book the free audit →</a>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
