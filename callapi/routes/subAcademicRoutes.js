const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer(); // required for form-data without file

const {
  createSubAcademic,
  getSubAcademic,
  getSubAcademicById,
  updateSubAcademic,
  deleteSubAcademic,
} = require("../controllers/subAcademicController"); 

// POST - with form-data
router.post("/", upload.none(), createSubAcademic);
// Create
router.post("/", createSubAcademic);

// List
router.get("/", getSubAcademic);

// Single
router.get("/:id", getSubAcademicById);

// Update

// Update
router.put(
  "/:id",
  upload.fields([
    { name: "title", maxCount: 1 },
    { name: "content", maxCount: 1 },
  ]),
  updateSubAcademic
);



// Delete
router.delete("/:id", deleteSubAcademic);
module.exports = router;






