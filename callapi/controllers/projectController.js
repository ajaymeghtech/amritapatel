const Project = require("../models/Project");

// Create Project
const createProject = async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/projects/${req.file.filename}` : null;

    if (!req.body.project_title) {
      return res.status(400).json({
        status: false,
        message: "Project title is required",
        data: null,
      });
    }

    const project = new Project({
      ...req.body,
      project_image: imagePath,
    });

    await project.save();

    res.status(201).json({
      status: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to create project",
      error: err.message,
      data: null,
    });
  }
};

// Get All Projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    if (!projects.length) {
      return res.status(200).json({
        status: false,
        message: "No projects found",
        data: [],
      });
    }

    res.status(200).json({
      status: true,
      message: "Projects fetched successfully",
      data: projects,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Server error while fetching projects",
      error: err.message,
      data: [],
    });
  }
};

// Get Single Project
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        status: false,
        message: "Project not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Project fetched successfully",
      data: project,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching project",
      error: err.message,
      data: null,
    });
  }
};

// Update Project
const updateProject = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.project_image = `/uploads/projects/${req.file.filename}`;
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "Project not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Project updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to update project",
      error: err.message,
      data: null,
    });
  }
};

// Delete Project
const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to delete project",
      error: err.message, 
    });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
