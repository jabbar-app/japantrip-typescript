# 🇯🇵 Japan Smart Trip Planner

An open-source, developer-friendly trip planning tool tailored for first-time travelers to Japan — built with a TypeScript-first mindset for both frontend and backend.

🚀 [Live Demo](https://japan-trip.jabbar.id)

---

## ✨ Overview

Planning a trip to Japan can be overwhelming — multiple destinations, schedules, ticketing, and cultural considerations. This app simplifies that process by allowing users to visually build and manage their daily itineraries across Japanese cities using a beautiful, interactive interface.

More than just a travel tool, this project is also a showcase of clean architecture, modular structure, and scalable TypeScript design across the stack.

---

## 🧠 Key Features

- 🔐 **User Authentication**: Register, login, logout using JWT
- 🗺️ **Destination Explorer**: Filter, sort, and view details of Japanese destinations
- 🗓️ **FAB List Builder**: Add destinations into a floating list (like a cart)
- 🕒 **Drag-and-Drop Timeline**: Plan daily itinerary using an interactive timeline UI
- ✍️ **CRUD Itineraries**: Create, edit, delete plans with support for multiple days
- 📊 **Dashboard Overview**: View insights on total destinations & itineraries
- 📱 **Responsive UI**: Built mobile-first with Tailwind + MUI
- 💾 **Data Persistence**: MySQL + Prisma for relational schema modeling
- 🛠️ **Full Admin Management**: Add/Edit/Delete destinations and itineraries
- 📦 **API-first Architecture**: REST endpoints for all resources

---

## ⚙️ Tech Stack

### Frontend

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS, MUI (Material UI)
- **State Management**: React Hooks (`useState`, `useEffect`)
- **UX Enhancements**: Framer Motion, ShadCN UI

### Backend

- **API**: REST using Next.js API Routes (`/api/...`)
- **Languages**: TypeScript (strict mode)
- **Server Frameworks**: Fastify, Express (optional switchable), NestJS (in future)
- **ORM**: Prisma (strict schema typing, TS inference)
- **Database**: MySQL

### Deployment

- **Hosting**: Google Cloud Platform (GCP App Engine & Cloud SQL)
- **Frontend**: Vercel (Edge API-ready)
- **DevOps**: GitHub Actions for CI/CD (coming soon)

---

## 📁 Folder Structure

```
🔺 app/
└── destinations/        # Destination explore pages
└── itineraries/         # Timeline builder and viewer
└── dashboard/           # Stats and summaries
└── api/                 # API endpoints (REST, typed)
🔺 components/              # UI building blocks (Navbar, Sidebar, etc.)
🔺 lib/                     # Utils, database (Prisma), and helper modules
🔺 prisma/                  # schema.prisma and seed
🔺 public/                  # Static assets
```

---

## 🧪 Best Practices & Code Patterns

### ✅ Advanced TypeScript Techniques

- Strong typing on `req.body`, `params`, `query` inside API routes
- Reusable types for DTOs and form models
- Prisma auto-inference to reduce manual typing
- Custom utility types for form validation and transformation

### ✅ Clean Code Practices

- Modular directory-based routing with isolated component scopes
- Drag & drop system using React DnD + local state
- Separation of concern: `lib/`, `components/`, `views/`

---

## 🛠️ Local Development

```bash
git clone https://github.com/jabbar-app/japantrip-typescript.git
cd japantrip-typescript

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Run locally
dev
```

---

## 📁 License

This project is open-source and available under the [MIT License](LICENSE).

---

Made with passion by [Jabbar Ali Panggabean](https://www.linkedin.com/in/jabbarpanggabean/). Contributions welcome!