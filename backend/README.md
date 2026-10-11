# Backend - Employee Management System

Express.js REST API connected to MongoDB Atlas for the Employee Management System.

## Features
- Modular MVC architecture (controllers, models, routes, config, middleware)
- MongoDB Atlas integration via Mongoose
- Full CRUD operations on Employee records
- Dashboard aggregate analytics endpoint
- Health check endpoint (`GET /api/health`)
- Comprehensive error handling and validation
- Pre-configured Dockerfile for containerization

## Environment Variables
Create a `.env` file in the `backend/` directory or at the root:
```env
PORT=5000
MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/employee_management
CLIENT_URL=http://localhost:5173
```

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Seed sample data (optional):
   ```bash
   npm run seed
   ```

3. Start server:
   ```bash
   npm start
   # or development mode:
   npm run dev
   ```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status |
| `GET` | `/api/dashboard/stats` | Analytics & statistics |
| `GET` | `/api/employees` | Get all employees (supports `?search=`, `?department=`, `?status=`) |
| `GET` | `/api/employees/:id` | Get employee by ID |
| `POST` | `/api/employees` | Create a new employee |
| `PUT` | `/api/employees/:id` | Update an existing employee |
| `DELETE` | `/api/employees/:id` | Delete an employee |

## Docker
Build the backend image:
```bash
docker build -t ems-backend .
```

Run container:
```bash
docker run -p 5000:5000 --env-file .env ems-backend
```
