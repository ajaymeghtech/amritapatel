const fs = require("fs");
const path = require("path");
const TestimonialCategory = require("../models/testimonialCategoryModel");

// CREATE
exports.createTestimonialCategory = async (req, res) => {
  try {
    const category = new TestimonialCategory({
      title: req.body.title,
      description: req.body.description || "",
      status: req.body.status || "active",
      sortOrder: req.body.sortOrder || 0,
    });

    await category.save();

    res.status(201).json({
      status: true,
      message: "Testimonial category created successfully",
      data: category,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// GET ALL
exports.getAllTestimonialCategories = async (req, res) => {
  try {
    const data = await TestimonialCategory.find().sort({ sortOrder: 1, createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Testimonial categories fetched successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// GET ONE
exports.getTestimonialCategoryById = async (req, res) => {
  try {
    const item = await TestimonialCategory.findById(req.params.id);

    if (!item)
      return res.status(404).json({ status: false, message: "Not found" });

    res.status(200).json({
      status: true,
      message: "Testimonial category fetched successfully",
      data: item,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// UPDATE
exports.updateTestimonialCategory = async (req, res) => {
  try {
    const item = await TestimonialCategory.findById(req.params.id);
    if (!item)
      return res.status(404).json({ status: false, message: "Not found" });

    item.title = req.body.title || item.title;
    item.description = req.body.description !== undefined ? req.body.description : item.description;
    item.status = req.body.status || item.status;
    item.sortOrder = req.body.sortOrder !== undefined ? req.body.sortOrder : item.sortOrder;

    await item.save();

    res.status(200).json({
      status: true,
      message: "Testimonial category updated successfully",
      data: item,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// DELETE
exports.deleteTestimonialCategory = async (req, res) => {
  try {
    const item = await TestimonialCategory.findById(req.params.id);
    if (!item)
      return res.status(404).json({ status: false, message: "Not found" });

    // Delete all photos and thumbnails from nested arrays
    if (item.testimonials) {
      item.testimonials.forEach((testimonial) => {
        if (testimonial.photo) {
          const photoPath = path.join(__dirname, "..", testimonial.photo);
          if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
        }
      });
    }
    if (item.videos) {
      item.videos.forEach((video) => {
        if (video.thumbnail) {
          const thumbPath = path.join(__dirname, "..", video.thumbnail);
          if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
        }
      });
    }

    await item.deleteOne();

    res.status(200).json({
      status: true,
      message: "Testimonial category deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// ========== TESTIMONIALS MANAGEMENT (Nested) ==========

// Add Testimonial to Category
exports.addTestimonial = async (req, res) => {
  try {
    const category = await TestimonialCategory.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ status: false, message: "Category not found" });

    const photoPath = req.file ? `/uploads/testimonials/${req.file.filename}` : null;

    const newTestimonial = {
      name: req.body.name,
      designation: req.body.designation || "",
      institute: req.body.institute || "",
      message: req.body.message || "",
      rating: req.body.rating ? parseInt(req.body.rating) : null,
      photo: photoPath,
      status: req.body.status || "active",
      sortOrder: req.body.sortOrder ? parseInt(req.body.sortOrder) : 0,
    };

    category.testimonials.push(newTestimonial);
    await category.save();

    res.status(201).json({
      status: true,
      message: "Testimonial added successfully",
      data: category.testimonials[category.testimonials.length - 1],
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Update Testimonial in Category
exports.updateTestimonial = async (req, res) => {
  try {
    const category = await TestimonialCategory.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ status: false, message: "Category not found" });

    const testimonial = category.testimonials.id(req.params.testimonialId);
    if (!testimonial) return res.status(404).json({ status: false, message: "Testimonial not found" });

    let photoPath = testimonial.photo;
    if (req.file) {
      // Delete old photo
      if (photoPath) {
        const oldPhotoPath = path.join(__dirname, "..", photoPath);
        if (fs.existsSync(oldPhotoPath)) fs.unlinkSync(oldPhotoPath);
      }
      photoPath = `/uploads/testimonials/${req.file.filename}`;
    }

    testimonial.name = req.body.name || testimonial.name;
    testimonial.designation = req.body.designation !== undefined ? req.body.designation : testimonial.designation;
    testimonial.institute = req.body.institute !== undefined ? req.body.institute : testimonial.institute;
    testimonial.message = req.body.message || testimonial.message;
    testimonial.rating = req.body.rating ? parseInt(req.body.rating) : testimonial.rating;
    testimonial.status = req.body.status || testimonial.status;
    testimonial.sortOrder = req.body.sortOrder !== undefined ? parseInt(req.body.sortOrder) : testimonial.sortOrder;
    testimonial.photo = photoPath;

    await category.save();

    res.status(200).json({
      status: true,
      message: "Testimonial updated successfully",
      data: testimonial,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Delete Testimonial from Category
exports.deleteTestimonial = async (req, res) => {
  try {
    const category = await TestimonialCategory.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ status: false, message: "Category not found" });

    const testimonial = category.testimonials.id(req.params.testimonialId);
    if (!testimonial) return res.status(404).json({ status: false, message: "Testimonial not found" });

    // Delete photo file
    if (testimonial.photo) {
      const photoPath = path.join(__dirname, "..", testimonial.photo);
      if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
    }

    category.testimonials.pull(req.params.testimonialId);
    await category.save();

    res.status(200).json({
      status: true,
      message: "Testimonial deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Get All Testimonials (flattened from all categories or filtered by category)
exports.getAllTestimonials = async (req, res) => {
  try {
    const { category_id } = req.query;
    let filter = {};

    if (category_id) {
      filter._id = category_id;
    }

    const categories = await TestimonialCategory.find(filter);
    const allTestimonials = [];

    categories.forEach((category) => {
      category.testimonials.forEach((testimonial) => {
        allTestimonials.push({
          ...testimonial.toObject(),
          category_id: category._id,
          category_title: category.title,
        });
      });
    });

    res.status(200).json({
      status: true,
      message: "Testimonials fetched successfully",
      data: allTestimonials,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// ========== VIDEOS MANAGEMENT (Nested) ==========

// Add Video to Category
exports.addVideo = async (req, res) => {
  try {
    const category = await TestimonialCategory.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ status: false, message: "Category not found" });

    const thumbnailPath = req.file ? `/uploads/testimonial-videos/${req.file.filename}` : null;

    const newVideo = {
      title: req.body.title,
      video_url: req.body.video_url,
      thumbnail: thumbnailPath,
      description: req.body.description || "",
      status: req.body.status || "active",
      sortOrder: req.body.sortOrder ? parseInt(req.body.sortOrder) : 0,
    };

    category.videos.push(newVideo);
    await category.save();

    res.status(201).json({
      status: true,
      message: "Video added successfully",
      data: category.videos[category.videos.length - 1],
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Update Video in Category
exports.updateVideo = async (req, res) => {
  try {
    const category = await TestimonialCategory.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ status: false, message: "Category not found" });

    const video = category.videos.id(req.params.videoId);
    if (!video) return res.status(404).json({ status: false, message: "Video not found" });

    let thumbnailPath = video.thumbnail;
    if (req.file) {
      // Delete old thumbnail
      if (thumbnailPath) {
        const oldThumbPath = path.join(__dirname, "..", thumbnailPath);
        if (fs.existsSync(oldThumbPath)) fs.unlinkSync(oldThumbPath);
      }
      thumbnailPath = `/uploads/testimonial-videos/${req.file.filename}`;
    }

    video.title = req.body.title || video.title;
    video.video_url = req.body.video_url || video.video_url;
    video.description = req.body.description !== undefined ? req.body.description : video.description;
    video.status = req.body.status || video.status;
    video.sortOrder = req.body.sortOrder !== undefined ? parseInt(req.body.sortOrder) : video.sortOrder;
    video.thumbnail = thumbnailPath;

    await category.save();

    res.status(200).json({
      status: true,
      message: "Video updated successfully",
      data: video,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Delete Video from Category
exports.deleteVideo = async (req, res) => {
  try {
    const category = await TestimonialCategory.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ status: false, message: "Category not found" });

    const video = category.videos.id(req.params.videoId);
    if (!video) return res.status(404).json({ status: false, message: "Video not found" });

    // Delete thumbnail file
    if (video.thumbnail) {
      const thumbPath = path.join(__dirname, "..", video.thumbnail);
      if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
    }

    category.videos.pull(req.params.videoId);
    await category.save();

    res.status(200).json({
      status: true,
      message: "Video deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Get All Videos (flattened from all categories or filtered by category)
exports.getAllVideos = async (req, res) => {
  try {
    const { category_id } = req.query;
    let filter = {};

    if (category_id) {
      filter._id = category_id;
    }

    const categories = await TestimonialCategory.find(filter);
    const allVideos = [];

    categories.forEach((category) => {
      category.videos.forEach((video) => {
        allVideos.push({
          ...video.toObject(),
          category_id: category._id,
          category_title: category.title,
        });
      });
    });

    res.status(200).json({
      status: true,
      message: "Videos fetched successfully",
      data: allVideos,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

