require('dotenv').config();
const mongoose = require('mongoose');
const ProductSchema = require('./server/routes/schemas/product');

const Product = mongoose.model('Product', ProductSchema);

const sampleProducts = [
  {
    name: "Apple MacBook Pro 14\"",
    brand: "Apple",
    category: "Bilgisayar",
    images: ["https://via.placeholder.com/300x300?text=MacBook"],
    prices: [{ siteName: "Store", price: 1999, url: "https://example.com", inStock: true }],
    specifications: [
      { name: "CPU", value: "M3 Max", category: "Processor" },
      { name: "RAM", value: "18GB", category: "Memory" },
      { name: "Storage", value: "512GB", category: "Storage" }
    ],
    description: "Professional laptop with powerful performance"
  },
  {
    name: "Dell XPS 13",
    brand: "Dell",
    category: "Bilgisayar",
    images: ["https://via.placeholder.com/300x300?text=XPS"],
    prices: [{ siteName: "Store", price: 999, url: "https://example.com", inStock: true }],
    specifications: [
      { name: "CPU", value: "Intel i7", category: "Processor" },
      { name: "RAM", value: "16GB", category: "Memory" },
      { name: "Storage", value: "512GB", category: "Storage" }
    ],
    description: "Ultra-thin and lightweight ultrabook"
  },
  {
    name: "Samsung Galaxy S24",
    brand: "Samsung",
    category: "Elektronik",
    images: ["https://via.placeholder.com/300x300?text=S24"],
    prices: [{ siteName: "Store", price: 899, url: "https://example.com", inStock: true }],
    specifications: [
      { name: "Display", value: "6.1 AMOLED", category: "Display" },
      { name: "RAM", value: "8GB", category: "Memory" },
      { name: "Storage", value: "256GB", category: "Storage" }
    ],
    description: "Latest Samsung flagship smartphone"
  },
  {
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "Elektronik",
    images: ["https://via.placeholder.com/300x300?text=iPhone15"],
    prices: [{ siteName: "Store", price: 999, url: "https://example.com", inStock: true }],
    specifications: [
      { name: "Display", value: "6.1 Super Retina", category: "Display" },
      { name: "RAM", value: "8GB", category: "Memory" },
      { name: "Storage", value: "256GB", category: "Storage" }
    ],
    description: "Premium iPhone with advanced features"
  },
  {
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Elektronik",
    images: ["https://via.placeholder.com/300x300?text=Headphones"],
    prices: [{ siteName: "Store", price: 399, url: "https://example.com", inStock: true }],
    specifications: [
      { name: "Type", value: "Over-ear", category: "Type" },
      { name: "Battery", value: "30h", category: "Battery" },
      { name: "ANC", value: "Yes", category: "Features" }
    ],
    description: "Industry-leading noise-cancelling headphones"
  },
  {
    name: "iPad Air",
    brand: "Apple",
    category: "Elektronik",
    images: ["https://via.placeholder.com/300x300?text=iPad"],
    prices: [{ siteName: "Store", price: 599, url: "https://example.com", inStock: true }],
    specifications: [
      { name: "Display", value: "11 inch", category: "Display" },
      { name: "RAM", value: "8GB", category: "Memory" },
      { name: "Storage", value: "128GB", category: "Storage" }
    ],
    description: "Powerful tablet for productivity"
  },
  {
    name: "Google Pixel 8",
    brand: "Google",
    category: "Elektronik",
    images: ["https://via.placeholder.com/300x300?text=Pixel8"],
    prices: [{ siteName: "Store", price: 799, url: "https://example.com", inStock: true }],
    specifications: [
      { name: "Display", value: "6.2 OLED", category: "Display" },
      { name: "RAM", value: "12GB", category: "Memory" },
      { name: "Storage", value: "128GB", category: "Storage" }
    ],
    description: "Google's AI-powered flagship phone"
  },
  {
    name: "Lenovo ThinkPad X1",
    brand: "Lenovo",
    category: "Bilgisayar",
    images: ["https://via.placeholder.com/300x300?text=ThinkPad"],
    prices: [{ siteName: "Store", price: 1299, url: "https://example.com", inStock: true }],
    specifications: [
      { name: "CPU", value: "Intel i7", category: "Processor" },
      { name: "RAM", value: "16GB", category: "Memory" },
      { name: "Storage", value: "512GB", category: "Storage" }
    ],
    description: "Business-class laptop with durability"
  }
];

async function addProducts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Cleared existing products');

    console.log('Adding sample products...');
    const result = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully added ${result.length} products!`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addProducts();
