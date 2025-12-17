const express = require('express');
const router = express.Router();
const Permission = require('../models/Permission');

// List permissions
router.get('/', async (req, res) => {
  try {
    const list = await Permission.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create permission
router.post('/', async (req, res) => {
  try {
    const { key, label } = req.body;
    if (!key || !label) return res.status(400).json({ error: 'Key and label required' });
    const exists = await Permission.findOne({ key });
    if (exists) return res.status(409).json({ error: 'Permission key exists' });
    const item = new Permission({ key, label });
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update permission
router.put('/:id', async (req, res) => {
  try {
    const { key, label } = req.body;
    const item = await Permission.findByIdAndUpdate(req.params.id, { key, label }, { new: true });
    if (!item) return res.status(404).json({ error: 'Permission not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete permission
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Permission.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Permission not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;


