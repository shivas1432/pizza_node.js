#  Pizza sort - Online Booking System

A complete online pizza ordering system built with Node.js, Express.js, and MongoDB. Features customer ordering, admin management, and real-time order tracking.

![Pizza Palace](https://img.shields.io/badge/Status-Production%20Ready-green)
![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)
![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey)

##  Features

###  Customer Features
- **User Registration & Authentication** - Secure login system
- **Browse Pizza Menu** - View pizzas by categories with search functionality
- **Shopping Cart** - Add/remove items, customize toppings and sizes
- **Online Ordering** - Place orders with delivery/pickup options
- **Order Tracking** - Real-time order status updates
- **Order History** - View past orders and reorder favorites
- **User Profile** - Manage personal information and addresses

### Admin Features
- **Dashboard** - Sales analytics and key metrics
- **Pizza Management** - Add, edit, delete pizzas and categories
- **Order Management** - View and update order statuses
- **Customer Management** - View customer information and order history
- **Sales Reports** - Detailed analytics and revenue reports
- **Inventory Tracking** - Monitor pizza availability

### Security Features
- **Password Hashing** - Bcrypt encryption
- **Session Management** - Secure user sessions
- **Input Validation** - Server-side validation with Joi
- **XSS Protection** - Helmet.js security headers
- **CSRF Protection** - Cross-site request forgery prevention
- **Rate Limiting** - API rate limiting protection

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/pizza-booking-system.git
cd pizza-booking-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
Edit `.env` file with your configuration:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/pizza_booking
SESSION_SECRET=your-super-secret-session-key
```

4. **Create required directories**
```bash
mkdir -p public/uploads/pizzas
mkdir -p storage/logs
mkdir -p storage/cache
```

5. **Seed the database** (optional)
```bash
npm run seed
```

6. **Start the application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
pizza-booking-system/
├── app.js                 # Main application file
├── server.js             # Server configuration
├── package.json          # Dependencies and scripts
│
├── config/               # Configuration files
│   ├── database.js      # Database config
│   └── app.js           # App configuration
│
├── controllers/          # Route controllers
│   ├── authController.js
│   ├── pizzaController.js
│   ├── orderController.js
│   └── adminController.js
│
├── models/              # Database models
│   ├── User.js
│   ├── Pizza.js
│   ├── Order.js
│   └── Category.js
│
├── routes/              # Route definitions
│   ├── index.js
│   ├── auth.js
│   ├── pizza.js
│   ├── order.js
│   └── admin.js
│
├── views/               # EJS templates
│   ├── layouts/         # Layout templates
│   ├── partials/        # Partial templates
│   ├── customer/        # Customer pages
│   ├── admin/           # Admin pages
│   └── auth/            # Authentication pages
│
├── public/              # Static files
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   ├── img/            # Images
│   └── uploads/        # User uploads
│
├── middlewares/         # Custom middlewares
│   ├── auth.js         # Authentication
│   ├── validation.js   # Input validation
│   └── errorHandler.js # Error handling
│
├── utils/              # Utility functions
│   ├── helpers.js
│   ├── validation.js
│   └── email.js
│
└── database/           # Database related
    ├── connection.js   # DB connection
    └── seeders/        # Database seeders
```

##  API Endpoints

### Authentication
- `GET /auth/login` - Login page
- `POST /auth/login` - Process login
- `GET /auth/register` - Registration page
- `POST /auth/register` - Process registration
- `POST /auth/logout` - Logout user

### Public Routes
- `GET /` - Homepage
- `GET /pizza` - Pizza menu
- `GET /pizza/:id` - Pizza details
- `GET /about` - About page
- `GET /contact` - Contact page

### Customer Routes
- `GET /order/cart` - View shopping cart
- `POST /order/cart/add` - Add item to cart
- `DELETE /order/cart/:id` - Remove from cart
- `GET /order/checkout` - Checkout page
- `POST /order/place` - Place order
- `GET /order/history` - Order history
- `GET /order/:id` - Order details

### Admin Routes (Protected)
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/pizzas` - Manage pizzas
- `GET /admin/orders` - Manage orders
- `GET /admin/customers` - Manage customers
- `GET /admin/reports` - Sales reports

### API Routes
- `GET /api/pizzas` - Get all pizzas
- `GET /api/pizzas