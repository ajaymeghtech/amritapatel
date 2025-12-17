const StudentLifePDF = require("../models/StudentLifePDF");
const StudentLife = require("../models/StudentLife");

exports.createStudentLifePDF = async (req, res) => {
  try {
    const { student_life_id, title } = req.body;

    if (!student_life_id || !title || !req.file) {
      return res.status(400).json({
        status: false,
        message: "student_life_id, title and pdf file are required"
      });
    }

    const pdfPath = `/uploads/student-life-pdf/${req.file.filename}`;

    // Create PDF Record
    const newRecord = await StudentLifePDF.create({
      student_life_id,
      title,
      pdf: pdfPath
    });

    // Link PDF with StudentLife Document (optional if you want)
    await StudentLife.findByIdAndUpdate(
      student_life_id,
      { $addToSet: { pdfs: newRecord._id } },
      { new: true }
    );

    res.status(201).json({
      status: true,
      message: "PDF uploaded and linked successfully",
      data: newRecord
    });

  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

exports.getStudentLifePDFs = async (req, res) => {
    const { student_life_id } = req.query;
  
    const filter = student_life_id ? { student_life_id } : {};
  
    const pdfs = await StudentLifePDF.find(filter).sort({ createdAt: -1 });
  
    if (pdfs.length === 0) {
      return res.status(200).json({
        status: false,
        message: student_life_id
          ? "No PDFs found for this Student Life section"
          : "No PDFs available",
        data: []
      });
    }
  
    return res.status(200).json({
      status: true,
      message: "PDFs fetched successfully",
      data: pdfs
    });
  };
  

// Delete PDF
exports.deleteStudentLifePDF = async (req, res) => {
  try {
    await StudentLifePDF.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: true, message: "PDF deleted successfully" });

  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

exports.updateStudentLifePDF = async (req, res) => {
  const { id } = req.params;
  const { title, student_life_id } = req.body;

  // Find existing
  const record = await StudentLifePDF.findById(id);
  if (!record) {
    return res.status(200).json({
      status: false,
      message: "PDF record not found",
      data: null
    });
  }

  let pdfPath = record.pdf;

  // If new file uploaded → replace old PDF path
  if (req.file) {
    pdfPath = `/uploads/student-life-pdf/${req.file.filename}`;
  }

  // Update record
  record.title = title || record.title;
  record.pdf = pdfPath;
  record.student_life_id = student_life_id || record.student_life_id;
  record.updatedAt = new Date();

  await record.save();

  return res.status(200).json({
    status: true,
    message: "PDF updated successfully",
    data: record
  });
};

