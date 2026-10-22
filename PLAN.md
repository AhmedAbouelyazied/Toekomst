# PLAN — VZW De Toekomst website

> **Status:** ✅ implemented, deployed and pushed to `github.com/AhmedAbouelyazied/Toekomst`.
> Live at **https://ghiras.be/Toekomst_vzw** (auto-deploys on push to `main`).
> See `README.md` for setup and `DEPLOYMENT.md` for hosting.

**Folder:** `IDEAS/Toekomst/`
**Repo:** `https://github.com/AhmedAbouelyazied/Toekomst`
**Deploy:** `ghiras.be/Toekomst_vzw` (OVH VPS, Node.js/PM2 port 3302, Next.js `basePath`)

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Prisma + SQLite · Resend
**Logo:** `IDEAS/Toekomst/logo.jpg` → header / footer / favicon / OG image
**Languages:** Dutch (`nl`, default) · Arabic (`ar`, RTL) · English (`en`) · French (`fr`)

## Mosque / prayer times (Mawaqit)
- Page: `https://mawaqit.net/en/de-toekomst-ghant-9000-belgium`
- Slug: `de-toekomst-ghant-9000-belgium` · Mosque ID: `2598`
- Name: "De Toekomst مسجد المستقبل – GENT" (Gent, 9000, Belgium)
- Mawaqit's public API is private; the page embeds a `confData` object (adhan, iqama,
  shuruq, jumua, hijri). Backend fetches and caches it (keyless); iframe widget fallback.

## Build steps
1. **Scaffold** Next.js 16 + TS + Tailwind v4, deps (prisma, resend, zod, jose),
   `.gitignore`, `.env.example`, `.nvmrc`, `next.config` with `basePath`.
2. **i18n & theme** — `messages/{nl,ar,en,fr}.json`, locale routes `/[locale]/...`, NL|AR|EN|FR toggle,
   RTL for Arabic, browser-language detection at the root, teal/green palette from logo, shared Header/Footer.
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

## Deployment (ghiras.be · OVH VPS)
- Auto-deploy on push to `main` via GitHub Actions (`.github/workflows/deploy.yml`).
- Server: `debian@51.161.114.226`, dir `/var/www/toekomst`; PM2 process `toekomst` (port 3302).
- `deploy.sh`: flock → `git pull` (deploy key `github-toekomst`) → `npm ci` → `db:push` → `db:seed`
  → `build` → `pm2 reload`.
- Nginx proxies `/Toekomst_vzw/` → `127.0.0.1:3302` with a language-aware root redirect.
- Details in `DEPLOYMENT.md`.

## Open items / placeholders
- `lib/config.ts`: org **email** and **IBAN** still placeholders (address + phone are set:
  Rerum-Novarumplein 1, 9000 Gent · 0472 86 04 75).
- Server `.env`: generated admin password set; `RESEND_API_KEY` empty (booking emails disabled).
