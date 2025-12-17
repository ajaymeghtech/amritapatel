const fs = require('fs');
const path = require('path');
const AcademicCalendar = require('../models/AcademicCalendar');

/**
 * Helper: normalize years input coming from client.
 * Accepts:
 * - array of numbers: [2023,2024]
 * - comma separated string: "2023,2024"
 * - single value string/number: "2023" or 2023
 */
function parseYears(input) {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map(y => Number(y)).filter(y => !isNaN(y));
  }
  const s = String(input).trim();
  if (s.includes(',')) {
    return s.split(',').map(p => Number(p.trim())).filter(y => !isNaN(y));
  }
  const n = Number(s);
  return isNaN(n) ? [] : [n];
}

// Build file path for storage reference
function buildPdfPath(filename) {
  return `/uploads/academic-calendars/${filename}`;
}

// Remove a file from uploads if it exists (safe)
function safeUnlink(filePath) {
  if (!filePath) return;
  // filePath might be stored like "/uploads/academic-calendars/abc.pdf"
  const rel = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  const full = path.join(process.cwd(), rel);
  if (fs.existsSync(full)) {
    try {
      fs.unlinkSync(full);
    } catch (err) {
      console.warn('Failed to delete file', full, err.message);
    }
  }
}

// ✅ Create Academic Calendar
const createAcademicCalendar = async (req, res) => {
  try {
    const pdfPath = req.file ? buildPdfPath(req.file.filename) : null;

    if (!req.body.title || !pdfPath) {
      return res.status(400).json({
        status: false,
        message: 'Title and PDF file are required',
        data: null
      });
    }

    const years = parseYears(req.body.years);

    const ac = new AcademicCalendar({
      title: req.body.title,
      pdf: pdfPath,
      years,
      description: req.body.description
    });

    await ac.save();

    res.status(201).json({
      status: true,
      message: 'Academic Calendar created successfully',
      data: ac
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to create academic calendar',
      error: err.message,
      data: null
    });
  }
};

// ✅ Get all (supports optional filter by year: ?year=2025)
const getAllAcademicCalendars = async (req, res) => {
  try {
    const { year } = req.query;
    const filter = {};

    if (typeof year !== 'undefined' && year !== null && year !== '') {
      const y = parseInt(year, 10);
      if (!isNaN(y)) {
        // find docs where years array contains this year
        filter.years = y;
      }
    }

    const data = await AcademicCalendar.find(filter).sort({ years: -1, createdAt: -1 });

    res.status(200).json({
      status: true,
      message: 'Academic calendars fetched successfully',
      data
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch academic calendars',
      error: err.message,
      data: []
    });
  }
};

// ✅ Get single by id
const getAcademicCalendarById = async (req, res) => {
  try {
    const data = await AcademicCalendar.findById(req.params.id);
    if (!data) {
      return res.status(404).json({
        status: false,
        message: 'Academic calendar not found',
        data: null
      });
    }
    res.status(200).json({
      status: true,
      message: 'Academic calendar fetched successfully',
      data
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch academic calendar',
      error: err.message,
      data: null
    });
  }
};

// ✅ Update (supports replacing PDF if new file uploaded)
const updateAcademicCalendar = async (req, res) => {
  try {
    const update = { ...req.body };

    // parse years
    if (typeof update.years !== 'undefined') {
      update.years = parseYears(update.years);
    }

    // handle new pdf file
    if (req.file) {
      update.pdf = buildPdfPath(req.file.filename);
    }

    // find existing to remove old file if replaced
    const existing = await AcademicCalendar.findById(req.params.id);
    if (!existing) {
      // if file was uploaded, remove it (since no DB record)
      if (req.file) safeUnlink(buildPdfPath(req.file.filename));
      return res.status(404).json({
        status: false,
        message: 'Academic calendar not found',
        data: null
      });
    }

    // if new pdf uploaded, delete old pdf file
    if (req.file && existing.pdf) {
      safeUnlink(existing.pdf);
    }

    const updated = await AcademicCalendar.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });

    res.status(200).json({
      status: true,
      message: 'Academic calendar updated successfully',
      data: updated
    });
  } catch (err) {
    // if new file was uploaded but update fails, try to remove the uploaded file to avoid orphan files
    if (req.file) {
      safeUnlink(buildPdfPath(req.file.filename));
    }
    res.status(400).json({
      status: false,
      message: 'Failed to update academic calendar',
      error: err.message,
      data: null
    });
  }
};

// ✅ Delete
const deleteAcademicCalendar = async (req, res) => {
  try {
    const data = await AcademicCalendar.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({
        status: false,
        message: 'Academic calendar not found',
        data: null
      });
    }

    // delete pdf file
    if (data.pdf) safeUnlink(data.pdf);

    res.status(200).json({
      status: true,
      message: 'Academic calendar deleted successfully',
      data
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: 'Failed to delete academic calendar',
      error: err.message,
      data: null
    });
  }
};

module.exports = {
  createAcademicCalendar,
  getAllAcademicCalendars,
  getAcademicCalendarById,
  updateAcademicCalendar,
  deleteAcademicCalendar
};
