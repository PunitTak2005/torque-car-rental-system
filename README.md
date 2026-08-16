# DriveEase | Modern Car Rental & Fleet Management System

DriveEase is a complete, premium, responsive Car Rental Management System built with a modern full-stack architecture (React/Vite, Express, Node.js, and MongoDB). 

This platform showcases vehicle listing and discovery, advanced filters, user authentication, customer dashboards, and a robust admin panel.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (A local MongoDB database instance running on `127.0.0.1:27017` was detected and configured)

---

## 🛠️ Installation & Setup

Follow these steps to run the application locally:

### 1. Database Seeding & Backend Server
Open a terminal in the `/server` directory:

```bash
# Navigate to server
cd server

# Install dependencies
npm install

# Pre-populate database with 15+ realistic cars, mock bookings, and users
npm run seed

# Run the Express server in development mode
npm run dev
```
The server will start running at `http://localhost:9002`.

### 2. Frontend client
Open a separate terminal in the `/client` directory:

```bash
# Navigate to client
cd client

# Install dependencies
npm install

# Run the Vite development server
npm run dev
```
The client will start running at `http://localhost:3253`. Open your browser and navigate to `http://localhost:3253`.

---

## 🔑 Test Credentials

Use these seeded accounts to test different roles on the platform:

### 👤 Customer User Role
- **Email:** `john@gmail.com`
- **Password:** `john123`
*Allows booking cars, processing mock card payments, managing dashboard bookings, printing invoices, and submitting reviews.*

### 🛡️ Administrative Role
- **Email:** `admin@driveease.com`
- **Password:** `admin123`
*Allows managing the car fleet (CRUD), auditing reservations (Confirm, Start rental, Complete, Cancel), promoting users, and deleting spam reviews.*

---

## 📁 Project Structure

```text
car-rental-app/
├── client/
│   ├── src/
│   │   ├── components/       # Custom cards, protected routing, skeletons
│   │   ├── context/          # AuthContext (sessions) & ToastContext (alerts)
│   │   ├── pages/            # Homepage, Browse, Checkout, Dashboard, Admin
│   │   ├── services/         # api.js Centralized Axios HTTP hooks
│   │   ├── App.jsx           # React Router pathways
│   │   ├── index.css         # Tailwind core + custom styling assets
│   │   └── main.jsx          # Vite React engine mount
│   ├── tailwind.config.js    # Tailwind colors & typography extended configuration
│   └── package.json
│
├── server/
│   ├── config/               # db.js Mongoose configuration
│   ├── middleware/           # auth.js filters & errorHandler.js centralized router
│   ├── models/               # MongoDB models (User, Car, Booking, Payment, Review...)
│   ├── routes/               # Express endpoints (auth, cars, bookings, admin...)
│   ├── seed.js               # Seed script populated with 15+ rich car cards
│   ├── server.js             # Main server entrypoint
│   └── package.json
│
├── .env.example              # Template containing default environment parameters
└── README.md                 # Complete system guide
```

---

## 💎 Features & Custom Business Rules

1. **Date Collision Guard**: Enforces that a vehicle cannot be reserved for overlapping dates. Any overlapping booking attempts will be blocked by a MongoDB database validator, displaying clear error alerts.
2. **Dynamic Review Aggregations**: Posting or deleting reviews dynamically updates the car's average rating (`rating`) and number of reviews (`numReviews`) fields inside the database.
3. **Printable Invoices**: Completed checkouts and dashboard booking logs feature a printer-formatted HTML layout for physical invoice output.
4. **Toast Notification System**: Pop-up banners notify users of validation errors, payment failures, or reservation confirmations.
5. **SEO Implementations**: Automatic meta details and semantic headings structure.
