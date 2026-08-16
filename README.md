# 🏎️ Torque — Luxury & Performance Car Rental Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)

> **Torque** is a full-stack, enterprise-grade Car Rental System designed for luxury, sports, and electric vehicles. It offers a seamless experience for customers reserving vehicles and an executive admin control center for managing fleet operations, reservations, users, and revenue telemetry.

---

## 🔗 Official GitHub Repository
**Repository URL**: `https://github.com/PunitTak2005/torque-car-rental-system`

---

## ⭐ Core Features

### 👤 Customer Portal
- **Showroom & Fleet Gallery**: Browse vehicles with dynamic filtering by category (SUV, Sedan, Electric, Luxury, Sports), transmission, fuel type, price range, and live text search.
- **Vehicle Configuration**: Detailed performance specs (acceleration, top speed, horsepower), image galleries, and interactive customer review section.
- **Persistent Favorites**: Per-user favorites system that isolates saved vehicles per account and persists in MongoDB.
- **4-Step Booking Workflow**:
  1. *Schedule & Hub Selection* (Pickup date, Return date, Hub locations).
  2. *Driver Verification* (Driver details & License verification).
  3. *Payment Gateway* (UPI with QR, Credit/Debit Card, Cash on Pickup).
  4. *Booking Confirmation* (Printable voucher with reservation ID).
- **Journey Timeline (Booking History)**: Customer portal (`/my-bookings`) to track active trips, past rentals, and cancel upcoming reservations.
- **Dual Theme Support**: Native **Light Mode & Dark Mode** toggle across all customer pages.

### 👨‍💼 Admin Control Center (`/admin`)
- **Executive Telemetry & Revenue Analytics**:
  - **Total Revenue Card**: Formatted Indian currency (`₹6,57,296`), monthly growth indicator (`+12.4%`), and detailed breakdown.
  - **Booking Analytics & Status Chart**: 3-column state distribution across lifecycle states (`Pending`, `Confirmed`, `Active`, `Completed`, `Cancelled`, `Rejected`).
- **Admin Fleet Catalog (CRUD)**: Add, edit, or remove vehicles from the fleet, update pricing per day, image URLs, specifications, and availability.
- **Reservations Feed & Lifecycle Manager**: Complete table displaying Booking ID (`#FE-529657`), Customer Details (Name, Email, Phone), Car Model, Schedule & Hub, Amount, Payment Status, and Status Action Dropdowns. Supports page sizes (`10`, `20`, `50`, `All`).
- **User Directory & Review Moderation**: Manage registered customer accounts and moderate vehicle reviews.
- **Dynamic Real-Time Sidebar Badges**: Real-time database counts for Fleet (`36`), Bookings (`22`), Users (`16`), Payments (`20`), and Reviews (`1797`).

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 18 (Vite)
- **Styling**: Vanilla CSS & TailwindCSS with HSL dynamic theme tokens (Dark & Light Mode glassmorphism)
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6) with lazy loading
- **State**: React Context API (`AuthContext`, `ThemeContext`, `ToastContext`, `FavoritesContext`)

### **Backend**
- **Runtime**: Node.js & Express.js REST API
- **Database**: MongoDB with Mongoose ODM
- **Security**: JWT (JSON Web Tokens) & Bcrypt password hashing
- **Data Seeding**: Automated sample booking, vehicle, and user data initialization

---

## 📂 Project Structure

```text
torque-car-rental-system/
├── client/                     # React Frontend Application
│   ├── src/
│   │   ├── components/         # UI Components (Navbar, Footer, Admin, Car details)
│   │   ├── context/            # React Context Providers (Auth, Theme, Toast, Favorites)
│   │   ├── pages/              # Page views (Home, BrowseCars, CarDetails, BookingWorkflow, Admin)
│   │   ├── routes/             # App Router DOM definitions
│   │   └── services/           # Axios API services
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js Express REST API Backend
│   ├── config/                 # Database configuration (db.js)
│   ├── controllers/            # API Controllers (auth, car, booking, admin, review, favorite)
│   ├── middleware/             # Auth JWT verification & error handlers
│   ├── models/                 # Mongoose schemas (User, Car, Booking, Payment, Review, Favorite)
│   ├── routes/                 # Express API endpoint routes
│   ├── seed.js                 # Database seed script for fleet catalog
│   ├── seedBookings.js         # Database seed script for realistic bookings
│   ├── package.json
│   └── server.js
│
├── screenshots/                # Project Screenshots (Light & Dark Mode)
├── README.md                   # Project Documentation
└── .env.example                # Environment Variable Template
```

---

## ⚡ Quick Setup & Installation

### **Prerequisites**
- Node.js (v18+ recommended)
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or MongoDB Atlas cluster

### **1. Configure Environment Variables**
Copy `.env.example` to `.env` inside the `server/` directory:

```bash
cp .env.example server/.env
```

Set your configuration values:
```env
PORT=9002
MONGODB_URI=mongodb://127.0.0.1:27017/car-rental
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### **2. Start Backend API Server**
```bash
cd server
npm install
npm start
# Express Server listening on http://localhost:9002
```

### **3. Start Frontend React Web App**
```bash
cd client
npm install
npm run dev
# React Web Application running on http://localhost:3253
```

---

## 📸 Screenshots Directory

All 22 high-resolution screenshots covering Customer and Admin workflows in both **Light Mode** and **Dark Mode** are available in the [`screenshots/`](./screenshots) folder:

- `01_home_page_light.png` & `02_home_page_dark.png` — Home Page
- `03_fleet_gallery_light.png` & `04_fleet_gallery_dark.png` — Fleet Gallery
- `05_showroom_filters_light.png` & `06_filtered_fleet_dark.png` — Showroom Filters & SUV Fleet
- `07_car_details_page_light.png` & `08_car_details_reviews_dark.png` — Car Details Page & Reviews
- `09_booking_form_light.png` & `10_booking_confirmation_dark.png` — 4-Step Booking Workflow & Confirmation Voucher
- `11_booking_history_light.png` & `12_booking_history_dark.png` — Journey Timeline / My Bookings
- `13_login_light.png` & `14_signup_dark.png` — Authentication Views
- `15_admin_dashboard_dark.png` & `16_admin_dashboard_light.png` — Admin Dashboard Overview & Revenue Telemetry
- `17_admin_fleet_management_dark.png` & `18_admin_fleet_management_light.png` — Admin Fleet Catalog (CRUD)
- `19_admin_bookings_dark.png` & `20_admin_bookings_light.png` — Admin Reservations Feed & Lifecycle Manager
- `21_admin_users_light.png` — Admin Customer Directory
- `22_admin_reviews_dark.png` — Admin Review Moderation

---

## 🔐 Default Admin Credentials
- **Admin Portal URL**: `http://localhost:3253/admin`
- **Email**: `admin@torque.com`
- **Password**: `admin123`

---

## 👨‍💻 Developer Information
Developed as part of the **TORQUE Luxury & Performance Car Rental System** platform.
- **Repository**: [PunitTak2005/torque-car-rental-system](https://github.com/PunitTak2005/torque-car-rental-system)
