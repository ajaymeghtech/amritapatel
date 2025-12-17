const StudentLife = require("../models/StudentLife");

const normalizeRichText = (value) => {
  if (typeof value === "string") return value;
  if (value?.target?.value) return value.target.value;
  if (value?.value) return value.value;
  if (value == null) return "";
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
};

const createStudentLife = async (req, res) => {
  try {
    const { title, short_description, description, views } = req.body;
    const normalizedDescription = normalizeRichText(description);

    if (!title) {
      return res.status(400).json({
        status: false,
        message: "Title is required",
      });
    }

    // Auto-generate slug
    const slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    const existing = await StudentLife.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        status: false,
        message: "A record with similar title already exists",
      });
    }

    const data = await StudentLife.create({
      title,
      slug,
      short_description,
      description: normalizedDescription,
      views,
    });

    res.status(201).json({
      status: true,
      message: "Student life created successfully",
      data,
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error creating student life",
      error: err.message,
    });
  }
};


const getStudentLife = async (req, res) => {
  try {
    const list = await StudentLife.find()
      .populate({
        path: "images",
        model: "StudentLifeImage"
      }) .populate({
        path: "pdfs",
        model: "StudentLifePDF"
      })
      .sort({ createdAt: -1 });

    res.json({
      status: true,
      message: "Student Life items fetched successfully",
      count: list.length,
      data: list
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching Student Life",
      error: err.message
    });
  }
};




// 👉 Get single
const getStudentLifeById = async (req, res) => {
  try {
    const data = await StudentLife.findById(req.params.id)
    .populate({
      path: "images",
      model: "StudentLifeImage"
    }) .populate({
      path: "pdfs",
      model: "StudentLifePDF"
    });

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Student Life item not found"
      });
    }

    res.json({
      status: true,
      message: "Student Life item fetched successfully",
      data
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching Student Life item",
      error: err.message
    });
  }
};


// 👉 Update
const updateStudentLife = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (updatedData.description !== undefined) {
      updatedData.description = normalizeRichText(updatedData.description);
    }

    if (req.body.title) {
      updatedData.slug = req.body.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^a-z0-9\-]/g, "");
    }

    const updated = await StudentLife.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "Student Life entry not found",
      });
    }

    res.json({
      status: true,
      message: "Student life updated successfully",
      data: updated,
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error updating student life",
      error: err.message,
    });
  }
};


// 👉 Delete
const deleteStudentLife = async (req, res) => {
  try {
    const deleted = await StudentLife.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Student Life item not found"
      });
    }

    res.json({
      status: true,
      message: "Student Life item deleted successfully",
      data: deleted
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error deleting Student Life",
      error: err.message
    });
  }
};


module.exports = {
  createStudentLife,
  getStudentLife,
  getStudentLifeById,
  updateStudentLife,
  deleteStudentLife,
};
