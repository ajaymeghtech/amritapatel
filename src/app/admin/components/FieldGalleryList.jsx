'use client';

import React, { useState, useEffect, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonDataGrid, { Tooltip } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from "./CMSList.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const FIELD_GALLERY_ENDPOINT = `${API_BASE_URL}/api/field-gallery`;

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
                <path d="M4 4H20V6H4V4ZM4 9H20V11H4V9ZM4 14H20V16H4V14ZM4 19H20V21H4V19Z"
                  fill="currentColor" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit") ? "Update gallery entry" : "Create a new gallery entry"}
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

const initialFormState = {
  title: "",
  description: "",
  images: [],
};

export default function FieldGalleryList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, title: "" });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(FIELD_GALLERY_ENDPOINT);
      const data = await res.json();
      setItems(data.data || []);
    } catch (err) {
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const match =
        searchTerm === "" ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return match;
    });
  }, [items, searchTerm]);

  const columns = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="fw-medium text-truncate" style={{ maxWidth: "100%" }}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "images",
      headerName: "Images",
      width: 120,
      renderCell: (params) => {
        const images = params.value || [];
        const count = Array.isArray(images) ? images.length : 0;
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#6b7280" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="badge bg-info" style={{ fontSize: "12px" }}>
              {count}
            </span>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          <button
            onClick={() => handleEdit(params.row)}
            className="btn btn-sm"
            style={{ backgroundColor: "#e0f2fe", border: "none", borderRadius: "6px", padding: "4px 8px" }}
            title="Edit"
          >
            <svg width="14" height="14" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => setConfirmModal({ isOpen: true, id: params.row._id, title: params.row.title })}
            className="btn btn-sm"
            style={{ backgroundColor: "#fee2e2", border: "none", borderRadius: "6px", padding: "4px 8px" }}
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

  const openAdd = () => {
    setFormMode("add");
    setFormData(initialFormState);
    setExistingImages([]);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    setEditId(item._id);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      images: item.images || [],
    });
    setExistingImages(item.images || []);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setImageFiles([...imageFiles, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews([...imagePreviews, ...previews]);
    e.target.value = "";
  };

  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } else {
      const idx = index - existingImages.length;
      if (imagePreviews[idx]) URL.revokeObjectURL(imagePreviews[idx]);
      setImageFiles(imageFiles.filter((_, i) => i !== idx));
      setImagePreviews(imagePreviews.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description || "");
      if (existingImages.length > 0) payload.append("existingImages", JSON.stringify(existingImages));
      imageFiles.forEach((file) => payload.append("images", file));

      const url = formMode === "edit" ? `${FIELD_GALLERY_ENDPOINT}/${editId}` : FIELD_GALLERY_ENDPOINT;
      const method = formMode === "edit" ? "PUT" : "POST";
      const res = await fetch(url, { method, body: payload });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save");
      }
      toast.success(formMode === "edit" ? "Updated successfully" : "Created successfully");
      setFormMode(null);
      fetchItems();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(`${FIELD_GALLERY_ENDPOINT}/${confirmModal.id}`, { method: "DELETE" });
      toast.success("Deleted successfully!");
      setConfirmModal({ isOpen: false, id: null, title: "" });
      fetchItems();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "none", margin: 0, padding: 0 }}>
      <ToastContainer position="top-right" autoClose={4000} />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, title: "" })}
        onConfirm={handleDeleteConfirm}
        title="Delete Gallery Item"
        message={`Are you sure you want to delete "${confirmModal.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

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
                  placeholder="Search gallery..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className={styles.searchClear} title="Clear search">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className={styles.actionBarRight}>
            <button onClick={openAdd} className={styles.addButton}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
              </svg>
              <span className={styles.buttonTextFull}>Add Gallery</span>
              <span className={styles.buttonTextShort}>Add</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <CommonDataGrid
          data={filteredItems.map((item, index) => ({ ...item, id: item._id, srNo: index + 1 }))}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 15, 20, 50]}
          initialPageSize={10}
          noDataMessage="No gallery items found"
          loadingMessage="Loading gallery..."
          showSerialNumber
          serialNumberField="srNo"
          serialNumberHeader="Sr.no."
          serialNumberWidth={80}
        />
      </div>

      <Modal isOpen={formMode !== null} onClose={() => setFormMode(null)} title={formMode === "edit" ? "Edit Gallery" : "Add Gallery"}>
        <div className={styles.modalFormContent}>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>Basic Information</h3>

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
                  placeholder="Enter gallery title..."
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.formInput}
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description..."
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Images</label>
                <div className={styles.imageUploadContainer}>
                  <input
                    type="file"
                    id="fieldGalleryImagesInput"
                    accept="image/*"
                    multiple
                    className={styles.fileInput}
                    onChange={handleImageChange}
                  />
                  <label htmlFor="fieldGalleryImagesInput" className={styles.fileInputLabel}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Click to select images (multiple allowed)</span>
                  </label>
                </div>

                {(existingImages.length > 0 || imagePreviews.length > 0) && (
                  <div
                    style={{
                      marginTop: "16px",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {existingImages.map((img, index) => (
                      <div key={`existing-${index}`} style={{ position: "relative" }}>
                        <div style={{ width: "100%", aspectRatio: "1", borderRadius: "8px", overflow: "hidden", border: "2px solid #e5e7eb" }}>
                          <img
                            src={getImageUrl(img)}
                            alt={`Existing ${index + 1}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                              e.target.style.display = "none";
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
                            padding: 0,
                          }}
                          title="Remove image"
                        >
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}

                    {imagePreviews.map((preview, index) => (
                      <div key={`preview-${index}`} style={{ position: "relative" }}>
                        <div style={{ width: "100%", aspectRatio: "1", borderRadius: "8px", overflow: "hidden", border: "2px solid #10b981" }}>
                          <img src={preview} alt={`New ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                            padding: 0,
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
              <button type="button" className={styles.formCancelBtn} onClick={() => setFormMode(null)}>
                Cancel
              </button>
              <button type="submit" className={styles.formSubmitBtn}>
                {formMode === "edit" ? "Update Entry" : "Create Entry"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

