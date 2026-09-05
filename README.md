# SmartQueue Health

A clickable prototype for **OPD queue visibility in Indian government hospitals**.

After registering at a government hospital OPD, a patient holds a token but has no
reliable way to know how the queue is moving. So they stand outside the consultation
room — for hours — because that is the only channel that never fails.

SmartQueue does not promise to shorten the wait. Hospital capacity decides that.
It makes the wait **predictable**, so the time can be spent somewhere other than a
corridor.

> Know your place in the queue. Get alerted when your turn is near.
> Wait anywhere inside the hospital.

---

## The two sides

The prototype exists to demonstrate one relationship:

```
hospital staff update the operational state
                ↓
      SmartQueue recalculates the queue
                ↓
   patients are told what to do, automatically
```

**Patient side** — token, currently-serving token, patients ahead, queue state,
turn alerts, delay and room-change notices, and a clear instruction at every step.

**Hospital side** — monitor all OPDs, open one, call the next patient, pause and
resume, report a delay, change room, hold a token for an absent patient. Staff never
compose a message or renumber a queue; SmartQueue derives both from the queue state.

Both experiences share one store, persisted to `localStorage` and broadcast between
tabs — so pausing a queue in the admin app changes what the patient screen says,
live, in another tab.

---

## Try it

```bash
npm install
npm run dev
```

Any credentials work — there is no authentication backend.

| Route | What it is |
| --- | --- |
| `/` | Landing page |
| `/login` | Role selection — patient or hospital admin |
| `/patient/login`, `/patient/register` | Patient access |
| `/patient/connect-queue` | Connect an OPD token (also supports attendants) |
| `/queue` | Live patient queue — mirrors whatever admin has done |
| `/queue/delay`, `/queue/approaching`, `/queue/next`, `/queue/complete` | Fixed queue states |
| `/admin/login` | Hospital staff access (`admin@cgh.gov.in`, any password) |
| `/admin` | Hospital overview — which OPDs need attention |
| `/admin/queues/medicine` | Live queue management |
| `/admin/alerts` | Every notification SmartQueue generated |
| `/admin/insights` | Daily operational summary |
| `/admin/departments`, `/admin/settings` | Secondary |

**The demo path:** sign in as admin → open Medicine OPD → Call Next Patient →
Report Delay → Pause Queue → open `/queue` in a second tab and watch it say
*"you don't need to return yet"* → Resume → check Alerts → check Insights.

---

## Design

Dark is the source design: warm near-black, ivory text, muted sage, antique gold used
sparingly, Cormorant Garamond for display and Inter for UI. Light is the same system
re-valued — warm ivory ground, forest text, the same sage and gold.

Both themes are driven by one set of semantic tokens in `src/index.css`. There is no
duplicated component anywhere; `data-theme` on `<html>` selects the palette, resolved
before first paint so the app never flashes. Preference is Light / Dark / System,
remembered per device.

All text meets WCAG AA in both themes, measured against composited backgrounds rather
than assumed.

## Stack

React 19 · TypeScript · Tailwind CSS v4 · React Router · Lucide · Vite

```
src/
  admin/     hospital-side store, screens and queue actions
  auth/      mock session, role guards, patient access screens
  theme/     ThemeProvider — light / dark / system
  components/ shared UI and the patient-facing landing page
```

## Scope

Deliberately **not** an HMIS replacement. No medical records, prescriptions, billing,
pharmacy, lab reports, inventory or scheduling — only OPD queue management.

Estimated wait is always shown as an indicative range, never a promised time: queues
change when emergencies arrive or a doctor is called away, and a confident wrong
number costs more trust than an honest one.

---

## Status

Prototype. Mock data throughout, no backend, no real authentication. Built to be
demonstrated as a public-sector product concept.

See [`public/images/README.md`](public/images/README.md) for the hero image slots and
the one asset still outstanding (the doctor mascot).
