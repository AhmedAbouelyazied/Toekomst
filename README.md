# VZW De Toekomst — website

Multilingual website (Nederlands · العربية · English) for **VZW De Toekomst**, an Islamic
centre and mosque in Ghent (Gent, 9000, België).

Built with **Next.js 16 (App Router)** · TypeScript · Tailwind CSS v4 · Prisma (SQLite) · Resend.

## Features

- **Pages:** Home · Activiteiten · Regels · Gebedstijden · School · Reserveren · Links · Contact
- **Trilingual** with `nl` (default), `ar` (RTL) and `en`, plus a language switcher.
- **Prayer times** live from Mawaqit (`de-toekomst-ghant-9000-belgium`), cached server-side.
- **Hall booking** form (bruiloft / عزاء / عقيقة / overig) with validation, rate limiting,
  conflict detection, database storage and email notifications.
- **Admin panel** (`/[locale]/admin`) to log in, review, confirm/decline or delete requests and
  export a CSV.
- **Links page** with trusted Qur'an and fatwa sources.

## Getting started

```bash
cp .env.example .env      # then edit the values
npm install               # also runs prisma generate
npm run db:push           # create the SQLite database
npm run db:seed           # create the admin user from ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev               # http://localhost:3000
```

### Environment variables (`.env`)

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLite path, e.g. `file:./dev.db` |
| `NEXT_PUBLIC_BASE_PATH` | Subpath when hosted under a folder (e.g. `/Toekomst_vzw`). **Required at build time.** |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, used for metadata/OG images |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin login (used by `db:seed`) |
| `AUTH_SECRET` | Long random string used to sign the admin session |
| `RESEND_API_KEY` | Resend API key for emails (leave empty to disable sending) |
| `BOOKING_TO_EMAIL` | Where new booking requests are sent |
| `BOOKING_FROM_EMAIL` | Verified "from" address for outgoing email |

## Configuration placeholders

Edit `src/lib/config.ts` to set the real organisation details (address, phone, email, IBAN),
the Mawaqit slug, halls, booking types and the Qur'an/fatwa link lists.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Generate Prisma client and build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Sync the Prisma schema to the database |
| `npm run db:seed` | Create the admin user |
| `npm run db:reset` | Reset the database and re-seed |

## Deployment (Ghiras.be · Node.js · subfolder `/Toekomst_vzw`)

Node.js ≥ 20.9 is required (see `.nvmrc`).

1. Clone the repository on the server and install dependencies:
   ```bash
   git clone https://github.com/AhmedAbouelyazied/Toekomst.git
   cd Toekomst
   npm ci
   ```
2. Create `.env` on the server (same keys as `.env.example`) **including**:
   ```
   NEXT_PUBLIC_BASE_PATH=/Toekomst_vzw
   NEXT_PUBLIC_SITE_URL=https://ghiras.be/Toekomst_vzw
   ```
3. Build and prepare the database:
   ```bash
   npm run db:push
   npm run db:seed
   npm run build
   ```
4. Run it under pm2:
   ```bash
   npm i -g pm2
   pm2 start ecosystem.config.cjs
   pm2 save
   pm2 startup
   ```
5. Point the host's `/Toekomst_vzw` path as a reverse proxy to `http://127.0.0.1:3000`.

> `NEXT_PUBLIC_BASE_PATH` is baked in at build time — set it before `npm run build`.

### Updating

```bash
git pull
npm ci
npm run build
pm2 restart toekomst
```

## Project structure

```
src/
  app/
    [locale]/            # all localized pages (root layout lives here)
    api/                 # route handlers (prayer-times, bookings, admin)
  components/            # Header, Footer, BookingForm, PrayerTimes, admin/*
  i18n/                  # locales + dictionaries
  messages/              # nl.json · ar.json · en.json
  lib/                   # config, mawaqit parser, prisma, auth, email, ...
  proxy.ts               # locale redirect (Next.js 16 "proxy" convention)
prisma/schema.prisma     # Booking + AdminUser
```
