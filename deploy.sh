#!/bin/bash
# ==============================================================================
# MAHILO WEB MODULE DEPLOYMENT SCRIPT (VPS PORT 5093)
# Domain: mahilo.sriddha.com
# Port: 5093 (Strictly isolated from all other apps on VPS)
# ==============================================================================

set -e

echo "🚀 [1/4] Pulling latest changes from main branch..."
git checkout main
git pull origin main

echo "📦 [2/4] Installing dependencies & building Frontend..."
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..

echo "⚙️ [3/4] Installing dependencies & building Backend..."
cd backend
npm install
npm run build
cd ..

echo "🔄 [4/4] Starting/Reloading isolated PM2 instance on port 5093..."
if pm2 describe mahilo-web > /dev/null 2>&1; then
    pm2 reload ecosystem.config.cjs --env production
else
    pm2 start ecosystem.config.cjs --env production
fi

echo "✅ MAHILO Web Module successfully deployed and listening exclusively on port 5093!"
