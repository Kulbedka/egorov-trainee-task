import os
from urllib.parse import urlencode

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, redirect, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv(
    "GOOGLE_REDIRECT_URI",
    "http://localhost:5000/api/auth/google/callback",
)

CORS(app, origins=[FRONTEND_URL])


@app.get("/health")
def health():
    return jsonify({
        "status": "ok",
        "service": "egorov-trainee-backend"
    })


@app.get("/api/auth/google")
def google_auth():
    if not GOOGLE_CLIENT_ID:
        return jsonify({
            "error": "Google OAuth is not configured"
        }), 500

    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "prompt": "select_account",
    }

    google_auth_url = "https://accounts.google.com/o/oauth2/v2/auth"
    return redirect(f"{google_auth_url}?{urlencode(params)}")


@app.get("/api/auth/google/callback")
def google_callback():
    code = request.args.get("code")

    if not code:
        return jsonify({
            "error": "Authorization code is missing"
        }), 400

    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        return jsonify({
            "error": "Google OAuth is not configured"
        }), 500

    token_response = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": GOOGLE_REDIRECT_URI,
        },
        timeout=10,
    )

    if not token_response.ok:
        return jsonify({
            "error": "Failed to get access token",
            "details": token_response.json()
        }), 400

    token_data = token_response.json()
    access_token = token_data.get("access_token")

    userinfo_response = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={
            "Authorization": f"Bearer {access_token}"
        },
        timeout=10,
    )

    if not userinfo_response.ok:
        return jsonify({
            "error": "Failed to get user info",
            "details": userinfo_response.json()
        }), 400

    user = userinfo_response.json()

    redirect_params = urlencode({
        "auth": "success",
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "picture": user.get("picture", ""),
    })

    return redirect(f"{FRONTEND_URL}?{redirect_params}")


if __name__ == "__main__":
    app.run(host="localhost", port=5000, debug=True)