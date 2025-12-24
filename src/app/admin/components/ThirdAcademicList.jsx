'use client';

import React, { useState, useEffect, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonDataGrid, { Tooltip } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import SubAcademicSelector from "./SubAcademicSelector";
import styles from "./CMSList.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const THIRDACADEMIC_ENDPOINT = `${API_BASE_URL}/api/third-academic`;
const SUBACADEMIC_ENDPOINT = `${API_BASE_URL}/api/sub-academic`;

const getImageUrl = (path = "") => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
};

// Enhanced Modal Component
const Modal = ({ isOpen, onClose, title, children, headerAction }) => {
  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '900px' }}
      >
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalIcon}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {headerAction}
            <button onClick={onClose} className={styles.modalCloseBtn} aria-label="Close modal">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
};

export default function ThirdAcademicList() {
  const [thirdAcademic, setThirdAcademic] = useState([]);
  const [subAcademic, setSubAcademic] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subAcademicIds: [],
    images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [editId, setEditId] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    id: null,
    name: ""
  });

  useEffect(() => {
    fetchThirdAcademic();
    fetchSubAcademic();
  }, []);

  const fetchSubAcademic = async () => {
    try {
      const response = await fetch(SUBACADEMIC_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch sub-academic");
      const data = await response.json();
      setSubAcademic(data.data || []);
    } catch (err) {
      toast.error(`Failed to fetch sub-academic: ${err.message}`);
    }
  };

  const fetchThirdAcademic = async () => {
    try {
      setLoading(true);
      const response = await fetch(THIRDACADEMIC_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch third-academic");
      const data = await response.json();
      setThirdAcademic(data.data || []);
    } catch (err) {
      toast.error(`Failed to fetch third-academic: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormMode(null);
    setEditId(null);
    setFormData({
      title: "",
      subAcademicIds: [],
      images: [],
    });
    setImageFiles([]);
    setExistingImages([]);
    setImagePreviews([]);
  };

  const handleFormSubmit = async (e, closeAfterSubmit = true) => {
    e.preventDefault();

    if (!formData.title || !formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.subAcademicIds || formData.subAcademicIds.length === 0) {
      toast.error("Please select at least one Sub-Academic");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("subAcademicIds", JSON.stringify(formData.subAcademicIds));
      
      // Append existing images as JSON
      if (existingImages.length > 0) {
        formDataToSend.append("existingImages", JSON.stringify(existingImages));
      }
      
      // Append new image files
      imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const url = formMode === "edit" 
        ? `${THIRDACADEMIC_ENDPOINT}/${editId}` 
        : THIRDACADEMIC_ENDPOINT;
      
      const method = formMode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to save: ${errorData.message || 'Unknown error'}`);
        return;
      }

      toast.success(formMode === "edit" ? "Third Academic updated!" : "Third Academic created!");
      
      if (formMode === "edit" || closeAfterSubmit) {
        resetForm();
      } else {
        setFormData({
          title: "",
          subAcademicIds: [],
          images: [],
        });
        setImageFiles([]);
        setExistingImages([]);
        setImagePreviews([]);
      }
      
      fetchThirdAcademic();
    } catch (error) {
      toast.error(`Failed to save. Error: ${error.message}`);
    }
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    setEditId(item._id);
    setFormData({
      title: item.title || "",
      subAcademicIds: item.subAcademicIds || [],
      images: item.images || [],
    });
    
    // Load existing images
    const images = item.images && Array.isArray(item.images) ? item.images : [];
    setExistingImages(images);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleDelete = (id, title) => {
    setConfirmModal({
      isOpen: true,
      id,
      name: title
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(`${THIRDACADEMIC_ENDPOINT}/${confirmModal.id}`, { method: "DELETE" });
      toast.success("Deleted successfully!");
      fetchThirdAcademic();
    } catch (error) {
      toast.error(`Failed to delete: ${error.message}`);
    } finally {
      setConfirmModal({ isOpen: false, id: null, name: "" });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);

    e.target.value = "";
  };

  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      const updated = existingImages.filter((_, i) => i !== index);
      setExistingImages(updated);
    } else {
      const fileIndex = index - existingImages.length;
      const updatedFiles = imageFiles.filter((_, i) => i !== fileIndex);
      const updatedPreviews = imagePreviews.filter((_, i) => i !== fileIndex);
      
      if (imagePreviews[fileIndex]) {
        URL.revokeObjectURL(imagePreviews[fileIndex]);
      }
      
      setImageFiles(updatedFiles);
      setImagePreviews(updatedPreviews);
    }
  };

  const getSubAcademicTitles = (subAcademicIds) => {
    if (!subAcademicIds || !Array.isArray(subAcademicIds)) return "—";
    const titles = subAcademicIds
      .map(id => {
        const sub = subAcademic.find(s => s._id === id);
        return sub?.title;
      })
      .filter(Boolean);
    return titles.length > 0 ? titles.join(", ") : "—";
  };

  const filteredThirdAcademic = useMemo(() => {
    return thirdAcademic.filter((item) => {
      const searchMatch = searchTerm === "" ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getSubAcademicTitles(item.subAcademicIds)?.toLowerCase().includes(searchTerm.toLowerCase());
      return searchMatch;
    });
  }, [thirdAcademic, searchTerm, subAcademic]);

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="fw-medium text-truncate" style={{ maxWidth: '100%' }} title={params.value}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: 'subAcademicIds',
      headerName: 'Sub-Academic',
      width: 250,
      renderCell: (params) => {
        const titles = getSubAcademicTitles(params.value);
        return (
          <Tooltip content={titles}>
            <div className="text-truncate text-muted" style={{ maxWidth: '230px' }} title={titles}>
              {titles}
            </div>
          </Tooltip>
        );
      },
    },
    {
      field: 'images',
      headerName: 'Images',
      width: 120,
      renderCell: (params) => {
        const images = params.value || [];
        const imageCount = Array.isArray(images) ? images.length : 0;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#6b7280' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="badge bg-info" style={{ fontSize: '12px' }}>
              {imageCount}
            </span>
          </div>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      flex: 0,
      renderCell: (params) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          <button
            onClick={() => handleEdit(params.row)}
            className="btn btn-sm"
            style={{ backgroundColor: '#e0f2fe', border: 'none', borderRadius: '6px', padding: '4px 8px' }}
            title="Edit"
          >
            <svg width="14" height="14" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleDelete(params.row._id, params.row.title)}
            className="btn btn-sm"
            style={{ backgroundColor: '#fee2e2', border: 'none', borderRadius: '6px', padding: '4px 8px' }}
            title="Delete"
          >
            <svg width="14" height="14" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{
      width: '100%',
      maxWidth: 'none',
      margin: 0,
      padding: 0,
      position: 'relative',
      left: 0,
      right: 0
    }}>
      <ToastContainer position="top-right" autoClose={4000} />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, name: "" })}
        onConfirm={handleDeleteConfirm}
        title="Delete Third Academic"
        message={`Are you sure you want to delete "${confirmModal.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.actionBarContent}>
          <div className={styles.actionBarLeft}>
            {/* Search Bar */}
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <svg className={styles.searchIcon} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search third academic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className={styles.searchClear}
                    title="Clear search"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className={styles.actionBarRight}>
            <button
              onClick={() => setFormMode("add")}
              className={styles.addButton}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className={styles.buttonTextFull}>Add Third Academic</span>
              <span className={styles.buttonTextShort}>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div style={{ width: "100%", overflowX: "auto" }}>
        <CommonDataGrid
          data={filteredThirdAcademic.map((item, index) => ({ ...item, id: item._id, srNo: index + 1 }))}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 15, 20, 50]}
          initialPageSize={10}
          noDataMessage="No third academic found"
          noDataDescription={
            searchTerm
              ? "Try adjusting your search criteria."
              : "Get started by creating your first third academic."
          }
          noDataAction={
            (!searchTerm) ? {
              onClick: () => setFormMode("add"),
              text: "Create First Third Academic"
            } : null
          }
          loadingMessage="Loading third academic..."
          showSerialNumber={true}
          serialNumberField="srNo"
          serialNumberHeader="Sr.no."
          serialNumberWidth={80}
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={formMode !== null}
        onClose={resetForm}
        title={formMode === "edit" ? "Edit Third Academic" : "Create Third Academic"}
      >
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
            <div className={styles.formSection}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Title <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter title"
                  required
                />
              </div>

              {/* Sub-Academic Selector */}
              <SubAcademicSelector
                selectedSubAcademicIds={formData.subAcademicIds}
                onChange={(ids) => setFormData({ ...formData, subAcademicIds: ids })}
                label="Select Sub-Academic"
                multiple={true}
              />

              {/* Images Upload */}
              <div className={styles.formField} style={{ gridColumn: "1 / -1" }}>
                <label className={styles.formLabel}>Images</label>
                <div className={styles.imageUploadContainer}>
                  <input
                    type="file"
                    id="thirdAcademicImagesInput"
                    accept="image/*"
                    multiple
                    className={styles.fileInput}
                    onChange={handleImageChange}
                  />
                  <label htmlFor="thirdAcademicImagesInput" className={styles.fileInputLabel}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Click to select images (multiple allowed)</span>
                  </label>
                </div>
                
                {/* Display all images */}
                {(existingImages.length > 0 || imagePreviews.length > 0) && (
                  <div style={{ 
                    marginTop: "16px", 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", 
                    gap: "12px" 
                  }}>
                    {/* Existing images */}
                    {existingImages.map((img, index) => (
                      <div key={`existing-${index}`} style={{ position: "relative" }}>
                        <div style={{
                          width: "100%",
                          aspectRatio: "1",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "2px solid #e5e7eb",
                          backgroundColor: "#f9fafb"
                        }}>
                          <img
                            src={getImageUrl(img)}
                            alt={`Existing ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #9ca3af;">Image not found</div>';
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index, true)}
                          style={{
                            position: "absolute",
                            top: "4px",
                            right: "4px",
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            backgroundColor: "#ef4444",
                            border: "none",
                            color: "white",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 0
                          }}
                          title="Remove image"
                        >
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    
                    {/* New image previews */}
                    {imagePreviews.map((preview, index) => (
                      <div key={`preview-${index}`} style={{ position: "relative" }}>
                        <div style={{
                          width: "100%",
                          aspectRatio: "1",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "2px solid #10b981",
                          backgroundColor: "#f0fdf4"
                        }}>
                          <img
                            src={preview}
                            alt={`New ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(existingImages.length + index, false)}
                          style={{
                            position: "absolute",
                            top: "4px",
                            right: "4px",
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            backgroundColor: "#ef4444",
                            border: "none",
                            color: "white",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 0
                          }}
                          title="Remove image"
                        >
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={resetForm}
                className={styles.formCancelBtn}
              >
                Cancel
              </button>
              <button 
                type="button"
                className={styles.formSubmitBtn}
                onClick={(e) => {
                  handleFormSubmit(e, true);
                }}
              >
                {formMode === "edit" ? "Update Third Academic" : "Create Third Academic"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

