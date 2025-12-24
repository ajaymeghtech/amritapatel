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
const SUBACTIVITIES_ENDPOINT = `${API_BASE_URL}/api/subactivities`;
const ACTIVITIES_ENDPOINT = `${API_BASE_URL}/api/activities`;
const IMAGE_UPLOAD_URL = `${API_BASE_URL}/api/cms/upload-image`;

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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

export default function SubActivitiesList() {
  const [subActivities, setSubActivities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState({
    activityId: "",
    title: "",
    short_description: "",
    description: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editId, setEditId] = useState(null);
  const [editorInstance, setEditorInstance] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activityFilter, setActivityFilter] = useState("all");
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    id: null,
    name: ""
  });

  useEffect(() => {
    fetchSubActivities();
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch(ACTIVITIES_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch activities");
      const data = await response.json();
      setActivities(data.data || []);
    } catch (err) {
      toast.error(`Failed to fetch activities: ${err.message}`);
    }
  };

  const fetchSubActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(SUBACTIVITIES_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch sub-activities");
      const data = await response.json();
      setSubActivities(data.data || []);
    } catch (err) {
      toast.error(`Failed to fetch sub-activities: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormMode(null);
    setEditId(null);
    setEditorInstance(null);
    setImageFile(null);
    setImagePreview("");
    setFormData({
      activityId: "",
      title: "",
      short_description: "",
      description: "",
      image: "",
    });
  };

  const handleFormSubmit = async (e, closeAfterSubmit = false) => {
    e.preventDefault();
    if (!formData.activityId) {
      toast.error("Please select an activity");
      return;
    }
    if (!formData.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    
    try {
      const latestDescription = editorInstance?.getData ? editorInstance.getData() : formData.description;
      
      const payload = new FormData();
      payload.append("activityId", formData.activityId);
      payload.append("title", formData.title);
      payload.append("short_description", formData.short_description || "");
      payload.append("description", latestDescription || "");
      
      if (imageFile) {
        payload.append("image", imageFile);
      }

      let response;
      if (formMode === "edit") {
        response = await fetch(`${SUBACTIVITIES_ENDPOINT}/${editId}`, {
          method: "PUT",
          body: payload,
        });
      } else {
        response = await fetch(SUBACTIVITIES_ENDPOINT, {
          method: "POST",
          body: payload,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to save: ${errorData.message || 'Unknown error'}`);
        return;
      }

      toast.success(formMode === "edit" ? "Sub-activity updated!" : "Sub-activity created!");
      
      if (formMode === "edit" || closeAfterSubmit) {
        resetForm();
      } else {
        // For add mode with "Add More", reset form but keep modal open
        setFormData({
          activityId: formData.activityId, // Keep activity selected
          title: "",
          short_description: "",
          description: "",
          image: "",
        });
        setImageFile(null);
        setImagePreview("");
        if (editorInstance) {
          editorInstance.setData("");
        }
      }
      
      fetchSubActivities();
    } catch (error) {
      toast.error(`Failed to save. Error: ${error.message}`);
    }
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    setEditId(item._id);
    setFormData({
      activityId: item.activityId || "",
      title: item.title || "",
      short_description: item.short_description || "",
      description: item.description || "",
      image: item.image || "",
    });
    setImagePreview(item.image ? getImageUrl(item.image) : "");
    setImageFile(null);
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
      await fetch(`${SUBACTIVITIES_ENDPOINT}/${confirmModal.id}`, { method: "DELETE" });
      toast.success("Deleted successfully!");
      fetchSubActivities();
    } catch (error) {
      toast.error(`Failed to delete: ${error.message}`);
    } finally {
      setConfirmModal({ isOpen: false, id: null, name: "" });
    }
  };

  // Filter sub-activities
  const filteredSubActivities = useMemo(() => {
    return subActivities.filter((item) => {
      const activityMatch = activityFilter === "all" || item.activityId === activityFilter;
      const searchMatch = searchTerm === "" ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.short_description?.toLowerCase().includes(searchTerm.toLowerCase());
      return activityMatch && searchMatch;
    });
  }, [subActivities, activityFilter, searchTerm]);

  // Get activity name by ID
  const getActivityName = (activityId) => {
    const activity = activities.find(a => a._id === activityId);
    return activity?.title || activityId || "—";
  };

  // Define table columns
  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden' }}>
          {params.value ? (
            <img
              src={getImageUrl(params.value)}
              alt={params.row.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/60';
              }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      ),
    },
    {
      field: 'activityId',
      headerName: 'Activity',
      width: 200,
      renderCell: (params) => (
        <Tooltip content={getActivityName(params.value)}>
          <div className="fw-medium text-truncate" style={{ maxWidth: '180px' }} title={getActivityName(params.value)}>
            {getActivityName(params.value)}
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
      field: 'actions',
      headerName: 'Actions',
      width: 200,
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
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, name: "" })}
        onConfirm={handleDeleteConfirm}
        title="Delete Sub-Activity"
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
                  placeholder="Search sub-activities..."
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

            {/* Activity Filter */}
            <div className={styles.filtersContainer}>
              <div className={styles.filterGroup}>
                <div className={styles.filterSelectWrapper}>
                  <select
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Activities</option>
                    {activities.map((activity) => (
                      <option key={activity._id} value={activity._id}>
                        {activity.title}
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
                minWidth: '140px'
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className={styles.buttonTextFull}>Add Sub-Activity</span>
              <span className={styles.buttonTextShort}>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div style={{ width: "100%", overflowX: "auto" }}>
        <CommonDataGrid
          data={filteredSubActivities.map((item, index) => ({ ...item, id: item._id, srNo: index + 1 }))}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 15, 20, 50]}
          initialPageSize={10}
          noDataMessage="No sub-activities found"
          noDataDescription={
            searchTerm || activityFilter !== "all"
              ? "Try adjusting your search criteria or filters."
              : "Get started by creating your first sub-activity."
          }
          noDataAction={
            (!searchTerm && activityFilter === "all") ? {
              onClick: () => setFormMode("add"),
              text: "Create First Sub-Activity"
            } : null
          }
          loadingMessage="Loading sub-activities..."
          showSerialNumber={true}
          serialNumberField="srNo"
          serialNumberHeader="Sr.no."
          serialNumberWidth={100}
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={formMode !== null}
        onClose={resetForm}
        title={formMode === "edit" ? "Edit Sub-Activity" : "Create Sub-Activity"}
      >
        <div className={styles.modalFormContent}>
          <form onSubmit={(e) => handleFormSubmit(e, false)} className={styles.formContainer}>
            <div className={styles.formSection}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Activity <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.formInput}
                  value={formData.activityId}
                  onChange={(e) => setFormData({ ...formData, activityId: e.target.value })}
                  required
                >
                  <option value="">Select Activity</option>
                  {activities.map((activity) => (
                    <option key={activity._id} value={activity._id}>
                      {activity.title}
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
                <label className={styles.formLabel}>Short Description</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Enter short description"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Description</label>
                <div style={{ minHeight: '200px' }}>
                  <CKEditorWrapper
                    data={formData.description || ''}
                    config={editorConfiguration}
                    onReady={(editor) => {
                      setEditorInstance(editor);
                      if (!editor) return;
                      editor.config.filebrowserUploadUrl = IMAGE_UPLOAD_URL;
                      editor.config.filebrowserImageUploadUrl = IMAGE_UPLOAD_URL;
                    }}
                    onChange={(event, editor) => {
                      const data = editor?.getData ? editor.getData() : event.target.value;
                      setFormData((prev) => ({ ...prev, description: data }));
                    }}
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Image</label>
                <div className={styles.imageUploadContainer}>
                  <input
                    type="file"
                    id="subActivityImageInput"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <label htmlFor="subActivityImageInput" className={styles.fileInputLabel}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Click to select image</span>
                  </label>
                </div>
                {(imagePreview || (formMode === "edit" && formData.image)) && (
                  <div className={styles.imagePreviewContainer}>
                    <div className={styles.imagePreview}>
                      <img
                        src={imagePreview || getImageUrl(formData.image)}
                        alt="Preview"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setImageFile(null);
                      }}
                      className={styles.removeImageBtn}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Remove Image
                    </button>
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
              {formMode === "add" && (
                <button
                  type="button"
                  className={styles.formSubmitBtn}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    marginRight: '8px'
                  }}
                  onClick={(e) => {
                    handleFormSubmit(e, false);
                  }}
                >
                  Create & Add More
                </button>
              )}
              <button 
                type="button"
                className={styles.formSubmitBtn}
                onClick={(e) => {
                  handleFormSubmit(e, true);
                }}
              >
                {formMode === "edit" ? "Update Sub-Activity" : "Create Sub-Activity"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

