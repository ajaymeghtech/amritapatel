const express = require('express');
const router = express.Router();
const multer = require('multer');

const cmsController = require('../controllers/cmsController');


// 🔹 Setup Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + "-" + file.originalname;
      cb(null, uniqueName);
    },
  });
  const upload = multer({ storage });

// Image upload endpoint for editor content images - MUST be before other routes
router.post("/upload-image", upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      success: true, 
      url: imageUrl,
      message: 'Image uploaded successfully' 
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/", upload.single('banner_image'), cmsController.createCmsPage);        // Create
router.get("/", cmsController.getAllCmsPages);        // List all
router.get("/:key", cmsController.getCmsPageByKey);   // Get by key (e.g. /cms/about)
router.put("/:id", upload.single('banner_image'), cmsController.updateCmsPage);      // Update
router.delete("/:id", cmsController.deleteCmsPage);   // Delete

module.exports = router;
