# Kairos Frontend

Frontend application built with TypeScript and Vite.

## Requirements

- Node.js 20 or newer
- npm
- Running backend for Google authentication

## Installation

Open a terminal in the `frontend` directory and install dependencies:

```bash
cd frontend
npm install
```

## Environment variables

Create a `.env` file based on `.env.example`:

```bash
copy .env.example .env
```

Default configuration:

```env
VITE_API_URL=http://localhost:5000
```

`VITE_API_URL` must point to the running backend.

## Development

Start the development server:

```bash
npm run dev
```

Open the application:

```text
http://localhost:5173
```

The backend should be available at:

```text
http://localhost:5000
```

## Production build

Create a production build:

```bash
npm run build
```

The generated files will be placed in the `dist` directory.

Preview the production build locally:

```bash
npm run preview
```

