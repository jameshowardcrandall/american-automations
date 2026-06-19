# American Automations — Lead Funnel

Veteran-owned plumbing & HVAC lead-automation funnel. A single-page React
landing built from the Claude Design handoff (`Lead Funnel.dc.html`).

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run typecheck
```

## Hero mode

`src/main.tsx` renders `<LeadFunnel heroMode="hookB" />`. Options:

- `hookB` — **live default.** Single hook, leads with the money (`$3,000+/mo`).
- `hookA` — single hook, leads with the leak.
- `compare` — design-review mode: shows both hooks side by side with
  "Hook A / Hook B" labels. Useful for A/B copy decisions, **not** for a live
  visitor (the labels are internal). The design tool defaulted to this; the
  shipped default is a single clean hook.

## What's still placeholder (wire up before launch)

- **Scheduler** — the calendar/time picker is a faithful visual mock with
  local React state. Swap the `#book` panel for a Calendly / Cal.com embed.
- **VSL video** — the hero video is a click-to-play poster. Drop in your embed
  where the "Your VSL plays here" placeholder renders.
- **Case study + testimonials + rating** — marked "(placeholder)" in copy.
- **Nav anchors** — `#how`, `#proof`, `#book` scroll to real sections already.

## Brand

Navy `#16243F` · Oxidized Red `#9C3B2C` · Graphite `#2E3641` · Steel `#6B7480`.
Headings/wordmark in **Saira Semi Condensed**, body/UI in **IBM Plex Sans**
(loaded via Google Fonts in `index.html`). Full brand system lives in the
handoff's `American Automations - Brand.dc.html`.
