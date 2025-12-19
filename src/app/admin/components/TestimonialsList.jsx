'use client';

import React, { useState, useEffect, useMemo } from "react";
import dynamic from 'next/dynamic';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonDataGrid, { Tooltip } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from "./CMSList.module.css";

// CKEditor Wrapper Component to handle client-side only rendering
const CKEditorWrapper = dynamic(
  () => import('./CKEditorWrapper'),
  {
    ssr: false,
    loading: () => null
  }
);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '${API_BASE_URL}';
const TESTIMONIALS_ENDPOINT = `${API_BASE_URL}/api/testimonials`;
const IMAGE_UPLOAD_URL = `${API_BASE_URL}/api/cms/upload-image`;

const getImageUrl = (path = "") => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
};

// Enhanced Modal Component
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
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalIcon}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit") ? "Update testimonial details" : "Create a new testimonial"}
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
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
};

export default function TestimonialsList() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    message: "",
    status: "active",
  });
  const [editId, setEditId] = useState(null);
  const [editorInstance, setEditorInstance] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    testimonialId: null,
    testimonialName: ""
  });
  const [viewModal, setViewModal] = useState({
    isOpen: false,
    testimonial: null
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(TESTIMONIALS_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch testimonials");
      const data = await response.json();
      setTestimonials(data.data || []);
    } catch (err) {
      toast.error(`Failed to fetch testimonials: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // CKEditor 4 configuration
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
      { name: 'forms', items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'] },
      '/',
      { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
      { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'] },
      { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
      { name: 'insert', items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
      '/',
      { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
      { name: 'colors', items: ['TextColor', 'BGColor'] },
      { name: 'tools', items: ['Maximize', 'ShowBlocks'] }
    ]
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const latestMessage = editorInstance?.getData ? editorInstance.getData() : formData.message;
      
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("designation", formData.designation);
      payload.append("message", latestMessage || "");
      payload.append("status", formData.status);

      let response;
      if (formMode === "edit") {
        response = await fetch(`${TESTIMONIALS_ENDPOINT}/${editId}`, {
          method: "PUT",
          body: payload,
        });
      } else {
        response = await fetch(TESTIMONIALS_ENDPOINT, {
          method: "POST",
          body: payload,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to save: ${errorData.message || 'Unknown error'}`);
        return;
      }

      toast.success(formMode === "edit" ? "Testimonial updated successfully!" : "Testimonial created successfully!");
      setFormMode(null);
      setEditId(null);
      setEditorInstance(null);
      setFormData({
        name: "",
        designation: "",
        message: "",
        status: "active",
      });
      fetchTestimonials();
    } catch (error) {
      toast.error(`Failed to save. Error: ${error.message}`);
    }
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    setEditId(item._id);
    setFormData({
      name: item.name || "",
      designation: item.designation || "",
      message: item.message || "",
      status: item.status || "active",
    });
  };

  const handleDeleteClick = (id, name) => {
    setConfirmModal({
      isOpen: true,
      testimonialId: id,
      testimonialName: name
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(`${TESTIMONIALS_ENDPOINT}/${confirmModal.testimonialId}`, { method: "DELETE" });
      setTestimonials(testimonials.filter((item) => item._id !== confirmModal.testimonialId));
      toast.success("Testimonial deleted successfully!");
    } catch (error) {
      toast.error(`Failed to delete testimonial: ${error.message}`);
    } finally {
      setConfirmModal({ isOpen: false, testimonialId: null, testimonialName: "" });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmModal({ isOpen: false, testimonialId: null, testimonialName: "" });
  };

  // Filter testimonials by status and search term
  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((item) => {
      const statusMatch = statusFilter === "all" || item.status === statusFilter;
      const searchMatch = searchTerm === "" ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.institute?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message?.toLowerCase().includes(searchTerm.toLowerCase());

      return statusMatch && searchMatch;
    });
  }, [testimonials, statusFilter, searchTerm]);

  // Render Rating Stars
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          width="16"
          height="16"
          fill={i <= rating ? "#fbbf24" : "#e5e7eb"}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
    return <div className="d-flex align-items-center gap-1">{stars}</div>;
  };

  // Define table columns
  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="fw-medium text-truncate" style={{ maxWidth: '130px' }} title={params.value}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: 'designation',
      headerName: 'Designation',
      width: 150,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="text-muted text-truncate" style={{ maxWidth: '130px' }} title={params.value}>
            {params.value || "—"}
          </div>
        </Tooltip>
      ),
    },
    {
      field: 'message',
      headerName: 'Message',
      width: 300,
      renderCell: (params) => (
        <Tooltip content={params.value?.replace(/<[^>]*>/g, '')}>
          <div
            className="text-muted text-truncate"
            style={{ maxWidth: '280px' }}
            dangerouslySetInnerHTML={{ __html: params.value?.substring(0, 100) + '...' || "—" }}
          />
        </Tooltip>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => {
        const status = params.value || 'active';
        return (
          <span className={`badge ${status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 150,
      renderCell: (params) => (
        <span className="small text-muted">
          {params.value ? new Date(params.value).toLocaleDateString() : 'N/A'}
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
            onClick={() => setViewModal({ isOpen: true, testimonial: params.row })}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#e0f2fe',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }}
            title="View Testimonial Details"
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
            title="Edit Testimonial"
            onMouseEnter={(e) => e.target.style.backgroundColor = '#bae6fd'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#e0f2fe'}
          >
            <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleDeleteClick(params.row._id, params.row.name)}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#fee2e2',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }}
            title="Delete Testimonial"
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

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Testimonial"
        message={`Are you sure you want to delete "${confirmModal.testimonialName}"? This action cannot be undone.`}
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
                  placeholder="Search testimonials..."
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
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
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
                minWidth: '140px'
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className={styles.buttonTextFull}>Add New Testimonial</span>
              <span className={styles.buttonTextShort}>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <CommonDataGrid
        data={filteredTestimonials}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 15, 20, 50]}
        initialPageSize={10}
        noDataMessage="No testimonials found"
        noDataDescription={
          searchTerm || statusFilter !== "all"
            ? "Try adjusting your search criteria or filters."
            : "Get started by creating your first testimonial."
        }
        noDataAction={
          (!searchTerm && statusFilter === "all") ? {
            onClick: () => setFormMode("add"),
            text: "Create First Testimonial"
          } : null
        }
        loadingMessage="Loading testimonials..."
        showSerialNumber={true}
        serialNumberField="id"
        serialNumberHeader="Sr.no."
        serialNumberWidth={100}
      />

      {/* Modal for Add/Edit Form */}
      <Modal
        isOpen={formMode !== null}
        onClose={() => {
          setFormMode(null);
          setEditId(null);
          setEditorInstance(null);
          setFormData({
            name: "",
            designation: "",
            message: "",
            status: "active",
          });
        }}
        title={formMode === "edit" ? "Edit Testimonial" : "Create New Testimonial"}
      >
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Testimonial Details</h3>
                <p className={styles.formSectionDescription}>Enter testimonial information</p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter name"
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Designation <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="Enter designation"
                    required
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Message <span className={styles.required}>*</span>
                </label>
                <div style={{ minHeight: '200px' }}>
                  <CKEditorWrapper
                    data={formData.message || ''}
                    config={editorConfiguration}
                    onReady={(editor) => {
                      setEditorInstance(editor);
                      if (!editor) return;

                      editor.config.filebrowserUploadUrl = IMAGE_UPLOAD_URL;
                      editor.config.filebrowserImageUploadUrl = IMAGE_UPLOAD_URL;

                      editor.on('fileUploadRequest', (evt) => {
                        const fileLoader = evt.data.fileLoader;
                        const xhr = fileLoader.xhr;
                        const formData = new FormData();

                        xhr.open('POST', IMAGE_UPLOAD_URL, true);
                        formData.append('image', fileLoader.file, fileLoader.fileName);
                        fileLoader.xhr.send(formData);

                        evt.stop();
                      });

                      editor.on('fileUploadResponse', (evt) => {
                        evt.stop();
                        try {
                          const response = JSON.parse(evt.data.xhr.responseText || '{}');

                          if (!response?.success || !response?.url) {
                            evt.cancel();
                            toast.error(response?.message || 'Image upload failed. Please try again.');
                            return;
                          }

                          const fullUrl = response.url.startsWith('http')
                            ? response.url
                            : `${API_BASE_URL}${response.url}`;

                          evt.data.url = fullUrl;
                          toast.success('Image uploaded successfully!', { autoClose: 2000 });
                        } catch (parseError) {
                          evt.cancel();
                          toast.error('Unexpected upload response. Please try again.');
                        }
                      });
                    }}
                    onChange={(event, editor) => {
                      const data = editor?.getData ? editor.getData() : event.target.value;
                      setFormData((prev) => ({ ...prev, message: data }));
                    }}
                  />
                </div>
                <small className={styles.formHelp}>
                  Format your message using the toolbar. You can add images, links, and formatted text.
                </small>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Status</label>
                <select
                  className={styles.formInput}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => {
                  setFormMode(null);
                  setEditId(null);
                  setEditorInstance(null);
                  setFormData({
                    name: "",
                    designation: "",
                    message: "",
                    status: "active",
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
                {formMode === "edit" ? "Update Testimonial" : "Create Testimonial"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* View Testimonial Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, testimonial: null })}
        title="View Testimonial Details"
      >
        {viewModal.testimonial && (
          <div className={styles.viewModalContent}>
            <div className={styles.viewSection}>
              <div className={styles.viewSectionHeader}>
                <h3 className={styles.viewSectionTitle}>Testimonial Information</h3>
              </div>

              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Photo</label>
                <div className={styles.viewValue}>
                  {viewModal.testimonial.photo ? (
                    <img
                      src={getImageUrl(viewModal.testimonial.photo)}
                      alt={viewModal.testimonial.name}
                      style={{ width: '120px', height: '120px', borderRadius: '8px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div style={{ width: '120px', height: '120px', backgroundColor: '#e5e7eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.viewGrid}>
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Name</label>
                  <div className={styles.viewValue}>{viewModal.testimonial.name}</div>
                </div>

                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Designation</label>
                  <div className={styles.viewValue}>{viewModal.testimonial.designation || 'N/A'}</div>
                </div>
              </div>

              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Institute</label>
                <div className={styles.viewValue}>{viewModal.testimonial.institute || 'N/A'}</div>
              </div>

              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Message</label>
                <div
                  className={`${styles.viewValue} ${styles.viewContentPreview || ''}`}
                  dangerouslySetInnerHTML={{ __html: viewModal.testimonial.message || 'N/A' }}
                />
              </div>

              <div className={styles.viewGrid}>
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Rating</label>
                  <div className={styles.viewValue}>
                    {renderRating(viewModal.testimonial.rating || 0)}
                  </div>
                </div>

                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Status</label>
                  <div className={styles.viewValue}>
                    {viewModal.testimonial.status === 'active' ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-secondary">Inactive</span>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Created At</label>
                <div className={styles.viewValue}>
                  {viewModal.testimonial.createdAt ? new Date(viewModal.testimonial.createdAt).toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>

            <div className={styles.viewModalActions}>
              <button
                onClick={() => setViewModal({ isOpen: false, testimonial: null })}
                className={styles.viewCloseBtn}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

