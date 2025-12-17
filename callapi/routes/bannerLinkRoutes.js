const express = require("express");
const router = express.Router();
const BannerLink = require("../models/BannerLink");

// ✅ Get all banner links (with status + message)
router.get("/", async (req, res) => {
    try {
      const data = await BannerLink.find();
  
      if (data.length === 0) {
        return res.status(200).json({
          status: false,
          message: "Data not found",
          data: [],
        });
      }
  
      res.status(200).json({
        status: true,
        message: "Data successfully fetched",
        data: data,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Server error",
        error: err.message,
      });
    }
  });
  


  router.get("/:id", async (req, res) => {
    console.log(req.params.id);
    try {
      const data = await BannerLink.findById(req.params.id);
  
      if (!data) {
        return res.status(404).json({
          status: false,
          message: "Banner link not found",
          data: null, // better to use null instead of []
        });
      }
  
      res.status(200).json({
        status: true,
        message: "Banner link found successfully",
        data: data,
      });
  
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Server error",
        error: err.message,
      });
    }
  });
  

// ✅ Add new banner link
router.post("/", async (req, res) => {
    try {
      const data = new BannerLink(req.body);
      await data.save();
  
      res.status(201).json({
        status: true,
        message: "Banner link added successfully",
        data: data,
      });
    } catch (err) {
      res.status(400).json({
        status: false,
        message: "Failed to add banner link",
        error: err.message,
        data: null,
      });
    }
  });
  

// ✅ Update existing banner link
router.put("/:id", async (req, res) => {
    try {
      const data = await BannerLink.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
      if (!data) {
        return res.status(404).json({
          status: false,
          message: "Banner link not found",
          data: null,
        });
      }
  
      res.status(200).json({
        status: true,
        message: "Banner link updated successfully",
        data: data,
      });
    } catch (err) {
      res.status(400).json({
        status: false,
        message: "Failed to update banner link",
        error: err.message,
        data: null,
      });
    }
  });
  



// ✅ Delete banner link
// ✅ Delete banner link (with status + message)
router.delete("/:id", async (req, res) => {
    try {
      const data = await BannerLink.findByIdAndDelete(req.params.id);
  
      if (!data) {
        return res.status(404).json({
          status: false,
          message: "Banner link not found",
        });
      }
  
      res.status(200).json({
        status: true,
        message: "Banner link deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Server error",
        error: err.message,
      });
    }
  });
  

module.exports = router;
