# WanderNepal

A personalized travel and tourism web platform for exploring Nepal — browse destinations, view tour packages, plan custom itineraries, and manage content through an admin panel.

---

## Team — L5CG3 (Group F)

| Role | Name |
|---|---|
| Project Manager | Aayush Mishra |
| Business Analyst | Melisha Thapa |
| Developer 1 | Kritika Yadav |
| Developer 2 | Ankit Chaudhary |
| Developer 3 | Kobid Nepal |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Backend | PHP (REST API, no framework) |
| Database | MySQL via XAMPP |
| Auth | JWT (JSON Web Tokens) |

---

## Project Structure

```
src/
├── api/                          # Legacy fallback data (Sprint 1 only)
├── components/                   # Shared UI — Navbar, Footer
├── features/
│   ├── auth/
│   │   ├── pages/                # LoginPage, RegisterPage
│   │   └── services/             # authService.js
│   ├── traveler/
│   │   ├── pages/                # HomePage, Destinations, Packages, Booking, Dashboard, Planner
│   │   └── services/             # destinationService.js, packageService.js
│   └── admin/
│       ├── pages/                # AdminPage
│       └── components/           # DestinationsTable, PackagesTable (full CRUD)
└── pages/                        # LandingPage

wanderNepal/api/
├── auth/                         # login.php, register.php
├── config/                       # db.php, cors.php, jwt.php
├── destinations/                 # index.php (GET/POST), single.php (GET/PUT/DELETE)
├── middleware/                   # auth.php — JWT verification
└── packages/                     # index.php (GET/POST), single.php (GET/PUT/DELETE)
```

---

## Getting Started

### Prerequisites
- [XAMPP](https://www.apachefriends.org/) with Apache and MySQL running
- [Node.js](https://nodejs.org/) v18+

### 1. Backend Setup

1. Copy the `wanderNepal/` folder into your XAMPP `htdocs/` directory
2. Open **phpMyAdmin** at `http://localhost/phpmyadmin`
3. Create a database named `wanderNepal`
4. Run `packages_setup.sql` to create tables and seed data

### 2. Frontend Setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Features — Sprint 1

### Traveler
| Feature | Status |
|---|---|
| Landing page with role selection |  Done |
| Register / Login with JWT auth | Done |
| Browse destinations (search + category filter) |  Done |
| Destination detail with map and related packages |  Done |
| Browse packages (keyword search) |  Done |
| Package detail with itinerary accordion and cost estimator |  Done |
| Custom itinerary planner |  Done |
| Booking form |  Sprint 2 (UI visible, disabled) |
| My Bookings dashboard |  Sprint 2 (UI visible, disabled) |
| Reviews |  Sprint 2 |

### Admin
| Feature | Status |
|---|---|
| Admin login (role-restricted) |  Done |
| Destinations CRUD |  Done |
| Packages CRUD |  Done |
| Route guard (non-admins redirected) |  Done |

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register.php` | Register new user |
| POST | `/auth/login.php` | Login, returns JWT |

### Destinations
| Method | Endpoint | Description |
|---|---|---|
| GET | `/destinations/index.php` | List all |
| GET | `/destinations/single.php?id=:id` | Get one |
| POST | `/destinations/index.php` | Create (admin) |
| PUT | `/destinations/single.php?id=:id` | Update (admin) |
| DELETE | `/destinations/single.php?id=:id` | Delete (admin) |

### Packages
| Method | Endpoint | Description |
|---|---|---|
| GET | `/packages/index.php` | List all |
| GET | `/packages/single.php?id=:id` | Get one |
| POST | `/packages/index.php` | Create (admin) |
| PUT | `/packages/single.php?id=:id` | Update (admin) |
| DELETE | `/packages/single.php?id=:id` | Delete (admin) |

---

## Sprint 2 — Planned
- Online booking submission and confirmation
- Destination reviews and ratings
- Server-side itinerary persistence
