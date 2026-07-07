#!/bin/sh
cd /app
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
