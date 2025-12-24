'use client';

import React, { useState, useEffect, useMemo } from "react";
import dynamic from 'next/dynamic';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonDataGrid, { Tooltip } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from "./CMSList.module.css";

// CKEditor Wrapper Component
const CKEditorWrapper = dynamic(
  () => import('./CKEditorWrapper'),
  {
    ssr: false,
    loading: () => null
  }
);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const SUBACADEMIC_ENDPOINT = `${API_BASE_URL}/api/sub-academic`;
const ACADEMIC_ENDPOINT = `${API_BASE_URL}/api/academic`;
const IMAGE_UPLOAD_URL = `${API_BASE_URL}/api/cms/upload-image`;

// CKEditor Configuration
const editorConfiguration = {
  height: 200,
  allowedContent: true,
  extraAllowedContent: '*(*);*{*};*[*]',
  extraPlugins: 'uploadimage,image2',
  removePlugins: 'easyimage,cloudservices',
  filebrowserUploadUrl: IMAGE_UPLOAD_URL,
  filebrowserImageUploadUrl: IMAGE_UPLOAD_URL,
  filebrowserUploadMethod: 'form',
  toolbar: [
    { name: 'document', items: ['Source', '-', 'Save', 'NewPage', 'Preview', '-', 'Templates'] },
    { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
    { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'] },
    '/',
    { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
    { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
    { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
    { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar'] },
    '/',
    { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
    { name: 'colors', items: ['TextColor', 'BGColor'] },
    { name: 'tools', items: ['Maximize', 'ShowBlocks'] }
  ]
};

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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

export default function SubAcademicList() {
  const [subAcademic, setSubAcademic] = useState([]);
  const [academic, setAcademic] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState({
    academicId: "",
    title: "",
    content: "",
    image: "",
    eventType: "",
    leadFacilitator: "",
    venueAffiliation: "",
    coFacilitator: "",
    date: "",
  });
  const [imageFiles, setImageFiles] = useState([]); // Array of new image files
  const [existingImages, setExistingImages] = useState([]); // Array of existing image URLs
  const [imagePreviews, setImagePreviews] = useState([]); // Array of preview URLs
  const [editId, setEditId] = useState(null);
  const [editorInstance, setEditorInstance] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [academicFilter, setAcademicFilter] = useState("all");
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    id: null,
    name: ""
  });

  useEffect(() => {
    fetchSubAcademic();
    fetchAcademic();
  }, []);

  const fetchAcademic = async () => {
    try {
      const response = await fetch(ACADEMIC_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch academic");
      const data = await response.json();
      setAcademic(data.data || []);
    } catch (err) {
      toast.error(`Failed to fetch academic: ${err.message}`);
    }
  };

  const fetchSubAcademic = async () => {
    try {
      setLoading(true);
      const response = await fetch(SUBACADEMIC_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch sub-academic");
      const data = await response.json();
      setSubAcademic(data.data || []);
    } catch (err) {
      toast.error(`Failed to fetch sub-academic: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormMode(null);
    setEditId(null);
    setFormData({
      academicId: "",
      title: "",
      content: "",
      image: "",
      eventType: "",
      leadFacilitator: "",
      venueAffiliation: "",
      coFacilitator: "",
      date: "",
    });
    setImageFiles([]);
    setExistingImages([]);
    setImagePreviews([]);
    if (editorInstance) {
      editorInstance.setData("");
    }
  };


  const handleFormSubmit = async (e, closeAfterSubmit = true) => {
    e.preventDefault();

    if (!formData.academicId) {
      toast.error("Please select an Academic");
      return;
    }

    if (!formData.title || !formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      const latestContent = editorInstance?.getData ? editorInstance.getData() : formData.content;
      
      const formDataToSend = new FormData();
      formDataToSend.append("academicId", formData.academicId);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", latestContent || "");
      formDataToSend.append("eventType", formData.eventType || "");
      formDataToSend.append("leadFacilitator", formData.leadFacilitator || "");
      formDataToSend.append("venueAffiliation", formData.venueAffiliation || "");
      formDataToSend.append("coFacilitator", formData.coFacilitator || "");
      formDataToSend.append("date", formData.date || "");
      
      // Append existing images as JSON
      if (existingImages.length > 0) {
        formDataToSend.append("existingImages", JSON.stringify(existingImages));
      }
      
      // Append new image files
      imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const url = formMode === "edit" 
        ? `${SUBACADEMIC_ENDPOINT}/${editId}` 
        : SUBACADEMIC_ENDPOINT;
      
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

      toast.success(formMode === "edit" ? "Sub-academic updated!" : "Sub-academic created!");
      
      if (formMode === "edit" || closeAfterSubmit) {
        resetForm();
      } else {
        // For add mode with "Add More", reset form but keep modal open
        setFormData({
          academicId: formData.academicId, // Keep academic selected
          title: "",
          content: "",
          image: "",
          eventType: "",
          leadFacilitator: "",
          venueAffiliation: "",
          coFacilitator: "",
          date: "",
        });
        setImageFiles([]);
        setExistingImages([]);
        setImagePreviews([]);
        if (editorInstance) {
          editorInstance.setData("");
        }
      }
      
      fetchSubAcademic();
    } catch (error) {
      toast.error(`Failed to save. Error: ${error.message}`);
    }
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    setEditId(item._id);
    // Format date for input field (YYYY-MM-DD)
    let formattedDate = "";
    if (item.date) {
      const dateObj = new Date(item.date);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toISOString().split('T')[0];
      }
    }
    setFormData({
      academicId: item.academicId || "",
      title: item.title || "",
      content: item.content || "",
      image: item.image || "",
      eventType: item.eventType || "",
      leadFacilitator: item.leadFacilitator || "",
      venueAffiliation: item.venueAffiliation || "",
      coFacilitator: item.coFacilitator || "",
      date: formattedDate,
    });
    
    // Load existing images
    const images = item.images && Array.isArray(item.images) ? item.images : [];
    setExistingImages(images);
    setImageFiles([]);
    setImagePreviews([]);
    
    if (editorInstance) {
      editorInstance.setData(item.content || "");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    // Create previews for new files
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);

    // Reset input
    e.target.value = "";
  };

  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      // Remove from existing images
      const updated = existingImages.filter((_, i) => i !== index);
      setExistingImages(updated);
    } else {
      // Remove from new files and previews
      const fileIndex = index - existingImages.length;
      const updatedFiles = imageFiles.filter((_, i) => i !== fileIndex);
      const updatedPreviews = imagePreviews.filter((_, i) => i !== fileIndex);
      
      // Revoke object URL to free memory
      if (imagePreviews[fileIndex]) {
        URL.revokeObjectURL(imagePreviews[fileIndex]);
      }
      
      setImageFiles(updatedFiles);
      setImagePreviews(updatedPreviews);
    }
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
      await fetch(`${SUBACADEMIC_ENDPOINT}/${confirmModal.id}`, { method: "DELETE" });
      toast.success("Deleted successfully!");
      fetchSubAcademic();
    } catch (error) {
      toast.error(`Failed to delete: ${error.message}`);
    } finally {
      setConfirmModal({ isOpen: false, id: null, name: "" });
    }
  };

  // Filter sub-academic
  const filteredSubAcademic = useMemo(() => {
    return subAcademic.filter((item) => {
      const academicMatch = academicFilter === "all" || item.academicId === academicFilter;
      const searchMatch = searchTerm === "" ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchTerm.toLowerCase());
      return academicMatch && searchMatch;
    });
  }, [subAcademic, academicFilter, searchTerm]);

  // Get academic name by ID
  const getAcademicName = (academicId) => {
    const acad = academic.find(a => a._id === academicId);
    return acad?.title || academicId || "—";
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "—";
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return "—";
      return dateObj.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return "—";
    }
  };

  // Define table columns
  const columns = [
    {
      field: 'academicId',
      headerName: 'Academic',
      width: 180,
      renderCell: (params) => (
        <Tooltip content={getAcademicName(params.value)}>
          <div className="fw-medium text-truncate" style={{ maxWidth: '160px' }} title={getAcademicName(params.value)}>
            {getAcademicName(params.value)}
          </div>
        </Tooltip>
      ),
    },
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
      field: 'eventType',
      headerName: 'Event Type',
      width: 160,
      renderCell: (params) => {
        const eventType = params.value || "—";
        return (
          <Tooltip content={eventType}>
            <div className="text-truncate" style={{ maxWidth: '140px' }} title={eventType}>
              {eventType}
            </div>
          </Tooltip>
        );
      },
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 130,
      renderCell: (params) => (
        <div style={{ fontSize: '14px' }}>
          {formatDate(params.value)}
        </div>
      ),
    },
    {
      field: 'leadFacilitator',
      headerName: 'Lead Facilitator',
      width: 180,
      renderCell: (params) => {
        const facilitator = params.value || "—";
        return (
          <Tooltip content={facilitator}>
            <div className="text-truncate text-muted" style={{ maxWidth: '160px' }} title={facilitator}>
              {facilitator}
            </div>
          </Tooltip>
        );
      },
    },
    {
      field: 'venueAffiliation',
      headerName: 'Venue / Affiliation',
      width: 180,
      renderCell: (params) => {
        const venue = params.value || "—";
        return (
          <Tooltip content={venue}>
            <div className="text-truncate text-muted" style={{ maxWidth: '160px' }} title={venue}>
              {venue}
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
        title="Delete Sub-Academic"
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
                  placeholder="Search sub-academic..."
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

            {/* Filters */}
            <div className={styles.filtersContainer}>
              <div className={styles.filterGroup}>
                <div className={styles.filterSelectWrapper}>
                  <select
                    value={academicFilter}
                    onChange={(e) => setAcademicFilter(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Academic</option>
                    {academic.map((acad) => (
                      <option key={acad._id} value={acad._id}>
                        {acad.title}
                      </option>
                    ))}
                  </select>
                  <span className={styles.dropdownIcon}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
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
              <span className={styles.buttonTextFull}>Add Sub-Academic</span>
              <span className={styles.buttonTextShort}>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div style={{ width: "100%", overflowX: "auto" }}>
        <CommonDataGrid
          data={filteredSubAcademic.map((item, index) => ({ ...item, id: item._id, srNo: index + 1 }))}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 15, 20, 50]}
          initialPageSize={10}
          noDataMessage="No sub-academic found"
          noDataDescription={
            searchTerm || academicFilter !== "all"
              ? "Try adjusting your search criteria or filters."
              : "Get started by creating your first sub-academic."
          }
          noDataAction={
            (!searchTerm && academicFilter === "all") ? {
              onClick: () => setFormMode("add"),
              text: "Create First Sub-Academic"
            } : null
          }
          loadingMessage="Loading sub-academic..."
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
        title={formMode === "edit" ? "Edit Sub-Academic" : "Create Sub-Academic"}
      >
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
            <div className={styles.formSection}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Academic <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.formInput}
                  value={formData.academicId}
                  onChange={(e) => setFormData({ ...formData, academicId: e.target.value })}
                  required
                >
                  <option value="">Select Academic</option>
                  {academic.map((acad) => (
                    <option key={acad._id} value={acad._id}>
                      {acad.title}
                    </option>
                  ))}
                </select>
              </div>

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

              <div className={styles.formField}>
                <label className={styles.formLabel}>Event Type</label>
                <select
                  className={styles.formInput}
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                >
                  <option value="">Select Event Type</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Sensitization Workshop">Sensitization Workshop</option>
                </select>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Lead Facilitator(s) / Speaker</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.leadFacilitator}
                  onChange={(e) => setFormData({ ...formData, leadFacilitator: e.target.value })}
                  placeholder="Enter lead facilitator(s) / speaker"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Venue / Affiliation</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.venueAffiliation}
                  onChange={(e) => setFormData({ ...formData, venueAffiliation: e.target.value })}
                  placeholder="Enter venue / affiliation"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Co-facilitator</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.coFacilitator}
                  onChange={(e) => setFormData({ ...formData, coFacilitator: e.target.value })}
                  placeholder="Enter co-facilitator"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Date</label>
                <input
                  type="date"
                  className={styles.formInput}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className={styles.formField} style={{ gridColumn: "1 / -1" }}>
                <label className={styles.formLabel}>Images</label>
                <div className={styles.imageUploadContainer}>
                  <input
                    type="file"
                    id="subAcademicImagesInput"
                    accept="image/*"
                    multiple
                    className={styles.fileInput}
                    onChange={handleImageChange}
                  />
                  <label htmlFor="subAcademicImagesInput" className={styles.fileInputLabel}>
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

              <div className={styles.formField}>
                <label className={styles.formLabel}>Content</label>
                <div style={{ minHeight: '200px' }}>
                  <CKEditorWrapper
                    data={formData.content || ''}
                    config={editorConfiguration}
                    onReady={(editor) => {
                      setEditorInstance(editor);
                      if (!editor) return;
                      editor.config.filebrowserUploadUrl = IMAGE_UPLOAD_URL;
                      editor.config.filebrowserImageUploadUrl = IMAGE_UPLOAD_URL;
                    }}
                    onChange={(event, editor) => {
                      const data = editor?.getData ? editor.getData() : event.target.value;
                      setFormData((prev) => ({ ...prev, content: data }));
                    }}
                  />
                </div>
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
                {formMode === "edit" ? "Update Sub-Academic" : "Create Sub-Academic"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

