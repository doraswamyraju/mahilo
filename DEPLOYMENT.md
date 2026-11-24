# MAHILO — Production Deployment & Disaster Recovery Guide

## 1. Production Architecture Overview

* **Cloud Provider:** Hostinger VPS (Ubuntu 22.04 / 24.04 LTS)
* **Web Server & Reverse Proxy:** Nginx (with HTTP/2 and Brotli compression)
* **DNS & SSL/TLS:** Cloudflare DNS with Full (Strict) SSL Mode
* **Application Runtime:** Node.js v20.x managed by PM2 Process Manager
* **Database:** PostgreSQL 16 (Strict ACID with normalized relational models)
* **Payment Gateway:** Razorpay (Production Key Pair + Webhook HMAC verification)

---

## 2. Server Provisioning & Initial Setup

```bash
# 1. Update OS packages
sudo apt update && sudo apt upgrade -y

# 2. Install essential utilities
sudo apt install -y curl git ufw nginx postgresql postgresql-contrib

# 3. Install Node.js 20 LTS via Nodesource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

# 4. Configure Firewall (UFW)
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 3. Production PostgreSQL Database Setup

```bash
# Switch to postgres user
sudo -i -u postgres

# Create database and user with strong password
psql -c "CREATE USER mahilo_prod_user WITH PASSWORD 'REPLACE_WITH_SECURE_STRONG_PASSWORD';"
psql -c "CREATE DATABASE mahilo_prod_db OWNER mahilo_prod_user;"
psql -c "GRANT ALL PRIVILEGES ON DATABASE mahilo_prod_db TO mahilo_prod_user;"
exit
```

---

## 4. Application Deployment Steps

```bash
# 1. Clone repository into /var/www/mahilo
sudo mkdir -p /var/www/mahilo
sudo chown -R $USER:$USER /var/www/mahilo
cd /var/www/mahilo
git clone <YOUR_GIT_REPOSITORY_URL> .

# 2. Setup Backend
cd /var/www/mahilo/backend
cp .env.example .env
nano .env # Configure production secrets, DATABASE_URL, RAZORPAY keys, and JWT_SECRET

npm install --production=false
npx prisma generate
npx prisma db push
npm run build

# 3. Start Backend with PM2
pm2 start dist/server.js --name "mahilo-api" -i max
pm2 save
pm2 startup

# 4. Setup Frontend
cd /var/www/mahilo/frontend
npm install
npm run build # Outputs production static assets to /var/www/mahilo/frontend/dist
```

---

## 5. Nginx Reverse Proxy Configuration

Create `/etc/nginx/sites-available/mahilo`:

```nginx
server {
    listen 80;
    server_name mahilo.in www.mahilo.in;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/javascript application/json application/javascript;

    # Frontend Static Single Page Application
    location / {
        root /var/www/mahilo/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }

    # Backend REST API Reverse Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/mahilo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 6. Automated Database Backup & Disaster Recovery

### Automated Daily Backup Cron Job
Create `/usr/local/bin/backup-mahilo.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/mahilo_db"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "$BACKUP_DIR"

# Run pg_dump
pg_dump -U mahilo_prod_user -h localhost -d mahilo_prod_db | gzip > "$BACKUP_DIR/mahilo_$TIMESTAMP.sql.gz"

# Retain backups for 14 days, delete older
find "$BACKUP_DIR" -type f -name "mahilo_*.sql.gz" -mtime +14 -exec rm {} \;
```

Set permissions and schedule in crontab:
```bash
sudo chmod +x /usr/local/bin/backup-mahilo.sh
# Run every night at 2:00 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-mahilo.sh") | crontab -
```

### Database Recovery Procedure
```bash
# To restore from a backup:
gunzip -c /var/backups/mahilo_db/mahilo_YYYYMMDD_HHMMSS.sql.gz | psql -U mahilo_prod_user -h localhost -d mahilo_prod_db
```
