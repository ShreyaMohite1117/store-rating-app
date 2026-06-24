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

---

## 👨‍💼 Default Admin Credentials

```text
Email: admin@storerating.com
Password: Admin@1234
```

---

## 📋 Validation Rules

| Field    | Validation                                        |
| -------- | ------------------------------------------------- |
| Name     | 20–60 characters                                  |
| Address  | Max 400 characters                                |
| Email    | Valid email format                                |
| Password | 8–16 characters, 1 uppercase, 1 special character |

Validations are enforced on both frontend and backend.

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

## 👩‍💻 Author

**Shreya Mohite**

GitHub: https://github.com/ShreyaMohite1117

---

## 📄 License

This project is developed for the Full Stack Intern Coding Challenge and is intended for educational and evaluation purposes.
