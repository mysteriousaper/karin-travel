---
name: karin-site-project
description: "Karin Travel website build — stack, verified client facts, open placeholders (as of 2026-10-21)"
metadata:
  node_type: memory
  type: project
  originSessionId: 57d7097c-cef6-4638-928d-742a18e55f22
  modified: 2026-10-21T20:18:54.549Z
---

Full-stack site for Karin Travel (Yerevan agency) built 2026-10-21 in this folder from the "Dusk" design handoff (copied to design-handoff/). Next.js 15 + next-intl (hy default, ru, en) + Prisma/SQLite locally, admin at /admin.

Verified public facts (Spyur.am listing updated 24.03.2026 + Instagram @karin_travel, ~5.1k followers): Marshal Baghramyan Ave 79, Arabkir, Yerevan 0033; +374 98 555085, +374 95 099993; IG highlights include ITB Berlin 25, Maldives, Hurghada, Dubai, Prague, Germany, Egypt. No website, email or opening hours found publicly.

**Why:** the brief forbids invented prices, reviews, hours; these stay as [placeholders] until the client confirms.
**How to apply:** prices null in DB, testimonials empty, hours empty, WhatsApp assumed = 098 555 085, Telegram link empty. See TRANSLATIONS_TODO.md. HANDOFF.md in the project root is the full handoff (written 2026-10-22); deps updated 2026-10-22 to next 15.5.28 / sharp 0.35.5 / nodemailer 10.2.0. Lighthouse on this PC is pessimistic (CPU benchmark ~700); use `--throttling.cpuSlowdownMultiplier=2` or PageSpeed Insights after deploy. Related: [[user-works-autonomously]]
