# Deployment — VZW De Toekomst

Hosted at **https://ghiras.be/Toekomst_vzw** on the existing OVH VPS, following the same
per-app pattern as KitabMind / Dutch500 / Arabic500 (see `ServerSetup/DEPLOYMENT_OVH_GHIRAS.md`).

## Values

| Item | Value |
| --- | --- |
| Server host | `51.161.114.226` (`vps-157f7ad5.vps.ovh.ca`) |
| SSH user | `debian` |
| App directory | `/var/www/toekomst` |
| URL path (basePath) | `/Toekomst_vzw` |
| PM2 process | `toekomst` |
| Internal port | `3302` (3000 = kitabmind, 3300 = dutch500, 3301 = arabic500) |
| Repo | `github.com/AhmedAbouelyazied/Toekomst` |
| Deploy key alias | `github-toekomst` → `~/.ssh/github_toekomst_ed25519` |

## GitHub Actions secrets (repo → Settings → Secrets → Actions)

Reuse the same three values already used by the other app repos:

| Secret | Value |
| --- | --- |
| `SERVER_HOST` | `51.161.114.226` |
| `SERVER_USER` | `debian` |
| `SERVER_SSH_KEY` | the Mac login private key (`~/.ssh/id_ed25519`) — the **same** value as KitabMind/Dutch500 |

> `SERVER_SSH_KEY` is your personal Mac key that logs in as `debian`. It is **not** a deploy key.

## One-time server setup

Run on the server (`ssh debian@51.161.114.226`):

```bash
# 1. Generate the repo-scoped deploy key (server → GitHub)
ssh-keygen -t ed25519 -f ~/.ssh/github_toekomst_ed25519 -N ""
cat ~/.ssh/github_toekomst_ed25519.pub
```

2. Paste the printed **public** key into **GitHub → Toekomst → Settings → Deploy keys → Add deploy key** (leave "Allow write access" **off** / read-only).

```bash
# 3. Add the SSH host alias (so only this key is offered to GitHub for this repo)
cat >> ~/.ssh/config <<'EOF'

Host github-toekomst
  HostName github.com
  User git
  IdentityFile /home/debian/.ssh/github_toekomst_ed25519
  IdentitiesOnly yes
  StrictHostKeyChecking accept-new
EOF
chmod 600 ~/.ssh/config

# 4. Create the app dir + production .env
sudo mkdir -p /var/www/toekomst
sudo chown debian:debian /var/www/toekomst
```

Create `/var/www/toekomst/.env` (mode `600`) with the production values:

```env
DATABASE_URL="file:./prod.db"
NEXT_PUBLIC_BASE_PATH=/Toekomst_vzw
NEXT_PUBLIC_SITE_URL=https://ghiras.be/Toekomst_vzw
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=<strong-password>
AUTH_SECRET=<long-random-string>
RESEND_API_KEY=<resend-key>
BOOKING_TO_EMAIL=info@toekomst.be
BOOKING_FROM_EMAIL=VZW De Toekomst <noreply@ghiras.be>
```

> `NEXT_PUBLIC_BASE_PATH` is baked in at build time — it **must** be present before `npm run build`.

## Nginx (reverse proxy)

Add to `/etc/nginx/sites-available/ghiras.be`, then `sudo nginx -t && sudo systemctl reload nginx`:

```nginx
# Language-aware root redirect. Next's proxy matcher needs a trailing slash after
# the basePath, so the bare root is handled here (map is valid in the http context).
map $http_accept_language $toekomst_locale {
    default nl;
    ~*^ar ar;
    ~*^fr fr;
    ~*^en en;
    ~*^nl nl;
}

# (inside the server block)
location = /Toekomst_vzw  { return 301 /Toekomst_vzw/$toekomst_locale; }
location = /Toekomst_vzw/ { return 301 /Toekomst_vzw/$toekomst_locale; }

location /Toekomst_vzw/ {
    proxy_pass http://127.0.0.1:3302;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

## Deploy

Automatic: push to `main` → `.github/workflows/deploy.yml` runs `/var/www/toekomst/deploy.sh`.

Manual:
```bash
ssh debian@51.161.114.226 'bash /var/www/toekomst/deploy.sh'
```

`deploy.sh` is flock-protected, pulls via the `github-toekomst` key, runs
`npm ci` → `db:push` → `db:seed` → `build` (with a `.next/BUILD_ID` guard) → `pm2 reload toekomst`.

## Files on the server

```
/var/www/toekomst/              # git checkout (main)
  ├── .env                      # 600 — production secrets (create once, not in git)
  ├── .next/                    # production build
  ├── deploy.sh                 # 755
  ├── ecosystem.config.cjs      # PM2 process `toekomst` (port 3302)
  └── prisma/prod.db            # SQLite database (created by db:push, not in git)
/home/debian/.ssh/github_toekomst_ed25519   # deploy key (private)
/var/lock/toekomst-deploy.lock              # flock file
```
