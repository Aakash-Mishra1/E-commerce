const mongoose = require("mongoose");
const Product = require("./models/Product");
const dotenv = require("dotenv");

dotenv.config();

const products = [
    {
        name: "Sony WH-1000XM5 Wireless Headphones",
        price: 29990,
        category: "Audio",
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1599669454699-248893623040?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=800&q=80", 
            "https://images.unsplash.com/photo-1524678606372-56527bb4234b?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
        ],
        description: "Experience world-class noise cancellation with our premium wireless headphones. Featuring 30-hour battery life, plush ear cushions for all-day comfort, and superior sound quality with deep bass.",
        rating: 4.8,
        reviews: 2124,
        video: "https://videos.pexels.com/video-files/5091636/5091636-hd_1920_1080_24fps.mp4"
    },
    {
        name: "Apple iPhone 15 Pro (Titanium)",
        price: 134900,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1696446701796-da6122569f5c?auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1696446701796-da6122569f5c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1696429175928-793a3c21dd63?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80"
        ],
        description: "The first iPhone to feature an aerospace-grade titanium design. A17 Pro chip. A Pro camera system that is more versatile than ever.",
        rating: 4.9,
        reviews: 5400,
        video: "https://videos.pexels.com/video-files/7891336/7891336-hd_1920_1080_30fps.mp4"
    },
    {
        name: "Apple MacBook Air M2 (Midnight)",
        price: 114900,
        category: "Laptops",
        image: "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?auto=format&fit=crop&w=800&q=80"
        ],
        description: "Supercharged by M2. Strikingly thin and fast so you can work, play, or create just about anything, anywhere.",
        rating: 4.7,
        reviews: 1540,
        video: "https://videos.pexels.com/video-files/8195863/8195863-hd_1920_1080_25fps.mp4"
    },
    {
        name: "Samsung Galaxy S24 Ultra",
        price: 129999,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1628116904677-dbac198357f6?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1678911820864-e284031d739b?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1598327105666-5b89351aff23?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1556656793-02f1367f9c8c?auto=format&fit=crop&w=800&q=80"
        ],
        description: "Unleash new ways to create, connect and more with Galaxy AI. The new titanium exterior is harder and more durable than ever.",
        rating: 4.7,
        reviews: 3100,
        video: "https://videos.pexels.com/video-files/4101348/4101348-hd_1920_1080_30fps.mp4"
    },
    {
         name: "Nike Air Jordan 1 Retro High",
         price: 16995, 
         category: "Fashion",
         image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
         images: [
             "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
             "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
             "https://images.unsplash.com/photo-1514989940723-e8875ea6ab7d?auto=format&fit=crop&w=800&q=80",
             "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80",
             "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80"
         ],
         description: "A classic sneaker silhouette that never goes out of style. Features premium leather and the iconic Air cushioning for all-day comfort.",
         rating: 4.8,
         reviews: 12500,
         video: "https://videos.pexels.com/video-files/3201584/3201584-hd_1920_1080_25fps.mp4"
    },
    {
        name: "PlayStation 5 Console (Disc Edition)",
        price: 54990,
        category: "Gaming",
        image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1621259181233-fa6e27b4582f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1592155931584-901ac1576d98?auto=format&fit=crop&w=800&q=80"
        ],
        description: "Experience lightning fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, 3D Audio, and an all-new generation of incredible PlayStation games.",
        rating: 4.9,
        reviews: 15600,
        video: "https://videos.pexels.com/video-files/4519662/4519662-hd_1920_1080_30fps.mp4"
    },
    {
        name: "Canon EOS R6 Mirrorless Camera",
        price: 215995,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1519638831568-d9897f54ed69?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1500634245200-e5245c7574ef?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80"
        ],
        description: "Versatile mirrorless camera for photos and videos. High-speed continuous shooting, 4K video, subject tracking, and image stabilization.",
        rating: 4.6,
        reviews: 870,
        video: "https://videos.pexels.com/video-files/3015511/3015511-hd_1920_1080_24fps.mp4"
    },
    {
        name: "Minimalist Modern Chair",
        price: 8999,
        category: "Home",
        image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1506439773649-6e0eb5818317?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=800&q=80"
        ],
        description: "Elegant and comfortable chair that fits perfectly into any modern home decor. Crafted with high-quality wood and premium fabric.",
        rating: 4.5,
        reviews: 420,
        video: "https://videos.pexels.com/video-files/6702912/6702912-hd_1920_1080_30fps.mp4"
    },
    {
        name: "Mechanical Gaming Keyboard RGB",
        price: 6499,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1587829741301-3a056a0d0d21?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1626218174358-77b7f9a46058?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80"
        ],
        description: "Professional mechanical keyboard with customizable RGB lighting, durable switches, and anti-ghosting technology for the ultimate gaming experience.",
        rating: 4.7,
        reviews: 2100,
        video: "https://videos.pexels.com/video-files/5482650/5482650-hd_1920_1080_30fps.mp4"
    },
    {
        name: "GoPro HERO11 Black",
        price: 34990,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1564466021184-b7473775fb9c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1526660690293-bcd32dc3b123?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1500318534870-7389c2538f4a?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1506202476831-d8ec789f2142?auto=format&fit=crop&w=800&q=80"
        ],
        description: "The most powerful GoPro yet. HERO11 Black features incredible 5.3K video, HyperSmooth 5.0 video stabilization, and extended battery life.",
        rating: 4.8,
        reviews: 1350,
        video: "https://videos.pexels.com/video-files/4211151/4211151-hd_1920_1080_30fps.mp4"
    }
];

// Assign random stock values, 3-4 items out of stock
const outOfStockIndexes = [1, 4, 7, 9]; // Pick 3-4 random indexes
products.forEach((product, idx) => {
    if (outOfStockIndexes.includes(idx)) {
        product.stock = 0;
    } else {
        product.stock = Math.floor(Math.random() * 50) + 5; // Random stock between 5 and 54
    }
});

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB...");
        
        // Clear existing products
        await Product.deleteMany({});
        console.log("Deleted old products...");
        
        // Insert new products
        await Product.insertMany(products);
        console.log("Added new products!");
        
        mongoose.connection.close();
    } catch (err) {
        console.log(err);
    }
};

seedDB();
