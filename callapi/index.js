require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON bodies

app.get('/api/test', (req, res) => {
  res.json({ status: true, message: 'API working fine' });
});

const newsRouter = require('./routes/news');
const yearRouter = require('./routes/yearRouter');
const announcementsRoutes = require('./routes/announcements');
const announcementYearRoutes = require('./routes/announcementYearRoutes');
const pressRoutes = require("./routes/pressRoutes");
const pressYearRoutes = require('./routes/pressYearRoutes');
const studentLifeRoutes = require('./routes/studentLifeRoutes');
const aboutUsRoutes = require('./routes/aboutUsRoutes');
const researchRoutes = require('./routes/researchRoutes');
const settingRoutes = require("./routes/settingRoutes");
const studentLifeImageRoutes = require("./routes/studentLifeImageRoutes");
const studentLifePDFRoutes = require("./routes/studentLifePDFRoutes");
const testimonialRouter = require('./routes/testimonial');
const activitiesRouter = require("./routes/activitiesRoutes");
const subactivitiesRouter = require("./routes/subactivitiesRoutes");
const faqRouter = require("./routes/faq");

const videoTestimonial = require("./routes/videoTestimonialRoutes");
const academicRouter = require("./routes/academicRoutes")
const subAcademicRouter = require("./routes/subAcademicRoutes");

// routes
app.use('/api/news', newsRouter);
app.use('/api/news-years', yearRouter);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/announcement-years', announcementYearRoutes);
app.use("/api/press", pressRoutes);
app.use("/api/press-years", pressYearRoutes);
app.use("/api/student-life", studentLifeRoutes);
app.use("/api/student-life-images", studentLifeImageRoutes);
app.use("/api/about-us", aboutUsRoutes);
app.use("/api/research", researchRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/student-life-pdfs", studentLifePDFRoutes);
app.use('/api/testimonials', testimonialRouter);
app.use("/api/faq", faqRouter);


app.use("/api/activities", activitiesRouter);
app.use("/api/subactivities", subactivitiesRouter);
app.use("/api/video-testimonial", videoTestimonial);
app.use("/api/academic", academicRouter);
app.use("/api/sub-academic", subAcademicRouter);


//Banners
const bannerRoutes = require('./routes/bannerRoutes');
app.use('/api/banners', bannerRoutes);

const aboutRoutes = require('./routes/aboutRoutes');
app.use('/api/about', aboutRoutes);

const projectRoutes = require('./routes/projectRoutes');
app.use('/api/projects', projectRoutes);

//login api this 
app.use('/api/auth', require('./routes/auth'));
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Banner Links
const bannerLinkRoutes = require('./routes/bannerLinkRoutes');
app.use("/api/banner-links", bannerLinkRoutes);

const videoRoutes = require("./routes/videoRoutes");
app.use("/api/videos", videoRoutes);

//  Academic Calendars 
const academicCalendarRoutes = require('./routes/academicCalendarRoutes');
app.use('/api/academic-calendars', academicCalendarRoutes);


// activities API



// Certification Routes 
const certificationRoutes = require("./routes/certificationRoutes");
app.use("/api/certifications", certificationRoutes);


const homeGalleryRoutes = require("./routes/homeGalleryRoutes");
app.use("/api/home-gallery", homeGalleryRoutes);

const programRoutes = require("./routes/programRoutes");
app.use("/api/programs", programRoutes);

const careerRoutes = require("./routes/career");
app.use("/api/career", careerRoutes);


app.use('/api/users', require('./routes/users'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/permissions', require('./routes/permissions'));


const cmsRoutes = require('./routes/cmsRoutes');
app.use("/api/cms", cmsRoutes);

const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);



// disma working on contact us api
const contactRouter = require('./routes/contact');
app.use('/api/contact', contactRouter);

// Campus Life Api 
const campusLifeRouter = require("./routes/campusLife");
app.use("/api/campus-life", campusLifeRouter);

// institute API
const instituteRouter = require("./routes/institute");
app.use("/api/institute", instituteRouter);

// course API
const courseRouter = require("./routes/course");
app.use("/api/course", courseRouter);




const announcementImageRoutes = require("./routes/announcementImageRoutes");
app.use("/api/announcement-images", announcementImageRoutes);



const researchSubcategoryRoutes = require("./routes/researchSubcategoryRoutes");
app.use("/api/research-subcategory", researchSubcategoryRoutes);


const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
