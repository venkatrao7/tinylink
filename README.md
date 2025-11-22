# TinyLink - URL Shortener

## 🚀 Overview

TinyLink is a full-stack URL shortener built using **Next.js**, **Prisma**, and **PostgreSQL (Neon)**. It allows users to create custom short links, manage them via a simple dashboard, and get redirected seamlessly to the original long URLs.

---

## 🧩 Features

* 🔗 Create short URLs from long URLs
* 🧠 Option to add custom short codes
* 📋 Dashboard to view all created links
* ⚡ Fast redirects using server-side routing
* 🩺 Health check endpoint (`/api/healthz`)

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 16
* **Backend:** Next.js API Routes
* **Database:** PostgreSQL (Neon)
* **ORM:** Prisma
* **Styling:** CSS / Tailwind CSS

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/tinylink.git
cd tinylink
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
```

### 4. Setup the Database

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db push
```

### 5. Run the App

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🧪 API Routes

| Route               | Method | Description                       |
| ------------------- | ------ | --------------------------------- |
| `/api/links`        | GET    | Fetch all links                   |
| `/api/links`        | POST   | Create a new short link           |
| `/api/links/[code]` | GET    | Redirect to the original long URL |
| `/api/healthz`      | GET    | Health check endpoint             |

---

## 🧠 Folder Structure

```
src/
├── pages/
│   ├── index.tsx        # Main dashboard
│   ├── _app.tsx         # Global CSS import
│   └── api/
│       ├── links.ts     # Link creation + fetch
│       └── healthz.ts   # Health check
├── styles/
│   └── index.css        # Styling
└── lib/
    └── prisma.ts        # Prisma client setup
```
---

## 🧾 Notes

* Make sure your Neon PostgreSQL database is **active and connected**.
* If port 3000 is in use, Next.js will automatically switch to 3001.

---

## 👤 Author

**Venkat Rao Velagapudi**  
B.Tech in Computer Science (AI & ML)  
GitHub: [https://github.com/venkatrao7](https://github.com/venkatrao7)

---

✅ *This project was built as part of the Full Stack Developer Take-Home Assignment for Aganitha Cognitive Solutions.*

