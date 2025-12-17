require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event'); 

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB, seeding events...');
    await Event.deleteMany({});
    console.log('🧹 Cleared existing events');

    const sampleEvents = [];
    for (let i = 1; i <= 30; i++) {
      sampleEvents.push({
        name: `Event ${i}`,
        description: `This is the description for Event ${i}.`,
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
        location: `Location ${i}`,
        author: 'Admin',
      });
    }

    await Event.insertMany(sampleEvents);
    console.log('✅ Seeded 30 dummy events successfully');
    mongoose.connection.close();
    console.log('🔒 MongoDB connection closed');
  })
  .catch(err => {
    console.error('❌ Error seeding events:', err.message);
    process.exit(1);
  });
