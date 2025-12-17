const Program = require("../models/Program");

// ✅ Create Program
const createProgram = async (req, res) => {
  try {
    const data = req.body;

    // ✅ Handle uploaded files
    if (req.files?.image?.[0]) {
      data.image = `/uploads/${req.files.image[0].filename}`;
    } else {
      data.image = null;
    }

    if (req.files?.iconImage?.[0]) {
      data.iconImage = `/uploads/${req.files.iconImage[0].filename}`;
    } else {
      data.iconImage = null;
    }

    const newProgram = new Program(data);
    await newProgram.save();

    res.status(201).json({
      status: true,
      message: "Program added successfully",
      data: newProgram,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to add program",
      error: err.message,
    });
  }
};


// ✅ Get All Programs
const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ isActive: true }).sort({ order: 1 });
    res.json({
      status: true,
      message: "Programs fetched successfully",
      data: programs,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch programs",
      error: err.message,
    });
  }
};

// ✅ Get One
const getProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ status: false, message: "Program not found" });
    }
    res.json({ status: true, message: "Program fetched successfully", data: program });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching program", error: err.message });
  }
};

// ✅ Update Program
// const updateProgram = async (req, res) => {
//   try {
//     const data = req.body;
//     if (req.file) data.image = `/uploads/${req.file.filename}`;

//     const updated = await Program.findByIdAndUpdate(req.params.id, data, { new: true });
//     if (!updated) return res.status(404).json({ status: false, message: "Program not found" });

//     res.json({ status: true, message: "Program updated successfully", data: updated });
//   } catch (err) {
//     res.status(400).json({ status: false, message: "Failed to update program", error: err.message });
//   }
// };

const updateProgram = async (req, res) => {
  try {
    const data = req.body;

    // courses handling
    if (Array.isArray(data.courses)) {
      // ok
    } else if (typeof data.courses === "string") {
      data.courses = data.courses
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
    }

    // IMPORTANT: with upload.fields, files are in req.files, not req.file
    if (req.files?.image?.[0]) {
      data.image = `/uploads/${req.files.image[0].filename}`;
    }

    if (req.files?.iconImage?.[0]) {
      data.iconImage = `/uploads/${req.files.iconImage[0].filename}`;
    }

    const updated = await Program.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ status: false, message: "Program not found" });
    }

    res.json({
      status: true,
      message: "Program updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to update program",
      error: err.message,
    });
  }
};

// ✅ Delete Program
const deleteProgram = async (req, res) => {
  try {
    const deleted = await Program.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ status: false, message: "Program not found" });

    res.json({ status: true, message: "Program deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Failed to delete program", error: err.message });
  }
};

module.exports = { createProgram, getAllPrograms, getProgram, updateProgram, deleteProgram };
