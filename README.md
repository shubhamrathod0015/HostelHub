# 🏨 Hostel Harmony - Full Stack Meal Management System

A comprehensive web application for managing hostel meals, built with React and Node.js. This system allows students to browse meals, make requests, write reviews, and manage subscriptions, while admins can manage users, meals, and view analytics.

## 📋 Project Overview

**Hostel Harmony** is a full-stack MERN application designed to streamline meal management in hostels. Students can browse available meals, request their favorites based on their subscription tier, and provide feedback through reviews. Administrators have powerful tools to manage users, approve meals, and monitor system analytics.

### 🎯 Problem It Solves

- **For Students:** Easy meal browsing, requesting, and feedback system
- **For Admins:** Centralized meal and user management with analytics
- **For Hostel Management:** Streamlined meal planning and student satisfaction tracking

## ✨ Key Features

### 🔐 Authentication & Authorization
- Email/Password and Google Sign-In
- JWT-based secure authentication
- Role-based access control (User/Admin)

### 🍽️ Meal Management
- Browse meals by category (Breakfast, Lunch, Dinner)
- Search and filter functionality
- Meal ratings and reviews
- Upcoming meals preview

### 💳 Subscription System
- 4 Tiers: Bronze (Free), Silver, Gold, Platinum
- Stripe payment integration
- Subscription-based meal requests

### 📊 Admin Dashboard
- User management (promote, delete)
- Meal approval system
- Analytics and statistics
- Review monitoring

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **TanStack Query** - Data fetching
- **Firebase** - Authentication
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authorization
- **Stripe** - Payments
- **CORS** - Cross-origin support

## 📁 Project Structure

```
Hostel/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── contexts/      # Context providers
│   │   └── routes/        # Route configuration
│   ├── .env               # Frontend environment variables
│   ├── package.json
│   └── README.md          # Frontend documentation
│
├── server/                # Backend Node.js application
│   ├── index.js          # Main server file
│   ├── .env              # Backend environment variables
│   ├── package.json
│   └── README.md         # Backend documentation
│
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v20.x or higher)
- npm
- MongoDB Atlas account
- Firebase project
- Stripe account (optional)

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd Hostel
```

#### 2. Setup Backend

```bash
cd server
npm install

# Create .env file
touch .env
```

Add to `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret
STRIPE_PK=your_stripe_secret_key
```

Start the server:
```bash
npm run dev
```

Server will run at `http://localhost:5000`

#### 3. Setup Frontend

```bash
cd ../client
npm install

# Create .env file
touch .env
```

Add to `client/.env`:
```env
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_databaseURL=your_firebase_database_url
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id
VITE_measurementId=your_firebase_measurement_id
VITE_API_URL=http://localhost:5000
```

Start the client:
```bash
npm run dev
```

Client will run at `http://localhost:5173`

## 📖 Detailed Documentation

For detailed setup instructions and API documentation:

- **Frontend Documentation:** [client/README.md](./client/README.md)
- **Backend Documentation:** [server/README.md](./server/README.md)

## 🎯 User Roles

### Regular User
- Browse and search meals
- Request meals (subscription-based)
- Write reviews and ratings
- Manage profile and subscriptions

### Admin
- All user features
- Manage users (promote to admin, delete)
- Add/edit/delete meals
- View analytics dashboard
- Manage reviews
- Add upcoming meals

## 🔑 Creating First Admin

Since admin role is stored in the database, you need to create the first admin manually:

1. Register a user through the application
2. Go to MongoDB Atlas
3. Find the user in the `users` collection
4. Add field: `"role": "admin"`
5. Save the document

After this, admins can promote other users through the UI.

## 🎓 For Interviews

### Project Highlights

**Architecture:**
- Full-stack MERN application with RESTful API
- Component-based React architecture
- JWT-based authentication and authorization
- MongoDB for flexible data storage

**Key Features:**
- Role-based access control
- Stripe payment integration
- Real-time rating system
- Subscription-based access
- Admin analytics dashboard

**Best Practices:**
- Environment variables for configuration
- Protected routes on both client and server
- Axios interceptors for token management
- Error handling and validation
- Responsive design with Tailwind CSS

**Challenges Solved:**
- Implemented secure authentication flow
- Created dynamic subscription system
- Built real-time rating calculations
- Handled concurrent meal requests
- Developed admin analytics

### Demo Flow for Interviews

1. **Show Authentication**
   - Register new user
   - Login with existing user
   - Demonstrate Google Sign-In

2. **User Features**
   - Browse meals by category
   - Search and filter meals
   - Request a meal
   - Write a review

3. **Admin Features**
   - Access admin dashboard
   - View analytics
   - Manage users
   - Add/edit meals

4. **Technical Aspects**
   - Show JWT token in localStorage
   - Demonstrate protected routes
   - Show API calls in Network tab
   - Explain subscription logic

## 🐛 Common Issues & Solutions

### Backend won't connect to MongoDB
- Check MongoDB URI format
- Verify network access in MongoDB Atlas
- Ensure database user has correct permissions

### Frontend can't reach backend
- Verify backend is running on port 5000
- Check `VITE_API_URL` in client `.env`
- Ensure CORS is enabled on backend

### Firebase authentication errors
- Enable Email/Password in Firebase Console
- Verify all Firebase credentials
- Check Firebase project is active

### Payment integration issues
- Verify Stripe key is correct
- Use test mode keys for development
- Check Stripe webhook configuration

## 📊 Database Collections

### users
- name, email, photoURL
- role (admin/user)
- subscription (Bronze/Silver/Gold/Platinum)
- createdAt

### meals
- title, category, image
- price, rating, likes
- distributor info
- ingredients, description

### reviews
- meal_id, user_id
- text, rating
- createdAt

### requests
- meal_id, user_id
- status (pending/delivered)
- createdAt

### payments
- email, amount
- package, date
- transactionId

## 🔒 Security Features

- JWT token expiration (1 hour)
- Password hashing (Firebase)
- Protected API endpoints
- CORS configuration
- Environment variable protection
- Role-based authorization

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in hosting platform
4. Update `VITE_API_URL` to production backend URL

### Backend (Vercel/Heroku/Railway)
1. Push code to Git repository
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

## 📝 Future Enhancements

- [ ] Real-time notifications
- [ ] Meal recommendation system
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Meal planning calendar
- [ ] Dietary preferences filter
- [ ] Multi-language support

## 👨‍💻 Developer

**Shubham Rathod**

## 📄 License

This project is for educational purposes.

---

## 🎉 Getting Started Checklist

- [ ] Clone repository
- [ ] Install Node.js
- [ ] Create MongoDB Atlas account
- [ ] Create Firebase project
- [ ] Setup backend `.env`
- [ ] Setup frontend `.env`
- [ ] Install backend dependencies
- [ ] Install frontend dependencies
- [ ] Start backend server
- [ ] Start frontend app
- [ ] Create first admin user
- [ ] Test the application

**Happy Coding! 🚀**
