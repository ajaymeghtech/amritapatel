const Activities = require("../models/Activities");
const SubActivities = require("../models/SubActivities");
const VideoTestimonial = require("../models/VideoTestimonial");

// CREATE
const createActivities = async (req, res) => {
  try {
    const { title, subtitle, content, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        status: false,
        message: "Title and content are required",
      });
    }

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    // If uploading image (optional)
    const image = req.file ? `/uploads/activities/${req.file.filename}` : null;

    const exists = await Activities.findOne({ slug });
    if (exists) {
      return res.status(400).json({
        status: false,
        message: "Activities entry with similar title already exists",
      });
    }

    const data = await Activities.create({
      title,
      subtitle,
      content,
      image,
      status,
    });

    res.status(201).json({
      status: true,
      message: "Activities content created successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error creating Activities content",
      error: err.message,
    });
  }
};

// GET ALL
// const getActivities = async (req, res) => {
//   try {
//     const list = await Activities.find().sort({ createdAt: -1 });
//     res.json({
//       status: true,
//       message: "Activities fetched successfully",
//       data: list,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: false,
//       message: "Error fetching Activities data",
//       error: err.message,
//     });
//   }
// }; 


// const getActivities = async (req, res) => {
//   try {
//     const activitiesList = await Activities.find().sort({ createdAt: -1 });

//     const finalResponse = await Promise.all(
//       activitiesList.map(async (item) => {
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
//       message: "Activities list with SubActivities fetched",
//       data: finalResponse,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: false,
//       message: err.message,
//     });
//   }
// };


const getActivities = async (req, res) => {
  try {
    const activitiesList = await Activities.find().sort({ createdAt: -1 });

    const finalResponse = await Promise.all(
      activitiesList.map(async (item) => {
        const subcategories = await SubActivities.find({
          activityId: item._id,
        });

        const testimonial_video = await VideoTestimonial.find({
          activityId: item._id,
        });

        return {
          ...item._doc,
          subcategories,
          testimonial_video,
        };
      })
    );

    res.json({
      status: true,
      message: "Activities list with SubActivities & Testimonial Videos fetched",
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
const getActivitiesById = async (req, res) => {
  try {
    const data = await Activities.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Activities entry not found",
      });
    }

    res.json({
      status: true,
      message: "Activities data fetched successfully",
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
const updateActivities = async (req, res) => {
  try {
    const updatedData = req.body;

    // If title updated, regenerate slug
    if (req.body.title) {
      updatedData.slug = req.body.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^a-z0-9\-]/g, "");
    }

    if (req.file) {
      updatedData.image = `/uploads/activities/${req.file.filename}`;
    }

    const updated = await Activities.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "Activities not found",
      });
    }

    res.json({
      status: true,
      message: "Activities updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error updating Activities",
      error: err.message,
    });
  }
};

// DELETE
const deleteActivities = async (req, res) => {
  try {
    const deleted = await Activities.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Activities not found",
      });
    }

    res.json({
      status: true,
      message: "Activities deleted successfully",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error deleting Activities",
      error: err.message,
    });
  }
};

module.exports = {
  createActivities,
  getActivities,
  getActivitiesById,
  updateActivities,
  deleteActivities,
};
