# MAHILO — VPS Deployment & Production Operations Guide

> **Target Domain:** [https://mahilo.sriddha.com](https://mahilo.sriddha.com)  
> **Dedicated VPS Port:** `5093`  
> **Hostinger VPS IP:** `147.93.107.21`  
> **Git Repository:** `https://github.com/doraswamyraju/mahilo.git`  
> **Target Production Branch:** `main` (Web Module only)  

---

## 1. Branch Strategy (Why VPS Pulls Only `main`)

The Git repository holds 3 dedicated branches:
1. **`main`**: The **Web Module** (React frontend + Node.js/Express backend API + VPS configs). This is the **only** branch deployed on the server.
2. **`android`**: Native Android Jetpack Compose app codebase (`android/`). Kept on GitHub and local development machines only.
3. **`ios`**: iOS mobile application codebase. Kept on GitHub and local development machines only.

### How to Clone ONLY the Web Module (Ignoring Mobile Branches)
On your VPS, use the `--single-branch` flag so Git will **only track and download `main`**. Git will never fetch or store `android` or `ios` objects on your server disk:

```bash
# Clone exclusively the main branch (Web Module)
git clone --single-branch --branch main https://github.com/doraswamyraju/mahilo.git /var/www/mahilo
```

---

## 2. Multi-App Isolation Guarantee (Port 5093)

The VPS hosts multiple applications on ports `5085` through `5092`.  
To ensure MAHILO operates in **100% isolation** without touching any other application:

1. **Dedicated Port Binding**:
   - The application binds strictly to port `5093`.
   - Unified single-port architecture: Node.js on port `5093` serves both the `/api/*` endpoints and the compiled React production bundle (`frontend/dist`) on `/*`. No secondary port is consumed.
2. **Isolated PM2 Process**:
   - Runs under the process name `mahilo-web`.
   - Controlled via `ecosystem.config.cjs`:
     ```javascript
     module.exports = {
       apps: [
         {
           name: 'mahilo-web',
           cwd: './backend',
           script: 'dist/server.js',
           instances: 1,
           autorestart: true,
           env: {
             NODE_ENV: 'production',
             PORT: 5093,
             CLIENT_URL: 'https://mahilo.sriddha.com'
           }
         }
       ]
     };
     ```
3. **Isolated Nginx Virtual Host**:
   - Nginx matches exclusively on `server_name mahilo.sriddha.com;` and proxies traffic only to `127.0.0.1:5093`.
   - All other existing domain blocks and port forwardings remain completely untouched.

---

## 3. Initial Server Setup (One-Time)

### Step 1: Firewall Rule Verification
Hostinger VPS firewall has port `5093` opened for incoming TCP traffic. If UFW is active on your Linux instance:
```bash
sudo ufw allow 5093/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Step 2: Clone Repository (Main Branch Only)
```bash
sudo mkdir -p /var/www/mahilo
sudo chown -R $USER:$USER /var/www/mahilo
git clone --single-branch --branch main https://github.com/doraswamyraju/mahilo.git /var/www/mahilo
cd /var/www/mahilo
```

### Step 3: Create Backend Production Environment File
Create `/var/www/mahilo/backend/.env`:
```bash
cat << 'EOF' > /var/www/mahilo/backend/.env
PORT=5093
NODE_ENV=production
CLIENT_URL=https://mahilo.sriddha.com
JWT_SECRET=mahilo_super_secure_production_secret_key_2026
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=mahilo_refresh_secret_secure_key_2026
REFRESH_TOKEN_EXPIRES_IN=7d
RAZORPAY_KEY_ID=rzp_live_placeholder
RAZORPAY_KEY_SECRET=rzp_secret_placeholder
UPLOAD_DIR=./uploads
EOF
```

### Step 4: Run Initial Build and Start PM2
```bash
cd /var/www/mahilo
bash deploy.sh
```
Save the PM2 process list so it automatically restarts on server reboots:
```bash
pm2 save
pm2 startup
```

### Step 5: Configure Nginx Virtual Host
```bash
sudo cp /var/www/mahilo/nginx.conf.example /etc/nginx/sites-available/mahilo.sriddha.com
sudo ln -s /etc/nginx/sites-available/mahilo.sriddha.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Install Free SSL Certificate (Let's Encrypt / Certbot)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d mahilo.sriddha.com
```

---

## 4. Routine Updates (How to Update Backend & Frontend on VPS)

Whenever you push new changes, bugfixes, or features to `main`:

### Option A: Automated 1-Click Update (Recommended)
```bash
cd /var/www/mahilo
bash deploy.sh
```
This script automatically pulls the latest `main` branch, builds the frontend, compiles the backend, and performs a zero-downtime PM2 reload (`pm2 reload mahilo-web`).

### Option B: Updating the Backend Only
If you only modified backend API routes or database models:
```bash
cd /var/www/mahilo
git pull origin main
cd backend
npm install
npm run build
pm2 reload mahilo-web
```

### Option C: Updating the Frontend Only
If you only updated UI components, styles, or user modules:
```bash
cd /var/www/mahilo
git pull origin main
cd frontend
npm install --legacy-peer-deps
npm run build
pm2 reload mahilo-web
```

---

## 5. Health Checks & Monitoring Commands

```bash
# Check if PM2 process is running on port 5093
pm2 status

# View live application logs (useful for debugging)
pm2 logs mahilo-web

# Test internal API health endpoint on port 5093
curl -i http://localhost:5093/api/health

# Verify port 5093 is actively listening
sudo netstat -tlpn | grep 5093
# or
sudo ss -tulpn | grep 5093
```

---

## 6. Future Migration to Dedicated Domain (e.g. `mahilo.in`)

When you register a dedicated brand domain:
1. **DNS**: Point the `@` and `www` A records of your new domain to `147.93.107.21`.
2. **Nginx**:
   Update `server_name` in `/etc/nginx/sites-available/mahilo.sriddha.com`:
   ```nginx
   server_name mahilo.in www.mahilo.in mahilo.sriddha.com;
   ```
   Reload Nginx and run Certbot for the new domain:
   ```bash
   sudo certbot --nginx -d mahilo.in -d www.mahilo.in
   ```
3. **Application Code**:
   **No code changes required!** All frontend API calls use relative paths (`/api`). The backend automatically responds to requests from the new host.
