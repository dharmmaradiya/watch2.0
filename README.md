# TIMEORA - Luxury Watch E-Commerce Website

A premium, full-stack luxury watch e-commerce website built with React, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Register, Login, JWT-based authentication
- **Product Management**: Browse, search, filter, and sort luxury watches
- **Shopping Cart**: Add to cart, update quantities, remove items
- **Wishlist**: Save favorite watches for later
- **Checkout**: Complete order placement with shipping details
- **User Profile**: View order history, update profile information
- **Admin Panel**: 
  - Dashboard with statistics
  - Product CRUD operations
  - Category management
  - Order management
  - User management
- **Reviews**: Customer reviews and ratings
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Premium UI**: Luxury design with gold accents, elegant typography

## Tech Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Bootstrap 5
- React Bootstrap
- Bootstrap Icons
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- dotenv
- multer (for image uploads)
- CORS

## Project Structure

```
luxury-watch-store/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components (Header, Footer, ProductCard)
│   │   ├── pages/           # Page components (Home, ProductDetails, Cart, etc.)
│   │   ├── pages/admin/     # Admin panel pages
│   │   ├── layouts/         # Layout components (MainLayout)
│   │   ├── context/         # React Context (Auth, Cart, Wishlist)
│   │   ├── services/        # API service
│   │   ├── assets/          # Static assets
│   │   ├── App.jsx          # Main App component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── .env
└── backend/
    ├── config/
    │   └── db.js            # MongoDB connection
    ├── controllers/         # Route controllers
    ├── models/              # Mongoose models
    ├── routes/              # API routes
    ├── middleware/          # Custom middleware
    ├── uploads/             # Uploaded product images
    ├── server.js            # Express server
    ├── seed.js              # Seed data script
    ├── package.json
    └── .env
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

### 1. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database named `luxury_watch_store`
5. Get your connection string from Atlas
6. Replace `USERNAME`, `PASSWORD`, and `CLUSTER` in the connection string

Example connection string:
```
mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/luxury_watch_store
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Configure environment variables:

Edit `.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/luxury_watch_store
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

Run the seed script to populate the database with demo data:

```bash
npm run seed
```

This will create:
- 1 admin user
- 6 categories
- 20 demo products

**Admin Login Details:**
- Email: `admin@timeora.com`
- Password: `admin123`

Start the backend server:

```bash
npm run dev
```

Or for production:

```bash
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

The frontend `.env` file is already configured:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products

- `GET /api/products` - Get all products (with search, filter, sort)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrivals
- `GET /api/products/bestsellers` - Get best sellers
- `GET /api/products/trending` - Get trending products

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Cart

- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Wishlist

- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/:id` - Remove item from wishlist

### Orders

- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders/all` - Get all orders (admin only)
- `PUT /api/orders/:id` - Update order status (admin only)
- `GET /api/orders/stats` - Get order statistics (admin only)

### Reviews

- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `DELETE /api/reviews/:id` - Delete review

### Users (Admin)

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get single user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)
- `GET /api/users/stats` - Get user statistics (admin only)

## API Testing Examples (Thunder Client)

### Register User

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Products

```http
GET http://localhost:5000/api/products
```

### Get Products with Filters

```http
GET http://localhost:5000/api/products?search=chronograph&minPrice=20000&maxPrice=50000&sort=price-low
```

### Add to Cart

```http
POST http://localhost:5000/api/cart
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "productId": "PRODUCT_ID",
  "quantity": 1
}
```

### Create Order

```http
POST http://localhost:5000/api/orders
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "products": [
    {
      "product": "PRODUCT_ID",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "COD"
}
```

## Demo Data

The seed script creates the following demo data:

### Brands
- AUREL
- CHRONOVA
- VELORA
- NEXUS
- ORION
- ELITE

### Categories
- Automatic Watches
- Chronograph Watches
- Men's Watches
- Women's Watches
- Smart Watches
- Premium Watches

### Products
20 luxury watches with various:
- Price ranges (₹18,000 - ₹150,000)
- Categories
- Brands
- Specifications (case material, strap, movement, etc.)
- Ratings (4.3 - 5.0)
- Stock levels
- Featured/Trending/Bestseller tags

## Admin Panel Features

### Dashboard
- Total users count
- Total products count
- Total orders count
- Total revenue
- Recent orders list
- Quick action buttons

### Product Management
- Add new products with image upload
- Edit existing products
- Delete products
- Update stock levels
- Set product tags (Featured, Trending, Bestseller, New Arrival)

### Category Management
- Add new categories
- Edit categories
- Delete categories
- Activate/deactivate categories

### Order Management
- View all orders
- View order details
- Update order status (Processing, Shipped, Delivered, Cancelled)
- Update payment status (Pending, Paid, Failed)

### User Management
- View all users
- Edit user details
- Change user roles (User/Admin)
- Delete users

## Design Features

- **Premium Color Palette**: Black, white, gold accents, beige/tan sections
- **Typography**: Playfair Display for headings, Montserrat for body text
- **Responsive**: Mobile-first design, works on all devices
- **Animations**: Smooth hover effects, fade-ins, image zoom
- **Components**:
  - Sticky navbar with announcement bar
  - Hero carousel with 3 banners
  - Category cards with hover effects
  - Product cards with wishlist and quick view
  - Premium footer with newsletter signup

## Deployment

### Backend Deployment (e.g., Render, Heroku)

1. Push code to GitHub
2. Connect your repository to deployment platform
3. Set environment variables in deployment platform
4. Deploy

### Frontend Deployment (e.g., Vercel, Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to your hosting platform
3. Set environment variable `VITE_API_URL` to your backend URL

## Troubleshooting

### MongoDB Connection Issues
- Ensure your MongoDB Atlas IP whitelist allows connections from your IP
- Check that your connection string is correct
- Verify database name matches

### CORS Issues
- Ensure backend CORS is configured correctly
- Check that frontend API URL matches backend URL

### Image Upload Issues
- Ensure `uploads` directory exists in backend
- Check multer configuration
- Verify file size limits (max 5MB)

### Authentication Issues
- Clear browser localStorage
- Verify JWT_SECRET is set in backend .env
- Check token expiration (30 days)

## License

This project is for educational purposes.

## Support

For issues or questions, please refer to the code comments or contact the development team.
#   w a t c h  
 