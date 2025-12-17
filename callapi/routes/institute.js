const express = require("express");
const router = express.Router();

const InstituteController = require("../controllers/instituteController");

// Routes
router.get("/", InstituteController.getAllInstitutes);
router.post("/", InstituteController.createInstitute);
router.get("/:id", InstituteController.getInstituteById);
router.put("/:id", InstituteController.updateInstitute);
router.delete("/:id", InstituteController.deleteInstitute);

module.exports = router;
