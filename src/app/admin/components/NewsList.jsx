'use client';

import React, { useState, useEffect, useMemo } from "react";
// import { usePermissions } from "../hooks/usePermissions";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PermissionGate from "@/app/components/PermissionGate";
import CommonDataGrid, { Tooltip, StatusBadge } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from './NewsList.module.css';
import StarterKit from '@tiptap/starter-kit';
import { useEditor, EditorContent } from '@tiptap/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Enhanced Modal Component with Better Design and Animations
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit") ? "Update news details and settings" : "Create a new news with all details"}
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

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editId, setEditId] = useState(null);


  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.description,   // 👈 was formData.content
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, description: editor.getHTML() })); // 👈 update description
    },
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
    },
  });


  useEffect(() => {
    if (editor && formData.description !== editor.getHTML()) {
      editor.commands.setContent(formData.description || "");
    }
  }, [formData.description, editor]);


  const [statusFilter, setStatusFilter] = useState("all");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [authorFilter, setAuthorFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    newsId: null,
    newsTitle: ""
  });

  // View modal state
  const [viewModal, setViewModal] = useState({
    isOpen: false,
    news: null
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/news`);
      if (!response.ok) throw new Error("Failed to fetch news");
      const data = await response.json();
      // Handle new API response format with data property
      setNews(data.data || data || []);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to fetch news: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Updated delete functions
  const handleDeleteClick = (id, title) => {
    console.log('Delete clicked for:', id, title); // Debug log
    console.log('Current confirmModal state:', confirmModal); // Debug current state
    setConfirmModal({
      isOpen: true,
      newsId: id,
      newsTitle: title
    });
    console.log('Set confirmModal to:', { isOpen: true, newsId: id, newsTitle: title }); // Debug new state
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/news/${confirmModal.newsId}`, { method: "DELETE" });
      setNews(news.filter((item) => item._id !== confirmModal.newsId));
      toast.success("News deleted successfully!");
    } catch (error) {
      toast.error(`Failed to delete news: ${error.message}`);
    } finally {
      setConfirmModal({ isOpen: false, newsId: null, newsTitle: "" });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmModal({ isOpen: false, newsId: null, newsTitle: "" });
  };

  // New handler functions for additional actions
  const handleView = (item) => {
    // Open news in a new tab or modal for viewing
    if (item.slug) {
      window.open(`/news/${item.slug}`, '_blank');
    } else {
      toast.info("News preview not available - no slug found");
    }
  };

  const handleDuplicate = async (item) => {
    try {
      const duplicateData = {
        ...item,
        title: `${item.title} (Copy)`,
        slug: `${item.slug}-copy-${Date.now()}`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        views: 0
      };

      delete duplicateData._id;

      const response = await fetch(`${API_BASE_URL}/api/news`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to duplicate news: ${errorData.error || 'Unknown error'}`);
        return;
      }

      toast.success("News duplicated successfully!");
      fetchNews();
    } catch (error) {
      console.error('Duplicate error:', error);
      toast.error(`Failed to duplicate news: ${error.message}`);
    }
  };

  const handleStatusToggle = async (item) => {
    try {
      const newStatus = item.status === 'published' ? 'draft' : 'published';

      const response = await fetch(`${API_BASE_URL}/api/news/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to update status: ${errorData.error || 'Unknown error'}`);
        return;
      }

      toast.success(`News ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`);
      fetchNews();
    } catch (error) {
      console.error('Status toggle error:', error);
      toast.error(`Failed to update status: ${error.message}`);
    }
  };

  const resetForm = () => {
    setFormMode(null);
    setEditId(null);
    setFormData({
      title: "",
      date: "",
      image: "",
    });
    setImageFile(null);
    setImagePreview("");
  };

  const formatDateForApi = (value) => {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    if (!year || !month || !day) return value;
    return `${day}-${month}-${year}`; // DD-MM-YYYY for API
  };

  const formatDateForInput = (value) => {
    if (!value) return "";
    const [day, month, year] = value.split("-");
    if (!day || !month || !year) return value;
    return `${year}-${month}-${day}`; // YYYY-MM-DD for input[type=date]
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title?.trim(),
        date: formatDateForApi(formData.date), // DD-MM-YYYY
      };

      console.log("Submitting payload:", payload);

      const formDataToSend = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formDataToSend.append(key, value);
        }
      });

      // image file
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      } else if (formMode === "edit" && formData.image) {
        // If backend supports keeping the same image via string
        formDataToSend.append("image", formData.image);
      }

      let response;
      if (formMode === "edit") {
        response = await fetch(`${API_BASE_URL}/api/news/${editId}`, {
          method: "PUT",
          body: formDataToSend,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/api/news`, {
          method: "POST",
          body: formDataToSend,
        });
      }

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response:", errorData);
        toast.error(`Failed to save: ${errorData.error || "Unknown error"}`);
        return;
      }

      const result = await response.json();
      console.log("Success response:", result);

      resetForm();
      toast.success(
        formMode === "edit" ? "News updated successfully!" : "News created successfully!"
      );
      fetchNews();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(`Failed to save. Error: ${error.message}`);
    }
  };


  const handleEdit = (item) => {
    setFormMode("edit");
    setEditId(item._id);

    let preview = "";
    if (item.image) {
      if (item.image.startsWith("http")) {
        preview = item.image;
      } else if (item.image.startsWith("/")) {
        preview = `${API_BASE_URL}${item?.image}`;
      } else {
        preview = `${API_BASE_URL}/uploads/news/${item.image}`;
      }
    }

    setFormData({
      title: item.title || "",
      date: item.date ? formatDateForInput(item.date) : "",
      image: item.image || "",
    });

    setImageFile(null);
    setImagePreview(preview);
  };

  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(news.map(item => item.status).filter(Boolean))];
    return statuses.sort();
  }, [news]);

  // Filter news by status, author, and search term
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const statusMatch = statusFilter === "all" || item.status === statusFilter;
      const authorMatch = authorFilter === "all" || item.author === authorFilter;
      const searchMatch = searchTerm === "" ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase()));

      return statusMatch && authorMatch && searchMatch;
    });
  }, [news, statusFilter, authorFilter, searchTerm]);

  // Define table columns for Common DataGrid
  const columns = [
    // Title column
    {
      field: 'title',
      headerName: 'Title',
      width: 180,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="fw-medium text-truncate" style={{ maxWidth: '180px' }} title={params.value}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },

    {
      field: "date",
      headerName: "Date",
      width: 120,
      renderCell: (params) => <span>{params.value || "N/A"}</span>,
    },
    // optional thumbnail
    {
      field: "image",
      headerName: "Image",
      width: 120,
      renderCell: (params) =>
        params.value ? (
          <img
            src={
              params.value.startsWith("http")
                ? params.value
                : params.value.startsWith("/")
                  ? `${API_BASE_URL}${params?.value}`
                  : `${API_BASE_URL}/uploads/news/${params.value}`
            }
            alt={params.row.title}
            style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }}
          />
        ) : (
          "No image"
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
            onClick={() => setViewModal({ isOpen: true, news: params.row })}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#e0f2fe',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }}
            title="View News Details"
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
            title="Edit News"
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
            title="Delete News"
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
        title="Delete News"
        message={`Are you sure you want to delete "${confirmModal.newsTitle}"? This action cannot be undone.`}
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
                  placeholder="Search news..."
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
              <span className={styles.buttonTextFull}>Add News</span>
              <span className={styles.buttonTextShort}>Add</span>
            </button>
          </div>
        </div>
      </div>


      {/* Enhanced Data Table */}
      <CommonDataGrid
        data={filteredNews}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 15, 20, 50]}
        initialPageSize={10}
        noDataMessage="No news found"
        noDataDescription={
          searchTerm || statusFilter !== "all" || authorFilter !== "all"
            ? "Try adjusting your search criteria or filters."
            : "Get started by creating your first news."
        }
        noDataAction={
          (!searchTerm && statusFilter === "all" && authorFilter === "all") ? {
            onClick: () => setFormMode("add"),
            text: "Create First News"
          } : null
        }
        loadingMessage="Loading news..."
        showSerialNumber={true}
        serialNumberField="id"
        serialNumberHeader="Sr.no."
        serialNumberWidth={100}
      />


      {/* Modal for Add/Edit Form */}
      <Modal
        isOpen={formMode !== null}
        onClose={resetForm}
        title={formMode === "edit" ? "Edit News" : "Create New News"}
      >

        {/* Enhanced Modal Content */}
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
            {/* Basic Information Section */}
            {/* Featured Image Section */}
            {/* Featured Image Section */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Featured Image</h3>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.formInput}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      } else {
                        setImageFile(null);
                        setImagePreview("");
                      }
                    }}
                  />
                  <small className={styles.formHelper}>
                    Supported formats: JPG, PNG, WEBP.
                  </small>
                </div>

                {(imagePreview || formData.image) && (
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Preview</label>
                    <div
                      style={{
                        width: "200px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid #e5e7eb",
                        background: "#f9fafb",
                      }}
                    >
                      <img
                        src={
                          imagePreview ||
                          (formData.image?.startsWith("http")
                            ? formData.image
                            : formData.image?.startsWith("/")
                              ? `${API_BASE_URL}${formData?.image}`
                              : `${API_BASE_URL}/uploads/news/${formData.image}`)
                        }
                        alt="News"
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Title & Date */}
            <div className={styles.formSection}>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Title</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter title..."
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Date</label>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>



            {/* Form Actions */}
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={resetForm}
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

                {formMode === "edit" ? "Update News" : "Create News"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* View News Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, news: null })}
        title="View News Details"
      >
        {viewModal.news && (
          <div className={styles.viewModalContent}>
            <div className={styles.viewSection}>
              <div className={styles.viewSectionHeader}>
                <h3 className={styles.viewSectionTitle}>News Information</h3>
              </div>

              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Title</label>
                <div className={styles.viewValue}>{viewModal.news.title}</div>
              </div>

              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Date</label>
                <div className={styles.viewValue}>{viewModal.news.date || "N/A"}</div>
              </div>

              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Image</label>
                <div className={styles.viewValue}>
                  {viewModal.news.image ? (
                    <img
                      src={
                        viewModal.news.image.startsWith("http")
                          ? viewModal.news.image
                          : viewModal.news.image.startsWith("/")
                            ? `${API_BASE_URL}${viewModal?.news?.image}`
                            : `${API_BASE_URL}/uploads/news/${viewModal.news.image}`
                      }
                      alt={viewModal.news.title}
                      style={{
                        maxWidth: "100%",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                  ) : (
                    "No image"
                  )}
                </div>
              </div>
            </div>

            <div className={styles.viewModalActions}>
              <button
                onClick={() => setViewModal({ isOpen: false, news: null })}
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
