'use client';

import React, { useState, useEffect, useMemo } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommonDataGrid, { Tooltip, StatusBadge } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from './BannerList.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const Modal = ({ isOpen, onClose, title, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalIcon}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit") ? "Update banner details and settings" : "Create a new banner with all details"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={styles.modalCloseBtn}
            aria-label="Close modal"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className={styles.modalContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default function BannerList() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formMode, setFormMode] = useState(null); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: "",
    link: "",
    altText: "",
    order: 1,
    status: "active",
    position: "homepage",
    startDate: "",
    endDate: ""
  });
  const [editId, setEditId] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Image upload state
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    bannerId: null,
    bannerTitle: ""
  });

  // View modal state
  const [viewModal, setViewModal] = useState({
    isOpen: false,
    banner: null
  });

  useEffect(() => {
    // fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/banners/`);
      if (!response.ok) throw new Error("Failed to fetch banners");
      const data = await response.json();
      // Handle new API response format with data property
      setBanners(data.data || data || []);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to fetch banners: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    console.log('File selected:', file);
    
    if (!file) {
      console.log('No file selected');
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      setImageFile(null);
      setImagePreview(null);
      e.target.value = ''; // Reset file input
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      toast.error(`Image size (${fileSizeMB} MB) exceeds the maximum allowed size of 10 MB. Please choose a smaller image.`);
      setImageFile(null);
      setImagePreview(null);
      e.target.value = ''; // Reset file input
      return;
    }

    console.log('Setting image file:', file.name, file.size, file.type);
    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setImagePreview(dataUrl); // Set preview for display
      console.log('Image preview set');
    };
    reader.onerror = () => {
      console.error('Error reading file');
      toast.error('Error reading image file');
    };
    reader.readAsDataURL(file);
  };

  // Updated delete functions
  const handleDeleteClick = (id, title) => {
    setConfirmModal({
      isOpen: true,
      bannerId: id,
      bannerTitle: title
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/banners/${confirmModal.bannerId}`, { method: "DELETE" });
      setBanners(banners.filter((item) => item._id !== confirmModal.bannerId));
      toast.success("Banner deleted successfully!");
    } catch (error) {
      toast.error(`Failed to delete banner: ${error.message}`);
    } finally {
      setConfirmModal({ isOpen: false, bannerId: null, bannerTitle: "" });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmModal({ isOpen: false, bannerId: null, bannerTitle: "" });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Form submission started');
      console.log('Form mode:', formMode);
      console.log('Image file:', imageFile);
      console.log('Image preview:', imagePreview);
      
      // Validate image is provided (for new banners only)
      if (formMode !== "edit" && !imageFile) {
        console.error('Validation failed: No image file for new banner');
        toast.error('Please upload a banner image');
        return;
      }

      // Create FormData object for multipart/form-data
      const submitFormData = new FormData();

      // Add text fields (trim whitespace)
      submitFormData.append('title', (formData.title || '').trim());
      submitFormData.append('subtitle', (formData.subtitle || '').trim());
      submitFormData.append('description', (formData.description || '').trim());
      submitFormData.append('link', (formData.link || '').trim());
      submitFormData.append('altText', (formData.altText || '').trim());
      submitFormData.append('order', formData.order.toString());
      submitFormData.append('status', formData.status || 'active');
      submitFormData.append('position', (formData.position || 'homepage').trim());

      if (formData.startDate) {
        // Convert datetime-local to ISO string format
        const startDate = new Date(formData.startDate);
        if (!isNaN(startDate.getTime())) {
          submitFormData.append('startDate', startDate.toISOString());
        }
      }
      if (formData.endDate) {
        // Convert datetime-local to ISO string format
        const endDate = new Date(formData.endDate);
        if (!isNaN(endDate.getTime())) {
          submitFormData.append('endDate', endDate.toISOString());
        }
      }

      // Handle image file
      if (imageFile) {
        // If we have a new file, append it
        console.log('Appending image file to FormData:', imageFile.name, imageFile.size, imageFile.type);
        submitFormData.append('image', imageFile);
      } else if (formMode === "edit") {
        // For edit mode without new file upload, the API should keep the existing image
        console.log('Edit mode: No new image file, keeping existing image');
      } else {
        console.warn('No image file available for submission');
      }

      console.log('Submitting banner data as FormData');
      console.log('Form mode:', formMode);
      console.log('Has image file:', !!imageFile);
      console.log('Edit ID:', editId);

      // Log FormData contents (for debugging)
      for (let pair of submitFormData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      let response;
      if (formMode === "edit") {
        response = await fetch(`${API_BASE_URL}/api/banners/${editId}`, {
          method: "PUT",
          body: submitFormData,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/api/banners/`, {
          method: "POST",
          body: submitFormData,
        });
      }

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        let errorData;
        let errorMessage = 'Unknown error';
        try {
          const responseText = await response.text();
          console.log('Error response text:', responseText);
          if (responseText) {
            try {
              errorData = JSON.parse(responseText);
              errorMessage = errorData?.error || errorData?.message || errorData?.data?.error || response.statusText;
            } catch (e) {
              errorMessage = responseText || response.statusText;
            }
          } else {
            errorMessage = response.statusText || `HTTP ${response.status}`;
          }
        } catch (e) {
          console.log('Could not parse error response:', e);
          errorMessage = response.statusText || `HTTP ${response.status}`;
        }
        console.log('Error message:', errorMessage);
        toast.error(`Failed to save: ${errorMessage}`);
        return;
      }

      try {
        const result = await response.json();
        console.log('Success response:', result);
      } catch (jsonError) {
        // Response might be empty or not JSON, that's ok
        console.log('No JSON response or empty response');
      }

      setFormMode(null);
      setEditId(null);
      setImageFile(null);
      setImagePreview(null);
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        image: "",
        link: "",
        altText: "",
        order: 1,
        status: "active",
        position: "homepage",
        startDate: "",
        endDate: ""
      });

      toast.success(formMode === "edit" ? "Banner updated successfully!" : "Banner created successfully!");
      fetchBanners();
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(`Failed to save. Error: ${error.message}`);
    }
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    setEditId(item._id);
    setImageFile(null);
    // Set image preview with full URL if needed
    const imageUrl = item.image 
      ? (item.image.startsWith('http') ? item.image : `${API_BASE_URL}${item?.image}`)
      : null;
    setImagePreview(imageUrl);

    setFormData({
      title: item.title || "",
      subtitle: item.subtitle || "",
      description: item.description || "",
      image: item.image || "",
      link: item.link || "",
      altText: item.altText || "",
      order: item.order || 1,
      status: item.status || "active",
      position: item.position || "homepage",
      startDate: item.startDate ? new Date(item.startDate).toISOString().slice(0, 16) : "",
      endDate: item.endDate ? new Date(item.endDate).toISOString().slice(0, 16) : ""
    });
  };

  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(banners.map(item => item.status).filter(Boolean))];
    return statuses.sort();
  }, [banners]);

  // Filter banners by status and search term
  const filteredBanners = useMemo(() => {
    return banners.filter((item) => {
      const statusMatch = statusFilter === "all" || item.status === statusFilter;
      const searchMatch = searchTerm === "" ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      return statusMatch && searchMatch;
    });
  }, [banners, statusFilter, searchTerm]);

  // Define table columns for Common DataGrid
  const columns = [
    // Title column
    {
      field: 'title',
      headerName: 'Title',
      width: 150,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="fw-medium text-truncate" style={{ maxWidth: '130px' }} title={params.value}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },

    // Subtitle column
    {
      field: 'subtitle',
      headerName: 'Subtitle',
      width: 120,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="text-muted text-truncate" style={{ maxWidth: '100px' }} title={params.value}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },

    // Description column
    {
      field: 'description',
      headerName: 'Description',
      width: 180,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="text-muted text-truncate" style={{ maxWidth: '160px' }} title={params.value}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },

    // Position column
    {
      field: 'position',
      headerName: 'Position',
      width: 100,
      renderCell: (params) => (
        <span className="badge bg-info">
          {params.value || "homepage"}
        </span>
      ),
    },

    // Status column
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => <StatusBadge status={params.value} />,
    },

    // Order column
    {
      field: 'order',
      headerName: 'Order',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <span className="badge bg-warning">
          {params.value || 1}
        </span>
      ),
    },

    // Created At column
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 120,
      renderCell: (params) => (
        <span className="small text-muted">
          {new Date(params.value).toLocaleDateString()}
        </span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          {/* View Button */}
          <button
            onClick={() => setViewModal({ isOpen: true, banner: params.row })}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#e0f2fe',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }}
            title="View Banner Details"
            onMouseEnter={(e) => e.target.style.backgroundColor = '#bae6fd'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#e0f2fe'}
          >
            <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          {/* Edit Button */}
          <button
            onClick={() => handleEdit(params.row)}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#e0f2fe',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }}
            title="Edit Banner"
            onMouseEnter={(e) => e.target.style.backgroundColor = '#bae6fd'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#e0f2fe'}
          >
            <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleDeleteClick(params.row._id, params.row.title)}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#fee2e2',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }}
            title="Delete Banner"
            onMouseEnter={(e) => e.target.style.backgroundColor = '#fecaca'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#fee2e2'}
          >
            <svg width="16" height="16" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
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
      {/* Toast Container */}
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Banner"
        message={`Are you sure you want to delete "${confirmModal.bannerTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Enhanced Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.actionBarContent}>
          {/* Left Section - Search and Filters */}
          <div className={styles.actionBarLeft}>
            {/* Search Bar */}
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <svg className={styles.searchIcon} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search banners..."
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
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setStatusDropdownOpen(false);
                    }}
                    onMouseDown={() => setStatusDropdownOpen(!statusDropdownOpen)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Status</option>
                    {uniqueStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  <span className={`${styles.dropdownIcon} ${statusDropdownOpen ? styles.rotatedIcon : ''}`}>
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
                minWidth: '140px'
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className={styles.buttonTextFull}>Add New Banner</span>
              <span className={styles.buttonTextShort}>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Data Table */}
      <CommonDataGrid
        data={filteredBanners}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 15, 20, 50]}
        initialPageSize={10}
        noDataMessage="No banners found"
        noDataDescription={
          searchTerm || statusFilter !== "all"
            ? "Try adjusting your search criteria or filters."
            : "Get started by creating your first banner."
        }
        noDataAction={
          (!searchTerm && statusFilter === "all") ? {
            onClick: () => setFormMode("add"),
            text: "Create First Banner"
          } : null
        }
        loadingMessage="Loading banners..."
        showSerialNumber={true}
        serialNumberField="id"
        serialNumberHeader="Sr.no."
        serialNumberWidth={100}
      />

      {/* Modal for Add/Edit Form */}
      <Modal
        isOpen={formMode !== null}
        onClose={() => {
          console.log('Modal closing, resetting form');
          setFormMode(null);
          setEditId(null);
          setImageFile(null);
          setImagePreview(null);
          setFormData({
            title: "",
            subtitle: "",
            description: "",
            image: "",
            link: "",
            altText: "",
            order: 1,
            status: "active",
            position: "homepage",
            startDate: "",
            endDate: ""
          });
          // Reset file input by forcing re-render with key change
        }}
        title={formMode === "edit" ? "Edit Banner" : "Create New Banner"}
      >
        {/* Enhanced Modal Content */}
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
            {/* Basic Information Section */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Basic Information</h3>
                <p className={styles.formSectionDescription}>Essential details for your banner</p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Banner Title <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter banner title..."
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Subtitle</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Enter banner subtitle..."
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Description <span className={styles.required}>*</span>
                </label>
                <textarea
                  className={styles.formTextarea}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter banner description..."
                  required
                />
              </div>
            </div>

            {/* Media Section */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Media & Links</h3>
                <p className={styles.formSectionDescription}>Banner image and destination URL</p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Banner Image <span className={styles.required}>*</span>
                  </label>
                  <input
                    key={formMode === "edit" ? `edit-${editId}` : "add"}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={styles.formInput}
                    style={{ padding: '8px' }}
                    required={formMode !== "edit"}
                  />
                  <small className={styles.formHelp}>Upload banner image (max 10MB, JPG, PNG, GIF, WEBP)</small>
                  {imagePreview && (
                    <div style={{ marginTop: '10px' }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          borderRadius: '8px',
                          border: '1px solid #d1d5db'
                        }}
                      />
                      {imageFile && (
                        <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                          File: {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                        </p>
                      )}
                    </div>
                  )}
                  {!imagePreview && formMode === "edit" && formData.image && (
                    <div style={{ marginTop: '10px', padding: '8px', background: '#f3f4f6', borderRadius: '8px' }}>
                      <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                        Current image will be kept if no new file is uploaded
                      </p>
                    </div>
                  )}
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Link URL</label>
                  <input
                    type="url"
                    className={styles.formInput}
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://example.com/destination"
                  />
                  <small className={styles.formHelp}>Where users go when they click the banner</small>
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Alt Text</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.altText}
                  onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                  placeholder="Alternative text for the banner image"
                />
                <small className={styles.formHelp}>Accessibility text for the image</small>
              </div>
            </div>

            {/* Settings Section */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Settings & Schedule</h3>
                <p className={styles.formSectionDescription}>Status, order, position, and scheduling options</p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Status</label>
                  <select
                    className={styles.formSelect}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Order</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    min="1"
                    max="100"
                  />
                  <small className={styles.formHelp}>Display order (1-100)</small>
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Position</label>
                <select
                  className={styles.formSelect}
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                >
                  <option value="homepage">Homepage</option>
                  <option value="top">Top</option>
                  <option value="middle">Middle</option>
                  <option value="bottom">Bottom</option>
                  <option value="sidebar">Sidebar</option>
                </select>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Start Date</label>
                  <input
                    type="datetime-local"
                    className={styles.formInput}
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>End Date</label>
                  <input
                    type="datetime-local"
                    className={styles.formInput}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => {
                  setFormMode(null);
                  setEditId(null);
                  setImageFile(null);
                  setImagePreview(null);
                  setFormData({
                    title: "",
                    subtitle: "",
                    description: "",
                    image: "",
                    link: "",
                    altText: "",
                    order: 1,
                    status: "active",
                    position: "homepage",
                    startDate: "",
                    endDate: ""
                  });
                }}
                className={styles.formCancelBtn}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              <button
                type="submit"
                className={styles.formSubmitBtn}
              >
                {formMode === "edit" ? "Update Banner" : "Create Banner"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* View Banner Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, banner: null })}
        title="View Banner Details"
      >
        {viewModal.banner && (
          <div className={styles.modalFormContent}>
            {/* Basic Information Section */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Banner Information</h3>
                <p className={styles.formSectionDescription}>Banner details and content</p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Title</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={viewModal.banner.title || ''}
                    readOnly
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Subtitle</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={viewModal.banner.subtitle || ''}
                    readOnly
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.formTextarea}
                  value={viewModal.banner.description || ''}
                  readOnly
                  rows={3}
                />
              </div>
            </div>

            {/* Media Section */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Media & Links</h3>
                <p className={styles.formSectionDescription}>Banner image and destination</p>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Banner Image</label>
                {viewModal.banner.image ? (
                  <>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={viewModal.banner.image}
                      readOnly
                      style={{ marginBottom: '10px' }}
                    />
                    <img
                      src={viewModal.banner.image.startsWith('http') ? viewModal.banner.image : `${API_BASE_URL}${viewModal?.banner?.image}`}
                      alt={viewModal.banner.altText || viewModal.banner.title}
                      style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #d1d5db' }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                      }}
                    />
                  </>
                ) : (
                  <input
                    type="text"
                    className={styles.formInput}
                    value="No image uploaded"
                    readOnly
                    style={{ color: '#999' }}
                  />
                )}
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Link URL</label>
                <input
                  type="url"
                  className={styles.formInput}
                  value={viewModal.banner.link || ''}
                  readOnly
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Alt Text</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={viewModal.banner.altText || ''}
                  readOnly
                />
              </div>
            </div>

            {/* Settings Section */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Settings & Schedule</h3>
                <p className={styles.formSectionDescription}>Status, position, and scheduling</p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Status</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={viewModal.banner.status || 'active'}
                    readOnly
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Position</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={viewModal.banner.position || 'homepage'}
                    readOnly
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Order</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={viewModal.banner.order || 1}
                    readOnly
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Created At</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={new Date(viewModal.banner.createdAt).toLocaleString()}
                    readOnly
                  />
                </div>
              </div>

              {(viewModal.banner.startDate || viewModal.banner.endDate) && (
                <div className={styles.formGrid}>
                  {viewModal.banner.startDate && (
                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Start Date</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={new Date(viewModal.banner.startDate).toLocaleString()}
                        readOnly
                      />
                    </div>
                  )}

                  {viewModal.banner.endDate && (
                    <div className={styles.formField}>
                      <label className={styles.formLabel}>End Date</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={new Date(viewModal.banner.endDate).toLocaleString()}
                        readOnly
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => setViewModal({ isOpen: false, banner: null })}
                className={styles.formCancelBtn}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}