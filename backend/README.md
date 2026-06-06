# Backend

Python Flask backend for Google OAuth2 authentication.

## Tech stack

* Python
* Flask
* Google OAuth2
* python-dotenv
* requests

## Setup

Create virtual environment:

```bash
python -m venv venv
```

Activate virtual environment on Windows:

```bash
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env` file based on `.env.example`:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

Run backend:

```bash
python app.py
```

Backend will start on:

```txt
http://localhost:5000
```

## Endpoints

### Health check

```txt
GET /health
```

### Start Google OAuth

```txt
GET /api/auth/google
```

### Google OAuth callback

```txt
GET /api/auth/google/callback
```

## Notes

The backend does not use sessions or a database. After successful Google authentication, it redirects the user back to the frontend with basic user profile data in query parameters.
