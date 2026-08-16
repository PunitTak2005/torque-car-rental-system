# 🏎️ Torque — Luxury & Performance Car Rental Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)

> **Torque** is a full-stack, enterprise-grade Car Rental System designed for luxury, sports, and electric vehicles. It offers a seamless experience for customers reserving vehicles and an executive admin control center for managing fleet operations, reservations, users, and revenue telemetry.

---

## 🌐 Live Application Links

### **Local Environment (Active Server)**
- 🌐 **Client Web Application**: [http://localhost:3253](http://localhost:3253)
- 👨‍💼 **Admin Control Center**: [http://localhost:3253/admin](http://localhost:3253/admin)
- ⚙️ **Backend REST API**: [http://localhost:9002/api](http://localhost:9002/api)

### ☁️ **Cloud Deployment (Recommended Stack)**
- **Frontend Hosting**: [Vercel](https://vercel.com/) / [Netlify](https://netlify.com/)
- **Backend Hosting**: [Render](https://render.com/) / [Railway](https://railway.app/)
- **Database Cloud Cluster**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## 🔗 Official GitHub Repository
**Repository URL**: [`https://github.com/PunitTak2005/torque-car-rental-system`](https://github.com/PunitTak2005/torque-car-rental-system)

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

## 🚀 Cloud Deployment Instructions (5 Minutes)

### Step 1: Deploy Database on MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Obtain your connection string: `mongodb+srv://username:password@cluster.mongodb.net/car-rental`.

### Step 2: Deploy Backend API on Render / Railway
1. Connect your GitHub repository `PunitTak2005/torque-car-rental-system`.
2. Root directory: `server`.
3. Build command: `npm install`. Start command: `node server.js`.
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas URI
   - `JWT_SECRET`: `your_jwt_secret_key`
   - `NODE_ENV`: `production`

### Step 3: Deploy Frontend Client on Vercel
1. Import repository `PunitTak2005/torque-car-rental-system` on [Vercel](https://vercel.com).
2. Root directory: `client`.
3. Build command: `npm run build`. Output directory: `dist`.
4. Environment variables: `VITE_API_URL` = Your backend Render API URL.

---

## 🔐 Default Admin Credentials
- **Admin Portal URL**: `http://localhost:3253/admin`
- **Email**: `admin@torque.com`
- **Password**: `admin123`

---

## 👨‍💻 Developer Information
Developed for **TORQUE Luxury & Performance Car Rental System**.
- **Repository**: [PunitTak2005/torque-car-rental-system](https://github.com/PunitTak2005/torque-car-rental-system)
