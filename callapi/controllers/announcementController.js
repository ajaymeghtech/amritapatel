const Announcement = require("../models/Announcement");
const AnnouncementYear = require("../models/AnnouncementYear");
const AnnouncementImage = require("../models/AnnouncementImage");
const mongoose = require("mongoose");


// --- Date Parsing Utility (unchanged) ---
function parseClientDateToUTC(dateStr) {
  if (!dateStr) return null;
  if (dateStr instanceof Date && !isNaN(dateStr)) return dateStr;

  const s = String(dateStr).trim();
  const isoMatch = s.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);

  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return new Date(Date.UTC(parseInt(y), parseInt(m) - 1, parseInt(d)));
  }

  const parts = s.split(/[-\/]/).map(p => parseInt(p));
  if (parts.length === 3 && parts.every(n => !isNaN(n))) {
    let [a, b, c] = parts;

    if (c > 31) {
      if (a > 12) return new Date(Date.UTC(c, b - 1, a));
      if (b > 12) return new Date(Date.UTC(c, a - 1, b));
      return new Date(Date.UTC(c, b - 1, a));
    }
  }

  const fb = new Date(s);
  return !isNaN(fb) ? fb : null;
}

// --------------------------------------
// CREATE
// --------------------------------------
const createAnnouncement = async (req, res) => {
  try {
    const body = { ...req.body };

    // NEW: store image path if uploaded
    if (req.file) {
      body.image = `/uploads/announcements/${req.file.filename}`;
    }

    if (body.date) {
      const parsed = parseClientDateToUTC(body.date);
      body.date = parsed || undefined;
    }

    const announcement = new Announcement(body);
    await announcement.save();

    res.status(201).json({
      status: true,
      message: "Announcement added successfully",
      data: announcement,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to add announcement",
      error: err.message,
      data: null,
    });
  }
};

// --------------------------------------
// GET ALL
// --------------------------------------
// const getAllAnnouncements = async (req, res) => {
//   try {
//     const { year, category, isPublished, announcement_year_id = "" } = req.query;
//     const filter = {};

//     if (category) filter.category = category;
//     if (announcement_year_id !== "") filter.announcement_year_id = announcement_year_id;
//     if (typeof isPublished !== "undefined") {
//       filter.isPublished = isPublished === "true";
//     }

//     if (year) {
//       const y = parseInt(year);
//       if (!isNaN(y)) {
//         filter.date = {
//           $gte: new Date(Date.UTC(y, 0, 1)),
//           $lt: new Date(Date.UTC(y + 1, 0, 1)),
//         };
//       }
//     }

//     const data = await Announcement.find(filter).sort({ createdAt: -1 }).populate('announcement_year_id');

//     res.json({
//       status: true,
//       message: "Announcements fetched successfully",
//       data,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: false,
//       message: "Failed to fetch announcements",
//       error: err.message,
//       data: [],
//     });
//   }
// };




const getAllAnnouncements = async (req, res) => {
  try {
    const { announcement_year_id } = req.query;

    const filter = {};

    // Convert to ObjectId if exists
    if (announcement_year_id) {
      filter.announcement_year_id = new mongoose.Types.ObjectId(announcement_year_id);
    }

    const data = await Announcement.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "announcementyears",
          localField: "announcement_year_id",
          foreignField: "_id",
          as: "announcement_year"
        }
      },
      { $unwind: { path: "$announcement_year", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "announcementimages",
          localField: "_id",
          foreignField: "announcement_id",
          as: "images"
        }
      },
      {
        $addFields: {
          announcement_year_label: "$announcement_year.year"
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.json({ status: true, message: "Announcements fetched", data });

  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};



// --------------------------------------
// GET ONE
// --------------------------------------
const getAnnouncement = async (req, res) => {
  try {
    const { announcement_year_id = "" } = req.query;
    const data = await Announcement.findById(req.params.id).populate("announcement_year_id").populate("images");
    if (announcement_year_id !== "") {
      data.announcement_year_id = announcement_year_id;
    }
    const images = await AnnouncementImage.find({ announcement_id: req.params.id });
    if (images.length > 0) {
      data.images = images;
    }
    else {
      data.images = [];
    }
  res.json({
      status: true,
      message: "Announcement fetched successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch announcement",
      error: err.message,
      data: null,
    });
  }
};

// const getAnnouncement = async (req, res) => {
//   try {
//     const id = req.params.id;

//     const data = await Announcement.aggregate([
//       { $match: { _id: new mongoose.Types.ObjectId(id) } },

//       {
//         $lookup: {
//           from: "announcementimages",
//           localField: "_id",
//           foreignField: "announcement_id",
//           as: "images"
//         }
//       }
//     ]);

//     res.json({
//       status: true,
//       message: "Announcement fetched successfully",
//       data: data[0],
//     });
//   } catch (err) {
//     res.status(500).json({ status: false, message: err.message });
//   }
// };


// --------------------------------------
// UPDATE
// --------------------------------------
const updateAnnouncement = async (req, res) => {
  try {
    const update = { ...req.body };

    // NEW: update image if uploaded
    if (req.file) {
      update.image = `/uploads/announcements/${req.file.filename}`;
    }

    if (update.date) {
      const parsed = parseClientDateToUTC(update.date);
      update.date = parsed || undefined;
    }

    if (update.announcement_year_id) {
      const announcementYear = await AnnouncementYear.findById(update.announcement_year_id);
      update.announcement_year_id = announcementYear._id;
    }
    const data = await Announcement.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Announcement not found",
        data: null,
      });
    }

    res.json({
      status: true,
      message: "Announcement updated successfully",
      data,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to update announcement",
      error: err.message,
      data: null,
    });
  }
};

// --------------------------------------
// DELETE
// --------------------------------------
const deleteAnnouncement = async (req, res) => {
  try {
    const data = await Announcement.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Announcement not found",
        data: null,
      });
    }

    res.json({
      status: true,
      message: "Announcement deleted successfully",
      data,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to delete announcement",
      error: err.message,
      data: null,
    });
  }
};

module.exports = {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
