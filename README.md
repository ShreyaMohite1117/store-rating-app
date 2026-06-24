# ⭐ RateNest — Store Rating Platform

A full-stack web application where users discover and rate stores. Built for the
FullStack Intern Coding Challenge.

🚀 Features

Authentication & Authorization
JWT-based authentication
Role-based access control
Secure password hashing using bcrypt
Update password functionality

👨‍💼 Admin
Dashboard with analytics
Manage users (Admin / User / Store Owner)
Create and manage stores
View store ratings
Search, filter, and sort users/stores

👤 Normal User
Register and login
Browse stores
Search stores by name and address
Submit ratings (1-5 stars)
Update existing ratings

🏪 Store Owner
Login and manage store dashboard
View average store rating
View users who rated the store

🛠 Tech Stack
- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL (via Sequelize ORM)
- **Frontend:** React (Vite)
- **Auth:** JWT, single login endpoint, role-based access (Admin / Normal User / Store Owner)

```
store-rating-app/
├── backend/      Express API, Sequelize models, JWT auth, validation
├── frontend/     React (Vite) single-page app
└── database/     schema.sql — reference DDL describing the schema design
```

---

## 1. Prerequisites

Install these before you start:

- **Node.js** v18 or newer — https://nodejs.org
- **PostgreSQL** v13 or newer, running locally or remotely — https://www.postgresql.org/download/
- **VS Code** (or any editor) — https://code.visualstudio.com

Verify versions:

```bash
node -v
npm -v
psql --version
```

---

## 2. Open the project in VS Code

Unzip the project, then in VS Code: `File → Open Folder…` and select the
`store-rating-app` folder. Open two terminals (`Terminal → New Terminal`) — one
for the backend, one for the frontend.

---

## 3. Set up the database

Create an empty PostgreSQL database (the app creates all tables for you on
first run — you only need to create the database itself):

```bash
psql -U postgres -c "CREATE DATABASE store_rating_db;"
```

(If you'd rather inspect the schema manually, `database/schema.sql` has the
full reference DDL — but you don't need to run it; Sequelize will create the
tables automatically.)

---

## 4. Set up and run the backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in your real PostgreSQL credentials (`DB_USER`,
`DB_PASSWORD`, `DB_NAME`, etc.) and set a `JWT_SECRET` to any long random
string. You can leave the `SEED_ADMIN_*` values as-is or customize them.

Create the tables and a default admin account:

```bash
npm run seed
```

This prints the admin login it created, by default:

```
Email:    admin@storerating.com
Password: Admin@1234
```

Start the API server:

```bash
npm run dev
```

The backend will run at **http://localhost:5000**. You should see
`Database connection established.` and `Server running on http://localhost:5000`
in the terminal.

---

## 5. Set up and run the frontend

In your second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app will run at **http://localhost:5173** and is already configured (via
`vite.config.js`) to proxy `/api` requests to the backend on port 5000, so the
two apps talk to each other with no extra setup.

Open **http://localhost:5173** in your browser.

---

## 6. Try it out

1. Log in with the seeded admin account above, or visit `/signup` to register
   a Normal User account.
2. As **Admin**: go to *Users* → *Add user* to create a Store Owner account,
   then go to *Stores* → *Add store* and assign that owner to a new store.
3. As **Normal User**: browse `/stores`, search by name/address, and click a
   star to rate a store (click again on a different star to change it).
4. As **Store Owner**: log in with the owner account you created — `/owner`
   shows the average rating and everyone who has rated the store.
5. Anyone can change their password from the **Password** link in the navbar.

---

## Roles & functionality

| Role | Capabilities |
|---|---|
| **System Administrator** | Dashboard (total users/stores/ratings); add users (admin/user/owner) and stores; list & filter users/stores by name, email, address, role; sortable tables; view full user detail (incl. rating for owners); log out |
| **Normal User** | Sign up; log in; update password; browse/search stores by name & address; submit a rating (1–5) for a store; modify their existing rating; log out |
| **Store Owner** | Log in; update password; dashboard showing average rating and the list of users who rated their store; log out |

## Form validations

- **Name:** 20–60 characters
- **Address:** up to 400 characters
- **Email:** standard email format
- **Password:** 8–16 characters, at least one uppercase letter and one special character

These are enforced both client-side (HTML attributes) and server-side
(`express-validator`, see `backend/src/utils/validators.js`) — never trust the
client alone.

## API overview

All routes are prefixed with `/api`.

| Method | Route | Who | Description |
|---|---|---|---|
| POST | `/auth/signup` | Public | Register a Normal User |
| POST | `/auth/login` | Public | Log in (any role) |
| PUT | `/auth/update-password` | Authenticated | Change your own password |
| GET | `/admin/dashboard` | Admin | Totals: users, stores, ratings |
| POST | `/admin/users` | Admin | Create a user (admin/user/owner) |
| GET | `/admin/users` | Admin | List + filter (`name`,`email`,`address`,`role`) + sort |
| GET | `/admin/users/:id` | Admin | Full user detail |
| POST | `/admin/stores` | Admin | Create a store |
| GET | `/admin/stores` | Admin | List + filter + sort, with average rating |
| GET | `/stores` | Normal User | List/search stores (`name`,`address`) with overall + own rating |
| POST | `/stores/:storeId/rating` | Normal User | Submit or update a 1–5 rating |
| GET | `/owner/dashboard` | Store Owner | Average rating + list of raters |

## Design notes

- Passwords are hashed with bcrypt before storage; the API never returns them.
- JWTs carry the user's id and role; every protected route is guarded by
  `authenticate` (verifies the token) and `authorize(...roles)` (checks role).
- The schema enforces a **unique (user, store)** pair on ratings, so "submit"
  and "modify" use the same upsert endpoint.
- See `database/schema.sql` for the full table design with constraints and
  indexes.

## Troubleshooting

- **"Database connection established" never appears / ECONNREFUSED:** PostgreSQL
  isn't running, or your `.env` credentials don't match a real database/user.
- **CORS or 404 errors in the browser:** make sure the backend is running on
  port 5000 *before* you start the frontend dev server.
- **"An account with this email already exists":** the seed script and signup
  form both check for duplicate emails — use a different email or log in instead.
