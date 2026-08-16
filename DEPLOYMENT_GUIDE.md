# 🚀 TORQUE Car Rental System — Step-by-Step Production Deployment Guide

This guide provides complete, step-by-step instructions to deploy the **Torque Car Rental System** to free production cloud hosting using **MongoDB Atlas**, **Render (Backend)**, and **Vercel (Frontend)**.

---

## 📌 STEP 1: Deploy MongoDB Database (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up / log in.
2. Click **Create a Deployment** and select the **M0 Free Shared Tier**.
3. Under **Database Access**:
   - Create a database user (e.g., `torque_admin`) and set a strong password. Save this password.
4. Under **Network Access**:
   - Click **Add IP Address** and select **Allow Access From Anywhere (`0.0.0.0/0`)** so hosting providers can connect.
5. Click **Database** → **Connect** → **Drivers**:
   - Copy your connection string. It will look like:
     ```text
     mongodb+srv://torque_admin:<password>@cluster0.mongodb.net/torque-car-rental?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual database user password.

---

## 📌 STEP 2: Deploy Backend REST API (Render.com)

1. Sign up / log in to [Render.com](https://render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub account and select your repository:
   `PunitTak2005/torque-car-rental-system`
4. Configure the Web Service settings:
   - **Name**: `torque-backend-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. Scroll down to **Environment Variables** and add the following keys:
   | Key | Value |
   | :--- | :--- |
   | `PORT` | `9002` |
   | `MONGODB_URI` | Your MongoDB Atlas Connection String from Step 1 |
   | `JWT_SECRET` | `torque_production_jwt_secret_key_2026` |
   | `JWT_EXPIRES_IN` | `7d` |
   | `NODE_ENV` | `production` |
6. Click **Create Web Service**.
7. Wait 2–3 minutes for deployment. Once complete, Render will provide your live backend API URL:
   `https://torque-backend-api.onrender.com`

---

## 📌 STEP 3: Seed Production Database (Optional)

To seed your MongoDB Atlas cloud database with initial car fleet and sample bookings:
1. Temporarily set your local `server/.env` file:
   ```env
   MONGODB_URI=mongodb+srv://torque_admin:<password>@cluster0.mongodb.net/torque-car-rental?retryWrites=true&w=majority
   ```
2. Open terminal and run:
   ```bash
   cd server
   node seed.js
   node seedBookings.js
   ```

---

## 📌 STEP 4: Deploy Frontend Client (Vercel)

1. Sign up / log in to [Vercel](https://vercel.com/) with your GitHub account.
2. Click **Add New...** → **Project**.
3. Select your repository: `PunitTak2005/torque-car-rental-system`.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and select `client`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://torque-backend-api.onrender.com/api` |
6. Click **Deploy**.
7. In ~60 seconds, Vercel will launch your live frontend website at:
   `https://torque-car-rental.vercel.app`

---

## 📌 STEP 5: Verification & Post-Deployment Test

1. Visit your live Vercel URL.
2. Test browsing the fleet gallery, filtering by category (SUV, Sedan, Electric), and opening vehicle details.
3. Test user signup/login and saving vehicles to Favorites.
4. Test the 4-Step Booking Workflow and generating a booking confirmation voucher.
5. Visit `https://torque-car-rental.vercel.app/admin` and log in with admin credentials:
   - **Email**: `admin@torque.com`
   - **Password**: `admin123`
6. Verify revenue statistics, fleet CRUD management, reservation status updates, and user directory.

---

🎉 **Congratulations! Your Torque Car Rental System is 100% deployed and live on the internet!**
