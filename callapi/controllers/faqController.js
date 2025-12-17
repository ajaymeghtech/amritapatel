const FAQ = require("../models/FAQ");

// CREATE
const createFAQ = async (req, res) => {
  try {
    const item = new FAQ({
      question: req.body.question,
      answer: req.body.answer,
      status: req.body.status
    });

    await item.save();

    res.status(201).json({
      status: true,
      message: "FAQ created successfully",
      data: item
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// GET ALL
const getAllFAQ = async (req, res) => {
  try {
    const data = await FAQ.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "FAQ fetched successfully",
      data
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// GET ONE
const getFAQById = async (req, res) => {
  try {
    const item = await FAQ.findById(req.params.id);

    if (!item)
      return res.status(404).json({ status: false, message: "Not found" });

    res.status(200).json({
      status: true,
      message: "FAQ fetched successfully",
      data: item
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// UPDATE
const updateFAQ = async (req, res) => {
  try {
    const item = await FAQ.findById(req.params.id);
    if (!item)
      return res.status(404).json({ status: false, message: "Not found" });

    item.question = req.body.question;
    item.answer = req.body.answer;
    item.status = req.body.status;

    await item.save();

    res.status(200).json({
      status: true,
      message: "FAQ updated successfully",
      data: item
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// DELETE
const deleteFAQ = async (req, res) => {
  try {
    const item = await FAQ.findById(req.params.id);
    if (!item)
      return res.status(404).json({ status: false, message: "Not found" });

    await item.deleteOne();

    res.status(200).json({
      status: true,
      message: "FAQ deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = {
  createFAQ,
  getAllFAQ,
  getFAQById,
  updateFAQ,
  deleteFAQ
};
