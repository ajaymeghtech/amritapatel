const fs = require("fs");
const path = require("path");
const Event = require("../models/Event");

// ✅ Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });

    if (!events.length) {
      return res.status(200).json({
        status: false,
        message: "No events found",
        data: [],
      });
    }

    res.status(200).json({
      status: true,
      message: "Events fetched successfully",
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Server error while fetching events",
      error: err.message,
    });
  }
};

// ✅ Get single event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: false,
        message: "Event not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Event fetched successfully",
      data: event,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching event",
      error: err.message,
    });
  }
};

// ✅ Create event
const createEvent = async (req, res) => {
  try {
    const { name, description, date, location, author } = req.body;

    if (!name || !date) {
      return res.status(400).json({
        status: false,
        message: "Name and date are required",
        data: null,
      });
    }

    const event = new Event({
      name,
      description,
      date,
      location,
      author,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await event.save();

    res.status(201).json({
      status: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to create event",
      error: err.message,
      data: null,
    });
  }
};

// ✅ Update event
const updateEvent = async (req, res) => {
  try {
    const { name, description, date, location, author } = req.body;
    const updateData = { name, description, date, location, author };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({
        status: false,
        message: "Event not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to update event",
      error: err.message,
      data: null,
    });
  }
};

// ✅ Delete event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: false,
        message: "Event not found",
      });
    }

    // Delete image if exists
    if (event.image) {
      const imagePath = path.join(__dirname, `../${event.image}`);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    res.status(200).json({
      status: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to delete event",
      error: err.message,
    });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
