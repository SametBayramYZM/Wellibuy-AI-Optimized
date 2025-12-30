require('dotenv').config();
const mongoose = require('mongoose');
const UserSchema = require('./server/routes/schemas/user');

const User = mongoose.model('User', UserSchema);

async function createAdminUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@wellibuy.com' });
    if (adminExists) {
      console.log('⚠️  Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    const adminUser = new User({
      email: 'admin@wellibuy.com',
      password: 'Admin@12345', // Default password - kullanıcı değiştirmeli
      firstName: 'Admin',
      lastName: 'Wellibuy',
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@wellibuy.com');
    console.log('🔐 Password: Admin@12345');
    console.log('⚠️  Please change the password after first login!');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminUser();
