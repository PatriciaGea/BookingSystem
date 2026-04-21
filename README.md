# <img src="./public/user_10813375.svg" alt="User Registration System" width="30" height="30" style="vertical-align: middle; margin-right: 8px;"> User Registration System

![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white)

> Full-stack user management application developed by **Patricia Gea** at **Hyper Island, Stockholm**

A modern web app for managing user registrations built with React, Node.js, and MongoDB featuring a responsive design, real-time notifications, and accessibility-first approach.

## 🚀 Live Demo

**Frontend:** https://patriciagea.github.io/React_Javascript_Api/  
**Backend API:** https://react-javascript-api.onrender.com

<img src="./src/assets/IMG_8875.jpeg" alt="Project screenshot" height="350px" />

---

## Table of Contents

- [Features](#-features)
- [Technologies](#-technologies)
- [Quick Start](#-quick-start)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Accessibility & SEO](#-accessibility--seo)
- [Learning Outcomes](#-learning-outcomes)

---

## Features

**Core Functionality**
- Create, search, display, and delete user records
- Real-time notifications with visual feedback
- Form validation with error handling

**User Experience**
- Fully responsive (desktop, tablet, mobile)
- Modern UI with smooth animations
- Smart search with result counting
- Live notifications for all actions

**Technical**
- RESTful API with CRUD operations
- Clean component architecture with React Hooks
- Asynchronous data fetching and error handling

---

## Technologies

**Frontend:** React 19.2.0 | Vite 7.3.1 | Axios | CSS3 | HTML5  
**Backend:** Node.js | Express.js 4.22.1 | MongoDB | Mongoose 8.22.1  
**Deployment:** GitHub Pages | Render | MongoDB Atlas  
**Tools:** Git

---

## Quick Start

### Prerequisites
- Node.js (v14+) | MongoDB | npm

### Installation

```bash
# Clone and setup project
git clone <repository-url>

# Frontend
npm install

# Backend
cd api_users
npm install
```

### Configuration

Create `.env` in `api_users/`:
```env
MONGODB_URI=mongodb://localhost:27017/usersdb
PORT=3000
CORS_ORIGINS=http://localhost:5173
JWT_SECRET=change_me
FRONTEND_URL=http://localhost:5173
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

For production, set environment variables in:
- **Render:** `MONGODB_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FRONTEND_URL`, `GOOGLE_CALLBACK_URL`, `CORS_ORIGINS`
- **GitHub Actions:** `VITE_API_URL`

### Running

```bash
# Terminal 1 - Backend
cd api_users
npm start
# Runs on http://localhost:3000

# Terminal 2 - Frontend
npm run dev
# Runs on http://localhost:5173
```

### Build
```bash
npm run build  # Frontend
npm run preview
```

---

## 🌐 Deployment

**Architecture:**
```
Frontend (GitHub Pages)
  ↓ VITE_API_URL
Backend (Render)
  ↓ MONGODB_URI  
Database (MongoDB Atlas)
```

### Deploy Frontend (GitHub Pages)

1. Push to `main` branch
2. GitHub Actions automatically builds and deploys
3. Configure `VITE_API_URL=https://your-render-service.onrender.com` in repository variables
4. The Pages base path is resolved automatically from the repository name during GitHub Actions builds

### Deploy Backend (Render)

1. Connect GitHub repository
2. Render auto-deploys using `render.yaml`
3. Set environment variables:
  - `MONGODB_URI=<your mongodb atlas uri>`
  - `JWT_SECRET=<strong random secret>`
  - `EMAIL_USER=<gmail account>`
  - `EMAIL_PASS=<gmail app password>`
  - `GOOGLE_CLIENT_ID=<google oauth client id>`
  - `GOOGLE_CLIENT_SECRET=<google oauth client secret>`
  - `FRONTEND_URL=https://<your-github-username>.github.io/<your-repository-name>`
  - `GOOGLE_CALLBACK_URL=https://<your-render-service>.onrender.com/auth/google/callback`
  - `CORS_ORIGINS=https://<your-github-username>.github.io,http://localhost:5173`

### Google OAuth Setup

1. Open Google Cloud Console and edit the OAuth 2.0 Web Client used by this project.
2. Add these Authorized JavaScript origins:
  - `https://patriciagea.github.io`
  - `http://localhost:5173`
3. Add these Authorized redirect URIs:
  - `https://<your-render-service>.onrender.com/auth/google/callback`
  - `http://localhost:3000/auth/google/callback`
4. Save the client and redeploy Render if you changed the backend environment.
5. Redeploy GitHub Pages if you changed `VITE_API_URL`.

### Deploy Checklist

1. Backend `/health` returns `{"status":"ok"}` on Render.
2. GitHub Pages loads with the correct base path for the new repository.
3. Clicking `Entrar com Google` redirects to Google and returns to the frontend logged in.
4. Manual login and booking creation still work after deploy.

### Database (MongoDB Atlas)

1. Create cluster and database
2. Add network access (0.0.0.0/0 for Render)
3. Copy connection string to `MONGODB_URI`

---

## API Documentation

**Base URL (Production):** `https://react-javascript-api.onrender.com`  
**Base URL (Local):** `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |
| GET | `/users` | Get all users or search with query params |
| GET | `/users?name=X&email=Y&age=Z` | Search users by name, email, or age |
| POST | `/users` | Create new user (requires name, email, age) |
| DELETE | `/users/:id` | Delete user by ID |

**Response Codes:** 200 (Success) | 201 (Created) | 400 (Bad Request) | 404 (Not Found) | 500 (Server Error)

---

## Project Structure

```
devClubCadastrouser/
├── api_users/                 # Backend API
│   ├── models/user.js        # User model
│   ├── routes/users.js       # API endpoints
│   ├── db.js                 # Database setup
│   ├── server.js             # Express server
│   ├── package.json
│   └── .env
│
├── src/                      # Frontend
│   ├── pages/Home/
│   │   ├── index.jsx         # Main component
│   │   └── style.css
│   ├── services/api.js       # Axios config
│   ├── assets/
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
└── vite.config.js
```

---

## Accessibility & SEO

### Accessibility (WCAG 2.1 AA)
- Semantic HTML (`<form>`, `<section>`, `<article>`)
- ARIA labels and live regions for announcements
- Full keyboard navigation support
- Screen reader optimized
- High contrast (white on dark purple)
- Min font size 13px, touch-friendly buttons (45px)
- Form validation with clear error messages

### SEO Optimization
- Descriptive meta tags & description
- Open Graph & Twitter Card meta tags
- Mobile-friendly responsive design
- Fast load times (Vite optimization)
- Semantic HTML structure

### Testing Tools
- WAVE Browser Extension
- axe DevTools
- Chrome Lighthouse (target: 95+ accessibility, 100 SEO)
- Screen readers: NVDA, JAWS, VoiceOver

---

## Learning Outcomes

- **Full-Stack Development:** Frontend-backend integration, RESTful APIs, database modeling
- **React:** Component architecture, Hooks, state management, form handling
- **Backend:** Express.js, MongoDB/Mongoose, CRUD, error handling
- **Web Standards:** Responsive design, accessibility (a11y), SEO, modern CSS
- **Professional:** Code organization, documentation, version control, deployment

---

<div align="center">

  <p>Portfolio • LinkedIn • GitHub • Email</p>
</div>
