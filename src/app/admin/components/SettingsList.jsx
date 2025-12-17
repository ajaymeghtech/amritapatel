'use client';

import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './SettingsList.module.css';
import { ToastContainer } from 'react-toastify';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SettingsList() {
  const [activeTab, setActiveTab] = useState('branding');
  const [saving, setSaving] = useState(false);

  // dynamic state based on API
  const [settings, setSettings] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [faIconFile, setFaIconFile] = useState(null);
  const [faIconPreview, setFaIconPreview] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings/`);
      const result = await response.json();

      if (result.status) {
        setSettings(result.data);

        // Load existing logo
        if (result.data.logo) {
          setLogoPreview(`${API_BASE_URL}${result?.data?.logo}`);
        }

        // Load existing favicon
        if (result.data.faviconUrl) {
          setFaIconPreview(`${API_BASE_URL}${result?.data?.faviconUrl}`);
        }

      } else {
        toast.error("Failed to load settings");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("API error while loading settings");
    }
  };


  // ------------------------------
  // Handle Change
  // ------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  // ------------------------------
  // ✅ UPDATE SETTINGS (PUT)
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let formData = new FormData();

      // Append all settings fields
      Object.keys(settings).forEach((key) => {
        formData.append(key, settings[key]);
      });

      // If logo file uploaded
      if (logoFile) {
        formData.append("logo", logoFile);
      }
      // If FA icon is uploaded
      if (faIconFile) {
        formData.append("faviconUrl", faIconFile);
      }

      const response = await fetch(`${API_BASE_URL}/api/settings/`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.status) {
        toast.error("Failed to update settings");
        setSaving(false);
        return;
      }

      toast.success("Settings updated successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    }

    setSaving(false);
  };

  if (!settings) return <p className={styles.loading}>Loading settings...</p>;
  const tabs = [
    { id: 'branding', label: 'Branding', icon: 'branding' },
    // { id: 'seo', label: 'SEO', icon: 'seo' },
    { id: 'contact', label: 'Contact', icon: 'contact' },
    { id: 'social', label: 'Social', icon: 'social' },
    { id: 'footer', label: 'Footer', icon: 'footer' }
  ];

  const getTabIcon = (iconType) => {
    switch (iconType) {
      case 'branding':
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'seo':
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'contact':
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case 'social':
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'footer':
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'branding':
        return (
          <div className={styles.settingsSection}>
            <div className={styles.settingsSectionHeader}>
              <div className={styles.sectionIcon}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className={styles.sectionTitle}>Branding & Identity</h3>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Site Name</label>
                <input
                  type="text"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="My Site"
                />
              </div>

            </div>
            <div className={styles.formGrid}>
              {/* Logo Upload */}

              <div className={styles.formField}>
                <label className={styles.formLabel}>Upload Logo</label>

                <div className={styles.uploadWrapper}>
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className={styles.logoPreview} />
                  ) : (
                    <div className={styles.placeholderBox}>No Logo Uploaded</div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setLogoFile(file);
                      setLogoPreview(URL.createObjectURL(file));
                    }}
                    className={styles.fileInput}
                  />
                </div>
              </div>
            </div>
            <div className={styles.formGrid}>
              {/* FA Icon Upload */}
              <div className={styles.formField}>
                <label className={styles.formLabel}>Upload FAV Icon</label>

                <div className={styles.uploadWrapper}>
                  {faIconPreview ? (
                    <img src={faIconPreview} alt="FA Icon Preview" className={styles.logoPreview} />
                  ) : (
                    <div className={styles.placeholderBox}>No Icon Uploaded</div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFaIconFile(file);
                      setFaIconPreview(URL.createObjectURL(file));
                    }}
                    className={styles.fileInput}
                  />
                </div>
              </div>
            </div>

            {/* <div className={styles.previewSection}>
              <div className={styles.previewHeader}>
                <h4 className={styles.previewTitle}>Preview</h4>
                <p className={styles.previewSubtitle}>Favicon Preview</p>
              </div>
              <div className={styles.faviconPreview}>
                <span className={styles.faviconPreviewText}>Favicon preview</span>
              </div>
            </div> */}
          </div>
        );

      case 'seo':
        return (
          <div className={styles.settingsSection}>
            <div className={styles.settingsSectionHeader}>
              <div className={styles.sectionIcon}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className={styles.sectionTitle}>SEO Settings</h3>
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Meta Title</label>
              <input
                type="text"
                name="metaTitle"
                value={settings.metaTitle}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="My Site - Welcome"
              />
              <small className={styles.formHelp}>Recommended: 50-60 characters</small>
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Meta Description</label>
              <textarea
                name="metaDescription"
                value={settings.metaDescription}
                onChange={handleChange}
                className={styles.formTextarea}
                placeholder="Welcome to My Site. Explore our content and discover what we have to offer."
                rows={4}
              />
              <small className={styles.formHelp}>Recommended: 150-160 characters</small>
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Meta Keywords</label>
              <input
                type="text"
                name="metaKeywords"
                value={settings.metaKeywords}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="website, site, my site"
              />
              <small className={styles.formHelp}>Separate keywords with commas</small>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className={styles.settingsSection}>
            <div className={styles.settingsSectionHeader}>
              <div className={styles.sectionIcon}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className={styles.sectionTitle}>Contact Information</h3>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="contact@example.com"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Contact Email (Amrita) </label>
                <input
                  type="email"
                  name="contactEmailAmrita"
                  value={settings.contactEmailAmrita}
                  onChange={handleChange}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Admission Email</label>
                <input
                  type="email"
                  name="emailAdmission"
                  value={settings.emailAdmission}
                  onChange={handleChange}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Contact Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="+1-234-567-8900"
                />
              </div>
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Contact Address</label>
              <textarea
                name="address"
                value={settings.address}
                onChange={handleChange}
                className={styles.formTextarea}
                rows={3}
              />

            </div>
          </div>
        );

      case 'social':
        return (
          <div className={styles.settingsSection}>
            <div className={styles.settingsSectionHeader}>
              <div className={styles.sectionIcon}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className={styles.sectionTitle}>Social Media Links</h3>
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Facebook URL</label>
              <input
                type="url"
                name="facebookUrl"
                value={settings.facebookUrl}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Twitter URL</label>
              <input
                type="url"
                name="twitterUrl"
                value={settings.twitterUrl}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="https://twitter.com/yourhandle"
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Instagram URL</label>
              <input
                type="url"
                name="instagramUrl"
                value={settings.instagramUrl}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="https://instagram.com/yourprofile"
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>LinkedIn URL</label>
              <input
                type="url"
                name="linkedinUrl"
                value={settings.linkedinUrl}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>YouTube URL</label>
              <input
                type="url"
                name="youtubeUrl"
                value={settings.youtubeUrl}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="https://youtube.com/yourchannel"
              />
            </div>
          </div>
        );

      case 'footer':
        return (
          <div className={styles.settingsSection}>
            <div className={styles.settingsSectionHeader}>
              <div className={styles.sectionIcon}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className={styles.sectionTitle}>Footer Settings</h3>
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Footer Text</label>
              <textarea
                name="footerText"
                value={settings.footerText}
                onChange={handleChange}
                className={styles.formTextarea}
                placeholder="© 2024 My Site. All rights reserved."
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  console.log('Rendering SettingsList with settings:', settings);
  return (
    <div className={styles.settingsContainer}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      />

      {/* Header */}
      <div className={styles.settingsHeader}>
        <div className={styles.headerIcon}>
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className={styles.headerText}>
          <h1 className={styles.settingsTitle}>Site Settings</h1>
          <p className={styles.settingsSubtitle}>Configure your website settings and preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
          >
            <span className={styles.tabIcon}>{getTabIcon(tab.icon)}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={styles.contentContainer}>
        <form onSubmit={handleSubmit} className={styles.contentForm}>
          {renderTabContent()}

          {/* Footer */}
          <div className={styles.settingsFooter}>
            <p className={styles.saveMessage}>Changes are saved automatically when you submit the form</p>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={saving}
            >
              {saving ? (
                <>
                  <svg className={styles.spinner} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Save All Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

