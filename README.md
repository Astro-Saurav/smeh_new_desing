# SMEH News Platform

A full-stack, dynamic, and modern news platform designed with Next.js 15, React 19, and Express.js.

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
- **Security:** JWT Authentication (Access & Refresh tokens), Role-based Access Control (RBAC), Helmet, and Request Sanitization.
- **Uploads:** Securely handles Multer-based Image and Document uploads with strict MIME-type and extension validation.

## Quick Start 🚀

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Backend Setup
```bash
cd backend
npm install
# Set up your environment variables
cp .env.example .env
# Sync the database schema
npx prisma db push
# Generate the Prisma Client
npx prisma generate
# Start the server (Development)
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Set up your environment variables
cp .env.example .env.local
# Start the Next.js development server
npm run dev
```

## Deployment 🌐

This repository includes a robust `auto_deploy.sh` script specifically designed for seamless integration with a Hostinger VPS (or any Linux-based VPS).

When triggered via a cron job, the script will automatically:
- Fetch the latest changes from the `main` branch.
- Install new backend/frontend dependencies.
- Sync database schema changes.
- Build the optimized Next.js production bundle.
- Restart the active PM2 processes.

## License
Confidential - All rights reserved.