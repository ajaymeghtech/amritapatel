const Research = require("../models/Research");
const ResearchSubcategory = require("../models/ResearchSubcategory");

// CREATE
const createResearch = async (req, res) => {
  try {
    const { title, short_description, description, researcher, status } = req.body;

    if (!title) {
      return res.status(400).json({
        status: false,
        message: "Title is required",
      });
    }

    const slug = title
      .toLowerCase() 
      .replace(/ /g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    const image = req.files?.image
      ? `/uploads/research/${req.files.image[0].filename}`
      : null;

    const pdf = req.files?.pdf
      ? `/uploads/research/${req.files.pdf[0].filename}`
      : null;

    const data = await Research.create({
      title,
      slug,
      short_description,
      description,
      researcher,
      image,
      pdf,
      status,
    });

    res.status(201).json({
      status: true,
      message: "Research entry created successfully",
      data,
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error creating research data",
      error: err.message,
    });
  }
};

// GET ALL
// const getResearch = async (req, res) => {
//   try {
//     const list = await Research.find().sort({ createdAt: -1 });

//     res.json({
//       status: true,
//       message: "Research data fetched",
//       data: list,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: false,
//       message: "Error fetching research",
//       error: err.message,
//     });
//   }
// };

const getResearch = async (req, res) => {
  try {
    const researchList = await Research.find().sort({ createdAt: -1 });

    const finalResponse = await Promise.all(
      researchList.map(async (item) => {
        const subcategories = await ResearchSubcategory.find({
          research_id: item._id,
        });

        return {
          ...item._doc,
          subcategories,
        };
      })
    );

    res.json({
      status: true,
      message: "Research list with subcategories fetched",
      data: finalResponse,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};



// // GET SINGLE
// const getResearchById = async (req, res) => {
//   try {
//     const data = await Research.findById(req.params.id);

//     if (!data) {
//       return res.status(404).json({
//         status: false,
//         message: "Research entry not found",
//       });
//     }

//     res.json({
//       status: true,
//       message: "Research fetched successfully",
//       data,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: false,
//       message: "Error fetching record",
//       error: err.message,
//     });
//   }
// };


const mongoose = require("mongoose");

// GET SINGLE — INCLUDING SUBCATEGORIES
const getResearchById = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Research.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },

      {
        $lookup: {
          from: "researchsubcategories", // collection name
          localField: "_id",
          foreignField: "research_id",
          as: "subcategories"
        }
      }
    ]);

    if (!data || data.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Research entry not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Research fetched successfully",
      data: data[0],
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
const updateResearch = async (req, res) => {
  try {
    const updatedData = req.body;

    if (req.body.title) {
      updatedData.slug = req.body.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^a-z0-9\-]/g, "");
    }

    if (req.files?.image) {
      updatedData.image = `/uploads/research/${req.files.image[0].filename}`;
    }
    if (req.files?.pdf) {
      updatedData.pdf = `/uploads/research/${req.files.pdf[0].filename}`;
    }

    const updated = await Research.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "Research entry not found",
      });
    }

    res.json({
      status: true,
      message: "Research updated successfully",
      data: updated,
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error updating research",
      error: err.message,
    });
  }
};

// DELETE
const deleteResearch = async (req, res) => {
  try {
    const deleted = await Research.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Research entry not found",
      });
    }

    res.json({
      status: true,
      message: "Research deleted successfully",
      data: deleted,
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error deleting research",
      error: err.message,
    });
  }
};

module.exports = {
  createResearch,
  getResearch,
  getResearchById,
  updateResearch,
  deleteResearch,
};
