const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
    // Audio
    {
        name: "Sony WH-1000XM5",
        price: 29990,
        oldPrice: 34990,
        rating: 4.8,
        reviews: 2124,
        category: "Audio",
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80",
        discount: 14,
        description: "Experience world-class noise cancellation with our premium wireless headphones. Featuring 30-hour battery life, plush ear cushions for all-day comfort, and superior sound quality with deep bass.",
        images: [
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1610423186256-11f876255734?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1520170350707-b21f556e9686?auto=format&fit=crop&w=1000&q=80"
        ],
        features: [
            "Industry-leading Noise Cancellation",
            "30-hour battery life with quick charging",
            "Touch Sensor controls",
            "Speak-to-Chat technology"
        ]
    },
    {
        name: "Bose QuietComfort 45",
        price: 24900,
        rating: 4.7,
        reviews: 890,
        category: "Audio",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
        description: "Iconic quiet. Comfort. And sound. The first noise cancelling headphones are back, now with the best materials and sound quality.",
        images: [
             "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
             "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=1000&q=80",
             "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80"
        ],
        features: ["Acoustic Noise Cancelling", "High-fidelity audio", "Lightweight comfort", "24-hour battery life"]
    },
     {
        name: "JBL Flip 6 Speaker",
        price: 9999,
        oldPrice: 12999,
        rating: 4.5,
        reviews: 3200,
        category: "Audio",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=80",
        discount: 23,
        description: "Your adventure companion. The 2-way speaker system delivers loud, crystal clear, and powerful sound.",
        images: [
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1543512214-318c77a799bf?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?auto=format&fit=crop&w=1000&q=80"
        ],
        features: ["IP67 waterproof and dustproof", "12 hours of playtime", "Bold design", "PartyBoost compatible"]
    },
    {
        name: "Apple AirPods Pro (2nd Gen)",
        price: 24900,
        rating: 4.9,
        reviews: 5600,
        category: "Audio",
        image: "https://images.unsplash.com/photo-1603351154351-5cf99703f6a8?auto=format&fit=crop&w=1000&q=80",
        description: "Reengineered for even richer audio experiences. Next-level Active Noise Cancellation and Adaptive Transparency.",
        images: [
            "https://images.unsplash.com/photo-1603351154351-5cf99703f6a8?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1572569028738-411a56119565?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1505236273191-1dce8aca70a3?auto=format&fit=crop&w=1000&q=80"
        ],
        features: ["H2 Apple Silicon chip", "Adaptive Transparency", "Personalized Spatial Audio", "MagSafe Charging Case"]
    },
    {
        name: "Samsung Galaxy Buds 2 Pro",
        price: 16999,
        oldPrice: 19999,
        rating: 4.4,
        reviews: 450,
        category: "Audio",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80",
        discount: 15,
        description: "24-bit Hi-Fi audio for quality listening. ANC with 3 high SNR microphones eliminates more exterior noise.",
        images: [
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1612442449529-887321852bd3?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1631867675167-90a456a90863?auto=format&fit=crop&w=1000&q=80"
        ],
        features: ["24-bit Hi-Fi Audio", "Intelligent ANC", "360 Audio", "Ergonomic Design"]
    },

    // Gaming
    {
        name: "Razer BlackWidow V4",
        price: 14999,
        rating: 4.6,
        reviews: 80,
        category: "Gaming",
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=80",
        description: "Go full throttle with the Razer BlackWidow V4 — a mechanical gaming keyboard designed for advanced control.",
        images: [
            "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1587829741301-3a056a0d0d21?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80"
        ],
        features: ["Razer Green Mechanical Switches", "Immersive Underglow", "Multi-function Roller", "Double-shot ABS Keycaps"]
    },
    {
        name: "Logitech G502 HERO",
        price: 4295,
        oldPrice: 5495,
        rating: 4.8,
        reviews: 12500,
        category: "Gaming",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80",
        discount: 21,
        description: "High performance gaming mouse. HERO 25K Sensor, 11 Programmable Buttons, Adjustable Weight System.",
        images: [
            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1615663245857-acda5b2b8b6b?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=1000&q=80"
        ],
        features: ["HERO 25K Sensor", "11 Programmable Buttons", "Adjustable Weights", "LIGHTSYNC RGB"]
    },
    {
        name: "PS5 DualSense Controller",
        price: 5990,
        category: "Gaming",
        rating: 4.9,
        reviews: 860,
        image: "https://images.unsplash.com/photo-1606318801954-d46d46d3360a?auto=format&fit=crop&w=1000&q=80",
        description: "Discover a deeper, highly immersive gaming experience that brings the action to life in the palms of your hands.",
        images: [
            "https://images.unsplash.com/photo-1606318801954-d46d46d3360a?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1592155931584-901ac15763e3?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?auto=format&fit=crop&w=1000&q=80"
        ],
        features: ["Haptic Feedback", "Adaptive Triggers", "Built-in Microphone", "Signature Comfort"]
    },
    {
        name: "Xbox Series X",
        price: 49990,
        category: "Gaming",
        rating: 4.8,
        reviews: 1400,
        image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=1000&q=80",
        description: "The fastest, most powerful Xbox ever. Play thousands of titles from four generations of consoles.",
        images: [
            "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1596740926474-0053954734e5?auto=format&fit=crop&w=1000&q=80"
        ],
        features: ["4K Gaming", "120 FPS", "1TB SSD", "Xbox Velocity Architecture"]
    },

    // Wearables
    {
        name: "Apple Watch Series 9",
        price: 41900,
        oldPrice: 44900,
        rating: 4.9,
        reviews: 1450,
        category: "Wearables",
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80",
        discount: 7,
        description: "Smarter. Brighter. Mightier. The most powerful chip in Apple Watch ever. A magical new way to use your watch without touching the screen.",
        images: [
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1434493789847-2f02ea6ca2cb?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80"
        ],
        features: ["S9 SiP", "Double tap gesture", "Brighter display", "Carbon Neutral"]
    },
    {
        name: "Samsung Galaxy Watch 6",
        price: 29999,
        rating: 4.6,
        reviews: 670,
        category: "Wearables",
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80",
        description: "Start your wellness journey. Keep track of your sleep, health, and fitness with the Galaxy Watch 6.",
        images: [
            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&w=1000&q=80"
        ],
        features: ["Sleep Coaching", "Heart Health Monitoring", "Thin Bezel", "One-Click Band"]
    },
    {
        name: "Fitbit Charge 6",
        price: 14999,
        rating: 4.4,
        reviews: 320,
        category: "Wearables",
        image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=1000&q=80",
        description: "Give your routine a boost with Charge 6, the only tracker with Google built in.",
        images: [
            "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=1000&q=80"
        ],
        features: ["YouTube Music controls", "Google Maps", "Heart Rate on equipment", "7 days battery"]
    },

    // Photography
    {
        name: "Sony Alpha a7 IV",
        price: 242990,
        rating: 4.9,
        reviews: 120,
        category: "Photography",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80",
        description: "The basic is never basic. Prepare to be inspired. The true-to-life resolution and remarkable AI-powered autofocus of the a7 IV complement a range of world-class features.",
        images: [
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1616423664033-2559385b2ad0?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1500634245200-e5245c7574ef?auto=format&fit=crop&w=1000&q=80"
        ],
        features: ["33MP Full-frame Sensor", "4K 60p Recording", "Real-time Eye AF", "Vari-angle LCD"]
    },
    {
        name: "Canon EOS R6 Mark II",
        price: 215990,
        rating: 4.8,
        reviews: 95,
        category: "Photography",
        image: "https://images.unsplash.com/photo-1519638831568-d9897f54ed69?auto=format&fit=crop&w=1000&q=80",
        description: "Master of stills and video. The uncompromising EOS R6 Mark II allows you to capture action in ways you never thought possible.",
        images: [
            "https://images.unsplash.com/photo-1519638831568-d9897f54ed69?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&w=1000&q=80"
        ],
        features: ["40fps Electronic Shutter", "In-body Image Stabilizer", "Dual Pixel CMOS AF II", "6K Oversampled 4K"]
    },
    {
        name: "GoPro Hero 12 Black",
        price: 39990,
        rating: 4.6,
        reviews: 4500,
        category: "Photography",
        image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80",
        description: "Incredible image quality, even better HyperSmooth video stabilization and a huge boost in battery life.",
        images: [
            "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1621259181233-00da87cc431c?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1594910609337-43ca05178619?auto=format&fit=crop&w=1000&q=80"
        ],
        features: ["HDR Video", "HyperSmooth 6.0", "Waterproof to 33ft", "Longer Battery Life"]
    },
    {
        name: "Herman Miller Aeron",
        price: 125000,
        oldPrice: 145000,
        rating: 4.9,
        reviews: 800,
        category: "Furniture",
        image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=1000&q=80",
        discount: 14,
        description: "The Aeron Chair combined a deep knowledge of human-centered design with cutting-edge technology.",
        images: [
            "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1588200618450-3a5b1d3b9aa5?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1617505185566-b3334208d132?auto=format&fit=crop&w=1000&q=80"
        ],
        features: ["Pellicle Suspension", "PostureFit SL", "Fully Adjustable Arms", "Inclusive Design"]
    },
    {
        name: "Green Soul Monster Ultimate",
        price: 18990,
        rating: 4.5,
        reviews: 2100,
        category: "Furniture",
        image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=1000&q=80",
        description: "Ergonomic Gaming Chair for ultimate comfort during long gaming sessions.",
        images: [
            "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1595514020150-13e738c6422f?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1000&q=80"
        ],
        features: ["Breathable Fabric", "Adjustable Neck Pillow", "4D Armrests", "Heavy Duty Metal Base"]
    },
];

dotenv.config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");
        
        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log("Cleared existing data");

        // Insert new products
        await Product.insertMany(products);
        console.log("Seeded products");

        // Create Demo Users
        const hashedPassword = await bcrypt.hash("user123", 10);
        const hashedAdminPassword = await bcrypt.hash("admin123", 10);

        const users = [
            {
                username: "Rahul User",
                email: "rahul@example.com",
                password: hashedPassword,
                isAdmin: false
            },
            {
                username: "Admin User",
                email: "admin@techstore.com",
                password: hashedAdminPassword,
                isAdmin: true
            }
        ];

        await User.insertMany(users);
        console.log("Seeded users (Rahul & Admin)");

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
        console.log("Disconnected from DB");
    }
};

seedDB();
