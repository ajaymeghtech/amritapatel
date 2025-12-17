const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g., 'news.create'
  label: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Permission', PermissionSchema);


