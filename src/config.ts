/* ============================================================================
   config.ts — the single source of truth for the whole funnel.
   This IS the template engine: rebrand or re-target by editing this file only.
   Swap brand colors, the trade list, per-industry benchmarks, copy, FAQ, and
   logos here and the entire page (hero, calculator, sticky bar, proof) follows.
   ========================================================================== */

export const brand = {
  name: 'American Automations',
  navy: '#16243F',
  red: '#9C3B2C',
  redDark: '#7E2F22',
  ember: '#E0795C',
  page: '#F4F5F7',
  ink: '#16243F',
  muted: '#6B7480',
  faint: '#9AA3AE',
  border: '#E2E5EA',
  tagline: 'Stop losing jobs you already paid to get.',
};

/* ---- Leak math (shared by the calculator, hero ticker, and sticky bar) ---- */
export const WEEKS_PER_MONTH = 4.33;
export const MISSED_CALL_BOOK_RATE = 0.35; // a missed call that would've booked
export const DEAD_QUOTE_CLOSE_RATE = 0.22; // an un-followed-up quote that would've closed

export interface LeakInputs { avgTicket: number; missedPerWeek: number; deadQuotesPerWeek: number }
export function monthlyLeak({ avgTicket, missedPerWeek, deadQuotesPerWeek }: LeakInputs) {
  const fromCalls = missedPerWeek * WEEKS_PER_MONTH * MISSED_CALL_BOOK_RATE * avgTicket;
  const fromQuotes = deadQuotesPerWeek * WEEKS_PER_MONTH * DEAD_QUOTE_CLOSE_RATE * avgTicket;
  return { fromCalls, fromQuotes, total: fromCalls + fromQuotes };
}
export const fmtMoney = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

/* ---- Industries (drives industry-aware mode + calculator defaults) ---- */
export interface Industry extends LeakInputs {
  key: string;
  label: string;   // shown in the picker
  trade: string;   // noun used in the headline ("Most ___ are losing…")
}
export const INDUSTRIES: Industry[] = [
  { key: 'all',         label: 'All service businesses', trade: 'service businesses', avgTicket: 400, missedPerWeek: 6, deadQuotesPerWeek: 5 },
  { key: 'plumbing',    label: 'Plumbing',     trade: 'plumbers',       avgTicket: 480, missedPerWeek: 8, deadQuotesPerWeek: 5 },
  { key: 'hvac',        label: 'HVAC',         trade: 'HVAC shops',     avgTicket: 620, missedPerWeek: 7, deadQuotesPerWeek: 6 },
  { key: 'roofing',     label: 'Roofing',      trade: 'roofers',        avgTicket: 1100, missedPerWeek: 5, deadQuotesPerWeek: 7 },
  { key: 'electrical',  label: 'Electrical',   trade: 'electricians',   avgTicket: 520, missedPerWeek: 6, deadQuotesPerWeek: 5 },
  { key: 'landscaping', label: 'Landscaping',  trade: 'landscapers',    avgTicket: 350, missedPerWeek: 7, deadQuotesPerWeek: 6 },
  { key: 'cleaning',    label: 'Cleaning',     trade: 'cleaning crews', avgTicket: 180, missedPerWeek: 10, deadQuotesPerWeek: 6 },
  { key: 'pest',        label: 'Pest Control', trade: 'pest pros',      avgTicket: 240, missedPerWeek: 8, deadQuotesPerWeek: 5 },
  { key: 'garage',      label: 'Garage Doors', trade: 'garage-door pros', avgTicket: 540, missedPerWeek: 5, deadQuotesPerWeek: 4 },
  { key: 'medspa',      label: 'Med Spa',      trade: 'med spas',       avgTicket: 320, missedPerWeek: 9, deadQuotesPerWeek: 7 },
];
export const industryByKey = (key: string) => INDUSTRIES.find((i) => i.key === key) ?? INDUSTRIES[0];

/* Trades cycled in the hero when "All service businesses" is selected. */
export const TRADES = ['plumbers', 'roofers', 'electricians', 'HVAC shops', 'landscapers', 'cleaning crews', 'pest pros', 'contractors'];

/* Marquee strip under the hero. */
export const MARQUEE = ['Plumbing', 'HVAC', 'Roofing', 'Electrical', 'Landscaping', 'Cleaning', 'Pest Control', 'Garage Doors', 'Painting', 'Auto Repair', 'Med Spa', 'Dental', 'Fitness', 'Salons'];

/* The six leaks — now with a fix line for the interactive diagram. */
export interface Leak { title: string; body: string; fix: string }
export const LEAKS: Leak[] = [
  { title: 'Missed calls', body: 'The caller dials your competitor in seconds. The #1 leak in service businesses.', fix: 'Instant missed-call text-back + 24/7 AI receptionist that books the job.' },
  { title: 'Slow lead response', body: "Web leads sit for hours while you're in the field. First to reply usually wins.", fix: 'Auto-reply in under 60 seconds, every lead, every channel.' },
  { title: 'Estimates never followed up', body: 'A few nudges would close them. Nobody has time. Silent lost revenue.', fix: 'Automated quote follow-up sequence until they book or say no.' },
  { title: 'No-shows & unconfirmed jobs', body: 'An idle tech window is expensive. Unconfirmed appointments waste them daily.', fix: 'Automatic confirmations + reminders that cut no-shows.' },
  { title: 'Reviews nobody asks for', body: "They've got 14, the competitor has 300. That gap costs you ranking.", fix: 'Auto-request reviews right after a paid job, while you shine.' },
  { title: 'Flying blind', body: 'No clear view of revenue, job margin, or which marketing actually works.', fix: 'One dashboard: leads, booked revenue, and source ROI.' },
];

export interface Step { num: string; title: string; body: string }
export const STEPS: Step[] = [
  { num: '01', title: 'We run the audit', body: 'A 20-minute call where we map where jobs leak out and turn it into a dollar number. Keep the report either way.' },
  { num: '02', title: 'We plug the biggest leak first', body: 'Usually missed calls + instant lead response. We fix the #1 leak and prove the ROI before anything else.' },
  { num: '03', title: 'We automate the rest', body: "Follow-ups, review requests, and reactivating old leads you'd written off — all running in the background." },
];

export interface Testimonial { quote: string; name: string; loc: string }
export const TESTIMONIALS: Testimonial[] = [
  { quote: '"Found $4k/month walking out the door on the first call. We\'d been blaming our ad budget the whole time."', name: 'Dave T.', loc: 'HVAC, Ohio' },
  { quote: '"No pressure, no jargon. They fixed the missed-call thing first and it paid for itself in two weeks."', name: 'Carla M.', loc: 'Cleaning service, Texas' },
  { quote: '"Finally know my numbers. The audit alone was worth more than what three \'marketing guys\' sold me."', name: 'Sam P.', loc: 'Electrical & Solar, Florida' },
];

export const CASE_STUDY = {
  headline: 11400,
  jobsBooked: 147,
  reviewsFrom: 14,
  reviewsTo: 92,
  quote: '"We weren\'t missing leads — we were missing the follow-up. The audit showed us exactly where, down to the dollar."',
  name: 'Mike R.',
  role: 'Owner · Service business (placeholder)',
  initials: 'MR',
  beforeRevenue: 38000,  // monthly, before
  afterRevenue: 49400,   // monthly, after
};

export interface Faq { q: string; a: string }
export const FAQ: Faq[] = [
  { q: 'Is the audit really free?', a: 'Yes — the 20-minute lead-leak audit costs nothing and you keep the findings whether or not we ever work together. We make money only when we recover revenue for you.' },
  { q: 'I\'m not plumbing or HVAC — does this still apply?', a: 'It applies to any business that books jobs or appointments: roofing, electrical, landscaping, cleaning, pest, med spas, auto, dental, fitness. The leaks are the same; only the numbers change.' },
  { q: 'Do I have to switch software?', a: 'No. We layer automation on top of the tools you already use — your phone, your CRM, your booking. Nothing gets ripped out.' },
  { q: 'How fast do we see results?', a: 'The #1 leak (missed calls + instant response) is usually live within a week, and it tends to pay for itself before the first invoice.' },
  { q: 'What does it cost after the free audit?', a: 'A flat monthly pilot with a 30-day cancel-anytime guarantee, and you only pay for booked jobs the system recovers. We\'ll quote it on the call once we see your numbers.' },
];

/* "As seen in" / trust strip — replace with real client or press logos. */
export const LOGOS = ['HomePro', 'TradeForce', 'ServiceHub', 'BlueCollar Co.', 'MainStreet', 'FieldOps'];
