# Vaultline Frontend

React + Vite (JavaScript) client for the Spring Boot JWT auth API.

## Run

```bash
cd Frontend
npm install
npm run dev
```

App: http://localhost:5173  
API: http://localhost:8080 (Spring Boot must be running)

## Pages

- `/signup` → `POST /api/v1/auth/signup`
- `/login` → `POST /api/v1/auth/login` (stores JWT, redirects to `/home`)
- `/home` → `GET /api/v1/user/home` with `Authorization: Bearer <token>`
