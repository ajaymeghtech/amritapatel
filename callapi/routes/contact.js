const express = require("express");
const router = express.Router();

const ContactController = require("../controllers/contactController");

// Routes (Laravel style)
router.get("/", ContactController.getAllContacts);       // List all
router.post("/", ContactController.createContact);       // Add contact message
router.get("/:id", ContactController.getContactById);    // Get one
router.delete("/:id", ContactController.deleteContact);  // Delete

module.exports = router;
