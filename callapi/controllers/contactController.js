const Contact = require("../models/Contact");
const transporter = require("../utils/mailer");


// CREATE Contact Message
// CREATE Contact Message
const createContact = async (req, res) => {
  let adminEmailStatus = false;
  let userEmailStatus = false;
  let emailError = null;

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      message,
      institute,
      course
    } = req.body;

    if (!firstName || !email || !message) {
      return res.status(400).json({
        status: false,
        message: "First name, Email and Message are required",
      });
    }

    // 1️⃣ Save contact in DB
    const contact = new Contact({
      firstName,
      lastName,
      email,
      phone,
      message,
      institute,
      course,
    });

    await contact.save();

    /* ================= ADMIN EMAIL ================= */
    try {
      const adminInfo = await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: process.env.SMTP_FROM_EMAIL,
        subject: "New Contact Us Enquiry",
        html: `
          <h3>New Contact Enquiry</h3>
          <p><b>Name:</b> ${firstName} ${lastName || ""}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone || "-"}</p>
          <p><b>Institute:</b> ${institute || "-"}</p>
          <p><b>Course:</b> ${course || "-"}</p>
          <p><b>Message:</b><br/>${message}</p>
        `,
      });

      adminEmailStatus = true;
      console.log("✅ Admin email sent:", adminInfo.messageId);

    } catch (err) {
      emailError = err.message;
      console.error("❌ Admin email failed:", err);
    }

    /* ================= USER AUTO-REPLY ================= */
    try {
      const userInfo = await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: email,
        subject: "Thank you for contacting us",
        html: `
          <p>Dear ${firstName},</p>
          <p>
            Thank you for contacting 
            <b>${process.env.SMTP_FROM_NAME}</b>.
            We have received your enquiry and our team will
            get back to you shortly.
          </p>

          <p><b>Your Message:</b><br/>${message}</p>

          <br/>
          <p>Regards,<br/>
          ${process.env.SMTP_FROM_NAME}</p>
        `,
      });

      userEmailStatus = true;
      console.log("✅ User auto-reply sent:", userInfo.messageId);

    } catch (err) {
      emailError = err.message;
      console.error("❌ User email failed:", err);
    }

    /* ================= FINAL RESPONSE ================= */
    return res.status(201).json({
      status: true,
      message: "Contact submitted successfully",
      data: contact,
      email: {
        adminSent: adminEmailStatus,
        userSent: userEmailStatus,
        error: emailError,
      },
    });

  } catch (err) {
    console.error("Contact Error:", err);

    return res.status(500).json({
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
