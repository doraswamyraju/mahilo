# MAHILO — Women Entrepreneurs Products & Services Marketplace

> **Shop • Book • Learn • Empower**  
> Staging Domain: [https://mahilo.sriddha.com](https://mahilo.sriddha.com)  
> Dedicated VPS Port: `5093`  
> VPS IP: `147.93.107.21`

---

## Git Branches Architecture

| Branch | Description | VPS Deployment |
| :--- | :--- | :--- |
| **`main`** | **Web Module**: React + Vite frontend, Express Node.js backend, unified static serving, and VPS automation scripts. | **Target Branch on VPS** |
| **`android`** | **Android App**: Native Android Jetpack Compose codebase (`android/`). | Local & CI/CD only (Not pulled on VPS) |
| **`ios`** | **iOS App**: Native iOS application codebase (`ios/`). | Local & CI/CD only (Not pulled on VPS) |

---

## VPS Deployment (Pulling ONLY the Web Module)

To ensure the VPS never downloads mobile code (`android` / `ios`) and runs strictly isolated on port **5093**:

```bash
# 1. Clone only the main branch (Web Module)
git clone --single-branch --branch main https://github.com/doraswamyraju/mahilo.git /var/www/mahilo
cd /var/www/mahilo

# 2. Deploy or update with 1-click
bash deploy.sh
```

---

## Updating the Web Module on VPS

Whenever changes are pushed to `main`:

```bash
cd /var/www/mahilo
git pull origin main
bash deploy.sh
```

---

## Multi-App Isolation Guarantee
- **Dedicated Port**: Binds strictly to `PORT=5093`.
- **Zero Port Conflict**: Existing apps on ports `5085`–`5092` are completely untouched.
- **Unified Process**: Single Node.js process (`pm2 start ecosystem.config.cjs`) serves both the API endpoints (`/api/*`) and the compiled frontend bundle (`/*`).
- See [DEPLOYMENT.md](file:///d:/mahilo/DEPLOYMENT.md) for full Nginx, SSL, and database setup instructions.

---

## Local Development

### 1. Backend API Server
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5000 (or PORT env)
```

### 2. Frontend Web Application
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```
