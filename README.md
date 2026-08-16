# 🏎️ TORQUE — Luxury & Performance Car Rental System

[![GitHub License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-blue?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?logo=mongodb)](https://www.mongodb.com/)

> **TORQUE** is a full-stack web application designed for luxury, sports, and electric vehicle rentals. It delivers a modern experience for customers reserving cars and an executive control panel for administrators managing fleet vehicles, bookings, users, and financial analytics.

---

## 🔗 GitHub Repository Link

To push or link this repository to your GitHub account:

```bash
# 1. Add your remote repository URL
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/torque-car-rental-app.git

# 2. Rename branch to main
git branch -M main

# 3. Push all commits to GitHub
git push -u origin main
```

---

## 🌟 Key Features

### 👤 Customer Portal
- **Showroom & Fleet Gallery**: Browse vehicles with dynamic filtering by category (SUV, Sedan, Electric, Luxury, Sports), transmission, fuel type, and price range.
- **Vehicle Configuration**: Detailed performance specifications (acceleration, top speed, horsepower) and interactive reviews.
- **Persistent Favorites**: Account-isolated favorite cars stored in MongoDB.
- **4-Step Booking Workflow**: Schedule selection, driver details & license verification, payment gateway (UPI / Card / Cash), and booking voucher.
- **Journey Timeline**: Customer portal to track active rentals and past trip history.

### 👨‍💼 Admin Control Center (`/admin`)
- **Executive Analytics**: Real-time revenue card (`₹`), monthly growth comparison, and 3-column status analytics chart.
- **Fleet Catalog CRUD**: Manage vehicle listings, pricing per day, image links, and availability status.
- **Bookings Feed**: Complete reservation table with search, status filters, payment filters, page size options (`10`, `20`, `50`, `All`), and status change controls.
- **User & Review Moderation**: Full customer directory and review moderation.
- **Real-time Sidebar Badges**: MongoDB counts for Fleet (`36`), Bookings (`22`), Users (`16`), Payments (`20`), and Reviews (`1797`).

---

## 📸 Screenshots Directory
All 22 project screenshots in **Light Mode & Dark Mode** are available in the [`screenshots/`](./screenshots) folder.

---

## 🚀 Quick Setup & Execution

### 1. Start Backend API Server
```bash
cd server
npm install
npm start
# Server listening on http://localhost:9002
```

### 2. Start Frontend React Application
```bash
cd client
npm install
npm run dev
# App running on http://localhost:3253
```

---

## 🔐 Default Credentials
- **Admin Portal**: `http://localhost:3253/admin`
- **Admin Email**: `admin@torque.com` | **Password**: `admin123`
