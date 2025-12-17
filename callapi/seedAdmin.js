require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    const email = 'admin@cms.com';
    const password = 'admin123';

    // Check if already exists
    let admin = await User.findOne({ email });
    if (admin) {
      console.log('⚠️ Admin already exists:', email);
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin = await User.create({
        name: 'Super Admin',
        email,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Default admin created successfully');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    }

    mongoose.connection.close();
    console.log('🔒 MongoDB connection closed');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
