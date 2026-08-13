# 📰 Manavrachna Times — News Platform

> The official digital news platform of **Manav Rachna University** — built with Next.js 15, React 19, and Express.js.

[![Live](https://img.shields.io/badge/Live-manavrachnatimes.com-blue?style=flat-square)](https://manavrachnatimes.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://prisma.io)

---

## 🌟 What is Manavrachna Times?

Manavrachna Times (MRT) is a full-stack, bespoke news platform built specifically for the Manav Rachna University community. It covers campus news, student voices, events, sports, entertainment, and official announcements — all in one beautifully designed, fast-loading digital publication.

---

## 📂 Site Structure & Navigation

The platform is organized around the following sections:

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
| **About Us** | About the MRT team and editorial board |
| **Contact** | Contact and submissions |

---

## 🏗️ Architecture

```
smeh_new_desing/
├── frontend/          # Next.js 15 App — public site + admin panel
└── backend/           # Express.js API — content, auth, media management
```

### Frontend (`/frontend`)
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Framer Motion
- **Admin Panel:** Integrated at `/admin` — Create/edit articles, manage users, editorial board
- **Rendering:** SSR + Static generation for SEO-optimised news pages

### Backend (`/backend`)
- **Framework:** Node.js + Express.js
- **ORM:** Prisma
- **Database:** SQLite (production-ready; can swap to PostgreSQL instantly via Prisma)
- **Media Storage:** Azure Blob Storage for uploaded images and documents
- **Auth:** JWT dual-token (Access Token + HttpOnly Refresh Token) + RBAC (`admin` / `editor`)

---

## 🛡️ Security

| Layer | Implementation |
|---|---|
| Authentication | JWT + HttpOnly Refresh Tokens + RBAC |
| Input Sanitization | `sanitize-html` — XSS prevention on all API inputs |
| Upload Security | Multer with strict MIME-type & extension validation (blocks `.exe`, `.php`, `.sh`) |
| Headers | `Helmet.js` — CSP, clickjacking & MIME-sniffing protection |
| Firewall | UFW — only ports 80, 443, SSH exposed |
| Brute-force | Fail2Ban recommended for SSH; rate-limiting on API |
| Secrets | `.env` and `.db` blocked from Git via `.gitignore` |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env        # Fill in your secrets
npx prisma db push
npx prisma generate
npx prisma db seed          # Seeds categories and default data
npm run dev                 # Starts on port 8080
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local  # Set INTERNAL_API_URL if needed
npm run dev                 # Starts on port 3000
```

### 3. Admin Access
Go to `http://localhost:3000/admin` and log in with the credentials seeded by the backend.

---

## ☁️ Production Deployment (VPS / KVM8)

The platform runs on a Linux VPS managed by **PM2** with automated GitHub-based deployments.

### Services
| PM2 Process | Port | Description |
|---|---|---|
| `mrt-backend` | 8080/8081 | Express.js API |
| `mrt-frontend` | 3000 | Next.js frontend |

### Auto-Deploy
```bash
# On the VPS, the auto_deploy.sh script:
# 1. Pulls latest from GitHub main
# 2. Rebuilds the frontend (npm run build)
# 3. Restarts PM2 processes
bash auto_deploy.sh
```

A GitHub Actions workflow (`.github/workflows/deploy-kvm8.yml`) triggers this automatically on every push to `main`.

---

## 📦 Article Categories (Admin Panel)

The **Create Article** form provides the following categories matching the site navigation:

- Beyond Campus
- Current Affairs *(sub-category)*
- Entertainment & Lifestyle Feature *(sub-category)*
- Sports *(sub-category)*
- Campus Buzz
- Social Buzz
- MR TV
- MR Podcast
- Students Voices
- Photo Gallery
- Announcement

---

## 🔗 Repositories

| Repo | URL |
|---|---|
| Primary (Astro-Saurav) | https://github.com/Astro-Saurav/smeh_new_desing |
| Mirror (Saurav-Astro) | https://github.com/Saurav-Astro/smeh_new_desing |

---

## 📄 License

Confidential — All rights reserved © Manav Rachna Times.