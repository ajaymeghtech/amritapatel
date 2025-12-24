'use client';

import React, { useState, useEffect, useMemo } from "react";
import dynamic from 'next/dynamic';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommonDataGrid, { Tooltip, StatusBadge } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from './CMSList.module.css';

// CKEditor Wrapper Component to handle client-side only rendering
const CKEditorWrapper = dynamic(
  () => import('./CKEditorWrapper'),
  {
    ssr: false,
    // Return null during initial hydration to avoid mismatches
    loading: () => null
  }
);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '${API_BASE_URL}';
const IMAGE_UPLOAD_URL = `${API_BASE_URL}/api/cms/upload-image`;

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit") ? "Update CMS page details and content" : "Create a new CMS page with all details"}
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

export default function CMSList() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formMode, setFormMode] = useState(null); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    page_key: "",
    title: "",
    slug: "",
    content: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    banner_image: "",
    status: true,
    description_1: "",   // NEW
    description_2: "",   // NEW
  });
  const [editId, setEditId] = useState(null);
  const [editorInstance, setEditorInstance] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  // Image upload handler for CKEditor
  const handleImageUpload = async (file) => {
    try {
      toast.info('Uploading image...', { autoClose: 2000 });
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/api/cms/upload-image`, {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      console.log("dataurl", data);
      const imageUrl = data.url;
      toast.success('Image uploaded successfully!', { autoClose: 2000 });
      console.log("imageUrl", imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      return null;
    }
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBannerPreview(URL.createObjectURL(file)); // local preview

    // store image name/path to formData (if required)
    setFormData((prev) => ({
      ...prev,
      banner_image: file
    }));
  };

  // CKEditor 4 configuration
  const editorConfiguration = {
    height: 400,
    allowedContent: true, // allow classes/styles/attributes from Source view
    extraAllowedContent: '*(*);*{*};*[*]', // keep custom classes, inline styles, attributes
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

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    pageId: null,
    pageTitle: ""
  });

  // View modal state
  const [viewModal, setViewModal] = useState({
    isOpen: false,
    page: null
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cms/`);
      if (!response.ok) throw new Error("Failed to fetch CMS pages");
      const data = await response.json();
      // Handle API response format with data property
      setPages(data.data || data || []);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to fetch CMS pages: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Updated delete functions
  const handleDeleteClick = (id, title) => {
    setConfirmModal({
      isOpen: true,
      pageId: id,
      pageTitle: title
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/cms/${confirmModal.pageId}`, { method: "DELETE" });
      setPages(pages.filter((item) => item._id !== confirmModal.pageId));
      toast.success("CMS page deleted successfully!");
    } catch (error) {
      toast.error(`Failed to delete CMS page: ${error.message}`);
    } finally {
      setConfirmModal({ isOpen: false, pageId: null, pageTitle: "" });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmModal({ isOpen: false, pageId: null, pageTitle: "" });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const latestContent = editorInstance?.getData ? editorInstance.getData() : formData.content;
      const payload = {
        ...formData,
        content: latestContent || "",
      };
      console.log('Submitting CMS page data:', payload);

      let response;
      if (formMode === "edit") {
        response = await fetch(`${API_BASE_URL}/api/cms/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/api/cms/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to save: ${errorData.error || 'Unknown error'}`);
        return;
      }

      const result = await response.json();
      console.log('Success response:', result);

      setFormMode(null);
      setEditId(null);
      setEditorInstance(null);
      setFormData({
        page_key: "",
        title: "",
        slug: "",
        content: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        banner_image: "",
        status: true,
        description_1: "",
        description_2: "",
      });

      toast.success(formMode === "edit" ? "CMS page updated successfully!" : "CMS page created successfully!");
      fetchPages();
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(`Failed to save. Error: ${error.message}`);
    }
  };

  const handleEdit = (item) => {
    console.log("item", item);
    setFormMode("edit");
    setEditId(item._id);
    setFormData({
      page_key: item.page_key || "",
      title: item.title || "",
      slug: item.slug || "",
      content: item.content || "",
      meta_title: item.meta_title || "",
      meta_description: item.meta_description || "",
      meta_keywords: item.meta_keywords || "",
      banner_image: item.banner_image || "",
      status: item.status !== undefined ? item.status : true,
      description_1: item.description_1 || "",
      description_2: item.description_2 || "",
    });
  };

  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(pages.map(item => item.status ? 'active' : 'inactive'))];
    return statuses.sort();
  }, [pages]);

  // Filter pages by status and search term
  const filteredPages = useMemo(() => {
    return pages.filter((item) => {
      const statusMatch = statusFilter === "all" ||
        (statusFilter === "active" && item.status) ||
        (statusFilter === "inactive" && !item.status);
      const searchMatch = searchTerm === "" ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.page_key.toLowerCase().includes(searchTerm.toLowerCase());

      return statusMatch && searchMatch;
    });
  }, [pages, statusFilter, searchTerm]);

  // Define table columns for Common DataGrid
  const columns = [
    // Page Key column
    {
      field: 'page_key',
      headerName: 'Page Key',
      width: 150,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="fw-medium text-muted" style={{ fontFamily: 'monospace', fontSize: '13px' }} title={params.value}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },

    // Title column
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

    // Slug column
    {
      field: 'slug',
      headerName: 'Slug',
      width: 200,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="text-muted text-truncate" style={{ maxWidth: '100%' }} title={params.value}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },

    // Status column
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => {
        const status = params.value ? 'active' : 'inactive';
        return (
          <span className={`badge ${status === 'active' ? 'bg-success' : 'bg-danger'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
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
      renderCell: (params) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          {/* View Button */}
          <button
            onClick={() => setViewModal({ isOpen: true, page: params.row })}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#e0f2fe',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }}
            title="View CMS Page Details"
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
            title="Edit CMS Page"
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
            title="Delete CMS Page"
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
      maxWidth: '100%',
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
        title="Delete CMS Page"
        message={`Are you sure you want to delete "${confirmModal.pageTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Enhanced Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.actionBarContent}>
          {/* Left Section - Search and Filters */}
          <div className={styles.actionBarLeft}>
            {/* Search Bar - Hidden */}

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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
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
              <span className={styles.buttonTextFull}>Add New Page</span>
              <span className={styles.buttonTextShort}>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Data Table */}
      <div style={{ width: '100%', overflow: 'auto' }}>
        <CommonDataGrid
          data={filteredPages}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 15, 20, 50]}
          initialPageSize={10}
          noDataMessage="No CMS pages found"
          noDataDescription={
            searchTerm || statusFilter !== "all"
              ? "Try adjusting your search criteria or filters."
              : "Get started by creating your first CMS page."
          }
          noDataAction={
            (!searchTerm && statusFilter === "all") ? {
              onClick: () => setFormMode("add"),
              text: "Create First Page"
            } : null
          }
          loadingMessage="Loading CMS pages..."
          showSerialNumber={true}
          serialNumberField="id"
          serialNumberHeader="Sr.no."
          serialNumberWidth={100}
        />
      </div>

      {/* Modal for Add/Edit Form */}
      <Modal
        isOpen={formMode !== null}
        onClose={() => {
          setFormMode(null);
          setEditId(null);
          setEditorInstance(null);
          setFormData({
            page_key: "",
            title: "",
            slug: "",
            content: "",
            meta_title: "",
            meta_description: "",
            meta_keywords: "",
            banner_image: "",
            status: true,
            description_1: "",
            description_2: "",
          });
        }}
        title={formMode === "edit" ? "Edit CMS Page" : "Create New CMS Page"}
      >
        {/* Enhanced Modal Content */}
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
            {/* Basic Information Section */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Page Details</h3>
                <p className={styles.formSectionDescription}>Essential information for the page</p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Page Key <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.page_key}
                    onChange={(e) => formMode !== "edit" && setFormData({ ...formData, page_key: e.target.value })}
                    placeholder="e.g., about, contact"
                    disabled={formMode === "edit"}
                    required
                  />
                  <small className={styles.formHelp}>Unique identifier for the page</small>
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
                    placeholder="Page title"
                    required
                  />
                </div>
              </div>

              {/* Main Content CKEditor */}
              <div className={styles.formField}>
                <label className={styles.formLabel}>Content</label>
                <div style={{ minHeight: '250px' }}>
                  <CKEditorWrapper
                    data={formData.content || ''}
                    config={editorConfiguration}
                    onReady={(editor) => {
                      setEditorInstance(editor);
                      console.log('CKEditor is ready', editor);

                      if (!editor) return;

                      // Proactively configure upload URLs so CKEditor shows the Upload tab
                      editor.config.filebrowserUploadUrl = IMAGE_UPLOAD_URL;
                      editor.config.filebrowserImageUploadUrl = IMAGE_UPLOAD_URL;

                      // Handle actual upload using our API endpoint with the expected "image" field
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
                            : `${API_BASE_URL}${response?.url}`;

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
                      setFormData((prev) => ({ ...prev, content: data }));
                    }}
                  />
                </div>
                <small className={styles.formHelp}>
                  Format your content using the toolbar. (Optional field)
                </small>
              </div>

              {/* Description 1 CKEditor */}
              <div className={styles.formField}>
                <label className={styles.formLabel}>Description 1</label>
                <div style={{ minHeight: '200px' }}>
                  <CKEditorWrapper
                    data={formData.description_1 || ''}
                    config={editorConfiguration}
                    onReady={(editor) => {
                      if (!editor) return;
                      editor.config.filebrowserUploadUrl = IMAGE_UPLOAD_URL;
                      editor.config.filebrowserImageUploadUrl = IMAGE_UPLOAD_URL;
                    }}
                    onChange={(event, editor) => {
                      const data = editor?.getData ? editor.getData() : event.target.value;
                      setFormData((prev) => ({ ...prev, description_1: data }));
                    }}
                  />
                </div>
              </div>

              {/* Description 2 CKEditor */}
              <div className={styles.formField}>
                <label className={styles.formLabel}>Description 2</label>
                <div style={{ minHeight: '200px' }}>
                  <CKEditorWrapper
                    data={formData.description_2 || ''}
                    config={editorConfiguration}
                    onReady={(editor) => {
                      if (!editor) return;
                      editor.config.filebrowserUploadUrl = IMAGE_UPLOAD_URL;
                      editor.config.filebrowserImageUploadUrl = IMAGE_UPLOAD_URL;
                    }}
                    onChange={(event, editor) => {
                      const data = editor?.getData ? editor.getData() : event.target.value;
                      setFormData((prev) => ({ ...prev, description_2: data }));
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Media & Status Section */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Media & Status</h3>
                <p className={styles.formSectionDescription}>Banner image and page status</p>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Banner Image</label>
                <div className={styles.imageUploadContainer}>
                  <input
                    type="file"
                    id="bannerImageInput"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const uploadedUrl = await handleImageUpload(file);
                        if (uploadedUrl) {
                          setFormData({ ...formData, banner_image: uploadedUrl });
                        }
                      }
                    }}
                  />
                  <label htmlFor="bannerImageInput" className={styles.fileInputLabel}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Click to select image</span>
                  </label>
                </div>
                {console.log("formData.banner_image", formData.banner_image)}
                {formData.banner_image && (
                  <div className={styles.imagePreviewContainer}>
                    <div className={styles.imagePreview}>
                      <img
                        src={`${API_BASE_URL}${formData?.banner_image}`}
                        alt="Banner preview"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, banner_image: "" })}
                      className={styles.removeImageBtn}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Remove Image
                    </button>
                  </div>
                )}
                <small className={styles.formHelp}>Upload a banner image (JPG, PNG, GIF, WebP)</small>
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Slug <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Page slug"
                  required
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Status</label>
                <div className={styles.formCheckboxGroup}>
                  <label className={styles.formCheckboxLabel}>
                    <input
                      type="checkbox"
                      className={styles.formCheckbox}
                      checked={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                    />
                    <span className={styles.formCheckboxText}>Page is Active</span>
                  </label>
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
                  setEditorInstance(null);
                  setFormData({
                    page_key: "",
                    title: "",
                    slug: "",
                    content: "",
                    meta_title: "",
                    meta_description: "",
                    meta_keywords: "",
                    banner_image: "",
                    status: true,
                    description_1: "",
                    description_2: "",
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
                {formMode === "edit" ? "Update Page" : "Create Page"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* View CMS Page Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, page: null })}
        title="View CMS Page Details"
      >
        {viewModal.page && (
          <div className={styles.viewModalContent}>
            <div className={styles.viewSection}>
              <div className={styles.viewSectionHeader}>
                <h3 className={styles.viewSectionTitle}>Page Information</h3>
              </div>

              <div className={styles.viewGrid}>
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Page Key</label>
                  <div className={styles.viewValue} style={{ fontFamily: 'monospace' }}>{viewModal.page.page_key}</div>
                </div>

                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Status</label>
                  <div className={styles.viewValue}>
                    {viewModal.page.status ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-secondary">Inactive</span>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Title</label>
                <div className={styles.viewValue}>{viewModal.page.title}</div>
              </div>

              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Slug</label>
                <div className={styles.viewValue}>{viewModal.page.slug || 'N/A'}</div>
              </div>
            </div>

            <div className={styles.viewSection}>
              <div className={styles.viewSectionHeader}>
                <h3 className={styles.viewSectionTitle}>Content & Metadata</h3>
              </div>

              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Content</label>
                <div
                  className={`${styles.viewValue} ${styles.viewContentPreview || ''}`}
                  dangerouslySetInnerHTML={{ __html: viewModal.page.content || 'N/A' }}
                />
              </div>

              {/* Show description_1 */}
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Description 1</label>
                <div
                  className={`${styles.viewValue} ${styles.viewContentPreview || ''}`}
                  dangerouslySetInnerHTML={{ __html: viewModal.page.description_1 || 'N/A' }}
                />
              </div>

              {/* Show description_2 */}
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Description 2</label>
                <div
                  className={`${styles.viewValue} ${styles.viewContentPreview || ''}`}
                  dangerouslySetInnerHTML={{ __html: viewModal.page.description_2 || 'N/A' }}
                />
              </div>

              <div className={styles.viewGrid}>
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Meta Title</label>
                  <div className={styles.viewValue}>{viewModal.page.meta_title || 'N/A'}</div>
                </div>

                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Meta Description</label>
                  <div className={styles.viewValue}>{viewModal.page.meta_description || 'N/A'}</div>
                </div>
              </div>

              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Meta Keywords</label>
                <div className={styles.viewValue}>{viewModal.page.meta_keywords || 'N/A'}</div>
              </div>

              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Created At</label>
                <div className={styles.viewValue}>
                  {viewModal.page.createdAt ? new Date(viewModal.page.createdAt).toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>

            <div className={styles.viewModalActions}>
              <button
                onClick={() => setViewModal({ isOpen: false, page: null })}
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
