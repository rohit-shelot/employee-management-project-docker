# Employee Management System (Full-Stack + Docker & Docker Compose)

A complete, beginner-friendly, production-ready Full-Stack Employee Management System built with **React.js (Vite)**, **Node.js (Express.js)**, and **MongoDB Atlas**, fully containerized using **Docker** and orchestrated with **Docker Compose**.

Designed as a clean, practical academic assignment demonstrating modern containerization patterns, cloud database integration, and microservice networking.

---

## 1. Project Architecture

The application consists of two decoupled services running inside isolated Docker containers, communicating securely over an internal Docker bridge network with a cloud-hosted MongoDB Atlas database:

```
┌─────────────────────────────────────────────────────────────┐
│                      DOCKER HOST                            │
│                                                             │
│   ┌────────────────────────┐      ┌─────────────────────┐   │
│   │   ems-frontend         │      │    ems-backend      │   │
│   │   (React + Nginx)      │      │   (Express REST)    │   │
│   │   Port: 5173 (80 int)  │      │   Port: 5000        │   │
│   └───────────┬────────────┘      └──────────┬──────────┘   │
│               │                              │              │
│               │   HTTP REST API              │              │
│               └──────────────────────────────┘              │
│               (ems-network Docker bridge)                   │
└──────────────────────────────────────────────┼──────────────┘
                                               │
                                               │ Secure TLS (MONGO_URI)
                                               ▼
                              ┌───────────────────────────────────┐
                              │       MongoDB Atlas (Cloud)       │
                              │       Managed Cloud Cluster       │
                              └───────────────────────────────────┘
```

### Docker Network Architecture Explained
- **Browser & Client Side**: The user interacts with the React frontend through their web browser at `http://localhost:5173`.
- **Frontend Container**: Nginx serves the compiled React Single Page Application (SPA).
- **Backend Container**: Express.js exposes RESTful API endpoints at `http://localhost:5000/api`.
- **Security Rule**: The React frontend **never connects directly to MongoDB Atlas**. All database operations, validations, and business logic are securely encapsulated inside the Node.js backend. The backend communicates with MongoDB Atlas over TLS using the `MONGO_URI` environment variable.

---

## 2. Docker & Containerization Concepts Explained

This project serves as a practical, hands-on learning tool for core Docker concepts:

### 1. Image
A **Docker Image** is a lightweight, standalone, executable blueprint or template containing everything needed to run an application—code, runtime, system tools, libraries, and settings. In this project:
- `backend` produces a Node.js image with the Express server.
- `frontend` produces an Nginx image containing the compiled React assets.

### 2. Container
A **Docker Container** is a runnable, isolated instance of an image. Containers are isolated from each other and the host system, running safely in their own namespace.

### 3. Dockerfile
A **Dockerfile** is a text script containing sequential instructions that Docker reads to assemble an image automatically:
- `backend/Dockerfile`: Uses official `node:20-alpine`, sets the working directory, copies `package.json`, installs dependencies, copies source code, and exposes port 5000.
- `frontend/Dockerfile`: Uses a **multi-stage build**—Stage 1 builds the Vite React app in Node.js, and Stage 2 copies the production `dist` directory into an ultra-lean `nginx:alpine` image.

### 4. Docker Hub
**Docker Hub** is the world's largest public cloud registry for sharing and storing container images. Base images used in this project (`node:20-alpine` and `nginx:alpine`) are pulled directly from Docker Hub.

### 5. Volume
A **Docker Volume** is used for persistent data storage that outlives individual container lifecycles.
> **Note on MongoDB Atlas:** Because this project uses **MongoDB Atlas (Cloud)**, database persistence, backups, and storage are entirely managed in the cloud cluster. Therefore, a local volume for raw database files is not required on your machine.

### 6. Network (`ems-network`)
A **Docker Network** enables containers to discover and communicate with each other securely using internal DNS service names (e.g. `backend:5000`) within an isolated bridge network, protecting internal communications from external exposure.

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, JavaScript (ES6+), Axios, React Router v6, Responsive Vanilla CSS |
| **Backend** | Node.js, Express.js, Mongoose ODM, CORS, Dotenv, RESTful API |
| **Database** | MongoDB Atlas (Cloud Database) |
| **DevOps & Containers** | Docker, Docker Compose, Nginx Alpine, Multi-stage Builds |

---

## 4. Folder Structure

```
Assignment 2/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB Atlas connection handler
│   │   ├── controllers/
│   │   │   ├── employeeController.js  # CRUD business logic
│   │   │   └── dashboardController.js # Aggregations & KPI metrics
│   │   ├── models/
│   │   │   └── Employee.js           # Mongoose schema with validations
│   │   ├── routes/
│   │   │   ├── employeeRoutes.js     # /api/employees routes
│   │   │   ├── dashboardRoutes.js    # /api/dashboard routes
│   │   │   └── healthRoutes.js       # /api/health route
│   │   ├── middleware/
│   │   │   └── errorHandler.js       # Global error & 404 handler
│   │   └── server.js                 # Express application entrypoint
│   ├── scripts/
│   │   └── seed.js                   # Populates 5 sample employee records
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile                    # Backend Docker instructions
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx           # Sidebar navigation with live API status
│   │   │   ├── Navbar.jsx            # Top bar with quick actions
│   │   │   ├── StatCard.jsx          # Dashboard metric card
│   │   │   ├── StatusBadge.jsx       # Active / Inactive status badge
│   │   │   └── ConfirmModal.jsx      # Safe delete confirmation dialog
│   │   ├── layouts/
│   │   │   └── Layout.jsx            # Main app shell layout
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx         # KPI stats & analytics page
│   │   │   ├── EmployeeList.jsx      # Searchable, filterable records table
│   │   │   ├── AddEmployee.jsx       # Create employee form with validations
│   │   │   ├── EditEmployee.jsx      # Update employee form
│   │   │   └── EmployeeDetail.jsx    # Complete employee profile view
│   │   ├── services/
│   │   │   └── api.js                # Centralized Axios API service
│   │   ├── App.jsx                   # Router switchboard
│   │   ├── main.jsx                  # React DOM mount point
│   │   └── index.css                 # Clean, modern design system
│   ├── index.html
│   ├── vite.config.js
│   ├── nginx.conf                    # Nginx routing configuration for React Router
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile                    # Multi-stage frontend Dockerfile
│   ├── package.json
│   └── README.md
│
├── docker-compose.yml                # Multi-container orchestration
├── .gitignore                        # Git exclusion rules (never commit .env!)
├── .env.example                      # Root environment variables template
└── README.md                         # Project documentation
```

---

## 5. Environment Configuration

### Step 1: Create your `.env` file
Copy `.env.example` to `.env` in the root folder (or inside `backend/`):
```bash
cp .env.example .env
```

### Step 2: Configure MongoDB Atlas Connection String
Open `.env` and fill in your real credentials:
```env
PORT=5000
MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/employee_management
CLIENT_URL=http://localhost:5173
VITE_API_URL=http://localhost:5000/api
```

> [!IMPORTANT]
> **Never commit your `.env` file to Git!**
> The `.env` file contains sensitive database passwords and is explicitly listed in `.gitignore` and `.dockerignore`.

---

## 6. How to Run with Docker Compose (Recommended)

Make sure Docker Desktop is open and running on your system.

### Build and start all containers:
```bash
docker compose up --build
```

### Start in background (detached mode):
```bash
docker compose up -d
```

### Access the Application:
- **Frontend Dashboard**: Open your browser at [http://localhost:5173](http://localhost:5173)
- **Backend Health Check**: Open [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Dashboard Stats API**: Open [http://localhost:5000/api/dashboard/stats](http://localhost:5000/api/dashboard/stats)
- **Employees API**: Open [http://localhost:5000/api/employees](http://localhost:5000/api/employees)

---

## 7. Essential Docker Commands Cheat Sheet

| Task | Command | Description |
|---|---|---|
| **Build images** | `docker compose build` | Builds or rebuilds backend and frontend images |
| **Start services** | `docker compose up` | Starts containers with live terminal logs |
| **Start in background**| `docker compose up -d` | Starts containers in detached mode |
| **Stop services** | `docker compose down` | Stops and removes containers and internal network |
| **Check containers** | `docker ps` | Lists all currently running containers |
| **View all logs** | `docker compose logs` | Streams logs from all running services |
| **Backend logs** | `docker compose logs backend` | Shows logs specifically from the Node.js backend |
| **Frontend logs** | `docker compose logs frontend` | Shows logs specifically from the Nginx frontend |
| **Restart a service** | `docker compose restart backend` | Restarts the backend container |

---

## 8. How to Run Locally Without Docker (For Development)

### 1. Backend:
```bash
cd backend
npm install
# Seed sample employees (optional):
npm run seed
# Start Express API server:
npm start
# Server runs at http://localhost:5000
```

### 2. Frontend:
```bash
cd frontend
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 9. REST API Reference

Base URL: `http://localhost:5000/api`

### Health Check
- `GET /health`
  - Response: `{ "status": "OK", "message": "Employee Management API is running", "database": "connected" }`

### Dashboard
- `GET /dashboard/stats`
  - Response:
    ```json
    {
      "success": true,
      "totalEmployees": 5,
      "activeEmployees": 4,
      "inactiveEmployees": 1,
      "totalDepartments": 4
    }
    ```

### Employees
- `GET /employees` - Retrieve all employees (supports query parameters `?search=alice&department=Engineering&status=Active`)
- `GET /employees/:id` - Retrieve single employee by MongoDB `_id` or `employeeId`
- `POST /employees` - Create employee record
- `PUT /employees/:id` - Update employee details
- `DELETE /employees/:id` - Delete employee record

---

## 10. Sample Seed Employees

You can run `npm run seed` inside `backend/` to populate 5 diverse sample roles:
1. **Alice Johnson** - Software Engineer (Engineering, Active)
2. **Robert Martinez** - HR Manager (Human Resources, Active)
3. **Sarah Connor** - Project Manager (Operations, Active)
4. **David Chen** - Blockchain Developer (Engineering, Active)
5. **Emily Taylor** - UI/UX Designer (Design, Inactive)
