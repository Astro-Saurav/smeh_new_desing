#!/bin/sh
# MRT Deployment Verification Script

echo "=== MRT Production Deployment Verification ==="
echo ""

echo "1. Checking all containers are running..."
docker compose ps
echo ""

echo "2. Testing Express API health endpoints..."
echo "   - /api/live"
docker exec smeh_new_desing-express-api-1 wget -q -O- http://localhost:8080/api/live | head -c 100
echo ""
echo "   - /api/ready"
docker exec smeh_new_desing-express-api-1 wget -q -O- http://localhost:8080/api/ready | head -c 100
echo ""
echo "   - /api/health"
docker exec smeh_new_desing-express-api-1 wget -q -O- http://localhost:8080/api/health | head -c 100
echo ""
echo ""

echo "3. Testing Redis connectivity..."
docker exec smeh_new_desing-redis-1 redis-cli ping
echo ""

echo "4. Testing PostgreSQL connectivity..."
docker exec smeh_new_desing-postgresql-1 psql -U mrt_user -d mrt_production -c "SELECT COUNT(*) as tables FROM pg_tables WHERE schemaname='public';"
echo ""

echo "5. Checking database tables..."
docker exec smeh_new_desing-postgresql-1 psql -U mrt_user -d mrt_production -c "\dt"
echo ""

echo "6. Testing Next.js..."
docker exec smeh_new_desing-nextjs-1 wget -q -O- http://localhost:3000 | head -c 200
echo ""
echo ""

echo "7. Verifying upload directories..."
docker exec smeh_new_desing-express-api-1 ls -la /var/www/mrt/uploads/
echo ""

echo "8. Testing Prisma client..."
docker exec smeh_new_desing-express-api-1 node -e "const p = require('.prisma/client'); console.log('✓ Prisma client loaded')"
echo ""

echo "=== Verification Complete ==="
