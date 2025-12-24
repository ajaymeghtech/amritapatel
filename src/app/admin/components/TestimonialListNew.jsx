'use client';

import React, { useState, useEffect, useMemo } from "react";
import dynamic from 'next/dynamic';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonDataGrid, { Tooltip } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from "./NewsList.module.css";

// CKEditor Wrapper Component to handle client-side only rendering
const CKEditorWrapper = dynamic(
  () => import('./CKEditorWrapper'),
  {
    ssr: false,
    loading: () => null
  }
);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const TESTIMONIALS_ENDPOINT = `${API_BASE_URL}/api/testimonial-categories/testimonials/all`;
const TESTIMONIAL_CATEGORY_ENDPOINT = `${API_BASE_URL}/api/testimonial-categories`;
const IMAGE_UPLOAD_URL = `${API_BASE_URL}/api/cms/upload-image`;

const getImageUrl = (path = "") => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 4H20V6H4V4ZM4 9H20V11H4V9ZM4 14H20V16H4V14ZM4 19H20V21H4V19Z" fill="currentColor" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit") ? "Update testimonial details" : "Create a new testimonial"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className={styles.modalCloseBtn}>
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

export default function TestimonialListNew() {
  const [testimonials, setTestimonials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    designation: "",
    institute: "",
    message: "",
    rating: "",
    status: "active",
    sortOrder: 0,
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [editId, setEditId] = useState(null);
  const [editorInstance, setEditorInstance] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    id: null,
    name: "",
    categoryId: null
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [categoryFilter]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(TESTIMONIAL_CATEGORY_ENDPOINT);
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const url = categoryFilter !== "all" 
        ? `${TESTIMONIALS_ENDPOINT}?category_id=${categoryFilter}`
        : TESTIMONIALS_ENDPOINT;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch testimonials");
      const data = await response.json();
      setTestimonials(data.data || []);
    } catch (err) {
      toast.error(`Failed to fetch testimonials: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

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

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_id) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.name || !formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.message || !formData.message.trim()) {
      toast.error("Message is required");
      return;
    }

    try {
      const latestMessage = editorInstance?.getData ? editorInstance.getData() : formData.message;
      
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("designation", formData.designation || "");
      payload.append("institute", formData.institute || "");
      payload.append("message", latestMessage || "");
      payload.append("rating", formData.rating || "");
      payload.append("status", formData.status);
      payload.append("sortOrder", formData.sortOrder || 0);

      if (photoFile) {
        payload.append("photo", photoFile);
      }

      let url, method;
      if (formMode === "edit") {
        // Extract categoryId and testimonialId from editId (format: "categoryId_testimonialId")
        const [categoryId, testimonialId] = editId.split("_");
        url = `${TESTIMONIAL_CATEGORY_ENDPOINT}/${categoryId}/testimonials/${testimonialId}`;
        method = "PUT";
      } else {
        url = `${TESTIMONIAL_CATEGORY_ENDPOINT}/${formData.category_id}/testimonials`;
        method = "POST";
      }

      const response = await fetch(url, {
        method,
        body: payload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to save: ${errorData.message || 'Unknown error'}`);
        return;
      }

      toast.success(formMode === "edit" ? "Testimonial updated successfully!" : "Testimonial created successfully!");
      resetForm();
      fetchTestimonials();
    } catch (error) {
      toast.error(`Failed to save. Error: ${error.message}`);
    }
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    // Store as "categoryId_testimonialId" for nested update
    const categoryId = item.category_id?._id || item.category_id;
    const testimonialId = item._id;
    setEditId(`${categoryId}_${testimonialId}`);
    setFormData({
      category_id: categoryId || "",
      name: item.name || "",
      designation: item.designation || "",
      institute: item.institute || "",
      message: item.message || "",
      rating: item.rating || "",
      status: item.status || "active",
      sortOrder: item.sortOrder || 0,
    });
    setPhotoPreview(item.photo ? getImageUrl(item.photo) : "");
    setPhotoFile(null);
  };

  const openAddForm = () => {
    setFormMode("add");
    setEditId(null);
    setEditorInstance(null);
    setFormData({
      category_id: "",
      name: "",
      designation: "",
      institute: "",
      message: "",
      rating: "",
      status: "active",
      sortOrder: 0,
    });
    setPhotoFile(null);
    setPhotoPreview("");
  };

  const resetForm = () => {
    setFormMode(null);
    setEditId(null);
    setEditorInstance(null);
    setFormData({
      category_id: "",
      name: "",
      designation: "",
      institute: "",
      message: "",
      rating: "",
      status: "active",
      sortOrder: 0,
    });
    setPhotoFile(null);
    setPhotoPreview("");
  };

  const handleDeleteConfirm = async () => {
    if (!confirmModal.id || !confirmModal.categoryId) return;
    try {
      const response = await fetch(
        `${TESTIMONIAL_CATEGORY_ENDPOINT}/${confirmModal.categoryId}/testimonials/${confirmModal.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete");
      toast.success("Testimonial deleted successfully!");
      setConfirmModal({ isOpen: false, id: null, name: "", categoryId: null });
      fetchTestimonials();
    } catch (error) {
      toast.error(`Failed to delete testimonial: ${error.message}`);
    }
  };

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((item) => {
      const statusMatch = statusFilter === "all" || item.status === statusFilter;
      const categoryMatch = categoryFilter === "all" || 
        (item.category_id?._id || item.category_id) === categoryFilter;
      const searchMatch = searchTerm === "" ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.institute?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message?.toLowerCase().includes(searchTerm.toLowerCase());

      return statusMatch && categoryMatch && searchMatch;
    });
  }, [testimonials, statusFilter, categoryFilter, searchTerm]);

  const renderRating = (rating) => {
    if (!rating) return "—";
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

  const gridData = filteredTestimonials.map((item, index) => ({
    ...item,
    id: item._id,
    srNo: index + 1,
  }));

  const columns = [
    {
      field: "srNo",
      headerName: "Sr. No.",
      width: 100,
    },
    {
      field: "category",
      headerName: "Category",
      width: 200,
      renderCell: (params) => (
        <Tooltip content={params.row.category_title || "—"}>
          <div className="text-truncate" style={{ maxWidth: "180px" }}>
            {params.row.category_title || "—"}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="fw-medium text-truncate" style={{ maxWidth: "180px" }}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "designation",
      headerName: "Designation",
      width: 180,
      renderCell: (params) => (
        <Tooltip content={params.value || "—"}>
          <div className="text-muted text-truncate" style={{ maxWidth: "160px" }}>
            {params.value || "—"}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "institute",
      headerName: "Institute",
      width: 180,
      renderCell: (params) => (
        <Tooltip content={params.value || "—"}>
          <div className="text-muted text-truncate" style={{ maxWidth: "160px" }}>
            {params.value || "—"}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <span
          style={{
            padding: "4px 12px",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: 600,
            backgroundColor: params.row.status === "active" ? "#d1fae5" : "#fee2e2",
            color: params.row.status === "active" ? "#065f46" : "#991b1b",
          }}
        >
          {params.row.status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          <button
            onClick={() => handleEdit(params.row)}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#e0f2fe",
              border: "none",
              borderRadius: "6px",
              padding: 0
            }}
            title="Edit"
          >
            <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => setConfirmModal({ 
              isOpen: true, 
              id: params.row._id, 
              name: params.row.name,
              categoryId: params.row.category_id?._id || params.row.category_id
            })}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#fee2e2",
              border: "none",
              borderRadius: "6px",
              padding: 0
            }}
            title="Delete"
          >
            <svg width="16" height="16" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: 0, padding: 0 }}>
      <ToastContainer />
      <div className={styles.actionBar}>
        <div className={styles.actionBarContent}>
          <div className={styles.actionBarLeft}>
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
                  <button onClick={() => setSearchTerm("")} className={styles.searchClear} aria-label="Clear search">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className={styles.filterContainer}>
              <label className={styles.filterLabel}>Category</label>
              <select
                className={styles.filterSelect}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterContainer}>
              <label className={styles.filterLabel}>Status</label>
              <select
                className={styles.filterSelect}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className={styles.actionBarRight}>
            <button onClick={openAddForm} className={styles.addButton}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
              </svg>
              <span className={styles.buttonTextFull}>Add Testimonial</span>
              <span className={styles.buttonTextShort}>Add</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', overflow: 'auto' }}>
        <CommonDataGrid
          data={gridData}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 15, 20, 50]}
          initialPageSize={10}
          noDataMessage="No testimonials found"
          loadingMessage="Loading testimonials..."
          showSerialNumber={true}
          serialNumberHeader="Sr No."
        />
      </div>

      <Modal isOpen={formMode !== null} onClose={resetForm} title={formMode === "edit" ? "Edit Testimonial" : "Add Testimonial"}>
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Basic Information</h3>
                <p className={styles.formSectionDescription}>Enter testimonial details</p>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Category <span className={styles.required}>*</span></label>
                <select
                  className={styles.formSelect}
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Name <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    className={styles.formInput}
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter name..."
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Designation</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="Enter designation..."
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Institute</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.institute}
                  onChange={(e) => setFormData({ ...formData, institute: e.target.value })}
                  placeholder="Enter institute name..."
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Message <span className={styles.required}>*</span></label>
                <div style={{ minHeight: '200px' }}>
                  <CKEditorWrapper
                    data={formData.message || ''}
                    config={editorConfiguration}
                    onReady={(editor) => {
                      if (!editor) return;
                      editor.config.filebrowserUploadUrl = IMAGE_UPLOAD_URL;
                      editor.config.filebrowserImageUploadUrl = IMAGE_UPLOAD_URL;
                      setEditorInstance(editor);
                    }}
                    onChange={(event, editor) => {
                      const data = editor?.getData ? editor.getData() : event.target.value;
                      setFormData((prev) => ({ ...prev, message: data }));
                    }}
                  />
                </div>
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
                  </select>
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Sort Order</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={resetForm} className={styles.formCancelBtn}>Cancel</button>
              <button type="submit" className={styles.formSubmitBtn}>
                {formMode === "edit" ? "Update Entry" : "Create Entry"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, name: "", categoryId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Testimonial"
        message={`Are you sure you want to delete "${confirmModal.name}"? This action cannot be undone.`}
      />
    </div>
  );
}

