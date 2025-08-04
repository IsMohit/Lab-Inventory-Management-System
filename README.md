# 🧪 Laboratory Inventory Management System (LIMS)

A modern, responsive **full-stack web application** designed to manage laboratory inventory, streamline stock tracking, and notify users of critical levels. Built with **React**, **Node.js**, **Express**, and **MongoDB**, LIMS supports user roles, dynamic dashboards, and alert mechanisms for effective lab resource management.

**GitHub Repo:** [https://github.com/IsMohit/Lab-Inventory-Management-System](https://github.com/IsMohit/Lab-Inventory-Management-System)

---

## 🚀 Project Overview

LIMS helps laboratories efficiently manage their inventory by tracking components, managing stock movements, notifying users about low or critical inventory levels, and enabling role-based access. The system is particularly useful for educational institutions and research labs.

---

## 🛠️ Tech Stack

| Frontend            | Backend            | Database   | Others                     |
|---------------------|--------------------|------------|----------------------------|
| React + TailwindCSS | Node.js + Express  | MongoDB    | JWT, bcrypt, Axios, Cron   |

---

## ⚙️ Setup Instructions (Local Development)

### 1. 📦 Clone the Repository

```bash
git clone https://github.com/IsMohit/Lab-Inventory-Management-System.git
cd Lab-Inventory-Management-System
```

### 2. 🖥 Frontend Setup

```bash
cd client
npm install
npm run dev
```

### 3. 🔧 Backend Setup

```bash
cd server
npm install
```

- Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lims
JWT_SECRET=supersecretkey
```

- Then run the server:

```bash
npm run dev
```

Make sure MongoDB is running locally or update the `MONGO_URI` accordingly.

---

## 🧱 Application Architecture

```
client/      → React frontend with TailwindCSS, component-based UI
server/      → Node.js/Express backend with routes, controllers, JWT-based auth
 ┣ routes/   → API endpoints
 ┣ models/   → MongoDB Mongoose models
 ┣ utils/    → Notification checks (e.g., low stock, expired)
 ┗ config/   → MongoDB connection

Frontend communicates via Axios to http://localhost:5000/api/...
```

---

## ✅ Features Implemented

### 🔒 User Authentication
- Secure login via JWT
- Role-based access (Admin/User)

### 📦 Inventory Management
- Add, edit, delete components (Admin only)
- Inward & outward stock tracking
- Live quantity bar and color-coded stock statuses

### 📊 Dashboard
- Overview of stock value, critical items, recent activity
- Pie charts for category distribution

### 🔔 Notifications
- Alerts for low stock, critical items, and outdated entries
- Notification badge with animation
- Cron job runs daily at 2 AM to check and log notifications

### 👥 User Management (Admin only)
- Add/remove users
- Set roles (admin/user)
- Role visibility in profile

---

## 👤 User Roles & Access

| Role   | Description                                     | Access                                  |
|--------|-------------------------------------------------|-----------------------------------------|
| Admin  | Full access to all features                     | Dashboard, Inventory, Users, Alerts     |
| User   | Limited access (view + stock movement only)     | Inventory (Inward/Outward), Alerts only |

### Test Credentials

```txt
Admin
Username: admin
Password: admin123

User
Username: techguy
Password: user1234
```

---

## 📸 Screenshots

> _Add actual screenshots or GIFs to your repo and update links below._

### 💻 Dashboard  
![Dashboard Screenshot](https://github.com/IsMohit/Lab-Inventory-Management-System/blob/main/dashboard.gif)

### 🧾 Inventory List  
![Inventory Screenshot](https://github.com/IsMohit/Lab-Inventory-Management-System/blob/main/inventory.gif)

### 🔔 Notifications  
![Notifications Screenshot](https://github.com/IsMohit/Lab-Inventory-Management-System/blob/main/notifications.gif)

### 📱 Fully Responsive Design  
![Mobile View](https://github.com/IsMohit/Lab-Inventory-Management-System/blob/main/mobile-view.gif)

---

## ⚠️ Known Limitations

- No password reset or email verification flow
- File upload (e.g., datasheets) is not fully implemented
- No advanced filtering (e.g., by date range, supplier) yet
- Backend lacks full validation & rate-limiting

---

## 🔮 Future Improvements

- Docker support for containerized deployment
- CSV/Excel import/export
- PDF report generation
- Role permissions UI (e.g., per-feature toggles)
- Email alerts & Google Calendar integration

---

## 🤝 Contributing

1. Fork this repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## ✨ Created by [Mohit Khambekar](https://github.com/IsMohit)
