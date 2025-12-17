const express = require("express");
const router = express.Router();

const {
  createFAQ,
  getAllFAQ,
  getFAQById,
  updateFAQ,
  deleteFAQ
} = require("../controllers/faqController");

// Routes
router.get("/", getAllFAQ);
router.get("/:id", getFAQById);
router.post("/", createFAQ);
router.put("/:id", updateFAQ);
router.delete("/:id", deleteFAQ);

module.exports = router;
