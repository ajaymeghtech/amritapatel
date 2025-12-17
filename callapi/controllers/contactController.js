const Contact = require("../models/Contact");

// CREATE Contact Message
const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message, institute, course } = req.body;

    if (!firstName || !email || !message) {
      return res.status(400).json({
        status: false,
        message: "Name, Email, Subject and Message are required",
      });
    }

    const contact = new Contact({ firstName, lastName, email, phone, message, institute, course });
    await contact.save();

    res.status(201).json({
      status: true,
      message: "Contact message submitted successfully",
      data: contact,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error creating contact message",
      error: err.message,
    });
  }
};

// GET All Contacts
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Contacts fetched successfully",
      data: contacts,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching contacts",
      error: err.message,
    });
  }
};

// GET Single Contact
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Contact fetched successfully",
      data: contact,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching contact",
      error: err.message,
    });
  }
};

// DELETE Contact
const deleteContact = async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Contact deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error deleting contact",
      error: err.message,
    });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  deleteContact,
};
