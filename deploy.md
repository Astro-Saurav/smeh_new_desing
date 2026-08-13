# Deployment & Maintenance Guide

This document explains the architecture of the deployment and maintenance system for the Manav Rachna Times project. The system is designed to be fully automated, secure, and resilient.

## 1. Automated Deployment Pipeline

The project uses GitHub Actions to automate deployments to the Virtual Private Server (VPS).

### How it Works:
1. **GitHub Action Workflow (`.github/workflows/deploy.yml`)**:
   - Triggered automatically whenever code is pushed to the `main` branch.
   - The runner connects securely to the VPS via SSH using keys configured in GitHub Secrets.
   - Once connected, it executes the `auto_deploy.sh` script located on the VPS.

2. **The Deployment Script (`auto_deploy.sh`)**:
   - The script pulls the latest code from the `main` branch of the GitHub repository.
   - It installs frontend and backend dependencies using `npm install`.
   - It builds the Next.js frontend application (`npm run build`).
   - It runs any pending Prisma database migrations or seeders.
   - Finally, it restarts the PM2 process manager to serve the latest changes with zero downtime.

## 2. Maintenance Mode System

To ensure users do not see broken pages during significant updates, database migrations, or manual interventions, we have a robust Maintenance Mode.

### Activating Maintenance Mode
To put the site into maintenance mode, connect to the VPS and run:
```bash
./maintenance.sh
```

**What happens behind the scenes?**
- A lock file (`.maintenance_lock`) is created in the project root.
- A friendly HTML page (`maintenance.html`) is copied to the public Nginx web directory.
- The PM2 services for both the backend (`mrt-backend`) and frontend (`mrt-frontend`) are safely stopped.
- Nginx detects the `maintenance.html` file and automatically intercepts all incoming traffic, returning a **503 Service Unavailable** status code along with the maintenance page, ensuring search engine bots don't penalize the site.

### Safety Checks During Maintenance
If a developer merges code into the `main` branch while the site is in maintenance mode, the GitHub Action will still fire. However, the `auto_deploy.sh` script contains a safety check:
- It looks for the `.maintenance_lock` file.
- If the lock file exists, the script immediately aborts the deployment process, logs a warning, and prevents any changes from occurring while maintenance is active.

### Deactivating Maintenance Mode & Recovering
To bring the site back online, connect to the VPS and run:
```bash
./auto_deploy.sh --force
```

**What happens behind the scenes?**
- The script detects the `--force` flag and removes the `.maintenance_lock` file.
- It removes the `maintenance.html` page from the Nginx public directory.
- It pulls any pending updates from the GitHub repository.
- It runs the standard build and dependency installation process.
- Finally, it brings the PM2 services (`mrt-backend` and `mrt-frontend`) back online, and Nginx automatically starts routing traffic to the Node.js applications again.

## Security Considerations

- **No Hardcoded Secrets**: None of the deployment or maintenance scripts in this repository contain sensitive data such as API keys, GitHub tokens, server IP addresses, or SSH passwords.
- **Environment Variables**: Sensitive configuration should be placed in a `.env` file on the server, which is explicitly ignored by version control.
- **SSH Keys**: The GitHub Actions runner authenticates with the VPS using an encrypted SSH key stored exclusively in GitHub Secrets.
