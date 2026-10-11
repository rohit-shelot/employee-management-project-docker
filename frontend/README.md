# Frontend - Employee Management System

React.js Single Page Application built with Vite, React Router, Axios, and modern CSS.

## Features
- Modern admin dashboard with KPI statistics cards
- Full employee CRUD with responsive tables and forms
- Real-time search by ID, name, email, and position
- Filtering by department and active/inactive status
- Modal confirmation dialog for safe deletions
- Detailed employee profile view
- Clean vanilla CSS design system (responsive on mobile, tablet, and desktop)

## Environment Variables
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

3. Open your browser at:
   `http://localhost:5173`

4. Build for production:
   ```bash
   npm run build
   ```

## Docker Build & Run
```bash
docker build -t ems-frontend .
docker run -p 5173:80 ems-frontend
```
