#!/bin/bash
PROJECT_DIR="/root/smeh_new_desing"
BRANCH="main"

cd $PROJECT_DIR || exit

echo "Fetching latest from origin/$BRANCH..."
git fetch origin $BRANCH

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/$BRANCH)

if [ "$LOCAL" = "$REMOTE" ]; then
    echo "Up-to-date. No deployment needed."
    exit 0
fi

echo "Changes detected! Starting deployment..."

# Stash any local changes (e.g. log files) so pull doesn't abort
git stash --include-untracked
git pull origin $BRANCH
git stash drop 2>/dev/null

echo "Updating Backend..."
cd $PROJECT_DIR/backend
npm install
npx prisma db push
npx prisma generate
mkdir -p uploads/documents
pm2 restart mrt-backend

echo "Updating Frontend..."
cd $PROJECT_DIR/frontend
npm install
rm -rf .next
npm run build
pm2 restart mrt-frontend

echo "Deployment completed successfully at $(date)!"
