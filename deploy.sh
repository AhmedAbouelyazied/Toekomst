#!/bin/bash
# Deploy VZW De Toekomst (Next.js) — runs on the OVH server at /var/www/toekomst.
# Pulls from GitHub via the repo deploy key (SSH alias `github-toekomst`),
# applies the Prisma schema, seeds the admin user and reloads PM2.
set -euo pipefail

REPO_ALIAS="git@github-toekomst:AhmedAbouelyazied/Toekomst.git"
APP_DIR="/var/www/toekomst"
APP_NAME="toekomst"

LOCKFILE="/var/lock/${APP_NAME}-deploy.lock"
exec 200>"$LOCKFILE"
if ! flock -n 200; then
  echo "[deploy] Another deploy is already running — aborting."
  exit 1
fi

mkdir -p "$APP_DIR"
cd "$APP_DIR"

if [ ! -d .git ]; then
  echo "[deploy] First run: initialising repo from $REPO_ALIAS ..."
  git init -b main
  git remote add origin "$REPO_ALIAS"
  git fetch origin main
  git reset --hard origin/main
else
  echo "[deploy] Pulling latest code from main..."
  git remote set-url origin "$REPO_ALIAS"
  git pull origin main
fi

echo "[deploy] Installing dependencies..."
npm ci

echo "[deploy] Applying schema + seeding admin user (non-destructive)..."
npm run db:push
npm run db:seed

echo "[deploy] Building..."
npm run build

if [ ! -f .next/BUILD_ID ]; then
  echo "[deploy] ERROR: production build missing (.next/BUILD_ID) — aborting before PM2 reload."
  exit 1
fi

echo "[deploy] Reloading PM2..."
pm2 reload "$APP_NAME" || pm2 start ecosystem.config.cjs
pm2 save || true
echo "[deploy] Done."
