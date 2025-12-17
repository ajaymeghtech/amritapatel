const CmsPage = require("../models/CmsPage");

// 📄 Create new CMS page
const createCmsPage = async (req, res) => {
    try {
      console.log("Incoming Body:", req.body);
      console.log("Incoming File:", req.file);
  
      // ✅ ensure req.body is not undefined
      if (!req.body) {
        return res.status(400).json({
          success: false,
          message: "No form data received. Use form-data in Postman.",
        });
      }
  
      const {
        page_key,
        title,
        slug,
        content,
        meta_title,
        meta_description,
        meta_keywords,
        description_1,
        description_2 ,
        status,
      } = req.body;
  
      const banner_image = req.file ? req.file.filename : "";
  
      const cmsPage = new CmsPage({
        page_key,
        title,
        slug,
        content,
        meta_title,
        meta_description,
        meta_keywords,
        banner_image,
        description_1,
        description_2,
        status,
      });
  
      await cmsPage.save();
      res.status(201).json({ success: true, data: cmsPage });
    } catch (error) {
      console.error("Error creating CMS:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

// 📋 Get all CMS pages
const getAllCmsPages = async (req, res) => {
  try {
    const pages = await CmsPage.find().sort({ createdAt: -1 });
    res.json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔍 Get single page by key or slug
const getCmsPageByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const page = await CmsPage.findOne({ page_key: key });
    if (!page) return res.status(404).json({ success: false, message: "Page not found" });
    res.json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Update page
const updateCmsPage = async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };
    if (req.file) {
      update.banner_image = req.file.filename;
    }
    const page = await CmsPage.findByIdAndUpdate(id, update, { new: true });
    if (!page) return res.status(404).json({ success: false, message: "Page not found" });
    res.json({ success: true, message: "Page updated successfully", data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ❌ Delete page
const deleteCmsPage = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await CmsPage.findByIdAndDelete(id);
    if (!page) return res.status(404).json({ success: false, message: "Page not found" });
    res.json({ success: true, message: "Page deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCmsPage,
  getAllCmsPages,
  getCmsPageByKey,
  updateCmsPage,
  deleteCmsPage,
};
