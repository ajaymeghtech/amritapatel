const express = require('express');
const router = express.Router();
const Role = require('../models/Role');

// List roles
router.get('/', async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create role
router.post('/', async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const role = new Role({ name, description, permissions: permissions || [] });
    await role.save();
    res.status(201).json({ success: true, data: role });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update role
router.put('/:id', async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { name, description, permissions: permissions || [] },
      { new: true }
    );
    if (!role) return res.status(404).json({ error: 'Role not found' });
    res.json({ success: true, data: role });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete role
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Role.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Role not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;


