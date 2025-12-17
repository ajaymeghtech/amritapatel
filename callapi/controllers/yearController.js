const Year = require("../models/Year");



// GET All Contacts
const getAllYears = async (req, res) => {
  try {
    const years = await Year.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Years fetched successfully",
      data: years,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching years",
      error: err.message,
    });
  }
};
const createYear = async (req, res) => {
  try {
    const year = new Year(req.body);

    await year.save();
    res.status(201).json({ status: true, message: "Year created successfully", data: year });
  } catch (err) {

    if (err.code === 11000) {
        return res.status(400).json({ status: false, message: "Year already exists" });
      }
      
    res.status(500).json({ status: false, message: "Error creating year", error: err.message });
  }
};
const getYearById = async (req, res) => {
  try {
    const year = await Year.findById(req.params.id);
    res.status(200).json({ status: true, message: "Year fetched successfully", data: year });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching year", error: err.message });
  }
};

const deleteYear = async (req, res) => {
  try {
        const year = await Year.findByIdAndDelete(req.params.id);
        if(!year) {
        return res.status(404).json({ status: false, message: "Year not found" });
        }
    res.status(200).json({ status: true, message: "Year deleted successfully" });
    } catch (err) {
      res.status(500).json({ status: false, message: "Error deleting year", error: err.message });
    }
};



const updateYearById = async (req, res) => {

  try {
    const year = await Year.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if(!year) {
      return res.status(404).json({ status: false, message: "Year not found" });
    }
    res.status(200).json({ status: true, message: "Year updated successfully", data: year });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error updating year", error: err.message });
  }
};

module.exports = {
 getAllYears,
 createYear,
 getYearById,
 updateYearById,
 deleteYear
};
