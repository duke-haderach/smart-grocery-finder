import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../../data/stores.db');
let db;
export function getDatabase() {
    if (!db) {
        throw new Error('Database not initialized. Call setupDatabase() first.');
    }
    return db;
}
export async function setupDatabase() {
    try {
        // Ensure data directory exists
        const dataDir = path.dirname(dbPath);
        await import('fs').then(fs => {
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
        });
        db = new Database(dbPath);
        // Enable foreign keys
        db.pragma('foreign_keys = ON');
        // Create tables
        createTables();
        // Seed with sample data
        await seedSampleData();
        console.log('✅ Database initialized successfully');
    }
    catch (error) {
        console.error('❌ Database setup failed:', error);
        throw error;
    }
}
function createTables() {
    // Stores table
    db.exec(`
    CREATE TABLE IF NOT EXISTS stores (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT,
      website TEXT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      price_score INTEGER NOT NULL CHECK(price_score >= 1 AND price_score <= 10),
      health_score INTEGER NOT NULL CHECK(health_score >= 1 AND health_score <= 10),
      rating REAL NOT NULL CHECK(rating >= 1 AND rating <= 5),
      categories TEXT NOT NULL,
      hours TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    // Items table for future price tracking
    db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      avg_price REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    console.log('📄 Database tables created');
}
async function seedSampleData() {
    // Check if data already exists
    const existingStores = db.prepare('SELECT COUNT(*) as count FROM stores').get();
    if (existingStores.count > 0) {
        console.log('📊 Sample data already exists, skipping seed');
        return;
    }
    // Sample stores across different major cities for testing
    const sampleStores = [
        // New York City Area (10001)
        {
            id: 'nyc-whole-foods-1',
            name: 'Whole Foods Market',
            address: '95 E Houston St, New York, NY 10002',
            phone: '(212) 420-1320',
            website: 'https://wholefoodsmarket.com',
            latitude: 40.7223,
            longitude: -73.9928,
            price_score: 4,
            health_score: 10,
            rating: 4.5,
            categories: JSON.stringify(['Organic', 'Natural Foods', 'Premium', 'Fresh Produce']),
            hours: JSON.stringify({
                monday: '8:00 AM - 10:00 PM',
                tuesday: '8:00 AM - 10:00 PM',
                wednesday: '8:00 AM - 10:00 PM',
                thursday: '8:00 AM - 10:00 PM',
                friday: '8:00 AM - 10:00 PM',
                saturday: '8:00 AM - 10:00 PM',
                sunday: '8:00 AM - 10:00 PM'
            })
        },
        {
            id: 'nyc-trader-joes-1',
            name: 'Trader Joe\'s',
            address: '142 E 14th St, New York, NY 10003',
            phone: '(212) 529-4612',
            website: 'https://traderjoes.com',
            latitude: 40.7332,
            longitude: -73.9898,
            price_score: 7,
            health_score: 8,
            rating: 4.3,
            categories: JSON.stringify(['Specialty', 'Natural Foods', 'Budget-Friendly']),
            hours: JSON.stringify({
                monday: '8:00 AM - 10:00 PM',
                tuesday: '8:00 AM - 10:00 PM',
                wednesday: '8:00 AM - 10:00 PM',
                thursday: '8:00 AM - 10:00 PM',
                friday: '8:00 AM - 10:00 PM',
                saturday: '8:00 AM - 10:00 PM',
                sunday: '8:00 AM - 10:00 PM'
            })
        },
        // Los Angeles Area (90210)
        {
            id: 'la-bristol-farms-1',
            name: 'Bristol Farms',
            address: '9039 Beverly Blvd, West Hollywood, CA 90048',
            phone: '(310) 278-1534',
            website: 'https://bristolfarms.com',
            latitude: 34.0759,
            longitude: -118.3776,
            price_score: 3,
            health_score: 9,
            rating: 4.4,
            categories: JSON.stringify(['Premium', 'Gourmet', 'Fresh Produce', 'Organic']),
            hours: JSON.stringify({
                monday: '7:00 AM - 10:00 PM',
                tuesday: '7:00 AM - 10:00 PM',
                wednesday: '7:00 AM - 10:00 PM',
                thursday: '7:00 AM - 10:00 PM',
                friday: '7:00 AM - 10:00 PM',
                saturday: '7:00 AM - 10:00 PM',
                sunday: '7:00 AM - 10:00 PM'
            })
        },
        {
            id: 'la-ralphs-1',
            name: 'Ralphs',
            address: '9616 Little Santa Monica Blvd, Beverly Hills, CA 90210',
            phone: '(310) 274-6645',
            website: 'https://ralphs.com',
            latitude: 34.0703,
            longitude: -118.4089,
            price_score: 6,
            health_score: 7,
            rating: 4.1,
            categories: JSON.stringify(['Supermarket', 'Full Service', 'Pharmacy']),
            hours: JSON.stringify({
                monday: '6:00 AM - 12:00 AM',
                tuesday: '6:00 AM - 12:00 AM',
                wednesday: '6:00 AM - 12:00 AM',
                thursday: '6:00 AM - 12:00 AM',
                friday: '6:00 AM - 12:00 AM',
                saturday: '6:00 AM - 12:00 AM',
                sunday: '6:00 AM - 12:00 AM'
            })
        },
        // Chicago Area (60601)
        {
            id: 'chi-jewel-osco-1',
            name: 'Jewel-Osco',
            address: '1224 S Wabash Ave, Chicago, IL 60605',
            phone: '(312) 322-3851',
            website: 'https://jewelosco.com',
            latitude: 41.8654,
            longitude: -87.6258,
            price_score: 6,
            health_score: 6,
            rating: 3.8,
            categories: JSON.stringify(['Supermarket', 'Full Service', 'Pharmacy']),
            hours: JSON.stringify({
                monday: '6:00 AM - 12:00 AM',
                tuesday: '6:00 AM - 12:00 AM',
                wednesday: '6:00 AM - 12:00 AM',
                thursday: '6:00 AM - 12:00 AM',
                friday: '6:00 AM - 12:00 AM',
                saturday: '6:00 AM - 12:00 AM',
                sunday: '6:00 AM - 11:00 PM'
            })
        },
        {
            id: 'chi-aldi-1',
            name: 'ALDI',
            address: '2570 N Clybourn Ave, Chicago, IL 60614',
            phone: '(855) 955-2534',
            website: 'https://aldi.us',
            latitude: 41.9290,
            longitude: -87.6574,
            price_score: 9,
            health_score: 6,
            rating: 4.2,
            categories: JSON.stringify(['Discount', 'Budget-Friendly', 'Limited Selection']),
            hours: JSON.stringify({
                monday: '9:00 AM - 8:00 PM',
                tuesday: '9:00 AM - 8:00 PM',
                wednesday: '9:00 AM - 8:00 PM',
                thursday: '9:00 AM - 8:00 PM',
                friday: '9:00 AM - 8:00 PM',
                saturday: '9:00 AM - 8:00 PM',
                sunday: '9:00 AM - 8:00 PM'
            })
        },
        // Houston Area (77001)
        {
            id: 'hou-heb-1',
            name: 'H-E-B',
            address: '1701 W Alabama St, Houston, TX 77006',
            phone: '(713) 654-8441',
            website: 'https://heb.com',
            latitude: 29.7370,
            longitude: -95.3990,
            price_score: 7,
            health_score: 7,
            rating: 4.6,
            categories: JSON.stringify(['Supermarket', 'Texas Favorite', 'Full Service']),
            hours: JSON.stringify({
                monday: '6:00 AM - 12:00 AM',
                tuesday: '6:00 AM - 12:00 AM',
                wednesday: '6:00 AM - 12:00 AM',
                thursday: '6:00 AM - 12:00 AM',
                friday: '6:00 AM - 1:00 AM',
                saturday: '6:00 AM - 1:00 AM',
                sunday: '6:00 AM - 12:00 AM'
            })
        },
        {
            id: 'hou-kroger-1',
            name: 'Kroger',
            address: '2120 W Gray St, Houston, TX 77019',
            phone: '(713) 529-0800',
            website: 'https://kroger.com',
            latitude: 29.7493,
            longitude: -95.4042,
            price_score: 6,
            health_score: 6,
            rating: 4.0,
            categories: JSON.stringify(['Supermarket', 'Full Service', 'Pharmacy']),
            hours: JSON.stringify({
                monday: '6:00 AM - 12:00 AM',
                tuesday: '6:00 AM - 12:00 AM',
                wednesday: '6:00 AM - 12:00 AM',
                thursday: '6:00 AM - 12:00 AM',
                friday: '6:00 AM - 1:00 AM',
                saturday: '6:00 AM - 1:00 AM',
                sunday: '6:00 AM - 12:00 AM'
            })
        }
    ];
    const insertStore = db.prepare(`
    INSERT INTO stores (
      id, name, address, phone, website, latitude, longitude,
      price_score, health_score, rating, categories, hours
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    for (const store of sampleStores) {
        insertStore.run(store.id, store.name, store.address, store.phone, store.website, store.latitude, store.longitude, store.price_score, store.health_score, store.rating, store.categories, store.hours);
    }
    console.log('🌱 Enhanced sample data seeded successfully');
}
