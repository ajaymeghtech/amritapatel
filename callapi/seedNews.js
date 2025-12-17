require('dotenv').config();
const mongoose = require('mongoose');
const News = require('./models/News');

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ Connected to MongoDB, seeding data...');

  // sample news data
  const sampleNews = [
    {
      title: 'Welcome to the MERN CMS',
      content: 'This is your first seeded news article. You can edit or delete it later.',
      author: 'Admin',
    },
    {
      title: 'MERN Stack Learning Progress',
      content: 'You are currently learning how to seed data in MongoDB using Node.js scripts.',
      author: 'Viral',
    },
    {
      title: 'Express + MongoDB Connected Successfully',
      content: 'Your backend API is running smoothly and connected to the database.',
      author: 'System',
    },
  ];

  // clear old data (optional)
  await News.deleteMany({});
  console.log('🧹 Cleared existing news');

  // insert new dummy data
  await News.insertMany(sampleNews);
  console.log('✅ Seeded dummy news data successfully');

  mongoose.connection.close();
  console.log('🔒 MongoDB connection closed');
})
.catch(err => {
  console.error('❌ Error seeding data:', err.message);
  process.exit(1);
});
