<<<<<<< HEAD
# 🚀 Deployment Guide

## Quick Start (Choose One Option)

### 🥇 **Option 1: Vercel (Recommended - Fastest)**

**Why Vercel?** Deploys both frontend + backend, free tier, automatic HTTPS, global CDN.

1. **Sign Up**: [vercel.com](https://vercel.com) (free)
2. **Install CLI**:
   ```bash
   npm install -g vercel
   ```
3. **Deploy**:
   ```bash
   vercel --prod
   ```
4. **Set Environment Variables** in Vercel dashboard:
   - `GOOGLE_PLACES_API_KEY` = your_api_key_here
   - `GOOGLE_GEOCODING_API_KEY` = your_api_key_here
   - `NODE_ENV` = production

**Result**: Live at `https://your-app.vercel.app` ✨

---

### 🥈 **Option 2: Railway (Full-Stack in One Place)**

**Why Railway?** Great for Node.js apps, automatic deployments, built-in database.

1. **Sign Up**: [railway.app](https://railway.app) (free)
2. **Connect GitHub**: Link your repository
3. **Deploy**: Railway auto-detects your app structure
4. **Set Environment Variables** in Railway dashboard:
   - `GOOGLE_PLACES_API_KEY` = your_api_key_here
   - `GOOGLE_GEOCODING_API_KEY` = your_api_key_here
   - `NODE_ENV` = production
   - `PORT` = (Railway sets this automatically)

**Result**: Live at `https://your-app.railway.app` 🚂

---

### 🥉 **Option 3: Netlify + Railway (Split Deployment)**

**Why Split?** Netlify excels at frontend, Railway handles backend.

#### **Frontend (Netlify)**
1. **Sign Up**: [netlify.com](https://netlify.com) (free)
2. **Connect GitHub**: Import your repository
3. **Build Settings**:
   - Build command: `cd client && npm run build`
   - Publish directory: `client/dist`
4. **Environment Variables**:
   - `VITE_API_URL` = your_railway_backend_url

#### **Backend (Railway)**
1. **Deploy server folder** to Railway
2. **Set Environment Variables**:
   - `GOOGLE_PLACES_API_KEY` = your_api_key_here
   - `CLIENT_URL` = your_netlify_frontend_url

---

## 🔧 **Local Testing Before Deployment**

```bash
# Build everything locally first
npm run build

# Test production build
cd client && npm run preview
cd server && npm start
```

---

## 🌐 **Share with Users**

Once deployed, share your URL:
- **Vercel**: `https://grocery-finder-abc123.vercel.app`
- **Railway**: `https://grocery-finder-production.railway.app`
- **Netlify**: `https://grocery-finder.netlify.app`

---

## 🔒 **Security Checklist**

✅ **API Keys**: Never commit API keys to GitHub
✅ **CORS**: Configure `CLIENT_URL` environment variable
✅ **Rate Limiting**: Already configured in your Express app
✅ **HTTPS**: All platforms provide automatic HTTPS

---

## 🐛 **Troubleshooting**

### **"API not found" Error**
- Check environment variables are set correctly
- Verify API URL in frontend matches backend deployment

### **Google API Errors**
- Ensure API keys have Places & Geocoding APIs enabled
- Check API quotas in Google Cloud Console
- Verify billing is enabled (required for production)

### **Build Failures**
```bash
# Clear cache and rebuild
rm -rf node_modules client/node_modules server/node_modules
npm run install:all
npm run build
```

---

## 💡 **Pro Tips**

- **Custom Domain**: All platforms support custom domains
- **Monitoring**: Use platform dashboards to monitor usage
- **Scaling**: Start with free tiers, upgrade as needed
=======
# 🚀 Deployment Guide

## Quick Start (Choose One Option)

### 🥇 **Option 1: Vercel (Recommended - Fastest)**

**Why Vercel?** Deploys both frontend + backend, free tier, automatic HTTPS, global CDN.

1. **Sign Up**: [vercel.com](https://vercel.com) (free)
2. **Install CLI**:
   ```bash
   npm install -g vercel
   ```
3. **Deploy**:
   ```bash
   vercel --prod
   ```
4. **Set Environment Variables** in Vercel dashboard:
   - `GOOGLE_PLACES_API_KEY` = your_api_key_here
   - `GOOGLE_GEOCODING_API_KEY` = your_api_key_here
   - `NODE_ENV` = production

**Result**: Live at `https://your-app.vercel.app` ✨

---

### 🥈 **Option 2: Railway (Full-Stack in One Place)**

**Why Railway?** Great for Node.js apps, automatic deployments, built-in database.

1. **Sign Up**: [railway.app](https://railway.app) (free)
2. **Connect GitHub**: Link your repository
3. **Deploy**: Railway auto-detects your app structure
4. **Set Environment Variables** in Railway dashboard:
   - `GOOGLE_PLACES_API_KEY` = your_api_key_here
   - `GOOGLE_GEOCODING_API_KEY` = your_api_key_here
   - `NODE_ENV` = production
   - `PORT` = (Railway sets this automatically)

**Result**: Live at `https://your-app.railway.app` 🚂

---

### 🥉 **Option 3: Netlify + Railway (Split Deployment)**

**Why Split?** Netlify excels at frontend, Railway handles backend.

#### **Frontend (Netlify)**
1. **Sign Up**: [netlify.com](https://netlify.com) (free)
2. **Connect GitHub**: Import your repository
3. **Build Settings**:
   - Build command: `cd client && npm run build`
   - Publish directory: `client/dist`
4. **Environment Variables**:
   - `VITE_API_URL` = your_railway_backend_url

#### **Backend (Railway)**
1. **Deploy server folder** to Railway
2. **Set Environment Variables**:
   - `GOOGLE_PLACES_API_KEY` = your_api_key_here
   - `CLIENT_URL` = your_netlify_frontend_url

---

## 🔧 **Local Testing Before Deployment**

```bash
# Build everything locally first
npm run build

# Test production build
cd client && npm run preview
cd server && npm start
```

---

## 🌐 **Share with Users**

Once deployed, share your URL:
- **Vercel**: `https://grocery-finder-abc123.vercel.app`
- **Railway**: `https://grocery-finder-production.railway.app`
- **Netlify**: `https://grocery-finder.netlify.app`

---

## 🔒 **Security Checklist**

✅ **API Keys**: Never commit API keys to GitHub
✅ **CORS**: Configure `CLIENT_URL` environment variable
✅ **Rate Limiting**: Already configured in your Express app
✅ **HTTPS**: All platforms provide automatic HTTPS

---

## 🐛 **Troubleshooting**

### **"API not found" Error**
- Check environment variables are set correctly
- Verify API URL in frontend matches backend deployment

### **Google API Errors**
- Ensure API keys have Places & Geocoding APIs enabled
- Check API quotas in Google Cloud Console
- Verify billing is enabled (required for production)

### **Build Failures**
```bash
# Clear cache and rebuild
rm -rf node_modules client/node_modules server/node_modules
npm run install:all
npm run build
```

---

## 💡 **Pro Tips**

- **Custom Domain**: All platforms support custom domains
- **Monitoring**: Use platform dashboards to monitor usage
- **Scaling**: Start with free tiers, upgrade as needed
>>>>>>> 27a6e46be65e2a293d71e9ab297d344d28b61e3a
- **Testing**: Share staging URLs before going live 