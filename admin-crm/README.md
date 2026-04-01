# Manav Rachna Time Admin CRM (React + Vite)

Admin panel for managing Manav Rachna Time news operations.

## Features

- Login with backend JWT + refresh-cookie auth flow
- Dashboard analytics cards and charts
- News create/edit/delete with rich text editor
- News status workflow: draft, published, scheduled
- Search, category/status filters, pagination
- Category management
- Admin-only users management panel
- Azure Blob media upload
- Dark mode support
- Toast notifications, optimistic updates, and skeleton loading states

## Tech Stack

- React + Vite
- React Router
- TanStack Query
- Axios
- React Quill
- Recharts

## Environment

Create `.env` in this folder:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Local Run

```bash
cd admin-crm
npm install
npm run dev
```

App runs on `http://localhost:5173` by default.

## Backend Integration Requirements

- Backend CORS must allow `http://localhost:5173`
- Backend refresh cookie requires credentials support (`withCredentials=true` already configured)
- Use `POST /api/auth/login` then automatic refresh via `POST /api/auth/refresh`

## Build

```bash
npm run build
npm run preview
```

## Deployment

### Vercel

1. Import `admin-crm` folder as project root.
2. Set environment variable `VITE_API_BASE_URL` to your deployed backend API URL.
3. Deploy.

## CI/CD (GitHub Actions)

- Frontend workflow: `.github/workflows/admin-vercel.yml`
- Required GitHub secrets:
	- `VERCEL_TOKEN`
	- `VERCEL_ORG_ID`
	- `VERCEL_PROJECT_ID_ADMIN`

### Azure Static Web Apps

1. Create Static Web App and point app location to `admin-crm`.
2. Build command: `npm run build`
3. Output location: `dist`
4. Set `VITE_API_BASE_URL` in app settings.

## Notes

- Frontend stores access token in localStorage for API authorization header.
- Refresh token is stored as secure HttpOnly cookie by backend.
- For cross-domain production, backend should use `REFRESH_COOKIE_SECURE=true` and compatible `sameSite` mode.
