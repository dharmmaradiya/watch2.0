# Deployment Guide - TIMEORA Luxury Watch Store

## Prerequisites
- GitHub account
- Vercel account (for frontend)
- Render account (for backend)
- MongoDB Atlas account (for database)

---

## Step 1: Deploy Backend (Render)

### 1. Push Code to GitHub
```bash
cd D:\watch\luxury-watch-store
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/luxury-watch-store.git
git push -u origin main
```

### 2. Deploy to Render
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `backend` folder as root directory
5. Configure:
   - **Name**: timeora-backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate a random secret key
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
7. Click "Deploy Web Service"
8. Wait for deployment - you'll get a URL like: `https://timeora-backend.onrender.com`

---

## Step 2: Deploy Frontend (Vercel)

### 1. Update Backend URL
Edit `frontend/.env.production`:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```
Replace with your actual Render backend URL.

### 2. Deploy to Vercel
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL`: Your Render backend URL
6. Click "Deploy"
7. Wait for deployment - you'll get a URL like: `https://timeora-frontend.vercel.app`

---

## Step 3: Verify Deployment

1. Open your frontend URL in browser
2. Check if products are loading
3. Test login/register functionality
4. Test cart and checkout

---

## Environment Variables Reference

### Backend (Render)
- `MONGO_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Random secret for JWT tokens
- `NODE_ENV`: production
- `PORT`: 5000

### Frontend (Vercel)
- `VITE_API_URL`: Your backend API URL

---

## MongoDB Atlas Setup (if not already done)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP: 0.0.0.0/0 (allows all IPs)
5. Get connection string and use as `MONGO_URI`

---

## Troubleshooting

### Frontend not loading products
- Check `VITE_API_URL` is correct in Vercel settings
- Verify backend is running on Render
- Check browser console for CORS errors

### Backend not connecting to database
- Verify `MONGO_URI` is correct in Render settings
- Check MongoDB Atlas whitelist settings
- Check Render logs for connection errors

### Images not loading
- Ensure uploads folder exists in backend
- Check if images are being served correctly from backend
