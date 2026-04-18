# ?? Complete Azure Deployment Guide (NoSQL Migration)

Welcome! This guide is designed for beginners. It explains exactly how to take your newly refactored **SMEH / Manav Rachna Time** project and host it on Microsoft Azure using a NoSQL architecture.

---

## ??? Architecture Overview
To keep costs low and performance high, we use:
1.  **Azure Cosmos DB (for MongoDB)**: Our NoSQL database (replaces SQL).
2.  **Azure App Service (Backend)**: Runs your Node.js code.
3.  **Azure Static Web Apps (Frontend)**: Hosts your Next.js application.
4.  **Azure Blob Storage**: Stores uploaded images/media.

---

## ?? Phase 1: Create your Database (Azure Cosmos DB)
Azure Cosmos DB is a globally distributed database. We use the **MongoDB API** version.

1.  **Search**: In the [Azure Portal](https://portal.azure.com), search for "Azure Cosmos DB" at the top.
2.  **Create**: Click **+ Create** and choose **Azure Cosmos DB for MongoDB**.
3.  **Basics**:
    - **Subscription**: Select yours.
    - **Resource Group**: Click "Create new" and name it `smeh-group`.
    - **Account Name**: Enter something unique (e.g., `smeh-db-01`).
    - **Capacity Mode**: select **Serverless**. 
      > [!TIP]
      > **Serverless** is perfect for new projects because you only pay for what you use. There is no monthly fee if no one visits.
4.  **Review + Create**: Click through to the end and wait for it to deploy (takes ~5 mins).
5.  **Get Connection String**:
    - Once deployed, go to your Cosmos DB resource.
    - Look for **Settings > Connection String** in the left sidebar.
    - Copy the **PRIMARY CONNECTION STRING**. It looks like `mongodb://...`.
    - **Keep this safe!** This is your `MONGODB_URI`.

---

## ?? Phase 2: Setup Media Storage (Azure Blob Storage)
Your app uses Azure Blob Storage to save images for news items.

1.  **Search**: Search for "Storage accounts" in the portal.
2.  **Create**: Click **+ Create**.
3.  **Basics**: Name it uniquely (e.g., `smehstorage01`). Set Performance to **Standard**.
4.  **Networking**: Ensure "Enable public access" is checked so images can be viewed.
5.  **Create Container**:
    - Go to your new Storage Account.
    - Click **Data storage > Containers** on the left.
    - Click **+ Container**. Name it `news-media`.
    - Set the **Anonymous access level** to "Blob" (so anyone can view the image URLs).
6.  **Get Connection String**:
    - Go to **Security + networking > Access keys**.
    - Click **Show keys** and copy the **Connection string** for `key1`.

---

## ?? Phase 3: Launch the Backend (Azure App Service)
This runs your Express API.

1.  **Search**: Search for "App Services".
2.  **Create**: Click **+ Create > Web App**.
3.  **Basics**:
    - **Name**: `smeh-api` (or similar).
    - **Publish**: Code.
    - **Runtime stack**: `Node 20 LTS`.
    - **Operating System**: `Linux`.
    - **Plan**: Choose **F1 Free** or **B1 Basic**.
4.  **Deployment**: 
    - You can connect your **GitHub repository** directly here. Azure will automatically redeploy every time you push code!
5.  **Configure Environment Variables**:
    - Go to your App Service > **Settings > Environment variables**.
    - Click **+ Add** for each of these:
        - `PORT`: `8080`
        - `NODE_ENV`: `production`
        - `MONGODB_URI`: (Paste from Phase 1)
        - `MONGODB_DB_NAME`: `manav_rachna_time`
        - `AZURE_STORAGE_CONNECTION_STRING`: (Paste from Phase 2)
        - `AZURE_STORAGE_CONTAINER_NAME`: `news-media`
        - `JWT_SECRET`: (Random long string)
        - `REFRESH_JWT_SECRET`: (Another random string)
        - `CLIENT_ORIGIN`: (Leave blank for now, come back after Phase 4)
    - **Click Apply / Save**.

---

## ?? Phase 4: Launch the Frontend (Azure Static Web Apps)
This is for your Next.js application.

1.  **Search**: Search for "Static Web Apps".
2.  **Create**: Click **+ Create**.
3.  **Basics**:
    - **Name**: `smeh-web`.
    - **Repository details**: Sign in with GitHub and select your Repo/Branch.
    - **Build Presets**: Select **Next.js**.
    - **App location**: `/frontend` (ensure this matches your folder structure).
    - **Output location**: `.next` (default).
4.  **Env Variables**:
    - Once deployed, go to the Static Web App > **Settings > Configuration**.
    - Add `NEXT_PUBLIC_API_URL`: `https://smeh-api.azurewebsites.net/api` (Use your actual Backend URL from Phase 3).
5.  **Save Backend URL**: Now go BACK to your **Backend App Service** (Phase 3) and update `CLIENT_ORIGIN` with your new Frontend URL (e.g., `https://wonderful-ocean-...azurestaticapps.net`).

---

## ?? Troubleshooting for Beginners

> [!WARNING]
> **CORS Errors**: If the website loads but the buttons don't work, it's likely a CORS issue. Ensure `CLIENT_ORIGIN` in the Backend settings perfectly matches your Frontend URL (including `https://` and no trailing slash).

> [!IMPORTANT]
> **Database Initialization**: On the first run, the app will automatically create the collections in MongoDB. You don't need to import SQL schema files anymore!

### How to see logs if something fails?
Go to your **App Service** > **Monitoring > Log stream**. It will show you the real-time errors if the server crashes.

---

**Congratulations!** You have successfully deployed a modern NoSQL application to Azure.
