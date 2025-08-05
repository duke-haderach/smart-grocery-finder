<<<<<<< HEAD
# Smart Grocery Finder

Find the shortest, healthiest, and cheapest grocery stores for any item by zipcode using real-time data from Google Places API.

## ✨ Features

- **Real-Time Data**: Integrates with Google Places API for live grocery store information
- **Smart Recommendations**: Finds the closest, healthiest, and most affordable options
- **Advanced Scoring**: Intelligent algorithms that consider distance, health factors, and pricing
- **Interactive Maps**: Visual location display with Leaflet maps
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Fallback System**: Uses local database when API limits are reached

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Query** for server state management
- **React Router v6** for navigation
- **Framer Motion** for animations
- **Leaflet & React Leaflet** for interactive maps

### Backend (Node.js + Express)
- **Express.js** REST API
- **SQLite** with better-sqlite3 for local data storage
- **Google Places API** integration for real-time store data
- **Google Geocoding API** for zipcode resolution
- **Intelligent caching** to optimize API usage
- **TypeScript** for type safety

### APIs Used
- **Google Places API (New)**: For real-time grocery store search
- **Google Geocoding API**: For zipcode to coordinates conversion
- **Fallback database**: Local SQLite for offline capability

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Cloud Platform account with Places and Geocoding APIs enabled

### 1. Get Google API Keys

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Places API (New)
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to these APIs for security

### 2. Clone and Install

```bash
git clone <repository-url>
cd smart-grocery-finder
npm run install:all
```

### 3. Configure Environment Variables

```bash
# In the server directory
cd server
cp .env.example .env
```

Edit `.env` file:
```bash
# Google APIs Configuration
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
GOOGLE_GEOCODING_API_KEY=your_google_geocoding_api_key_here

# Or use a single key for both APIs
GOOGLE_API_KEY=your_google_api_key_here

# Other settings
PORT=5000
CLIENT_URL=http://localhost:3000
```

### 4. Run the Application

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run dev:client   # Frontend only (http://localhost:3000)
npm run dev:server   # Backend only (http://localhost:5000)
```

## 🧠 How It Works

### 1. User Input
- Enter zipcode and grocery item
- Form validation ensures data quality

### 2. Real-Time Data Fetching
- **Geocoding**: Convert zipcode to coordinates using Google Geocoding API
- **Store Search**: Find nearby grocery stores using Google Places API
- **Fallback**: Use local database if API limits reached

### 3. Intelligent Scoring

#### Health Score (1-10)
- **Organic stores**: Whole Foods, Natural Markets (9-10)
- **Premium stores**: Harris Teeter, Wegmans (8)
- **Standard chains**: Kroger, Safeway (6-7)
- **Budget stores**: Walmart, Aldi (5-6)

#### Price Score (1-10)
- **Budget stores**: Walmart, Aldi, WinCo (8-10)
- **Warehouse clubs**: Costco, Sam's Club (8)
- **Standard chains**: Kroger, Safeway (6)
- **Premium stores**: Whole Foods, Fresh Market (3-5)

#### Distance Calculation
- Uses Haversine formula for accurate distance
- Filters stores within 25-mile radius

### 4. Smart Recommendations

#### Shortest Distance
- Purely based on geographic proximity
- Ideal for quick trips

#### Healthiest Option
- Weighted algorithm:
  - Health score (60%)
  - Customer rating (25%)
  - Organic/natural bonus (10%)
  - Distance penalty (5%)

#### Cheapest Option
- Weighted algorithm:
  - Price score (70%)
  - Customer rating (15%)
  - Distance penalty (10%)
  - Budget store bonus (5%)

## 🗂️ Project Structure

```
smart-grocery-finder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript definitions
│   │   └── styles/         # Global styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── database/       # Database setup and queries
│   │   └── types/          # TypeScript definitions
│   ├── data/               # SQLite database
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### GET `/api/grocery/search`
Search for grocery stores

**Parameters:**
- `zipcode` (string): US zipcode (e.g., "10001")
- `item` (string): Grocery item name

**Response:**
```json
{
  "success": true,
  "data": {
    "shortest": { /* GroceryStore */ },
    "healthiest": { /* GroceryStore */ },
    "cheapest": { /* GroceryStore */ },
    "searchedItem": "bananas",
    "userLocation": {
      "latitude": 40.7505,
      "longitude": -73.9934,
      "zipcode": "10001",
      "city": "New York",
      "state": "NY"
    }
  }
}
```

### GET `/api/grocery/store/:storeId`
Get detailed store information

### GET `/api/health`
Health check endpoint

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_PLACES_API_KEY` | Google Places API key | Yes* |
| `GOOGLE_GEOCODING_API_KEY` | Google Geocoding API key | Yes* |
| `GOOGLE_API_KEY` | Single Google API key for both services | Yes* |
| `PORT` | Server port (default: 5000) | No |
| `CLIENT_URL` | Frontend URL for CORS | No |
| `NODE_ENV` | Environment (development/production) | No |

*At least one Google API key is required for real-time data

### API Rate Limits & Costs

- **Google Places API**: Text Search requests
- **Google Geocoding API**: Geocoding requests
- **Caching**: Reduces repeated API calls
- **Fallback**: Local database prevents service interruption

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start both frontend and backend
npm run dev:client   # Start frontend only
npm run dev:server   # Start backend only
npm run build        # Build frontend for production
npm run install:all  # Install all dependencies
```

### Database

The app uses SQLite for:
- Fallback store data when APIs are unavailable
- Caching geocoding results
- Sample data for testing

Database is automatically created and seeded on first run.

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the `dist/` folder
3. Set environment variable for API URL

### Backend (Railway/Heroku)
1. Set environment variables in hosting platform
2. Ensure Google API keys are configured
3. Database will be created automatically

### Environment Variables for Production
```bash
GOOGLE_PLACES_API_KEY=your_production_api_key
GOOGLE_GEOCODING_API_KEY=your_production_api_key
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🔒 Security

- API keys are server-side only
- Input validation on all endpoints
- Rate limiting enabled
- CORS configured for security
- SQL injection protection

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter issues:

1. **API Errors**: Verify Google API keys are valid and APIs are enabled
2. **No Results**: Try different zipcodes or check API quotas
3. **Build Errors**: Ensure Node.js 18+ is installed
4. **Network Issues**: Check firewall settings for API access

For additional help, please open an issue on GitHub.

---

=======
# Smart Grocery Finder

Find the shortest, healthiest, and cheapest grocery stores for any item by zipcode using real-time data from Google Places API.

## ✨ Features

- **Real-Time Data**: Integrates with Google Places API for live grocery store information
- **Smart Recommendations**: Finds the closest, healthiest, and most affordable options
- **Advanced Scoring**: Intelligent algorithms that consider distance, health factors, and pricing
- **Interactive Maps**: Visual location display with Leaflet maps
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Fallback System**: Uses local database when API limits are reached

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Query** for server state management
- **React Router v6** for navigation
- **Framer Motion** for animations
- **Leaflet & React Leaflet** for interactive maps

### Backend (Node.js + Express)
- **Express.js** REST API
- **SQLite** with better-sqlite3 for local data storage
- **Google Places API** integration for real-time store data
- **Google Geocoding API** for zipcode resolution
- **Intelligent caching** to optimize API usage
- **TypeScript** for type safety

### APIs Used
- **Google Places API (New)**: For real-time grocery store search
- **Google Geocoding API**: For zipcode to coordinates conversion
- **Fallback database**: Local SQLite for offline capability

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Cloud Platform account with Places and Geocoding APIs enabled

### 1. Get Google API Keys

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Places API (New)
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to these APIs for security

### 2. Clone and Install

```bash
git clone <repository-url>
cd smart-grocery-finder
npm run install:all
```

### 3. Configure Environment Variables

```bash
# In the server directory
cd server
cp .env.example .env
```

Edit `.env` file:
```bash
# Google APIs Configuration
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
GOOGLE_GEOCODING_API_KEY=your_google_geocoding_api_key_here

# Or use a single key for both APIs
GOOGLE_API_KEY=your_google_api_key_here

# Other settings
PORT=5000
CLIENT_URL=http://localhost:3000
```

### 4. Run the Application

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run dev:client   # Frontend only (http://localhost:3000)
npm run dev:server   # Backend only (http://localhost:5000)
```

## 🧠 How It Works

### 1. User Input
- Enter zipcode and grocery item
- Form validation ensures data quality

### 2. Real-Time Data Fetching
- **Geocoding**: Convert zipcode to coordinates using Google Geocoding API
- **Store Search**: Find nearby grocery stores using Google Places API
- **Fallback**: Use local database if API limits reached

### 3. Intelligent Scoring

#### Health Score (1-10)
- **Organic stores**: Whole Foods, Natural Markets (9-10)
- **Premium stores**: Harris Teeter, Wegmans (8)
- **Standard chains**: Kroger, Safeway (6-7)
- **Budget stores**: Walmart, Aldi (5-6)

#### Price Score (1-10)
- **Budget stores**: Walmart, Aldi, WinCo (8-10)
- **Warehouse clubs**: Costco, Sam's Club (8)
- **Standard chains**: Kroger, Safeway (6)
- **Premium stores**: Whole Foods, Fresh Market (3-5)

#### Distance Calculation
- Uses Haversine formula for accurate distance
- Filters stores within 25-mile radius

### 4. Smart Recommendations

#### Shortest Distance
- Purely based on geographic proximity
- Ideal for quick trips

#### Healthiest Option
- Weighted algorithm:
  - Health score (60%)
  - Customer rating (25%)
  - Organic/natural bonus (10%)
  - Distance penalty (5%)

#### Cheapest Option
- Weighted algorithm:
  - Price score (70%)
  - Customer rating (15%)
  - Distance penalty (10%)
  - Budget store bonus (5%)

## 🗂️ Project Structure

```
smart-grocery-finder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript definitions
│   │   └── styles/         # Global styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── database/       # Database setup and queries
│   │   └── types/          # TypeScript definitions
│   ├── data/               # SQLite database
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### GET `/api/grocery/search`
Search for grocery stores

**Parameters:**
- `zipcode` (string): US zipcode (e.g., "10001")
- `item` (string): Grocery item name

**Response:**
```json
{
  "success": true,
  "data": {
    "shortest": { /* GroceryStore */ },
    "healthiest": { /* GroceryStore */ },
    "cheapest": { /* GroceryStore */ },
    "searchedItem": "bananas",
    "userLocation": {
      "latitude": 40.7505,
      "longitude": -73.9934,
      "zipcode": "10001",
      "city": "New York",
      "state": "NY"
    }
  }
}
```

### GET `/api/grocery/store/:storeId`
Get detailed store information

### GET `/api/health`
Health check endpoint

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_PLACES_API_KEY` | Google Places API key | Yes* |
| `GOOGLE_GEOCODING_API_KEY` | Google Geocoding API key | Yes* |
| `GOOGLE_API_KEY` | Single Google API key for both services | Yes* |
| `PORT` | Server port (default: 5000) | No |
| `CLIENT_URL` | Frontend URL for CORS | No |
| `NODE_ENV` | Environment (development/production) | No |

*At least one Google API key is required for real-time data

### API Rate Limits & Costs

- **Google Places API**: Text Search requests
- **Google Geocoding API**: Geocoding requests
- **Caching**: Reduces repeated API calls
- **Fallback**: Local database prevents service interruption

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start both frontend and backend
npm run dev:client   # Start frontend only
npm run dev:server   # Start backend only
npm run build        # Build frontend for production
npm run install:all  # Install all dependencies
```

### Database

The app uses SQLite for:
- Fallback store data when APIs are unavailable
- Caching geocoding results
- Sample data for testing

Database is automatically created and seeded on first run.

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the `dist/` folder
3. Set environment variable for API URL

### Backend (Railway/Heroku)
1. Set environment variables in hosting platform
2. Ensure Google API keys are configured
3. Database will be created automatically

### Environment Variables for Production
```bash
GOOGLE_PLACES_API_KEY=your_production_api_key
GOOGLE_GEOCODING_API_KEY=your_production_api_key
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🔒 Security

- API keys are server-side only
- Input validation on all endpoints
- Rate limiting enabled
- CORS configured for security
- SQL injection protection

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter issues:

1. **API Errors**: Verify Google API keys are valid and APIs are enabled
2. **No Results**: Try different zipcodes or check API quotas
3. **Build Errors**: Ensure Node.js 18+ is installed
4. **Network Issues**: Check firewall settings for API access

For additional help, please open an issue on GitHub.

---

>>>>>>> 27a6e46be65e2a293d71e9ab297d344d28b61e3a
**Smart Grocery Finder** - Making grocery shopping smarter, one search at a time! 🛒✨ 