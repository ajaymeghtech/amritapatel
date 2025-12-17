const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  permissions: [{ type: String }], // simple list of permission keys
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Role', RoleSchema);


