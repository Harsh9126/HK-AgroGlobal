# 🌿 HK AgroGlobal — Premium Agro Export & Supply Website

<div align="center">

![HK AgroGlobal](https://img.shields.io/badge/HK%20AgroGlobal-Premium%20Agro%20Exporter-2d6a4f?style=for-the-badge&logo=leaf&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12.11.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

A full-featured **B2B agricultural export & supply** platform built with React + Vite + Firebase. Enables global buyers to browse certified agro products, request quotes, and connect with HK AgroGlobal — while giving admins a powerful dashboard to manage the entire catalog.

</div>

---

## 📸 Screenshots

| Frontend Home | Admin Dashboard |
|---|---|
| Hero section with product highlights | Full product & inquiry management |

---

## ✨ Features

### 🛒 Frontend (Public Website)
- **Home Page** — Hero banner, product categories, featured products, certifications, testimonials, and CTA
- **Products Page** — Filter and browse all agro products by category
- **Product Detail** — Full product info, export specs, and request quote button
- **About Page** — Company story, mission, team, and milestones
- **Export Process** — Step-by-step guide for international buyers
- **Request Quote** — Smart inquiry form with product pre-selection
- **Contact Page** — Contact form + company details

### 🔐 Admin Panel (`/admin`)
- **Secure Login** — Firebase Authentication
- **Dashboard** — Overview stats (products, categories, inquiries)
- **Manage Products** — Add, edit, delete products with images, specs & featured toggle
- **Manage Categories** — Create and organize product categories with icons
- **Manage Inquiries** — View, respond to, and track buyer inquiries
- **Manage Certificates** — Upload and display quality certifications

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 6 |
| Routing | React Router DOM v6 |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Analytics | Firebase Analytics |
| Icons | Lucide React |
| Styling | Vanilla CSS (custom design system) |
| Build Tool | Vite |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ ([download](https://nodejs.org/))
- **npm** v9+
- A **Firebase** project (free tier works fine)

### 1. Clone the Repository

```bash
git clone https://github.com/Harsh9126/HK-AgroGlobal.git
cd HK-AgroGlobal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example env file and fill in your Firebase credentials:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

> **How to get Firebase credentials:**
> 1. Go to [Firebase Console](https://console.firebase.google.com/)
> 2. Create a new project (or use existing)
> 3. Go to **Project Settings → General → Your apps → Web app**
> 4. Copy the `firebaseConfig` values

### 4. Firebase Setup

In your Firebase project, enable:
- **Firestore Database** (start in test mode for development)
- **Authentication** → Email/Password provider

Create your first admin user:
```bash
node setup-admin.js
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the website.
Open [http://localhost:5173/admin](http://localhost:5173/admin) to access the admin panel.

---

## 📁 Project Structure

```
HK-AgroGlobal/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx       # Top navigation bar
│   │   ├── Footer.jsx       # Site footer
│   │   ├── ProductCard.jsx  # Product listing card
│   │   ├── ProtectedRoute.jsx # Auth guard for admin routes
│   │   └── PublicLayout.jsx # Wrapper for public pages
│   │
│   ├── pages/
│   │   ├── frontend/        # Public-facing pages
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Export.jsx
│   │   │   ├── RequestQuote.jsx
│   │   │   └── Contact.jsx
│   │   │
│   │   └── admin/           # Admin panel pages
│   │       ├── Login.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminLayout.jsx
│   │       ├── ManageProducts.jsx
│   │       ├── ManageCategories.jsx
│   │       ├── ManageInquiries.jsx
│   │       └── ManageCertificates.jsx
│   │
│   ├── context/             # React context providers
│   ├── data/                # Static/mock data
│   ├── lib/
│   │   └── firebase.js      # Firebase app initialization
│   ├── services/
│   │   └── firebaseService.js # Firestore CRUD operations
│   ├── App.jsx              # Root component + routing
│   ├── main.jsx             # App entry point
│   └── index.css            # Global design system
│
├── index.html
├── vite.config.js
├── package.json
├── .env.example             # Environment variable template
├── .gitignore
├── setup-admin.js           # Admin user creation script
├── Start_AgroGlobal.bat     # Windows quick-start script
└── Start_Admin_Dashboard.bat# Windows admin quick-start
```

---

## 🖥️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at `localhost:5173` |
| `npm run dev:open` | Start dev server and open browser |
| `npm run dev:admin` | Start dev server and open admin panel |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

### Windows Quick-Start Batch Files
- **`Start_AgroGlobal.bat`** — Double-click to start the frontend
- **`Start_Admin_Dashboard.bat`** — Double-click to start directly on admin panel

---

## 🔐 Admin Access

Navigate to `/admin` to access the admin panel.

Default login is via **Firebase Authentication** (Email/Password). Create an admin account using:

```bash
node setup-admin.js
```

Or manually create a user in the [Firebase Console → Authentication](https://console.firebase.google.com/) section.

---

## 🌍 Deployment

### Build for Production

```bash
npm run build
```

The optimized output will be in the `dist/` folder. Deploy to any static hosting:

- **Firebase Hosting**: `firebase deploy`
- **Vercel**: Connect your GitHub repo at [vercel.com](https://vercel.com)
- **Netlify**: Drag & drop the `dist/` folder at [netlify.com](https://netlify.com)

> **Important**: Set all `VITE_FIREBASE_*` environment variables in your hosting platform's dashboard before deploying.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary to **HK AgroGlobal**. All rights reserved.

---

## 📬 Contact

**HK AgroGlobal**  
🌐 Premium Agro Export & Supply  
📧 Reach out via the [Contact Page](http://localhost:5173/contact) on the website

---

<div align="center">
Made with ❤️ for global agro trade
</div>
