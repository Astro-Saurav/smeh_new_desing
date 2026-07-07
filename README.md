# SMEH News Platform

A full-stack, highly dynamic, and modern news platform designed with Next.js 15, React 19, and Express.js. This platform was built from the ground up to provide a seamless, premium news reading experience while equipping administrators with a powerful, secure, and robust content management system (CMS).

## 🌟 Why This Project is Unique
Unlike standard out-of-the-box CMS solutions, the SMEH News Platform is specifically tailored for high performance and aesthetic excellence. 
- **Bespoke UI/UX:** Features a glassmorphism design, smooth micro-animations, and dynamic grids that bring the news to life, engaging users far better than static pages.
- **Server-Side Rendered (SSR):** Powered by Next.js App Router, the platform ensures perfect SEO and lightning-fast initial load times, critical for a news application.
- **Unified Media Handling:** Seamlessly supports mixed media content (images, PDFs, documents, YouTube embeds) in a single unified article creation flow.

## 🚀 Production Value & Impact
This platform brings enterprise-grade standards to a manageable, lightweight footprint:
- **Zero-Downtime Deployments:** Includes a custom `auto_deploy.sh` script tailored for Linux VPS environments that automatically syncs with GitHub, rebuilds, and restarts the servers via PM2 with no manual intervention.
- **Scalable Architecture:** Starts with a lightweight SQLite database for zero-configuration deployments, but the Prisma ORM allows swapping to PostgreSQL instantly when traffic scales.
- **Self-Healing:** Managed by PM2, ensuring the frontend and backend servers automatically restart if they ever crash or if the server reboots.

## 🛡️ Security Measures
Security was treated as a first-class citizen during development to ensure data integrity and protect against common web vulnerabilities. The following measures have been strictly implemented:

1. **Robust Authentication (JWT & RBAC):**
   - Utilizes dual-token architecture (short-lived Access Tokens + long-lived HttpOnly Refresh Tokens).
   - Enforces Role-Based Access Control (RBAC) separating `admin` and `editor` privileges to limit destructive actions (like hard-deleting articles).
2. **Infrastructure Level Security:**
   - Designed to run behind a strict UFW firewall, exposing only ports 80, 443, and SSH, hiding the backend ports completely from the public internet.
   - Recommended deployment alongside Fail2Ban to permanently block SSH brute-force attacks.
3. **Data Protection:**
   - Passwords are heavily hashed and salted before entering the database.
   - Sensitive environment variables (`.env`) and the local production database (`.db`) are explicitly blocked from Git tracking to prevent accidental credential leakage on GitHub.
4. **Input Sanitization & Upload Security:**
   - All incoming API requests are sanitized using `sanitize-html` to prevent Cross-Site Scripting (XSS) injections.
   - The Multer upload service strictly enforces MIME-type checking and file extension validation. It explicitly blocks executable files (`.exe`, `.php`, `.sh`) from being uploaded to the server, protecting against Remote Code Execution (RCE).
5. **Hardened Headers:**
   - Incorporates `Helmet.js` to enforce strict Content Security Policies (CSP) and mitigate clickjacking and MIME-type sniffing.

---

## Architecture 🏗️

The project is divided into two main components:

### Frontend (`/frontend`)
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS & Framer Motion for animations
- **State Management:** React Hooks
- **Features:** Server-side rendering (SSR), dynamic routing, completely responsive mobile-first design, optimized image loading, and an integrated Admin Dashboard.

### Backend (`/backend`)
- **Framework:** Node.js & Express.js
- **Database ORM:** Prisma
- **Database:** SQLite (Configured and ready to easily migrate to PostgreSQL)

## Quick Start 🚀

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npx prisma db push
npx prisma generate
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## License
Confidential - All rights reserved.