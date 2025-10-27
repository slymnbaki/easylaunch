# Easylaunch — Packaging & Deployment

Özet: React frontend + Node backend uygulaması. Docker ile tek komutla çalıştırılabilir.

Quick start (development)
- Frontend:
  cd frontend
  npm install
  npm start

- Backend:
  cd (repo root)
  npm install
  npm run start

Docker (production-like)
- Kök dizinde `.env` dosyanızı oluşturun (`.env.example` referans alın).
- Build & up:
  docker-compose up -d --build
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

Quick steps to build and package:

1. Create production .env from .env.example and set values.
2. Build frontend (you already did): `cd frontend && npm run build`
3. Ensure backend serves build (backend/server.js).
4. Build Docker images and bring up:
   - `docker-compose up -d --build`
   - `docker-compose logs -f`
5. Verify:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api/ping

Run tests:
- Frontend unit tests: `cd frontend && npm test --watchAll=false`
- Backend tests: `cd backend && npm install && npm test`
- Contracts: from repo root `npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-chai-matchers chai` then `npx hardhat test`

Notes:
- npm audit reported vulnerabilities coming from react-scripts chain. Build works, but consider migrating away from react-scripts or applying overrides carefully before public release.
- Remove any secrets before packaging.

Satış / dağıtım notları
- Secrets .env içinde kalmalı, repoya commit etmeyin.
- Production için TLS, domain, DB yedekleme, monitoring ve CI/CD önerilir.

License: see LICENSE
