/**
 * EXAMPLE: How to use SubAcademicSelector in other modules
 * 
 * This file shows how to integrate Sub-Academic selection into other modules
 */

'use client';

import React, { useState } from "react";
import SubAcademicSelector from "./SubAcademicSelector";
import styles from "./CMSList.module.css";

// Example: Using in a form
export default function ExampleModuleWithSubAcademic() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subAcademicIds: [], // Array of selected Sub-Academic IDs
  });

  const handleSubAcademicChange = (selectedIds) => {
    setFormData({
      ...formData,
      subAcademicIds: selectedIds
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // When submitting, subAcademicIds will contain array of IDs
    // Example: ["69492b481aa1d89a3f643715", "69492b481aa1d89a3f643716"]
    
    const payload = {
      title: formData.title,
      description: formData.description,
      subAcademicIds: formData.subAcademicIds, // Save as array
    };

    // Send to your API
    // await fetch('/api/your-endpoint', {
    //   method: 'POST',
    //   body: JSON.stringify(payload)
    // });
    
    console.log('Submitting with Sub-Academic IDs:', payload);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formSection}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Title</label>
          <input
            type="text"
            className={styles.formInput}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* Use SubAcademicSelector here */}
        <SubAcademicSelector
          selectedSubAcademicIds={formData.subAcademicIds}
          onChange={handleSubAcademicChange}
          label="Select Sub-Academic Programs"
          multiple={true} // Allow multiple selection
        />

        <div className={styles.formField}>
          <label className={styles.formLabel}>Description</label>
          <textarea
            className={styles.formInput}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
        </div>
      </div>

      <button type="submit" className={styles.formSubmitBtn}>
        Submit
      </button>
    </form>
  );
}

/**
 * BACKEND EXAMPLE: How to save Sub-Academic IDs in your model
 * 
 * In your Mongoose model (e.g., callapi/models/YourModel.js):
 * 
 * const YourSchema = new mongoose.Schema({
 *   title: { type: String, required: true },
 *   description: { type: String },
 *   subAcademicIds: [{ type: String }], // Array of Sub-Academic IDs
 *   // OR if you want to store full objects:
 *   subAcademics: [{
 *     subAcademicId: { type: String },
 *     title: { type: String },
 *     images: [{ type: String }],
 *     // ... other fields you want to store
 *   }]
 * });
 * 
 * In your controller:
 * 
 * const createYourItem = async (req, res) => {
 *   const { title, description, subAcademicIds } = req.body;
 *   
 *   // Option 1: Store just IDs (recommended - lighter, can fetch full data when needed)
 *   const data = await YourModel.create({
 *     title,
 *     description,
 *     subAcademicIds // Array of IDs
 *   });
 *   
 *   // Option 2: Fetch and store full Sub-Academic data
 *   const subAcademics = await SubAcademic.find({ 
 *     _id: { $in: subAcademicIds } 
 *   });
 *   
 *   const data = await YourModel.create({
 *     title,
 *     description,
 *     subAcademics: subAcademics.map(sa => ({
 *       subAcademicId: sa._id,
 *       title: sa.title,
 *       images: sa.images,
 *       eventType: sa.eventType,
 *       // ... other fields
 *     }))
 *   });
 *   
 *   res.json({ status: true, data });
 * };
 */

