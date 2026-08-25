# 📰 Manavrachna Times — News Platform

> The official digital news platform of **Manav Rachna University** — built with Next.js 15, React 19, and Express.js.

[![Live](https://img.shields.io/badge/Live-manavrachnatimes.com-blue?style=flat-square)](https://manavrachnatimes.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://prisma.io)

---

## 🌟 What is Manavrachna Times?

Manavrachna Times (MRT) is a full-stack digital news publication built for the Manav Rachna University community. It features campus news, student voices, events, podcasts, video broadcasts, and official university announcements.

---

## 📂 Site Structure & Navigation

| Section | Description |
|---|---|
| **Beyond Campus** | Sub-sections: Current Affairs · Entertainment & Lifestyle Feature · Sports |
| **Campus Buzz** | Latest campus news and happenings |
| **Social Buzz** | Social media highlights and community stories |
| **MR TV** | Video content and broadcasts |
| **MR Podcast** | Audio shows and podcast episodes |
| **Students Voices** | Opinion pieces and student-authored content |
| **Photo Gallery** | Campus photography and visual stories |
| **Announcements** | Official university announcements |
| **About Us** | Editorial team & about the publication |
| **Contact** | Inquiries and story submissions |

---

## 🏗️ Architecture

```
smeh_new_desing/
├── frontend/          # Next.js 15 App — public news portal + admin panel
├── backend/           # Express.js API — authentication, articles, audit logging, media
├── nginx/             # Nginx reverse proxy configurations
├── vps_config.py      # Centralized environment loader (reads .env dynamically)
├── ecosystem.config.js# PM2 process manager configuration
└── README.md
```

### Frontend (`/frontend`)
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Framer Motion
- **Admin Panel:** Integrated at `/admin` (Article creation, user management, editorial controls)
- **Rendering:** SSR + Static generation for maximum SEO performance

### Backend (`/backend`)
- **Framework:** Node.js + Express.js
- **ORM:** Prisma
- **Database:** SQLite (production database `dev.db`; expandable to PostgreSQL via Prisma)
- **Authentication:** Dual-token JWT (Access Token + HttpOnly Refresh Cookie) + RBAC (`admin` / `editor`)
- **Rate Limiting & Lockout:** Built-in failed login tracking & IP-based lockout protection

---

## 🛡️ Security & Zero Hardcoded Credentials

| Security Feature | Implementation Detail |
|---|---|
| **Environment Isolation** | All credentials (JWT secrets, VPS host/passwords, DB keys) stored strictly in `.env` |
| **Dynamic Password Seeding** | Seed scripts use `process.env.ADMIN_PASSWORD` or auto-generate 16-byte random hex passwords |
| **Password Storage** | Passwords stored strictly as salted **Bcrypt hashes** (12 rounds) |
| **Authentication** | Dual JWTs (Short-lived Access Token + HttpOnly Refresh Cookie) |
| **Input Sanitization** | `sanitize-html` for XSS prevention on all API endpoints |
| **Upload Security** | Strict Multer MIME-type and extension validation |
| **Network Firewall** | UFW with standard HTTP/HTTPS/SSH isolation |

---

## 💾 Automated VPS Backups & Disaster Recovery

The production VPS runs an automated **daily backup system** with a **rolling 3-day retention policy**:

- **Backup Schedule:** Daily at **02:00 AM** via Cron (`/root/vps_backups/auto_daily_backup.sh`)
- **Backed Up Components:**
  - Database (`dev.db` snapshot via SQLite `.backup`)
  - Environment configurations (`.env` files)
  - Full codebase & media assets (`smeh_app_code_*.tar.gz`)
  - Git commit metadata (`GIT_COMMIT.txt`)
- **Automated Retention:** Scans `/root/vps_backups` and automatically purges backup archives older than 3 days.
- **One-Click Restoration:**
  ```bash
  /root/vps_backups/latest/restore.sh
  ```

---

## 🚀 Local Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env        # Configure JWT secrets & DB settings
npx prisma db push
npx prisma generate
npx prisma db seed          # Seeds categories & default data
npm run dev                 # Starts Express API on port 8081
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local  # Set INTERNAL_API_URL=http://127.0.0.1:8081
npm run dev                 # Starts Next.js on port 3000
```

---

## ☁️ Production Deployment (VPS)

PM2 manages production services on the VPS:

| PM2 Process | Port | Description |
|---|---|---|
| `mrt-backend` | 8081 | Express.js API Service |
| `mrt-frontend` | 3000 | Next.js Application |

To sync and restart services manually on the VPS:
```bash
git pull origin main
cd backend && npm install && npx prisma generate
cd ../frontend && npm install && npm run build
pm2 restart all
```

---

## 🔗 Repositories

| Repository | Remote | URL |
|---|---|---|
| Primary Fork | `origin` | https://github.com/Astro-Saurav/smeh_new_desing |
| Upstream | `upstream` | https://github.com/Saurav-Astro/smeh_new_desing |

---

## 📄 License

Confidential — All rights reserved © Manav Rachna Times.