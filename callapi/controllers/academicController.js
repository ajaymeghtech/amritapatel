const Academic = require("../models/academicModel");
const SubacademicModel = require("../models/SubacademicModel");

// CREATE
const createAcademic = async (req, res) => {
  try {
    const { title, subtitle, content, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        status: false,
        message: "Title and content are required",
      });
    }

    // Slug
    const slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    const exists = await Academic.findOne({ slug });
    if (exists) {
      return res.status(400).json({
        status: false,
        message: "Academic entry with similar title already exists",
      });
    }

    const image = req.file ? `/uploads/academic/${req.file.filename}` : null;

    const data = await Academic.create({
      title,
      subtitle,
      content,
      image,
      status,
      slug,
    });

    res.status(201).json({
      status: true,
      message: "Academic content created successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error creating Academic content",
      error: err.message,
    });
  }
};
 
// GET ALL
// const getAcademic = async (req, res) => {
//   try {
//     const list = await Academic.find().sort({ createdAt: -1 });

//     const finalResponse = await Promise.all(
//       list.map(async (item) => {
//         const subcategories = await SubActivities.find({
//           activityId: item._id,
//         });

//         return {
//           ...item._doc,
//           subcategories,
//         };
//       })
//     );

//     res.json({
//       status: true,
//       message: "Academic list with SubActivities fetched",
//       data: finalResponse,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: false,
//       message: err.message,
//     });
//   }
// };

const getAcademic = async (req, res) => {
  try {
    const AcademicList = await Academic.find().sort({ createdAt: -1 });

    const finalResponse = await Promise.all(
      AcademicList.map(async (item) => {
        const subacademic = await SubacademicModel.find({
          academicId: item._id,
        });

        return {
          ...item._doc,
          subacademic,
        };
      })
    );

    res.json({
      status: true,
      message: "Academic list with SubAcademic fetched",
      data: finalResponse,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// GET SINGLE
const getAcademicById = async (req, res) => {
  try {
    const data = await Academic.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Academic entry not found",
      });
    }

    res.json({
      status: true,
      message: "Academic data fetched successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching record",
      error: err.message,
    });
  }
};

// UPDATE
const updateAcademic = async (req, res) => {
  try {
    const updatedData = req.body;

    if (req.body.title) {
      updatedData.slug = req.body.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^a-z0-9\-]/g, "");
    }

    if (req.file) {
      updatedData.image = `/uploads/academic/${req.file.filename}`;
    }

    const updated = await Academic.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "Academic not found",
      });
    }

    res.json({
      status: true,
      message: "Academic updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error updating Academic",
      error: err.message,
    });
  }
};

// DELETE
const deleteAcademic = async (req, res) => {
  try {
    const deleted = await Academic.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Academic not found",
      });
    }

    res.json({
      status: true,
      message: "Academic deleted successfully",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error deleting Academic",
      error: err.message,
    });
  }
};

module.exports = {
  createAcademic,
  getAcademic,
  getAcademicById,
  updateAcademic,
  deleteAcademic,
};
