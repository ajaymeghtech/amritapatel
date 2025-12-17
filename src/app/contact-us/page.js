'use client';

import { useState, useEffect } from 'react';
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import Innerbanner from "../components/common/Innerbanner";
import contactusBanner from '@/app/assets/images/contactuse-innerbanner.png';
import contactStyles from '@/app/styles/scss/components/contact-us.module.scss';
import locationIcon from '@/app/assets/icons/location-white.png';
import emailIcon from '@/app/assets/icons/email-white.png';
import callIcon from '@/app/assets/icons/call-white.png';
import timeIcon from '@/app/assets/icons/time_icon.png';
import facebookIcon from '@/app/assets/icons/facebook-white.png';
import twitterIcon from '@/app/assets/icons/twitter-white.png';
import youtubeIcon from '@/app/assets/icons/youtube-white.png';
import instagramIcon from '@/app/assets/icons/instagram-white.png';
import { fetchInstitutes, fetchCourses } from "@/app/services/contactInstituteService.js";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import { fetchSettings } from '@/app/services/settingsService';

export default function ContactUsPage() {

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const [institutes, setInstitutes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [settings, setSettings] = useState(null);

  const [formData, setFormData] = useState({
    // name: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    institute: '',
    course: '',
    message: '',
    // subject: '',
    captcha: ''
  });

  const [captchaCode, setCaptchaCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateCaptcha();
    loadInstitutes();
    setIsLoading(false);

    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await fetchSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching footer settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInstitutes = async () => {
    const data = await fetchInstitutes();
    const coursedata = await fetchCourses();
    setInstitutes(data);
    setCourses(coursedata);
  };

  const generateCaptcha = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaCode(code);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Remove error instantly when user types
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let newErrors = {};

    // if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Contact number is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (!formData.captcha.trim()) newErrors.captcha = "Captcha is required";
    else if (formData.captcha !== captchaCode) newErrors.captcha = "Incorrect captcha code";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        // name: formData.name,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        // subject: formData.subject || 'General Inquiry',
        message: formData.message,
        institute: formData.institute,
        course: formData.course
      };

      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.status) {
        toast.success('Message submitted successfully! We will contact you soon.');
        setFormData({
          // name: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          institute: '',
          course: '',
          message: '',
          // subject: '',
          captcha: ''
        });
        generateCaptcha();
      } else {
        toast.error(data.message || 'Failed to submit the form. Please try again.');
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedAddress = settings?.address
    ?.replace(/\u2028|\u2029/g, "\n")
    ?.split("\n");

  const firstLine = formattedAddress?.[0] || "";
  const otherLines = formattedAddress?.slice(1).join("\n") || "";


  console.log('Contactus settings:', settings);


  return (
    <>
      <Header />
      <Innerbanner title="Contact Us" image={contactusBanner} />

      <section className="sectionPadding sectionPaddingBottom">
        <div className="container">
          <div className={`row ${contactStyles.contactUsMain}`}>

            {/* Form Section */}
            <div className={`col-lg-8 col-md-12 col-sm-12 col-12 ${contactStyles.sendMsgSection}`}>
              <h2 className="sectionheading">Send us a message</h2>

              <form onSubmit={handleSubmit}>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className={contactStyles.formLabel}>
                      First Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={contactStyles.formInput}
                    />
                    {errors.firstName && <div className="text-danger small">{errors.firstName}</div>}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className={contactStyles.formLabel}>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={contactStyles.formInput}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className={contactStyles.formLabel}>
                      Email Address <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={contactStyles.formInput}
                    />
                    {errors.email && <div className="text-danger small">{errors.email}</div>}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className={contactStyles.formLabel}>
                      Contact Number <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={contactStyles.formInput}
                    />
                    {errors.phone && <div className="text-danger small">{errors.phone}</div>}
                  </div>
                </div>

                {/* Institute / Course */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className={contactStyles.formLabel}>Select Institute</label>
                    <select
                      name="institute"
                      value={formData.institute}
                      onChange={handleInputChange}
                      className={contactStyles.formSelect}
                    >
                      <option value="">Select Institute</option>
                      {institutes.map(inst => (
                        <option key={inst._id} value={inst.name}>
                          {inst.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className={contactStyles.formLabel}>Select Course</label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      className={contactStyles.formSelect}
                    >
                      <option value="">Select Course</option>
                      {courses.map(course => (
                        <option key={course._id} value={course.name}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message / Captcha */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className={contactStyles.formLabel}>
                      Message <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className={contactStyles.formTextarea}
                    ></textarea>
                    {errors.message && <div className="text-danger small">{errors.message}</div>}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className={contactStyles.formLabel}>
                      Enter Captcha Code <span style={{ color: "red" }}>*</span>
                    </label>

                    <div className={contactStyles.captchaWrapper}>
                      <input
                        type="text"
                        name="captcha"
                        value={formData.captcha}
                        onChange={handleInputChange}
                        className={contactStyles.formInput}
                      />
                    </div>

                    <label className={contactStyles.captchaCode}>{captchaCode}</label>

                    {errors.captcha && <div className="text-danger small">{errors.captcha}</div>}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="btnCircle">
                  <button type="submit" className="sectionlink" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Now'}
                  </button>
                </div>

              </form>
            </div>

            {/* Reach Us */}
            <div className={`col-lg-4 col-md-12 col-sm-12 col-12 ${contactStyles.reachUsSection}`}>
              <div >
                <h2 className="sectionheading">Reach Us</h2>

                <div className={contactStyles.reachUsItem}><div className={contactStyles.reachUsContent}>
                  <div className={contactStyles.reachUsTitleText}>
                    Amrita Patel Centre for Public Health
                  </div>
                </div>
                </div>

                <div className={contactStyles.reachUsItem}>
                  <span className={contactStyles.reachUsIcon}><Image src={callIcon} alt="call_icon" width={31} className={contactStyles.socialImg} /></span>
                  <div className={contactStyles.reachUsContent}>
                    <div className={contactStyles.reachUsText}>
                      <a href={`tel:${settings?.phone}`}>+91 2692-228539, +91 95123 88324</a>
                    </div>
                  </div>
                </div>

                <div className={contactStyles.reachUsItem}>
                  <span className={contactStyles.reachUsIcon}><Image src={emailIcon} alt="email_icon" width={31} className={contactStyles.socialImg} /></span>
                  <div className={contactStyles.reachUsContent}>
                    <div className={contactStyles.reachUsText}>
                      <div><a href="mailto:info@bhaikakauniv.edu.in">director.apcph@charutarhealth.org</a></div>
                    </div>
                  </div>
                </div>

                <div className={contactStyles.reachUsItem}>
                  <span className={contactStyles.reachUsIcon}><Image src={timeIcon} alt="call_icon" width={31} className={contactStyles.socialImg} /></span>
                  <div className={contactStyles.reachUsContent}>
                    <div className={contactStyles.reachUsText}>
                      <a href={`tel:${settings?.phone}`}>Monday to Friday (9 am - 5 pm)</a>
                    </div>
                    <div className={contactStyles.reachUsText}>
                      <a href={`tel:${settings?.phone}`}>Saturdays (9 am - 1 pm)</a>
                    </div>
                  </div>
                </div>

                <div className={contactStyles.reachUsItem} style={{ marginTop: '50px' }}>
                  <span className={contactStyles.reachUsIcon}>
                    <Image src={locationIcon} alt="location_icon" width={31} className={contactStyles.socialImg} />
                  </span>

                  <div className={contactStyles.reachUsContent}>

                    {/* FIRST LINE (special class) */}
                    <div className={contactStyles.reachUsTitleText}>
                      {firstLine}
                    </div>

                    {/* OTHER LINES (normal class) */}
                    <div className={contactStyles.reachUsText}>
                      {otherLines}
                    </div>

                  </div>
                </div>

                <div className={contactStyles.reachUsItem}>
                  <span className={contactStyles.reachUsIcon}><Image src={callIcon} alt="call_icon" width={31} className={contactStyles.socialImg} /></span>
                  <div className={contactStyles.reachUsContent}>
                    <div className={contactStyles.reachUsText}>
                      <a href={`tel:${settings?.phone}`}>{settings?.phone}</a>
                    </div>
                  </div>
                </div>

                <div className={contactStyles.reachUsItem}>
                  <span className={contactStyles.reachUsIcon}><Image src={emailIcon} alt="email_icon" width={31} className={contactStyles.socialImg} /></span>
                  <div className={contactStyles.reachUsContent}>
                    <div className={contactStyles.reachUsText}>
                      <div><a href="mailto:info@bhaikakauniv.edu.in">{settings?.contactEmail}</a></div>
                      {/* <div><a href="mailto:admission@bhaikakauniv.edu.in">{settings?.emailAdmission}</a></div>
                      <div><a href="mailto:docverification@charuthealth.org">{settings?.emailVerification}</a></div> */}
                    </div>
                  </div>
                </div>

                <div className={contactStyles.reachUsItem}>
                  <span className={contactStyles.reachUsIcon}><Image src={timeIcon} alt="call_icon" width={31} className={contactStyles.socialImg} /></span>
                  <div className={contactStyles.reachUsContent}>
                    <div className={contactStyles.reachUsText}>
                      <a href={`tel:${settings?.phone}`}>Monday to Friday (9 am - 5 pm)</a>
                    </div>
                    <div className={contactStyles.reachUsText}>
                      <a href={`tel:${settings?.phone}`}>Saturdays (9 am - 1 pm)</a>
                    </div>
                  </div>
                </div>

                <div className={contactStyles.socialIcons}>
                  <a href={settings?.facebookUrl} target="_blank" rel="noopener noreferrer" title="Facebook">
                    <Image src={facebookIcon} alt="facebook_icon" width={31} className={contactStyles.socialImg} />
                  </a>
                  <a href={settings?.twitterUrl} target="_blank" rel="noopener noreferrer" title="Twitter">
                    <Image src={twitterIcon} alt="twitter_icon" width={31} className={contactStyles.socialImg} />
                  </a>
                  <a href={settings?.youtubeUrl} target="_blank" rel="noopener noreferrer" title="YouTube">
                    <Image src={youtubeIcon} alt="youtube_icon" width={31} className={contactStyles.socialImg} />
                  </a>
                  <a href={settings?.instagramUrl} target="_blank" rel="noopener noreferrer" title="Instagram">
                    <Image src={instagramIcon} alt="instagram_icon" width={31} className={contactStyles.socialImg} />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className={contactStyles.mapSection}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3685.012782059334!2d72.89143117475624!3d22.541193934121754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e53002fb54ebd%3A0x1214755f12b44868!2sAmrita%20Patel%20Centre%20for%20Public%20Health!5e0!3m2!1sen!2sin!4v1765433659914!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

        </div>
      </section>

      <ToastContainer />
      <Footer />
    </>
  );
}
