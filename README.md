# MAHILO — Women Entrepreneurs Products & Services Marketplace

> **Shop • Book • Learn • Empower**  
> Staging Domain: [https://mahilo.sriddha.com](https://mahilo.sriddha.com)  
> Dedicated VPS Port: `5093`  

---

## Git Branches Structure
- **`main`**: Web Module (React + Vite Frontend + Express Node.js Backend with static serving). Deployed on VPS.
- **`android`**: Native Android Jetpack Compose Application.
- **`ios`**: iOS Mobile Application.

---

## Running Locally

### 1. Backend Server
```bash
cd backend
npm install
npm run dev
# Listens on http://localhost:5000 (or PORT env)
```

### 2. Frontend Web Application
```bash
cd frontend
npm install
npm run dev
# Available at http://localhost:5173
```

---

## Production Deployment on VPS (Port 5093)
This application runs strictly isolated on port **5093**, avoiding any collision with other services on the host.

```bash
git pull origin main
bash deploy.sh
```
