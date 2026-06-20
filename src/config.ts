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
  lockupTagline: 'Military-grade systems for service businesses',
  signature: 'We take your operations to warfighter speed.',
  trustLine: 'Veteran-owned. Built on follow-through.',
};

/* ---- Who We Are (doc 13) ---- */
export interface Founder { name: string; role: string; bio: string }
export const FOUNDERS: Founder[] = [
  { name: 'Jagger', role: 'Operations & delivery', bio: 'Same DoD-space rigor as James — plus he\'s run service businesses from the owner\'s seat: roofing and junk removal, and he built and exited a vent-cleaning company. He\'s lived your shop\'s leaks firsthand. Leads operations and delivery.' },
  { name: 'James', role: 'Solution architect', bio: 'Spent years diagnosing where operations bleed time and money, then architecting the automation that fixes it. Leads discovery and systems design.' },
];
export const VALUES: { title: string; body: string }[] = [
  { title: 'Mission first', body: 'Your booked jobs and your time are the mission. Everything we build serves that.' },
  { title: 'No dropped handoffs', body: 'If it can fall through a crack, we automate the catch — calls, leads, quotes, follow-ups.' },
  { title: 'Prove it, then scale', body: 'Fix the biggest leak, show the ROI, expand. No hand-waving.' },
  { title: 'Plain talk', body: "We speak like operators, not marketers. You'll always know what we're doing and why." },
];

/* ---- GoHighLevel lead routing ----
   Paste your GHL *Inbound Webhook* URL below to send calculator leads into GHL.
   Create it in GHL: Automation → Workflows → + New Workflow → add trigger
   "Inbound Webhook" → Save → copy the webhook URL it generates. Then map the
   fields (name, email, phone, business, etc.) onto a Create/Update Contact step.
   Leave '' and the form still works — it just shows success without sending. */
export const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/Ox72X3YUgSkxaaC937Jv/webhook-trigger/2179a2b0-0383-4a58-aa87-a71c975064af';
export const GHL_LOCATION_ID = 'Ox72X3YUgSkxaaC937Jv';

/** POST a lead to the GHL inbound webhook as JSON. GHL's endpoint returns open
 *  CORS, so application/json sends fine from the browser AND gets parsed into
 *  mappable fields. Never throws to the caller. */
export async function submitLead(payload: Record<string, unknown>): Promise<boolean> {
  if (!GHL_WEBHOOK_URL) return true; // not wired yet — don't block the UX
  const body = JSON.stringify({ ...payload, locationId: GHL_LOCATION_ID });
  try {
    await fetch(GHL_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    return true;
  } catch {
    try { await fetch(GHL_WEBHOOK_URL, { method: 'POST', mode: 'no-cors', body }); } catch { /* ignore */ }
    return true;
  }
}

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

/* ---- Traffic-that-doesn't-convert leak ----
   A weak page wastes two things: paid demand (ad spend on visitors who bounce)
   and organic demand (visits that never become a call). Both, conservatively. */
export const ACHIEVABLE_CONV = 0.06; // a focused service landing page (visit → lead)
export const DEFAULT_CONV = 0.02;    // a typical generic small-shop website
export const WEB_LEAD_CLOSE_RATE = 0.4; // inbound web lead → booked job
export const MAX_SPEND_WASTE = 0.7;  // cap on the share of ad spend treated as wasted

export interface WebsiteInputs { avgTicket: number; monthlyVisits: number; currentConv: number; monthlyAdSpend: number }
export function websiteLeak({ avgTicket, monthlyVisits, currentConv, monthlyAdSpend }: WebsiteInputs) {
  const lostLeads = Math.max(0, monthlyVisits * (ACHIEVABLE_CONV - currentConv));
  const lostRevenue = lostLeads * WEB_LEAD_CLOSE_RATE * avgTicket;
  const wastePct = Math.min(MAX_SPEND_WASTE, Math.max(0, 1 - currentConv / ACHIEVABLE_CONV));
  const wastedSpend = monthlyAdSpend * wastePct;
  return { lostLeads, lostRevenue, wastedSpend, total: lostRevenue + wastedSpend };
}

export const fmtMoney = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

/* ---- Industries (drives industry-aware mode + calculator defaults) ---- */
export interface Industry extends LeakInputs {
  key: string;
  label: string;        // shown in the picker
  trade: string;        // noun used in the headline ("Most ___ are losing…")
  monthlyVisits: number;   // website/landing visits per month
  monthlyAdSpend: number;  // paid ads / LSA spend per month
}
export const INDUSTRIES: Industry[] = [
  { key: 'all',         label: 'All service businesses', trade: 'service businesses', avgTicket: 400, missedPerWeek: 6, deadQuotesPerWeek: 5, monthlyVisits: 400, monthlyAdSpend: 1000 },
  { key: 'plumbing',    label: 'Plumbing',     trade: 'plumbers',       avgTicket: 480, missedPerWeek: 8, deadQuotesPerWeek: 5, monthlyVisits: 500, monthlyAdSpend: 1500 },
  { key: 'hvac',        label: 'HVAC',         trade: 'HVAC shops',     avgTicket: 620, missedPerWeek: 7, deadQuotesPerWeek: 6, monthlyVisits: 600, monthlyAdSpend: 2200 },
  { key: 'roofing',     label: 'Roofing',      trade: 'roofers',        avgTicket: 1100, missedPerWeek: 5, deadQuotesPerWeek: 7, monthlyVisits: 450, monthlyAdSpend: 2500 },
  { key: 'electrical',  label: 'Electrical',   trade: 'electricians',   avgTicket: 520, missedPerWeek: 6, deadQuotesPerWeek: 5, monthlyVisits: 450, monthlyAdSpend: 1400 },
  { key: 'landscaping', label: 'Landscaping',  trade: 'landscapers',    avgTicket: 350, missedPerWeek: 7, deadQuotesPerWeek: 6, monthlyVisits: 500, monthlyAdSpend: 1200 },
  { key: 'cleaning',    label: 'Cleaning',     trade: 'cleaning crews', avgTicket: 180, missedPerWeek: 10, deadQuotesPerWeek: 6, monthlyVisits: 600, monthlyAdSpend: 900 },
  { key: 'pest',        label: 'Pest Control', trade: 'pest pros',      avgTicket: 240, missedPerWeek: 8, deadQuotesPerWeek: 5, monthlyVisits: 500, monthlyAdSpend: 1100 },
  { key: 'garage',      label: 'Garage Doors', trade: 'garage-door pros', avgTicket: 540, missedPerWeek: 5, deadQuotesPerWeek: 4, monthlyVisits: 350, monthlyAdSpend: 900 },
  { key: 'medspa',      label: 'Med Spa',      trade: 'med spas',       avgTicket: 320, missedPerWeek: 9, deadQuotesPerWeek: 7, monthlyVisits: 800, monthlyAdSpend: 1800 },
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
  { title: "Traffic that doesn't convert", body: "You pay for clicks and earn visits — then a slow, vague website sends them away before they ever call. Wasted ad spend and wasted demand.", fix: 'A fast, focused landing page (like this one) that turns visitors into booked calls — with tracking so you can see it working.' },
];

export interface Step { num: string; title: string; body: string }
export const STEPS: Step[] = [
  { num: '01', title: 'We run the audit', body: 'A 20-minute call where we map where jobs leak out and turn it into a dollar number. Keep the report either way.' },
  { num: '02', title: 'We plug the biggest leak first', body: 'Usually missed calls + instant lead response. We fix the #1 leak and prove the ROI before anything else.' },
  { num: '03', title: 'We automate the rest', body: "Follow-ups, review requests, and reactivating old leads you'd written off — all running in the background." },
];

/* Honest "what to expect" timeline — used in place of fabricated testimonials
   while pre-roster. Swap to a real Testimonial[] once you have client quotes. */
export interface Expectation { phase: string; title: string; body: string }
export const EXPECTATIONS: Expectation[] = [
  { phase: 'Week 1', title: 'Stop the #1 leak', body: 'We turn on instant missed-call text-back and 60-second lead response. The biggest drip stops first — usually before your first invoice.' },
  { phase: 'Day 30', title: 'Automations earning', body: "Quote follow-ups and review requests are running. Old leads you'd written off start booking again — on autopilot, in the background." },
  { phase: 'Day 90', title: 'Clear ROI, or you walk', body: 'One dashboard, a recovered-revenue number you can see, and a 30-day cancel-anytime guarantee. No lock-in, ever.' },
];

/* Projection (not a specific client) — modeled from the average leaks above.
   Honest while pre-roster; swap in a real case study when you have one. */
export const CASE_STUDY = {
  headline: 11400,
  jobsBooked: 147,
  reviewsFrom: 14,
  reviewsTo: 92,
  beforeRevenue: 38000,  // monthly, before
  afterRevenue: 49400,   // monthly, after
};

export interface Faq { q: string; a: string }
export const FAQ: Faq[] = [
  { q: 'Is the audit really free?', a: 'Yes — the 20-minute lead-leak audit costs nothing and you keep the findings whether or not we ever work together. We make money only when we recover revenue for you.' },
  { q: 'I\'m not plumbing or HVAC — does this still apply?', a: 'It applies to any business that books jobs or appointments: roofing, electrical, landscaping, cleaning, pest, med spas, auto, dental, fitness. The leaks are the same; only the numbers change.' },
  { q: 'Do I have to switch software?', a: 'No. We layer automation on top of the tools you already use — your phone, your CRM, your booking. Nothing gets ripped out.' },
  { q: 'How fast do we see results?', a: 'The #1 leak (missed calls + instant response) is usually live within a week, and it tends to pay for itself before the first invoice.' },
  { q: 'What does it cost after the free audit?', a: 'A one-time setup plus a flat month-to-month plan you can cancel anytime. We price it against what your audit shows you\'re losing, so it\'s built to pay for itself — and if it isn\'t recovering meaningfully more than it costs, we don\'t keep going. We\'ll quote it on the call once we see your numbers.' },
];

/* "As seen in" / trust strip — replace with real client or press logos. */
export const LOGOS = ['HomePro', 'TradeForce', 'ServiceHub', 'BlueCollar Co.', 'MainStreet', 'FieldOps'];

/* ---- Website Conversion Scorecard (doc 12) ----
   Self-grade tool: each item scored No(0) / Sort of(1) / Yes(2). */
export interface ScorecardItem { id: string; label: string }
export interface ScorecardCategory { key: string; title: string; items: ScorecardItem[] }
export const SCORECARD: ScorecardCategory[] = [
  { key: 'speed', title: 'Speed & mobile', items: [
    { id: 'load', label: 'Loads in under 3 seconds on a phone' },
    { id: 'responsive', label: 'Fully mobile-friendly — tappable, no pinch-zoom' },
    { id: 'popups', label: 'No pop-up blocking them before they can act' },
  ] },
  { key: 'cta', title: 'The call to action', items: [
    { id: 'taptocall', label: 'Tap-to-call number above the fold (sticky on mobile)' },
    { id: 'oneaction', label: 'One obvious primary action — not five competing buttons' },
    { id: 'ctarepeat', label: 'CTA repeated top, middle and bottom' },
    { id: 'booking', label: 'Online booking option for people who won’t call' },
  ] },
  { key: 'message', title: 'The message', items: [
    { id: 'who', label: 'Who you are, what you do, and where — clear in 3 seconds' },
    { id: 'why', label: 'A reason to choose you (speed, 24/7, pricing, guarantee)' },
    { id: 'offer', label: 'A current offer or hook visible without scrolling' },
  ] },
  { key: 'trust', title: 'Trust signals', items: [
    { id: 'reviews', label: 'Google review count + star rating shown' },
    { id: 'licensed', label: 'Licensed / insured / certifications visible' },
    { id: 'photos', label: 'Real photos (team, trucks, work) — not stock' },
    { id: 'guarantee', label: 'A guarantee or warranty stated' },
    { id: 'badges', label: 'Years in business / veteran-owned / local badges' },
  ] },
  { key: 'form', title: 'The form', items: [
    { id: 'short', label: 'Short — name, phone, problem (no 10-field forms)' },
    { id: 'mobileform', label: 'Works on mobile and submits without errors' },
    { id: 'expectation', label: 'Sets a response-time expectation ("we reply in minutes")' },
  ] },
  { key: 'tracking', title: 'Tracking & follow-through', items: [
    { id: 'calltrack', label: 'Call / conversion tracking in place' },
    { id: 'instant', label: 'Form submissions trigger instant follow-up' },
    { id: 'pixels', label: 'Retargeting pixels installed (Google / Facebook)' },
  ] },
];

export interface Grade { grade: string; label: string; color: string; verdict: string }
export function scoreToGrade(pct: number): Grade {
  if (pct >= 0.8) return { grade: 'A', label: 'Converting well', color: '#1F7A52', verdict: "Your page is pulling its weight — the leak is probably elsewhere (traffic or follow-up speed)." };
  if (pct >= 0.6) return { grade: 'B', label: 'Leaving money on the table', color: '#0E7C86', verdict: 'Decent, but a few targeted fixes would noticeably lift the calls you get from the same traffic.' };
  if (pct >= 0.4) return { grade: 'C', label: 'Leaking badly', color: '#9C3B2C', verdict: 'A meaningful share of your visitors bounce before calling. A focused rebuild pays for itself fast.' };
  return { grade: 'D/F', label: 'Burning your ad spend', color: '#9C3B2C', verdict: "This page is actively wasting the clicks you pay for. It's the highest-priority fix you have." };
}

/* ---- Pricing (customer-facing only; internal strategy stays off the site) ---- */
export const PRICING_FEATURES = [
  'Missed-call text-back',
  'Automated review requests',
  'Appointment reminders',
  'Speed-to-lead automation',
  'Monthly reactivation campaign',
  'Reporting dashboard',
  'Membership / maintenance renewals',
  'Priority support + quarterly strategy',
];

export interface PricingTier {
  key: string;
  name: string;
  price: number;        // monthly (ignored when custom)
  priceLabel?: string;  // shown instead of the price when custom (e.g. "By request")
  custom?: boolean;     // by-request / enterprise tier
  blurb: string;
  featured?: boolean;
  badge?: string;
  has: boolean[];       // aligns to PRICING_FEATURES
  sms: string;
}
export const PRICING_TIERS: PricingTier[] = [
  { key: 'starter', name: 'Starter', price: 297, blurb: 'Stop the biggest leak — missed calls and reviews.',
    has: [true, true, true, false, false, false, false, false], sms: '500 texts/calls included' },
  { key: 'growth', name: 'Growth', price: 997, blurb: 'The full speed-to-lead engine. Where most shops land.', featured: true, badge: 'Most popular',
    has: [true, true, true, true, true, true, false, false], sms: '1,500 texts/calls included' },
  { key: 'mission', name: 'Mission-Integrated', price: 1497, custom: true, priceLabel: 'By request', badge: 'Custom / enterprise',
    blurb: 'Multi-location, memberships, and deep integrations — done-for-you everything, conversion optimization included.',
    has: [true, true, true, true, true, true, true, true], sms: 'Usage & volume sized to you' },
];

/* Add-ons that attach to any tier (raise ARPU without a new sale). */
export interface AddOn { name: string; price: string; note: string }
export const ADDONS: AddOn[] = [
  { name: 'High-converting landing page', price: '$1,997', note: 'Mobile-first, sub-3s load, sticky tap-to-call, trust stack, wired to speed-to-lead. Optimization +$297/mo (included with Mission-Integrated).' },
  { name: 'Website Conversion Audit', price: '$249', note: 'Deep teardown + prioritized fix roadmap. Credited toward a landing-page build.' },
  { name: 'AI receptionist (24/7)', price: 'Custom', note: 'Answers and books every call around the clock, even after hours.' },
  { name: 'Paid-ads management', price: 'Custom', note: 'Google LSA / Google / Facebook — managed for a flat fee + % of spend.' },
];
/* Public scarcity hook. The *alternative* founding offer (performance pilot)
   stays internal — only the simplest, cleanest offer goes on the site. */
export const FOUNDING = {
  spots: 3,
  lead: 'Founding-client offer',
  offer: 'First 3 shops get the $989 setup waived + first month free.',
  cta: 'Claim your spot',
};

export const PRICING_META = {
  auditPrice: 'Free',
  setupPrice: 989,
  annualNote: 'Pay annually, get 2 months free (~17% off).',
  usageNote: 'Usage beyond your included allowance is billed at cost + 20%.',
};
