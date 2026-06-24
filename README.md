# ⭐ RateNest — Store Rating Platform

A full-stack web application where users can discover, rate, and review stores. The platform supports three user roles (**Admin, Normal User, and Store Owner**) with secure JWT authentication and role-based access control.

## 🚀 Features

### 🔐 Authentication & Authorization

* JWT-based authentication
* Role-based access control (Admin, User, Store Owner)
* Secure password hashing using bcrypt
* Change password functionality
* Protected routes and middleware

### 👨‍💼 Admin Features

* Dashboard with analytics
* Manage users (Admin / User / Store Owner)
* Create and manage stores
* View store ratings
* Search, filter, and sort users/stores
* Assign store owners

### 👤 Normal User Features

* User registration and login
* Browse available stores
* Search stores by name and address
* Submit ratings (1–5 stars)
* Update existing ratings

### 🏪 Store Owner Features

* Store owner dashboard
* View average store rating
* View users who rated the store
* Track store performance

---
## 📸 Screenshots

### Login Page
![Login](./screenshots/login.png)

### Admin Dashboard
![Admin Dashboard](./screenshots/admin-dashboard.png)

### Store Management
![Stores](./screenshots/stores.png)

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* Sequelize ORM
* JWT Authentication
* Bcrypt

### Database

* PostgreSQL

---

## 📂 Project Structure

```bash
store-rating-app/
├── backend/
│   ├── src/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── pages/
│   ├── components/
│   └── App.jsx
│
└── database/
    └── schema.sql
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/ShreyaMohite1117/store-rating-app.git

cd store-rating-app
```

### 2️⃣ Database Setup

Create PostgreSQL database:

```sql
CREATE DATABASE store_rating_db;
```

---

## 🔧 Backend Setup

```bash
cd backend

npm install
```

Create `.env` file:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

Create tables and default admin:

```bash
npm run seed
```

Start backend server:

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

## 🎨 Frontend Setup

```bash
cd frontend

npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```
## 🎯 Try It Out

1. Log in using the default admin credentials created by the seed script, or register a new account through the Sign Up page.
2. As an **Administrator**:

   * Navigate to **Users → Add User** to create a Store Owner account.
   * Navigate to **Stores → Add Store** to register a store and assign an owner.
3. As a **Normal User**:

   * Browse available stores.
   * Search stores by name or address.
   * Submit a rating between 1–5 stars.
   * Update an existing rating at any time.
4. As a **Store Owner**:

   * Access the Owner Dashboard.
   * View the store's average rating.
   * See the list of users who have submitted ratings.
5. Any authenticated user can update their password from the **Update Password** page.

---

## 👥 User Roles & Permissions

| Role              | Permissions                                                                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Administrator** | View platform statistics, manage users, create stores, assign store owners, search/filter records, sort tables, and view detailed user information. |
| **Normal User**   | Register, log in, browse stores, search stores, submit ratings, update ratings, change password, and log out.                                       |
| **Store Owner**   | Log in, view store rating analytics, see users who rated their store, change password, and log out.                                                 |

---

## ✅ Form Validation Rules

### User Validation

* **Name:** 2–6 characters
* **Address:** Maximum 40 characters
* **Email:** Valid email format
* **Password:** 8–16 characters, including:

  * At least one uppercase letter
  * At least one special character

### Rating Validation

* Rating value must be between **1 and 5 stars**

All validations are enforced on both the frontend and backend to ensure data integrity and security.

---

## 🔌 API Endpoints

All API routes are prefixed with `/api`.

| Method | Endpoint                  | Access        | Description                           |
| ------ | ------------------------- | ------------- | ------------------------------------- |
| POST   | `/auth/signup`            | Public        | Register a new user                   |
| POST   | `/auth/login`             | Public        | Login for all roles                   |
| PUT    | `/auth/update-password`   | Authenticated | Update password                       |
| GET    | `/admin/dashboard`        | Admin         | Dashboard statistics                  |
| POST   | `/admin/users`            | Admin         | Create user                           |
| GET    | `/admin/users`            | Admin         | List users with filtering and sorting |
| GET    | `/admin/users/:id`        | Admin         | Get user details                      |
| POST   | `/admin/stores`           | Admin         | Create store                          |
| GET    | `/admin/stores`           | Admin         | List stores with ratings              |
| GET    | `/stores`                 | User          | Browse and search stores              |
| POST   | `/stores/:storeId/rating` | User          | Create or update rating               |
| GET    | `/owner/dashboard`        | Store Owner   | Store analytics dashboard             |

---

## 🔒 Security & Architecture

* Passwords are securely hashed using **bcrypt** before storage.
* Authentication is handled through **JWT (JSON Web Tokens)**.
* Protected routes use authentication and role-based authorization middleware.
* Ratings enforce a unique **(user_id, store_id)** constraint, ensuring a user can rate a store only once while still allowing updates.
* Database schema follows normalization principles with indexes and constraints for performance and consistency.

---

## 🛠 Troubleshooting

### Database Connection Issues

If the backend fails to connect to PostgreSQL:

* Ensure PostgreSQL service is running.
* Verify database credentials inside the `.env` file.
* Confirm that the database `store_rating_db` exists.

### Frontend API Errors

If API requests fail:

* Start the backend server before the frontend.
* Verify the backend is running on `http://localhost:5000`.

### Duplicate Email Error

If you receive:

`An account with this email already exists`

Use a different email address or log in with the existing account.

---

## 👨‍💼 Default Admin Credentials

```text
Email: admin@storerating.com
Password: Admin@1234
```
---

## 🔗 API Endpoints

### Authentication

| Method | Endpoint                  | Description     |
| ------ | ------------------------- | --------------- |
| POST   | /api/auth/signup          | Register User   |
| POST   | /api/auth/login           | Login           |
| PUT    | /api/auth/update-password | Change Password |

### Admin

| Method | Endpoint             | Description     |
| ------ | -------------------- | --------------- |
| GET    | /api/admin/dashboard | Dashboard Stats |
| POST   | /api/admin/users     | Create User     |
| GET    | /api/admin/users     | List Users      |
| GET    | /api/admin/users/:id | User Details    |
| POST   | /api/admin/stores    | Create Store    |
| GET    | /api/admin/stores    | List Stores     |

### User

| Method | Endpoint                    | Description   |
| ------ | --------------------------- | ------------- |
| GET    | /api/stores                 | Browse Stores |
| POST   | /api/stores/:storeId/rating | Submit Rating |

### Store Owner

| Method | Endpoint             | Description     |
| ------ | -------------------- | --------------- |
| GET    | /api/owner/dashboard | Store Dashboard |

---

## 🔒 Security Features

* Password hashing using bcrypt
* JWT token authentication
* Role-based authorization
* Protected API routes
* Input validation
* Secure middleware

---

## 🎯 Future Improvements

* Store image uploads
* Email verification
* Password reset
* Review comments
* Admin analytics charts
* Docker deployment

---

## 📄 License

This project is developed for the Full Stack Intern Coding Challenge and is intended for educational and evaluation purposes.
