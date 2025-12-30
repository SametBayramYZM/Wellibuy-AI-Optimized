require('dotenv').config();
const mongoose = require('mongoose');

async function cleanDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');

    // Users collection'ındaki indexes'i sil
    const collection = mongoose.connection.collection('users');
    if (collection) {
      try {
        await collection.dropIndexes();
        console.log('✅ Dropped all indexes from users collection');
      } catch (err) {
        console.log('⚠️  No indexes to drop or error:', err.message);
      }
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

cleanDatabase();
