require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Permission = require('./models/Permission');
const Role = require('./models/Role');
const User = require('./models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');

    // Seed permissions
    const basePermissions = [
      { key: 'news.create', label: 'Create News' },
      { key: 'news.update', label: 'Update News' },
      { key: 'news.delete', label: 'Delete News' },
      { key: 'banners.create', label: 'Create Banners' },
      { key: 'banners.update', label: 'Update Banners' },
      { key: 'banners.delete', label: 'Delete Banners' },
      { key: 'events.create', label: 'Create Events' },
      { key: 'events.update', label: 'Update Events' },
      { key: 'events.delete', label: 'Delete Events' },
      { key: 'cms.create', label: 'Create CMS Pages' },
      { key: 'cms.update', label: 'Update CMS Pages' },
      { key: 'cms.delete', label: 'Delete CMS Pages' },
      { key: 'users.manage', label: 'Manage Users' },
      { key: 'roles.manage', label: 'Manage Roles' },
      { key: 'settings.update', label: 'Update Settings' },
    ];
    await Permission.deleteMany({});
    await Permission.insertMany(basePermissions);
    console.log('✅ Permissions seeded');

    // Seed roles
    await Role.deleteMany({});
    const adminRole = await Role.create({ 
      name: 'admin', 
      description: 'Super Admin - Full access to all features', 
      permissions: basePermissions.map(p => p.key) 
    });
    const editorRole = await Role.create({ 
      name: 'editor', 
      description: 'Content Editor - Can create, update and delete content', 
      permissions: ['news.create', 'news.update', 'news.delete', 'banners.create', 'banners.update', 'banners.delete', 'events.create', 'events.update', 'events.delete'] 
    });
    const viewerRole = await Role.create({ 
      name: 'viewer', 
      description: 'Read Only - Can view content but cannot modify', 
      permissions: [] 
    });
    console.log('✅ Roles seeded');

    // Seed users
    await User.deleteMany({});
    const adminPass = await bcrypt.hash('admin123', 10);
    const editorPass = await bcrypt.hash('editor123', 10);
    const viewerPass = await bcrypt.hash('viewer123', 10);

    await User.insertMany([
      { name: 'Admin User', email: 'admin@cms.com', password: adminPass, role: adminRole.name },
      { name: 'Content Editor', email: 'editor@cms.com', password: editorPass, role: editorRole.name },
      { name: 'Read Only', email: 'viewer@cms.com', password: viewerPass, role: viewerRole.name },
    ]);
    console.log('✅ Users seeded (admin/editor/viewer)');

    console.log('\nLogin accounts:');
    console.log('admin@cms.com / admin123');
    console.log('editor@cms.com / editor123');
    console.log('viewer@cms.com / viewer123');

    await mongoose.connection.close();
    console.log('🔒 MongoDB connection closed');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
})();


