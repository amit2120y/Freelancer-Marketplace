# FreelanceHub 🚀

FreelanceHub is an Elite Freelance Marketplace & Talent Platform designed to connect the top 1% of verified freelancers with innovative startups and enterprise companies. Built with a focus on transparency, secure escrow payments, and zero-commission cuts for freelancers, FreelanceHub provides a modern, seamless experience for both clients and talent.

## ✨ Features

- **Modern & Responsive UI**: Glassmorphism design system built with TailwindCSS, providing a visually stunning experience.
- **Role-Based Authentication**: Secure JWT-based authentication system supporting both standard email/password and Google OAuth logins.
- **Job Board**: Clients can post jobs, and freelancers can browse, search, and apply to opportunities tailored to their tech stacks (React, Python, Flutter, UI/UX, etc.).
- **Proposals System**: Freelancers can submit detailed proposals with bid amounts and estimated timelines.
- **Freelancer Profiles**: Showcase portfolios, skills, and past reviews to attract top clients.
- **Review & Rating System**: Built-in trust mechanism allowing clients and freelancers to leave feedback after project completion.

## 🛠️ Tech Stack

**Frontend**:
- HTML5 / CSS3
- TailwindCSS (via CDN)
- Vanilla JavaScript
- FontAwesome (Icons)

**Backend**:
- Node.js
- Express.js
- MongoDB (with Mongoose)

**Security & Auth**:
- JSON Web Tokens (JWT)
- bcryptjs (Password hashing)
- Google Auth Library

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas URI)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/amit2120y/Freelancer-Marketplace.git
   cd Freelancer-Marketplace
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   ```

4. **Seed the Database (Optional):**
   If you want to populate the database with sample data:
   ```bash
   npm run seed
   ```

5. **Start the Server:**
   - For production mode:
     ```bash
     npm start
     ```
   - For development mode (with nodemon):
     ```bash
     npm run dev
     ```

6. **Open in Browser:**
   Navigate to `http://localhost:3000` to view the application.

## 📂 Folder Structure

```
.
├── public/                 # Frontend assets (HTML, JS, CSS, images)
│   ├── assets/             # Logos and images
│   ├── js/                 # Client-side JavaScript (API, App, Auth logic)
│   └── styles.css          # Custom styling and overrides
├── server/                 # Backend Node.js/Express app
│   ├── config/             # Database connection configuration
│   ├── middleware/         # Custom Express middlewares (Auth, Error handling)
│   ├── models/             # Mongoose schemas (User, Job, Proposal, Review)
│   ├── routes/             # API route handlers
│   └── server.js           # Entry point for the backend application
├── seed.js                 # Database seeding script
├── package.json            # Node project metadata and dependencies
└── .gitignore              # Git ignore file
```

## 📜 License

This project is licensed under the ISC License.

---
*Crafted with precision & modern web standards.*
