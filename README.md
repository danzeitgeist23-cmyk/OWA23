# OWA - Origin Wild Adventure

Professional adventure experiences in Gran Canaria.

## Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, React Router 7, Tailwind CSS, Radix UI, TanStack Query, Framer Motion |
| **Backend** | FastAPI, MongoDB (Motor), Pydantic v2, JWT Auth |
| **Database** | MongoDB 7.0 |
| **Reverse Proxy** | Nginx (SSL termination, routing, caching) |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions → GHCR → VPS |
| **Hosting** | VPS (Hetzner) with Docker Compose |

---

## Quick Start (Local Development)

```bash
# 1. Clone
git clone https://github.com/danzeitgeist23-cmyk/OWA23.git
cd OWA23

# 2. Start all services (MongoDB + Backend + Frontend)
docker compose up -d

# 3. Verify
curl http://localhost/health      # Frontend via Nginx
curl http://localhost/api/        # Backend API
curl http://localhost/api/docs    # Swagger UI
```

**Or manually:**

```bash
# Terminal 1: MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Terminal 2: Backend
cd backend
cp .env.example .env
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --reload --port 8000

# Terminal 3: Frontend
cd frontend
npm install --legacy-peer-deps
npm start
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs

---

## Production Deployment

### Prerequisites (VPS)
- Ubuntu 22.04/24.04 or Debian 12
- Docker 24+ & Docker Compose v2
- Domain pointing to VPS IP
- SSH access

### One-time Setup

```bash
# 1. On VPS - create project directory
sudo mkdir -p /opt/owa && sudo chown $USER:$USER /opt/owa
cd /opt/owa

# 2. Clone repo
git clone https://github.com/danzeitgeist23-cmyk/OWA23.git .

# 3. Configure environment
cp .env.production.example .env.production
# Edit .env.production with real values (JWT_SECRET_KEY, etc.)

# 4. Initial deploy
./scripts/deploy.sh production
```

### Automated Deploy (GitHub Actions)

**Required Secrets in GitHub repo:**
| Secret | Description |
|--------|-------------|
| `VPS_HOST` | VPS IP or hostname |
| `VPS_USER` | SSH user (e.g., `root` or `ubuntu`) |
| `VPS_SSH_KEY` | Private SSH key for deploy |
| `VPS_PORT` | SSH port (default 22) |

**Trigger:** Push to `main` branch → Auto deploy

### Manual Deploy

```bash
# On VPS
cd /opt/owa
./scripts/deploy.sh production
```

### Rollback

```bash
cd /opt/owa
docker compose -f docker-compose.prod.yml down
# Restore DB from backup if needed
docker compose -f docker-compose.prod.yml up -d
```

---

## Project Structure

```
OWA23/
├── .github/workflows/ci-cd.yml    # GitHub Actions pipeline
├── backend/
│   ├── Dockerfile                 # Multi-stage build
│   ├── requirements.txt           # Python deps
│   ├── server.py                  # FastAPI app
│   ├── .env.example               # Local dev template
│   └── venv/                      # Local virtual env (gitignored)
├── frontend/
│   ├── Dockerfile                 # Multi-stage (builder + nginx)
│   ├── package.json               # Node deps
│   ├── src/                       # React source
│   ├── build/                     # Production build (gitignored)
│   └── public/                    # Static assets
├── nginx/
│   ├── nginx.conf                 # Main config (SSL, routing, caching)
│   └── ssl/                       # Let's Encrypt certs (gitignored)
├── scripts/
│   └── deploy.sh                  # Zero-downtime deploy script
├── docker-compose.yml             # Full stack (dev + prod build)
├── docker-compose.prod.yml        # Production (pre-built images)
├── .env.production.example        # Production env template
└── README.md
```

---

## Key Features

### Frontend
- **React 19** with modern hooks
- **React Router 7** for SPA routing
- **Tailwind CSS** + **Radix UI** for accessible components
- **TanStack Query** for server state
- **Framer Motion** for animations
- **PWA ready** (manifest, service worker)

### Backend
- **FastAPI** with automatic OpenAPI/Swagger
- **MongoDB** async driver (Motor)
- **Pydantic v2** for validation
- **JWT authentication** ready
- **CORS** configured for production domains
- **Health checks** for orchestration

### Infrastructure
- **Nginx** reverse proxy with:
  - SSL termination (Let's Encrypt)
  - HTTP/2
  - Rate limiting (API, login)
  - Security headers (HSTS, CSP, etc.)
  - Static asset caching (1 year)
  - SPA routing support
  - Gzip compression
- **Docker Compose** with:
  - Internal network (MongoDB isolated)
  - Health checks on all services
  - Auto-restart policies
  - Volume persistence
- **GitHub Actions** CI/CD:
  - Lint (black, isort, flake8, ESLint)
  - Test (pytest, Jest)
  - Multi-arch Docker builds
  - Push to GHCR
  - Zero-downtime deploy via SSH

---

## Environment Variables

### Backend (`.env.production`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URL` | Yes | MongoDB connection string |
| `DB_NAME` | Yes | Database name |
| `CORS_ORIGINS` | Yes | Comma-separated allowed origins |
| `JWT_SECRET_KEY` | Yes | 32+ char secret (openssl rand -hex 32) |
| `JWT_ALGORITHM` | No | HS256 (default) |
| `JWT_EXPIRE_MINUTES` | No | 1440 (default) |

---

## Monitoring & Logs

```bash
# View logs
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f nginx

# Health checks
curl https://owawild.com/health
curl https://owawild.com/api/

# Container status
docker compose -f docker-compose.prod.yml ps
```

---

## Backup Strategy

```bash
# Manual backup
docker exec owa-mongodb mongodump --archive --gzip --db=owa_db > backup_$(date +%Y%m%d).gz

# Restore
docker exec -i owa-mongodb mongorestore --archive --gzip --db=owa_db < backup_20260805.gz

# Automated: Add to crontab
0 3 * * * /opt/owa/scripts/backup.sh
```

---

## Security Checklist

- [ ] `JWT_SECRET_KEY` is 32+ random chars
- [ ] MongoDB auth enabled (production)
- [ ] `.env.production` not in git
- [ ] SSL certificates valid (Let's Encrypt auto-renewal)
- [ ] Security headers active (check with securityheaders.com)
- [ ] Rate limiting configured
- [ ] CORS restricted to known domains
- [ ] Non-root containers
- [ ] Internal network for MongoDB
- [ ] Regular security updates (`apt update && apt upgrade`)

---

## License

Private project - All rights reserved.

---

## Contact

- **Owner:** Dani (@Dan_Zeitgeist)
- **Repo:** https://github.com/danzeitgeist23-cmyk/OWA23
- **Production:** https://owawild.com