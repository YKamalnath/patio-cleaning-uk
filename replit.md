# Elite Patio Care UK

A full-stack web application for a professional patio cleaning service business in the UK. Provides a public-facing website for customers to view services, get quotes, and book appointments, plus a management portal for customers and administrators.

## Architecture

- **Frontend**: React 18 + TypeScript + Tailwind CSS, built with Vite (port 5000)
- **Backend**: Node.js + Express.js API server (port 5001)
- **Database**: MongoDB (local, running on port 27017)
- **Auth**: JWT-based authentication with bcrypt password hashing
- **Payments**: Stripe integration (optional, configure via env vars)

## Project Structure

- `src/` — React frontend (components, pages, lib, data, assets)
- `server/src/` — Express backend (models, routes, controllers, middleware, config)
- `public/` — Static frontend assets
- `server/scripts/` — Database seeding scripts
- `scripts/` — Utility scripts

## Running the App

The workflow (`bash start.sh`) starts:
1. MongoDB on port 27017 with data in `/tmp/mongodb-data`
2. Express backend on port 5001
3. Vite dev server on port 5000 (proxies /api, /health, /uploads to backend)

## Environment Variables

Required (set in Replit Secrets):
- `MONGO_URI` — MongoDB connection string (default: `mongodb://127.0.0.1:27017/patio-cleaning`)
- `JWT_SECRET` — Secret key for JWT tokens
- `PORT` — Backend port (default: 5001)

Optional (Stripe payments):
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_CURRENCY` (default: gbp)
- `BOOKING_PAYMENT_AMOUNT_GBP` (default: 49)
- `CLIENT_APP_URL` — Used for Stripe redirect URLs

## Seeding Admin User

```bash
ADMIN_NAME="Administrator" ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="strong-password" npm run seed:admin
```

## User Preferences

- Keep existing project structure and conventions
