# EcoFinds - Sustainable Second-Hand Marketplace

A full-stack web application for buying and selling second-hand products, built with React, Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: Register, login, and profile management with JWT
- **Product Management**: Create, edit, delete, and browse products
- **Shopping Cart**: Add items to cart and manage quantities
- **Purchase System**: Checkout process and order history
- **Search & Filters**: Find products by category, price, and keywords
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- React 18
- TailwindCSS
- React Router
- Axios
- Heroicons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## 📁 Project Structure

```
ecofinds/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (Auth)
│   │   ├── utils/          # API utilities
│   │   └── App.js
│   └── package.json
├── backend/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   └── server.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecofinds
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecofinds?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the Backend Server**
   ```bash
   npm run dev
   ```

5. **Set up the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

6. **Configure Frontend Environment**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

7. **Start the Frontend Development Server**
   ```bash
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🌐 Deployment

### Backend Deployment (Render)

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Configure the service:**
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment Variables:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_jwt_secret
     NODE_ENV=production
     ```

### Frontend Deployment (Vercel)

1. **Connect your GitHub repository to Vercel**
2. **Configure the project:**
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Environment Variables:
     ```
     REACT_APP_API_URL=https://your-backend-url.onrender.com/api
     ```

### Database Setup (MongoDB Atlas)

1. **Create a MongoDB Atlas account**
2. **Create a new cluster**
3. **Create a database user**
4. **Whitelist your IP address**
5. **Get your connection string**
6. **Update your environment variables**

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/user/:userId` - Get user's products

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Purchases
- `POST /api/purchases/checkout` - Checkout cart
- `GET /api/purchases/history` - Get purchase history
- `GET /api/purchases/sales` - Get sales history
- `GET /api/purchases/:id` - Get purchase details

## 🎨 UI Components

- **Navbar**: Navigation with authentication state
- **ProductCard**: Product display component
- **SearchBar**: Product search functionality
- **CategoryFilter**: Category selection dropdown
- **ProtectedRoute**: Route protection for authenticated users

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT token is stored in localStorage
3. Token is sent with each API request
4. Protected routes check authentication status
5. Token expiration triggers automatic logout

## 🛒 Shopping Flow

1. Browse products with search and filters
2. Add items to cart
3. Review cart and adjust quantities
4. Proceed to checkout
5. Complete purchase
6. View order history

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Future Enhancements

- Image upload functionality
- Real-time notifications
- Advanced search with filters
- Product reviews and ratings
- Payment integration
- Email notifications
- Admin dashboard
- Product recommendations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Happy coding! 🌱**
