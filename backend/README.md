# Manav Rachna Time Backend (Node.js + Express)

Production-ready REST API for the Manav Rachna Time Headless CMS/CRM.

## Features

- JWT authentication with role-based access (`admin`, `editor`)
- Refresh token flow with secure HttpOnly cookie rotation
- Azure SQL Database integration (`mssql` driver)
- Azure Blob image upload endpoint
- News workflow (`draft`, `published`, `scheduled`)
- Analytics endpoint (status counts, category counts, monthly publish trend)
- Cron-based scheduled publishing job
- Validation, error handling, logging, rate limiting

## Folder Structure

```txt
backend/
  src/
    config/
    controllers/
    jobs/
    middleware/
    routes/
    services/
    validators/
    app.js
    server.js
  sql/
    schema.sql
    seed.sql
```

## Setup Local

1. Install dependencies:

```bash
cd backend
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Update `.env` with Azure SQL + Azure Blob credentials.
4. Run `sql/schema.sql` and `sql/seed.sql` on your Azure SQL database.
5. Start backend:

```bash
npm run dev
```

Backend runs at `http://localhost:8080` and base API path is `/api`.

## Core API Endpoints

### Auth

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/register` (admin only)

### News

- `POST /api/news`
- `GET /api/news`
- `GET /api/news/:id`
- `PUT /api/news/:id`
- `DELETE /api/news/:id` (admin only)

### Categories

- `POST /api/categories`
- `GET /api/categories`

### Upload

- `POST /api/upload`

### Analytics

- `GET /api/analytics/overview`

### Users (Admin Only)

- `GET /api/users`
- `DELETE /api/users/:id`

## Sample Requests

### Login

```json
{
  "email": "admin@manavrachna.edu",
  "password": "ChangeMeNow123!"
}
```

### Create News

```json
{
  "title": "MRU wins national innovation award",
  "content": "<p>Rich content here...</p>",
  "categoryId": 1,
  "imageUrl": "https://...blob.core.windows.net/news-media/image.jpg",
  "status": "scheduled",
  "publishedAt": "2026-04-10T10:30:00.000Z"
}
```

### Upload Image

```json
{
  "fileName": "campus-event.jpg",
  "mimeType": "image/jpeg",
  "base64Data": "<raw-base64-without-data-url-prefix>"
}
```

## Azure Deployment (Backend)

1. Create Azure App Service (Node 20 LTS).
2. Add all `.env` variables in App Service Configuration.
3. Ensure Azure SQL firewall allows App Service outbound IP or enable trusted services/private endpoint.
4. Grant access to Azure Blob Storage via connection string in env var.
5. Deploy backend folder using GitHub Actions, ZIP deploy, or Azure CLI:

```bash
az webapp up --name <app-name> --resource-group <rg> --runtime "NODE|20-lts" --location <region>
```

6. Verify health endpoint:

- `GET /api/health`

## Security Notes

- Rotate `JWT_SECRET` regularly.
- Rotate `REFRESH_JWT_SECRET` regularly.
- Restrict CORS (`CLIENT_ORIGIN`) to CRM frontend domain.
- Prefer Managed Identity + Key Vault in production instead of plain secrets.
- In production set `REFRESH_COOKIE_SECURE=true` and `REFRESH_COOKIE_SAME_SITE=none` if frontend/backend are on different domains.

## CI/CD (GitHub Actions)

- Backend workflow: `.github/workflows/backend-azure.yml`
- Required GitHub secrets:
  - `AZURE_CREDENTIALS`
  - `AZURE_WEBAPP_NAME_BACKEND`
