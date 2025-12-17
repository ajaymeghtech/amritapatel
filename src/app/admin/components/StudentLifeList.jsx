'use client';

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonDataGrid, { Tooltip } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from "./NewsList.module.css";

const CKEditorWrapper = dynamic(
  () => import("./CKEditorWrapper"),
  { ssr: false, loading: () => null }
);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const STUDENT_LIFE_ENDPOINT = `${API_BASE_URL}/api/student-life`;
const STUDENT_LIFE_IMAGE_ENDPOINT = `${API_BASE_URL}/api/student-life-images`;

const editorConfiguration = { height: 250 };

const initialFormState = {
  title: "",
  short_description: "",
  description: "",
};

const initialImageFormState = {
  title: "",
  description: "",
  file: null,
  preview: "",
};

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
              {/* NEW ICON (REPLACED) */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 4H20V6H4V4ZM4 9H20V11H4V9ZM4 14H20V16H4V14ZM4 19H20V21H4V19Z" fill="currentColor" />
              </svg>
            </div>

            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit") ? "Update student life entry" : "Create a new student life entry"}
              </p>
            </div>
          </div>

          <button onClick={onClose} className={styles.modalCloseBtn} aria-label="Close modal">
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

export default function StudentLifeList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, title: "" });
  const [viewModal, setViewModal] = useState({ isOpen: false, entry: null });
  const [imageManager, setImageManager] = useState({
    isOpen: false,
    entry: null,
    images: [],
    loading: false,
  });
  const [imageForm, setImageForm] = useState(initialImageFormState);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageDeleteModal, setImageDeleteModal] = useState({ isOpen: false, id: null, title: "" });
  const [showImageUploadForm, setShowImageUploadForm] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(STUDENT_LIFE_ENDPOINT);
      const data = await response.json();
      setItems(data.data || []);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setFormMode("add");
    setFormData(initialFormState);
  };

  const handleEdit = (entry) => {
    setFormMode("edit");
    setEditId(entry._id);
    setFormData({
      title: entry.title,
      short_description: entry.short_description,
      description: entry.description,
    });
  };

  const resetForm = () => {
    setFormMode(null);
    setEditId(null);
    setFormData(initialFormState);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      short_description: formData.short_description,
      description: formData.description,
    };

    try {
      const url =
        formMode === "edit"
          ? `${STUDENT_LIFE_ENDPOINT}/${editId}`
          : STUDENT_LIFE_ENDPOINT;

      const method = formMode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save");

      toast.success(
        formMode === "edit" ? "Updated successfully" : "Created successfully"
      );

      resetForm();
      fetchItems();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    console.log("Deleting ID:", confirmModal.id);
    try {
      const response = await fetch(`${STUDENT_LIFE_ENDPOINT}/${confirmModal.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");

      toast.success("Deleted successfully");
      setConfirmModal({ isOpen: false, id: null });
      fetchItems();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchStudentLifeImages = async (studentLifeId) => {
    if (!studentLifeId) return;
    try {
      setImageManager((prev) => ({ ...prev, loading: true }));
      const response = await fetch(
        `${STUDENT_LIFE_IMAGE_ENDPOINT}?student_life_id=${studentLifeId}`
      );
      if (!response.ok) throw new Error("Failed to fetch images");
      const data = await response.json();
      setImageManager((prev) => ({
        ...prev,
        images: data.data || [],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.message);
      setImageManager((prev) => ({ ...prev, loading: false }));
    }
  };

  const openImageManager = (entry) => {
    if (!entry?._id) return;
    setImageManager({
      isOpen: true,
      entry,
      images: [],
      loading: true,
    });
    setImageForm(initialImageFormState);
    setShowImageUploadForm(false);
    fetchStudentLifeImages(entry._id);
  };

  const closeImageManager = () => {
    setImageManager({
      isOpen: false,
      entry: null,
      images: [],
      loading: false,
    });
    setImageForm(initialImageFormState);
    setShowImageUploadForm(false);
  };

  const handleImageFieldChange = (field, value) => {
    setImageForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageForm((prev) => ({
      ...prev,
      file,
      preview: file ? URL.createObjectURL(file) : "",
    }));
  };

  const handleImageUploadSubmit = async (event) => {
    event.preventDefault();
    if (!imageManager.entry?._id) {
      toast.error("Student life entry not selected");
      return;
    }
    if (!imageForm.file) {
      toast.error("Please select an image to upload");
      return;
    }

    try {
      setImageUploading(true);
      const payload = new FormData();
      payload.append("student_life_id", imageManager.entry._id);
      payload.append("title", imageForm.title);
      payload.append("description", imageForm.description);
      payload.append("image", imageForm.file);

      const response = await fetch(STUDENT_LIFE_IMAGE_ENDPOINT, {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to upload image");
      }

      toast.success("Image uploaded successfully");
      setImageForm(initialImageFormState);
      setShowImageUploadForm(false);
      fetchStudentLifeImages(imageManager.entry._id);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageDeleteClick = (image) => {
    setImageDeleteModal({
      isOpen: true,
      id: image?._id || null,
      title: image?.title || "Selected image",
    });
  };

  const handleImageDeleteConfirm = async () => {
    if (!imageDeleteModal.id) return;
    try {
      const response = await fetch(
        `${STUDENT_LIFE_IMAGE_ENDPOINT}/${imageDeleteModal.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete image");
      }
      toast.success("Image deleted successfully");
      setImageDeleteModal({ isOpen: false, id: null, title: "" });
      if (imageManager.entry?._id) {
        fetchStudentLifeImages(imageManager.entry._id);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const gridData = filteredItems.map((item, index) => ({ ...item, id: item._id, srNo: index + 1 }));

  const columns = [

    {
      field: "title",
      headerName: "Title",
      width: 250,
      renderCell: (params) => (
        <Tooltip content={params.row.title}>
          <div className="text-truncate" style={{ maxWidth: "220px" }}>
            {params.row.title}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "short_description",
      headerName: "Short Description",
      width: 300,
      renderCell: (params) => (
        <Tooltip content={params.row.short_description}>
          <div className="text-truncate" style={{ maxWidth: "270px" }}>
            {params.row.short_description}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created On",
      width: 150,
      renderCell: (params) => (
        <span>{new Date(params.row.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      field: "manageImages",
      headerName: "Images",
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <button
          onClick={() => openImageManager(params.row)}
          className="btn btn-sm d-flex align-items-center justify-content-center"
          style={{
            width: "32px",
            height: "32px",
            backgroundColor: "#e0f2fe",
            border: "none",
            borderRadius: "6px",
            padding: 0
          }}
          title="Manage images"
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#bae6fd")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e0f2fe")}
        >
          <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m3-3l-3 3v4H4a2 2 0 01-2-2V6a2 2 0 012-2h12" />
          </svg>
        </button>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="d-flex gap-2 align-items-center">

          {/* VIEW */}
          <button
            onClick={() => setViewModal({ isOpen: true, entry: params.row })}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#e0f2fe",
              border: "none",
              borderRadius: "6px",
              padding: 0
            }}
            title="View Details"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#bae6fd")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e0f2fe")}
          >
            <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 
                 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          {/* EDIT */}
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
            title="Edit Entry"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#bae6fd")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e0f2fe")}
          >
            <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 
                 2h11a2 2 0 002-2v-5m-1.414-9.414a2 
                 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* DELETE */}
          <button
            onClick={() => {
              setConfirmModal({
                isOpen: true,
                id: params.row._id,
                title: params.row.title,
              });
            }}

            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#fee2e2",
              border: "none",
              borderRadius: "6px",
              padding: 0
            }}
            title="Delete Entry"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fecaca")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fee2e2")}
          >
            <svg width="16" height="16" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 
                 21H7.862a2 2 0 01-1.995-1.858L5 
                 7m5 4v6m4-6v6m1-10V4a1 1 0 
                 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];


  return (
    <div>
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
                  placeholder="Search student life..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className={styles.searchClear}
                    aria-label="Clear search"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={styles.actionBarRight}>
            <button onClick={openAddForm} className={styles.addButton}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
              </svg>
              <span className={styles.buttonTextFull}>Add Student Life</span>
              <span className={styles.buttonTextShort}>Add</span>
            </button>
          </div>
        </div>
      </div>

      <CommonDataGrid
        data={gridData}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 15, 20, 50]}
        initialPageSize={10}
        noDataMessage="No roles found"
        noDataDescription={
          searchTerm
            ? "Try adjusting your search criteria."
            : "Get started by creating your first role."
        }
        noDataAction={
          !searchTerm ? {
            onClick: () => setFormMode("add"),
            text: "Create First Role"
          } : null
        }
        loadingMessage="Loading roles..."
        showSerialNumber={true}
        serialNumberField="id"
        serialNumberHeader="Sr.no."
        serialNumberWidth={100}
      />

      {/* ADD / EDIT MODAL */}
      <Modal
        isOpen={formMode !== null}
        onClose={resetForm}
        title={formMode === "edit" ? "Edit Student Life" : "Add Student Life"}
      >
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>

            {/* SECTION: BASIC INFO */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Basic Information</h3>
                <p className={styles.formSectionDescription}>Add essential details of student life</p>
              </div>

              {/* TITLE */}
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Title <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter title..."
                />
              </div>

              {/* SHORT DESCRIPTION */}
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Short Description <span className={styles.required}>*</span>
                </label>
                <textarea
                  className={styles.formTextarea}
                  required
                  rows={3}
                  value={formData.short_description}
                  onChange={(e) =>
                    setFormData({ ...formData, short_description: e.target.value })
                  }
                  placeholder="Enter short description..."
                ></textarea>
              </div>

              {/* FULL DESCRIPTION */}
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Detailed Description <span className={styles.required}>*</span>
                </label>
                <div className={styles.richTextContainer}>
                  <CKEditorWrapper
                    data={formData.description || ""}
                    config={editorConfiguration}
                    onChange={(event, editor) => {
                      const value = editor?.getData
                        ? editor.getData()
                        : event?.target?.value || "";
                      setFormData({ ...formData, description: value });
                    }}
                  />
                </div>
              </div>
            </div>

            {/* FORM ACTIONS */}
            <div className={styles.formActions}>

              {/* CANCEL BUTTON */}
              <button
                type="button"
                onClick={resetForm}
                className={styles.formCancelBtn}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>

              {/* SAVE BUTTON */}
              <button
                type="submit"
                className={styles.formSubmitBtn}
              >
                {formMode === "edit" ? "Update Entry" : "Create Entry"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={imageManager.isOpen}
        onClose={closeImageManager}
        title={`Manage Images${imageManager.entry ? ` - ${imageManager.entry.title}` : ""}`}
      >
        <div className={styles.modalFormContent}>
          {showImageUploadForm && (
            <form onSubmit={handleImageUploadSubmit} className={styles.formContainer} style={{ marginBottom: "2rem" }}>
              <div className={styles.formSection}>
                <div className={styles.formSectionHeader}>
                  <h3 className={styles.formSectionTitle}>Upload Image</h3>
                  <p className={styles.formSectionDescription}>Add gallery images for this entry</p>
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Title</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={imageForm.title}
                    onChange={(e) => handleImageFieldChange("title", e.target.value)}
                    placeholder="Title (optional)"
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Description</label>
                  <textarea
                    rows={3}
                    className={styles.formTextarea}
                    value={imageForm.description}
                    onChange={(e) => handleImageFieldChange("description", e.target.value)}
                    placeholder="Description (optional)"
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Image <span className={styles.required}>*</span>
                  </label>
                  <div
                    style={{
                      border: "1px dashed #cbd5f5",
                      padding: "1rem",
                      borderRadius: "8px",
                      background: "#f8fafc",
                      textAlign: "center",
                    }}
                  >
                    <input
                      type="file"
                      id="student-life-image-input"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageFileChange}
                    />
                    <label
                      htmlFor="student-life-image-input"
                      style={{
                        display: "inline-flex",
                        gap: "0.5rem",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#2563eb",
                        fontWeight: 600,
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Select image</span>
                    </label>
                  </div>
                  {imageForm.preview && (
                    <div style={{ marginTop: "1rem" }}>
                      <div
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          overflow: "hidden",
                          maxHeight: "220px",
                        }}
                      >
                        <img src={imageForm.preview} alt="Preview" />
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.formCancelBtn}
                    onClick={() => {
                      setImageForm(initialImageFormState);
                      setShowImageUploadForm(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.formSubmitBtn} disabled={imageUploading}>
                    {imageUploading ? "Uploading..." : "Upload Image"}
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className={styles.formSection}>
            <div className={styles.formSectionHeader}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <div>
                  <h3 className={styles.formSectionTitle}>Student Life Images</h3>
                  <p className={styles.formSectionDescription}>
                    Manage uploaded images for this student life entry
                  </p>
                </div>
                <button
                  onClick={() => setShowImageUploadForm(true)}
                  className={styles.addButton}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "8px 16px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "14px",
                    cursor: "pointer",
                    height: "fit-content",
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                  </svg>
                  <span>Add New</span>
                </button>
              </div>
            </div>

            {imageManager.loading ? (
              <p className="text-muted mb-0">Loading images...</p>
            ) : (
              <CommonDataGrid
                data={imageManager.images.map((img, index) => ({
                  ...img,
                  id: img._id,
                  srNo: index + 1,
                }))}
                columns={[
                  {
                    field: "srNo",
                    headerName: "Sr. No.",
                    width: 100,
                  },
                  {
                    field: "image",
                    headerName: "Image",
                    width: 200,
                    renderCell: (params) => (
                      params.row.image ? (
                        <div style={{ padding: "0.5rem" }}>
                          <img
                            src={getImageUrl(params.row.image)}
                            alt={params.row.title || "Student life image"}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid #e5e7eb",
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-muted">No image</span>
                      )
                    ),
                  },
                  {
                    field: "title",
                    headerName: "Title",
                    width: 200,
                    renderCell: (params) => (
                      <Tooltip content={params.row.title || "Untitled"}>
                        <div className="text-truncate" style={{ maxWidth: "180px" }}>
                          {params.row.title || "Untitled"}
                        </div>
                      </Tooltip>
                    ),
                  },
                  {
                    field: "description",
                    headerName: "Description",
                    width: 350,
                    renderCell: (params) => (
                      <Tooltip content={params.row.description || "—"}>
                        <div className="text-truncate text-muted" style={{ maxWidth: "330px" }}>
                          {params.row.description || "—"}
                        </div>
                      </Tooltip>
                    ),
                  },
                  {
                    field: "createdAt",
                    headerName: "Created At",
                    width: 150,
                    renderCell: (params) => (
                      <span className="small text-muted">
                        {params.row.createdAt
                          ? new Date(params.row.createdAt).toLocaleDateString()
                          : "—"}
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
                          onClick={() => handleImageDeleteClick(params.row)}
                          className="btn btn-sm d-flex align-items-center justify-content-center"
                          style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor: "#fee2e2",
                            border: "none",
                            borderRadius: "6px",
                            padding: 0,
                          }}
                          title="Delete Image"
                          onMouseEnter={(e) => (e.target.style.backgroundColor = "#fecaca")}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = "#fee2e2")}
                        >
                          <svg width="16" height="16" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ),
                  },
                ]}
                loading={imageManager.loading}
                pageSizeOptions={[5, 10, 15, 20]}
                initialPageSize={10}
                noDataMessage="No images uploaded yet"
                noDataDescription="Click 'Add New' to upload your first image"
                loadingMessage="Loading images..."
                showSerialNumber={false}
              />
            )}
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleDeleteConfirm}
        title="Delete Entry"
        message={`Are you sure you want to delete "${confirmModal.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <ConfirmationModal
        isOpen={imageDeleteModal.isOpen}
        onClose={() => setImageDeleteModal({ isOpen: false, id: null, title: "" })}
        onConfirm={handleImageDeleteConfirm}
        title="Delete Image"
        message={`Are you sure you want to delete "${imageDeleteModal.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* VIEW MODAL */}
      {viewModal.isOpen && (
        <Modal
          isOpen={true}
          onClose={() => setViewModal({ isOpen: false, entry: null })}
          title="View Student Life Details"
        >
          <div className={styles.viewModalContent}>

            <div className={styles.viewSection}>
              <div className={styles.viewSectionHeader}>
                <h3 className={styles.viewSectionTitle}>Basic Information</h3>
              </div>

              <div className={styles.viewGrid}>
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Title</label>
                  <div className={styles.viewValue}>{viewModal.entry.title}</div>
                </div>

                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Short Description</label>
                  <div className={styles.viewValue}>{viewModal.entry.short_description}</div>
                </div>
              </div>

              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Full Description</label>
                <div
                  className={styles.viewValue}
                  dangerouslySetInnerHTML={{ __html: viewModal.entry.description }}
                />
              </div>
            </div>

            {/* BOTTOM CLOSE BUTTON */}
            <div className={styles.viewModalActions}>
              <button
                onClick={() => setViewModal({ isOpen: false, entry: null })}
                className={styles.viewCloseBtn}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
