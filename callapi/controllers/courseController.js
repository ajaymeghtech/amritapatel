const Course = require("../models/Course");

// Create Course
exports.createCourse = async (req, res) => {
  try {
    const { name, description, sortOrder } = req.body;

    if (!name || !description || !sortOrder || sortOrder < 0) {
      return res.status(400).json({
        status: false,
        message: "Course name, description, and sort order are required",
      });
    }

    const course = new Course({ name, description, sortOrder });
    await course.save();

    res.status(201).json({
      status: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error creating course",
      error: error.message,
    });
  }
};

// Get All Courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
};

// Get Course By ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Course fetched successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching course",
      error: error.message,
    });
  }
};

// Update Course
exports.updateCourse = async (req, res) => {
  try {
    const { name, description, sortOrder } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { name, description, sortOrder },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        status: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error updating course",
      error: error.message,
    });
  }
};

// Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error deleting course",
      error: error.message,
    });
  }
};
