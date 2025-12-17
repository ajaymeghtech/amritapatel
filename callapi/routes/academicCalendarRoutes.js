const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const {
  createAcademicCalendar,
  getAllAcademicCalendars,
  getAcademicCalendarById,
  updateAcademicCalendar,
  deleteAcademicCalendar
} = require('../controllers/academicCalendarController');

// Ensure upload folder exists
const uploadPath = 'uploads/academic-calendars';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, Date.now() + '-' + safeName);
  }
});

// Accept only PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files are allowed'), false);
};

const upload = multer({ storage, fileFilter });

// Routes
router.post('/', upload.single('pdf'), createAcademicCalendar);         // Create (field name: pdf)
router.get('/', getAllAcademicCalendars);                                // List (optional ?year=2025)
router.get('/:id', getAcademicCalendarById);                             // Get one
router.put('/:id', upload.single('pdf'), updateAcademicCalendar);        // Update (can replace pdf)
router.delete('/:id', deleteAcademicCalendar);                           // Delete

module.exports = router;
