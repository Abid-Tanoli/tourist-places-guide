# Tourist Places Guide - MERN Stack

React + Vite frontend connected to a Node.js, Express.js, MongoDB, and Mongoose backend.

## Installation

```bash
npm run install:all
```

Create environment files:

```powershell
Copy-Item .env.example .env
Copy-Item Backend/.env.example Backend/.env
Copy-Item Frontend/User/.env.example Frontend/User/.env
Copy-Item Frontend/Admin/.env.example Frontend/Admin/.env
```

## MongoDB Setup

Install and start MongoDB locally, then use this connection string in `Backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/tourist_places_guide
```

## Environment Variables

### Backend (Backend/.env)

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/tourist_places_guide
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
USER_CLIENT_URL=http://localhost:5173
ADMIN_CLIENT_URL=http://localhost:5174
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### Frontend (Frontend/User/.env and Frontend/Admin/.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## Seed Data

```bash
npm run seed
```

To clear seeded data:

```bash
cd Backend; npm run seed:destroy
```

Default credentials after seeding:
- **Admin:** admin@example.com / admin123
- **User:** user@example.com / user123

## Run Commands

```bash
npm run dev          # Start all (backend + user + admin)
npm run backend      # Backend only
npm run user         # User frontend only
npm run admin        # Admin frontend only
```

## Project Structure

```
tourist-places-guide/
├── Backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   ├── cloudinary.js      # Cloudinary + Multer config
│   │   └── middleware.js       # Security middleware setup
│   ├── controllers/
│   │   ├── authController.js   # Auth, profiles, wishlist
│   │   ├── placeController.js  # Place CRUD + search/nearby
│   │   ├── tourController.js   # Tour CRUD
│   │   ├── bookingController.js# Booking management
│   │   ├── feedbackController.js
│   │   ├── categoryController.js
│   │   ├── regionController.js
│   │   └── reviewController.js # Reviews + replies + likes
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT protect + admin
│   │   ├── errorMiddleware.js  # Error handler
│   │   └── validateRequest.js  # Express validator
│   ├── models/
│   │   ├── User.js
│   │   ├── Place.js
│   │   ├── Tour.js
│   │   ├── Booking.js
│   │   ├── Feedback.js
│   │   ├── Category.js
│   │   ├── Region.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── placeRoutes.js
│   │   ├── tourRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── feedbackRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── regionRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── uploadRoutes.js
│   ├── seed/
│   │   ├── seed.js
│   │   ├── placesData.js
│   │   ├── toursData.js
│   │   └── constants.js
│   ├── utils/
│   │   └── crypto.js          # CNIC/Passport encryption
│   ├── server.js
│   └── package.json
├── Frontend/
│   ├── User/
│   │   └── src/
│   │       ├── api/axios.js
│   │       ├── components/
│   │       ├── layouts/UserLayout.jsx
│   │       └── pages/
│   └── Admin/
│       └── src/
│           ├── api/axios.js
│           ├── layouts/AdminLayout.jsx
│           ├── pages/admin/
│           ├── routes/ProtectedAdminRoute.jsx
│           └── utils/auth.js
├── package.json
└── README.md
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Refresh JWT
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Forgot password
- `PUT /api/auth/reset-password/:token` - Reset password
- `POST /api/auth/wishlist/:placeId` - Toggle wishlist
- `GET /api/auth/dashboard-stats` - Admin dashboard stats

### Places
- `GET /api/places` - List published places
- `GET /api/places/manage` - List all places (admin)
- `GET /api/places/featured` - Featured places
- `GET /api/places/nearby?lat=&lng=&radius=` - Nearby places
- `GET /api/places/:id` - Get place
- `POST /api/places` - Create (admin)
- `PUT /api/places/:id` - Update (admin)
- `DELETE /api/places/:id` - Delete (admin)

### Tours
- `GET /api/tours` - List published tours
- `GET /api/tours/manage` - List all tours (admin)
- `GET /api/tours/:id` - Get tour
- `POST /api/tours` - Create (admin)
- `PUT /api/tours/:id` - Update (admin)
- `DELETE /api/tours/:id` - Delete (admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - List all (admin)
- `GET /api/bookings/:id` - Get booking (admin)
- `PUT /api/bookings/:id/status` - Update status (admin)
- `DELETE /api/bookings/:id` - Delete (admin)

### Reviews
- `GET /api/reviews` - List reviews
- `GET /api/reviews/place/:placeId` - Reviews by place
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id/status` - Update status (admin)
- `POST /api/reviews/:id/reply` - Add reply (admin)
- `POST /api/reviews/:id/like` - Like review
- `DELETE /api/reviews/:id` - Delete (admin)

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create (admin)
- `PUT /api/categories/:id` - Update (admin)
- `DELETE /api/categories/:id` - Delete (admin)

### Regions
- `GET /api/regions` - List regions
- `POST /api/regions` - Create (admin)
- `PUT /api/regions/:id` - Update (admin)
- `DELETE /api/regions/:id` - Delete (admin)

### Upload
- `POST /api/upload/image` - Upload single image (Cloudinary)
- `POST /api/upload/images` - Upload multiple images
- `POST /api/upload/avatar` - Upload avatar

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - List feedback
- `DELETE /api/feedback/:id` - Delete (admin)

## Security Features

- Helmet security headers
- CORS with credentials
- Rate limiting (200 req/15min general, 15 req/15min auth)
- JWT with refresh tokens (httpOnly cookies)
- Password hashing with bcrypt
- CNIC/Passport encryption (AES-256-CBC)
- Input validation with Express Validator
- Compression

## Tech Stack

- React 19 + Vite
- React Router v7
- Tailwind CSS v4
- Leaflet + React Leaflet (maps)
- Axios
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (access + refresh tokens)
- Cloudinary + Multer
- Helmet, Compression, Cookie Parser
