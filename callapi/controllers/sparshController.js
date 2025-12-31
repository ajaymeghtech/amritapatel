const Sparsh = require("../models/sparshModel");

// CREATE
const createSparsh = async (req, res) => {
  try {
    const body = req.body || {};
    const { title, content } = body;
    if (!title) {
      return res.status(400).json({ status: false, message: "Title is required" });
    }
    const data = await Sparsh.create({ title, content: content || "" });
    res.status(201).json({ status: true, message: "Sparsh created successfully", data });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error creating Sparsh", error: err.message });
  }
};

// LIST
const getSparsh = async (_req, res) => {
  try {
    const list = await Sparsh.find().sort({ createdAt: -1 });
    res.json({ status: true, message: "Sparsh list fetched", data: list });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// GET BY ID
const getSparshById = async (req, res) => {
  try {
    const data = await Sparsh.findById(req.params.id);
    if (!data) return res.status(404).json({ status: false, message: "Sparsh not found" });
    res.json({ status: true, message: "Sparsh fetched successfully", data });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// UPDATE
const updateSparsh = async (req, res) => {
  try {
    const body = req.body || {};
    const { title, content } = body;
    const updated = await Sparsh.findByIdAndUpdate(
      req.params.id,
      { title, content: content || "" },
      { new: true }
    );
    if (!updated) return res.status(404).json({ status: false, message: "Sparsh not found" });
    res.json({ status: true, message: "Sparsh updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// DELETE
const deleteSparsh = async (req, res) => {
  try {
    const deleted = await Sparsh.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ status: false, message: "Sparsh not found" });
    res.json({ status: true, message: "Sparsh deleted successfully", data: deleted });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = {
  createSparsh,
  getSparsh,
  getSparshById,
  updateSparsh,
  deleteSparsh,
};

