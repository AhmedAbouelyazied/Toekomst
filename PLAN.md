# PLAN — VZW De Toekomst website

**Folder:** `IDEAS/Toekomst/`
**Repo:** `https://github.com/AhmedAbouelyazied/Toekomst`
**Deploy:** `Ghiras.be/Toekomst_vzw` (Node.js, Next.js `basePath: '/Toekomst_vzw'`)

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Prisma + SQLite · Resend · next-intl
**Logo:** `IDEAS/Toekomst/logo.jpg` → header / footer / favicon / OG image
**Languages:** Dutch (`nl`, default) · Arabic (`ar`, RTL) · English (`en`)

## Mosque / prayer times (Mawaqit)
- Page: `https://mawaqit.net/en/de-toekomst-ghant-9000-belgium`
- Slug: `de-toekomst-ghant-9000-belgium` · Mosque ID: `2598`
- Name: "De Toekomst مسجد المستقبل – GENT" (Gent, 9000, Belgium)
- Mawaqit's public API is private; the page embeds a `confData` object (adhan, iqama,
  shuruq, jumua, hijri). Backend fetches and caches it (keyless); iframe widget fallback.

## Build steps
1. **Scaffold** Next.js 15 + TS + Tailwind v4, deps (next-intl, prisma, resend, zod, jose, bcryptjs),
   `.gitignore`, `.env.example`, `.nvmrc`, `next.config` with `basePath`/`assetPrefix`.
2. **i18n & theme** — `messages/{nl,ar,en}.json`, locale routes `/[locale]/...`, NL|AR|EN toggle,
   RTL for Arabic, teal/green palette from logo, shared Header/Footer.
3. **Pages:** `/` Home · `/activiteiten` · `/regels` · `/gebedstijden` · `/school` ·
   `/reserveren` · `/links` · `/contact`.
4. **Prayer times (Mawaqit)** — `lib/mawaqit.ts` fetches the mosque page, parses `confData`,
   Zod-validated, cached ~1h; iframe fallback.
5. **Booking + backend + DB** — `Booking` & `AdminUser` Prisma models;
   `POST /api/bookings` (type: bruiloft / عزاء / عقيقة / overig, name, email, phone, date,
   time, hall, guests, notes; honeypot + rate limit + conflict check) → DB + Resend emails
   (org + requester confirmation).
6. **Admin** — `/admin` login (env credential, signed cookie), list/filter bookings,
   confirm/decline, CSV export.
7. **Links page** — Quran (quran.com, tanzil.net, quran.ksu.edu.sa, audio, tafseer) +
   Fatwa (islamqa.info, binbaz.org.sa, alifta.gov.sa, islamweb.net, Dutch resources)
   as config-driven cards.
8. **Config placeholders** — org address (Gent 9000), phone, email, IBAN, hours, Facebook;
   env: `DATABASE_URL`, `RESEND_API_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `BOOKING_TO_EMAIL`.
9. **Verify** — `npm run build` + `npm run lint`; test booking → DB → email → admin;
   check Mawaqit parser live; verify Arabic RTL.
10. **Git** — init, commit, push to `AhmedAbouelyazied/Toekomst` (`.gitignore` protects
    `.env` / `*.db`).

## Deployment (Ghiras.be, Node.js)
- `git pull` on the server + `pm2` process manager (`ecosystem.config.cjs`).
- Node ≥ 20 (target 20/22); `.nvmrc` included.

## Open items / placeholders
- Org contact details & IBAN (Facebook page was not machine-readable) → `lib/config.ts` placeholders.
- Real admin password + Resend API key to be set in `.env` on the server.
