const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

// Ensure upload folder exists
const uploadPath = "uploads/projects";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

router.post("/", upload.single("project_image"), createProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.put("/:id", upload.single("project_image"), updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
