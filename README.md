# American Automations — Lead Funnel

Veteran-owned lead-automation funnel for **all service businesses**. A
single-page React app built from the Claude Design handoff (`Lead Funnel.dc.html`),
then extended into a configurable, conversion-focused funnel.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run typecheck
```

## Features

- **Dark "command-panel" hero** with blueprint-grid texture, glowing CTAs, and a
  live revenue-leak ticker.
- **Industry-aware mode** — pick a trade (`I run a:`) and the headline, the live
  benchmark figure, and the calculator's defaults all adapt. Great for running a
  separate ad campaign per vertical.
- **Interactive Leak Calculator** — drag sliders, see your monthly/yearly leak
  compute live, then **gated lead capture** ("Email me the full breakdown") that
  turns the calculator into a real lead-gen form.
- **Interactive 6-leaks diagram** — clickable taps that drip money and reveal the
  fix for each leak.
- **Mission section** — the "government efficiency → Main Street" origin story.
- **Proof** — logo wall + animated before/after revenue bar chart + case study
  with count-up stats.
- **Sticky CTA bar** that slides in past the hero with your live leak number.
- **FAQ accordion**, **exit-intent** offer, **light/dark toggle**, scroll-reveal
  and count-up animations — all respecting `prefers-reduced-motion`.
- Responsive down to 375px.

## The template engine — `src/config.ts`

`config.ts` is the single source of truth. **To rebrand or re-target, edit only
this file** — every section reads from it:

- `brand` — colors, name, tagline.
- `INDUSTRIES` — the picker list + per-industry benchmarks (avg ticket, missed
  calls, dead quotes) that power industry-aware mode and the calculator.
- `TRADES` / `MARQUEE` — hero rotating words + the scrolling industries strip.
- `LEAKS`, `STEPS`, `TESTIMONIALS`, `CASE_STUDY`, `FAQ`, `LOGOS` — all copy.
- `monthlyLeak()` + the rate constants — the shared leak math.

That makes this resellable: clone, swap `config.ts`, ship a customized funnel
per client.

## Wire-up before launch (placeholders)

- **Calculator lead form** → POST to your CRM/webhook (HighLevel, Zapier, etc.).
  The payload is spelled out in `LeakCalculator.tsx` (`submit`).
- **Scheduler** — the booking calendar is a visual mock; drop in Calendly/Cal.com.
- **VSL video** — off by default (`showVideo={false}` in `main.tsx`).
- **Logos / case study / testimonials / the "$millions saved" metric** — all
  marked placeholder; replace in `config.ts`.

## Hero mode

`main.tsx` renders `<LeadFunnel heroMode="hookB" />`: `hookB` (money, live default),
`hookA` (the leak), or `compare` (design-review — both hooks with labels).

## Brand

Navy `#16243F` · Oxidized Red `#9C3B2C` · Ember `#E0795C`. Headings/wordmark in
**Saira Semi Condensed**, body in **IBM Plex Sans**. Full system in the handoff's
`American Automations - Brand.dc.html`.
