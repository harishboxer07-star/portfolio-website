# Harish Kumar — Personal Portfolio Website & Admin Management System

A full-stack personal portfolio and content management system built specifically for **Harish Kumar**, M.Sc. Data Science student and aspiring full-stack developer.

This application provides two distinct environments:
1. **Public Portfolio (`/`):** Read-only showcase of Harish's photograph, biography, categorized skills, machine learning & web projects, academic education, certificates, and direct contact options (phone, WhatsApp, validated message form).
2. **Private Admin Dashboard (`/admin/login` -> `/admin/dashboard`):** Secure single-owner administrative dashboard for managing projects, skills, education, certificates, messages, resume PDF, and profile photo with full CRUD operations and file uploads.

---

## Architecture & Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 18, Vite | High performance SPA with React Router v6 |
| **Styling** | Tailwind CSS 3 | Navy & Charcoal palette, cyan/violet glowing gradients, glassmorphism |
| **Icons** | Lucide React | Modern, clean vector iconography |
| **Backend** | Python 3.11+, Flask | RESTful API architecture with CORS & static file serving |
| **ORM & DB** | Flask-SQLAlchemy, SQLite | Relational database schema ready for seamless PostgreSQL migration |
| **Auth & Security**| Flask-JWT-Extended, Werkzeug | Salted password hashing, secure JWT authorization tokens |
| **File Handling** | Python standard & Werkzeug | Strict extension validation (PNG/JPG/WEBP for images; PDF for resumes) |

---

## Workspace Structure

```
portfolio/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py              # User authentication model & password hashing
│   │   │   ├── profile.py           # Personal profile, bio, socials, contact info
│   │   │   ├── project.py           # Projects, tech stacks, GitHub/demo links
│   │   │   ├── skill.py             # Categorized skills & proficiency ratings
│   │   │   ├── education.py         # M.Sc. Data Science & degrees timeline
│   │   │   ├── certificate.py       # Certifications & credential URLs
│   │   │   └── message.py           # Contact form submissions inbox
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py              # Login, token inspection, password change
│   │   │   ├── public.py            # Public read-only endpoints & contact submission
│   │   │   ├── admin.py             # Protected CRUD endpoints & file uploads
│   │   │   └── uploads.py           # Secure file streaming route
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── storage.py           # File validation, naming, and deletion
│   │   └── __init__.py              # Application factory, extensions, CORS
│   ├── uploads/
│   │   ├── images/                  # Profile & project images (includes harish_kumar.jpg)
│   │   └── resumes/                 # Resume PDFs
│   ├── config.py                    # Environment and app configuration
│   ├── run.py                       # CLI entrypoint, DB init & auto-seeding
│   ├── requirements.txt             # Python dependencies
│   ├── .env                         # Local environment configuration
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── harish_kumar.jpg         # Profile photograph asset
│   ├── src/
│   │   ├── assets/
│   │   │   └── harish_kumar.jpg
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Responsive navbar with theme switch
│   │   │   ├── Hero.jsx             # Hero section featuring Harish's photograph
│   │   │   ├── About.jsx            # Biography, career goals & strengths
│   │   │   ├── Skills.jsx           # Categorized skills matrix with progress bars
│   │   │   ├── Projects.jsx         # Project showcase with category filters & search
│   │   │   ├── Education.jsx        # Academic timeline (M.Sc. Data Science)
│   │   │   ├── Certificates.jsx     # Credentials with verification links
│   │   │   ├── Contact.jsx          # Mobile, WhatsApp, email, & validated form
│   │   │   ├── Footer.jsx           # Footer with discreet Admin portal link
│   │   │   ├── Modal.jsx            # Glassmorphism modal for CRUD operations
│   │   │   └── Toast.jsx            # Floating notification provider
│   │   ├── layouts/
│   │   │   └── AdminLayout.jsx      # Admin sidebar and subpage layout
│   │   ├── pages/
│   │   │   ├── PublicPortfolio.jsx  # Main public page
│   │   │   ├── AdminLogin.jsx       # Secure login portal
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx     # Metrics & recent messages
│   │   │       ├── ProfileManager.jsx     # Edit bio, upload photo & resume
│   │   │       ├── ProjectsManager.jsx    # Projects CRUD + screenshot upload
│   │   │       ├── SkillsManager.jsx      # Skills CRUD by category
│   │   │       ├── EducationManager.jsx   # Degrees and colleges CRUD
│   │   │       ├── CertificatesManager.jsx# Certificates CRUD
│   │   │       └── MessagesManager.jsx    # Inbox with read/delete actions
│   │   ├── services/
│   │   │   └── api.js               # Centralized API service with auth headers
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Session state & protected route guards
│   │   ├── App.jsx                  # Main router setup
│   │   ├── main.jsx                 # React root mount
│   │   └── index.css                # Tailwind design system & animations
│   ├── index.html                   # HTML template with Google Fonts
│   ├── vite.config.js               # Dev server configuration & proxy
│   ├── tailwind.config.js           # Palette & animations configuration
│   ├── postcss.config.js
│   ├── package.json                 # Node dependencies
│   ├── .env                         # Frontend environment settings
│   └── .env.example
└── README.md
```

---

## Quick Start Guide (Windows PowerShell)

### Prerequisites
- **Python 3.10+** (Tested with Python 3.11.9)
- **Node.js 18+** & **npm** (Tested with Node v24.12.0, npm 11.7.0)

---

### Step 1: Set Up and Start the Flask Backend

Open PowerShell and navigate to the `backend` folder:

```powershell
cd C:\Users\DHASWEEN\OneDrive\Desktop\portfolio\backend

# 1. Create a Python virtual environment (if not already created)
python -m venv venv

# 2. Activate the virtual environment
.\venv\Scripts\Activate.ps1

# 3. Install required packages
pip install -r requirements.txt

# 4. Initialize database and populate default admin & sample data
python run.py seed-data

# 5. Start the backend development server
python run.py
```

The Flask API will run on **`http://127.0.0.1:5000`**.

> **Default Admin Account:**
> - **Username:** `harishuu`
> - **Password:** `harishuu07`
> *(Configured in `backend/.env`)*

---

### Step 2: Set Up and Start the React Frontend

Open a **second PowerShell window** and navigate to the `frontend` folder:

```powershell
cd C:\Users\DHASWEEN\OneDrive\Desktop\portfolio\frontend

# 1. Install Node.js dependencies
npm install

# 2. Start the Vite development server
npm run dev
```

The frontend will run on **`http://localhost:5173`**.

---

## Testing the Application

### 1. View the Public Portfolio
1. Open your browser and go to `http://localhost:5173/`.
2. Notice:
   - **Hero Section:** Harish Kumar's actual photo displayed with subtle borders and gradient halo glow.
   - **Titles:** *"Hi, I'm Harish Kumar"* and *"M.Sc. Data Science Student & Aspiring Developer"*.
   - **Direct Contact:** Mobile phone (`6380178269`), WhatsApp direct chat link, and email link.
   - **Theme Toggle:** Switch between Dark and Light theme smoothly with the sun/moon icon.
   - **Search & Filters:** Filter projects by category (Data Science, Machine Learning, Full-Stack Web) or use the search box.
   - **Contact Form:** Enter a name, email, and message; click **Send Message** to verify live submission.

### 2. Access the Admin Dashboard
1. Scroll down to the footer and click **Admin Access** (or navigate to `http://localhost:5173/admin/login`).
2. Log in using:
   - **Username:** `harishuu`
   - **Password:** `harishuu07`
3. You will be redirected to `/admin/dashboard`:
   - View real-time metric cards (Projects, Skills, Certificates, Education, Messages).
   - View recent inquiries from visitors.

### 3. Test CRUD Operations
- **Profile & Bio (`/admin/profile`):**
  - Update your bio, email, location, GitHub URL, or LinkedIn URL.
  - Upload a new photo or a new PDF resume.
  - Click **Save Changes** and refresh the public page to see immediate updates.
- **Projects Manager (`/admin/projects`):**
  - Click **New Project** to add a project with screenshots, description, and GitHub/Demo URLs.
  - Edit or delete projects with confirmation prompts.
- **Skills Matrix (`/admin/skills`):**
  - Add or adjust proficiency sliders across the 6 categories (Programming Languages, Data Science and ML, Frontend, Backend, Databases, Tools).
- **Education Records (`/admin/education`):**
  - Add institutions, graduation years, or honors for your M.Sc. Data Science and undergraduate records.
- **Certificates (`/admin/certificates`):**
  - Add certificates with issuers, dates, credential verification links, and badges.
- **Messages Inbox (`/admin/messages`):**
  - View messages submitted through the contact form, toggle Read/Unread status, or delete messages.

---

## Security & Production Readiness

1. **Authentication:** Uses JSON Web Tokens (JWT) signed with secret keys stored in `.env`.
2. **Password Storage:** Uses `werkzeug.security.generate_password_hash` with salted pbkdf2/scrypt hashing.
3. **Endpoint Protection:** All write and admin routes enforce `@jwt_required()`. Public visitors have read-only access.
4. **File Upload Hardening:** Strict whitelist for image extensions (`.png`, `.jpg`, `.jpeg`, `.webp`) and resume files (`.pdf`). File names are sanitized with `secure_filename` and prefixed with UUIDs to avoid directory traversal and collisions.
5. **CORS:** Controlled via the `CORS_ORIGINS` environment variable in `backend/.env`.
6. **Database Migration to PostgreSQL:** Because SQLAlchemy ORM is used, migrating from SQLite to PostgreSQL only requires changing the `DATABASE_URL` in `backend/.env`:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/portfolio_db
   ```
   No code modifications are required.

---

## Custom CLI Commands

The `backend/run.py` script provides management commands:

```powershell
# Initialize tables and default admin
python run.py init-db

# Reset and seed complete sample dataset matching M.Sc. Data Science profile
python run.py seed-data

# Interactively set or reset the admin password from the terminal
python run.py create-admin
```
