const News = require("../models/News");

const createNews = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      short_description,
      description,
      year_id,
      date
    } = req.body;

    // ---- FILE PATHS SAME LIKE BANNER ----
    const image = req.files?.image
      ? `/uploads/news/${req.files.image[0].filename}`
      : null;

    const video = req.files?.video
      ? `/uploads/news/${req.files.video[0].filename}`
      : null;

    // ---- VALIDATION ----
    if (!title || !year_id || !date) {
      return res.status(400).json({
        status: false,
        message: "title, year_id, and date are required",
        data: null
      });
    }

    const news = new News({
      title,
      subtitle,
      short_description,
      description,
      year_id,
      date,
      image,
      video
    });

    await news.save();

    res.status(201).json({
      status: true,
      message: "News created successfully",
      data: news
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error creating news",
      error: err.message,
      data: null
    });
  }
};



// ✅ Get all news (with optional year filter)
const getAllNews = async (req, res) => {
  try {
    const { year_id } = req.query;  // get query string

    let filter = {};

    // Only apply filter if year_id exists AND is not empty
    if (year_id && year_id !== "") {
      filter.year_id = year_id;
    }

    const list = await News.find(filter).populate('year_id')
      .sort({ createdAt: -1 });

    res.json({
      status: true,
      message: "News fetched successfully",
      data: list,
      pagination: {
        totalItems: list.length,
      },
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Server error while fetching news",
      error: err.message,
      data: [],
    });
  }
};


// ✅ Get single news by ID
const getNewsById = async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id).populate("year_id", "year");
    if (!newsItem) {
      return res.status(404).json({
        status: false,
        message: "News not found",
        data: null,
      });
    }
  res.json({
      status: true,
      message: "News fetched successfully",
      data: newsItem,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Server error while fetching news",
      error: err.message,
      data: null,
    });
  }
};

const updateNews = async (req, res) => {
  try {
    const updatedData = req.body;

    if (req.files?.image) {
      updatedData.image = `/uploads/news/${req.files.image[0].filename}`;
    }

    if (req.files?.video) {
      updatedData.video = `/uploads/news/${req.files.video[0].filename}`;
    }

    const updated = await News.findByIdAndUpdate(req.params.id, updatedData, {
      new: true
    });

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "News not found"
      });
    }

    res.json({
      status: true,
      message: "News updated successfully",
      data: updated
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error updating news",
      error: err.message
    });
  }
};


// ✅ Delete news
const deleteNews = async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "News not found",
        data: null,
      });
    }

    res.json({
      status: true,
      message: "News deleted successfully",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Server error while deleting news",
      error: err.message,
      data: null,
    });
  }
};

module.exports = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
};
