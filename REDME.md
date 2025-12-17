#  Project Work – Full Stack Application

A containerized **full-stack web application** built with modern technologies and designed to run locally with **one command**.

---

##  Tech Stack

- **Backend:** Spring Boot (Java, Maven)
- **Frontend:** React (Vite) served by **Nginx**
- **Database:** PostgreSQL 15
- **Containerization:** Docker & Docker Compose

> ✅ No local Java, Node.js, or PostgreSQL installation required.

---

##  Prerequisites

You only need:

- **Docker** (v24+ recommended)
- **Docker Compose** (included with Docker Desktop / Docker Engine)

Verify installation:

```bash
docker --version
docker compose version
```

---

##  Environment Variables

This project **already contains** a `.env` file in the project root with the required database configuration:

```env
DB_USER=postgres
DB_PASS=postgres
DB_NAME=project_admin
DB_PORT=5432
```

Strongly advised: Change these values before using the application in any non-local or shared environment.

---

## Run the Entire Stack (Single Command)

From the **project root**:

```bash
docker compose up -d --build
```

---

##  What This Command Does

- Builds backend and frontend Docker images
- Starts PostgreSQL with a **persistent Docker volume**
- Waits for the database to become healthy
- Starts the backend service
- Starts the frontend service

---

##  Access the Application

### Frontend
```
http://localhost:3000
```

### Backend API
```
http://localhost:8080
```

Example API endpoint:
```http
GET http://localhost:8080/api/projects
```

---

## ⏹ Stop the Stack

```bash
docker compose down
```

---

##  Reset the Database (Delete All Data)
 
**This will permanently delete all database data.**

```bash
docker compose down -v
```

---

##  Rebuild After Code Changes

Rebuild **everything**:
```bash
docker compose up -d --build
```

Rebuild **backend only**:
```bash
docker compose up -d --build backend
```

Rebuild **frontend only**:
```bash
docker compose up -d --build frontend
```

---

##  View Logs

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f database
```

---



