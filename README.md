# 💰 Expense Tracker (Node.js + React + Prisma + MySQL + Docker)

A full-stack expense tracker application built with:

- **Backend:** Node.js, Express, TypeScript, Prisma ORM
- **Database:** MySQL (via Docker)
- **Frontend:** React + TypeScript + Vite
- **Containerization:** Docker Compose
- **API Style:** REST JSON APIs

This project allows you to create, categorize, and list expenses while maintaining a clean, type-safe full-stack architecture.

---

## ✨ Features

| Area | Feature |
|------|---------|
| Backend API | Node.js + Express + TypeScript |
| Database | Prisma ORM + MySQL in Docker |
| Frontend UI | React + TypeScript + Vite |
| Categories | Create & assign categories to expenses |
| Expenses | Add, list, and display expenses |
| Dashboard Ready | Summary endpoints for reporting |
| Type-Safe End-to-End | Prisma → TypeScript → React types |

---

## 🗂️ Project Structure

```
expense-mini/
├── docker-compose.yml # MySQL container
├── packages/
│ ├── api/ # Backend (Node + Express + Prisma)
│ │ ├── prisma/ # Prisma schema & migrations
│ │ ├── src/ # API code
│ │ └── package.json
│ └── web/ # Frontend (React + Vite + TS)
│ ├── src/
│ └── package.json

```

## 🧰 Prerequisites

Make sure you have installed:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | **v22+** | https://nodejs.org |
| Docker Desktop | latest | https://www.docker.com/products/docker-desktop |
| Git | latest | https://git-scm.com |

> If you use Windows, **use PowerShell or Git Bash**, not cmd.

---

## 🚀 Setup & Run the Project

Open a terminal in the project root (`expense-mini/`) and run:

```bash
# 1) Start MySQL in Docker
docker compose up -d

# 2) Run backend API
cd packages/api
npm install
npx prisma generate
npm run prisma:migrate     # applies schema & creates tables
npm run seed               # loads default categories (optional)
npm run dev                # start API at http://localhost:4000

# 3) Run frontend
cd ../web
npm install
npm run dev                # start app at http://localhost:5173