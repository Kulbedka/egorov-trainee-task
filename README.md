# Egorov Trainee Task

Full-stack adaptive web page implemented from the provided Figma design.

## Live Demo

* Frontend: https://egorov-trainee-task.vercel.app/
* Backend health check: https://egorov.185-117-116-100.sslip.io/health

## Features

* Responsive desktop, tablet, and mobile layouts
* Autoplay Hero background video
* Google OAuth2 authentication
* Real-time cryptocurrency prices through Coinbase WebSocket
* Interactive mobile menu, video popup, article popup, and cryptocurrency picker
* Self-hosted Bruno Ace font from the Figma design

## Tech Stack

### Frontend

* Vite
* TypeScript
* Plain CSS
* No frontend frameworks or UI libraries

### Backend

* Python
* Flask
* Google OAuth2
* Gunicorn
* Nginx
* PM2
* HTTPS
* No database
* No sessions

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Kulbedka/egorov-trainee-task.git
cd egorov-trainee-task
```

### 2. Start the backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Linux/macOS:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env` based on `.env.example` and provide Google OAuth credentials:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

Run the backend:

```bash
python app.py
```

The backend will be available at:

```txt
http://localhost:5000
```

Health check:

```txt
http://localhost:5000/health
```

Google OAuth start URL:

```txt
http://localhost:5000/api/auth/google
```

### 3. Start the frontend

Open another terminal from the repository root:

```bash
cd frontend
npm install
```

Create `.env` based on `.env.example`:

```env
VITE_API_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

Open:

```txt
http://localhost:5173
```

## Production Build

```bash
cd frontend
npm run build
```

For production frontend deployment, use:

```env
VITE_API_URL=https://egorov.185-117-116-100.sslip.io
```

## Production Deployment

The frontend is deployed on Vercel.

The backend is deployed on a VPS with:

* Gunicorn
* PM2
* Nginx reverse proxy
* HTTPS certificate

Production backend URL:

```txt
https://egorov.185-117-116-100.sslip.io
```

## Additional Documentation

* [Frontend documentation](frontend/README.md)
* [Backend documentation](backend/README.md)
