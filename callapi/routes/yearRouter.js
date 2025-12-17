const express = require("express");
const router = express.Router();

const YearController = require("../controllers/yearController");

// Routes (Laravel style)
router.get("/", YearController.getAllYears);       // List all
router.post("/", YearController.createYear);       // Add year
router.get("/:id", YearController.getYearById);    // Get one
router.delete("/:id", YearController.deleteYear);  // Delete
router.put("/:id", YearController.updateYearById);  // Update
module.exports = router;