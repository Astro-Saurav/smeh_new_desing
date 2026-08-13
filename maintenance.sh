#!/bin/bash
PROJECT_DIR="/root/smeh_new_desing"
MAINTENANCE_FILE="/var/www/manavrachnatimes.com/html/maintenance.html"

echo "Putting site into maintenance mode..."

# Create maintenance lock file to stop auto_deployment
touch "$PROJECT_DIR/.maintenance_lock"

# Create maintenance HTML
mkdir -p /var/www/manavrachnatimes.com/html
cat << 'EOF' > "$MAINTENANCE_FILE"
<!DOCTYPE html>
<html>
<head>
    <title>Site Under Maintenance</title>
    <style>
        body { font-family: sans-serif; text-align: center; padding: 50px; color: #333; }
        h1 { font-size: 50px; }
        p { font-size: 20px; color: #666; }
    </style>
</head>
<body>
    <h1>We'll be back soon!</h1>
    <p>Sorry for the inconvenience but we're performing some maintenance at the moment. We'll be back online shortly!</p>
</body>
</html>
EOF

echo "Stopping PM2 services..."
pm2 stop mrt-backend mrt-frontend 2>/dev/null || true

echo "Site is now in maintenance mode."
echo "Auto-deployment is SUSPENDED."
echo "To bring the site back online, run: ./auto_deploy.sh --force"
