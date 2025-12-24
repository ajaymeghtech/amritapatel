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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "${API_BASE_URL}";
const HOME_GALLERY_ENDPOINT = `${API_BASE_URL}/api/home-gallery`;

const editorConfiguration = {
  height: 250,
};

const initialFormState = {
  title: "",
  description: "",
  link: "",
  image: "",
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
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h18M3 10h18M7 15h10M5 20h14" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit") ? "Update gallery item" : "Create a new gallery item"}
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

export default function HomeGalleryList() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, title: "" });
  const [viewModal, setViewModal] = useState({ isOpen: false, entry: null });

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(HOME_GALLERY_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch gallery items");
      const data = await response.json();
      setGalleryItems(data.data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setFormMode("add");
    setFormData(initialFormState);
    setImageFile(null);
    setImagePreview("");
  };

  const handleEdit = (entry) => {
    setFormMode("edit");
    setEditId(entry._id);
    setFormData({
      title: entry.title || "",
      description: entry.description || "",
      link: entry.link || "",
      image: entry.image || "",
    });
    setImageFile(null);
    setImagePreview(getImageUrl(entry.image));
  };

  const resetForm = () => {
    setFormMode(null);
    setEditId(null);
    setFormData(initialFormState);
    setImageFile(null);
    setImagePreview("");
  };

  const buildPayload = () => {
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description || "");
    payload.append("link", formData.link || "");
    if (imageFile) {
      payload.append("image", imageFile);
    } else if (formData.image) {
      payload.append("image", formData.image);
    }
    return payload;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formMode === "add" && !imageFile) {
      toast.error("Image is required");
      return;
    }
    try {
      const payload = buildPayload();
      const url =
        formMode === "edit"
          ? `${HOME_GALLERY_ENDPOINT}/${editId}`
          : HOME_GALLERY_ENDPOINT;
      const method = formMode === "edit" ? "PUT" : "POST";
      const response = await fetch(url, { method, body: payload });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save gallery item");
      }
      toast.success(`Gallery item ${formMode === "edit" ? "updated" : "created"} successfully`);
      resetForm();
      fetchGalleryItems();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${HOME_GALLERY_ENDPOINT}/${confirmModal.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete gallery item");
      }
      toast.success("Gallery item deleted successfully");
      setConfirmModal({ isOpen: false, id: null, title: "" });
      fetchGalleryItems();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [galleryItems, searchTerm]);

  const gridData = filteredItems.map((item, index) => ({
    ...item,
    id: item._id,
    srNo: index + 1,
  }));

  const columns = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip content={params.row.title}>
          <div className="text-truncate" style={{ maxWidth: "100%" }}>
            {params.row.title}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "image",
      headerName: "Image",
      width: 150,
      renderCell: (params) => (
        params.row.image ? (
          <img
            src={getImageUrl(params.row.image)}
            alt={params.row.title}
            style={{ width: "80px", height: "auto", borderRadius: "6px" }}
          />
        ) : (
          <span className="text-muted">No image</span>
        )
      ),
    },
   {
    field: "actions",
    headerName: "Actions",
    width: 180,
    sortable: false,
    filterable: false,
    align: 'center',
    headerAlign: 'center',
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
          onClick={() =>
            setConfirmModal({ isOpen: true, id: params.row._id, title: params.row.title })
          }
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
    <div style={{ width: '100%', maxWidth: '100%', margin: 0, padding: 0 }}>
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

      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, entry: null })}
        title="Gallery Item Details"
      >
        {viewModal.entry && (
          <div className={styles.viewModalContent}>
            <div className={styles.viewSection}>
              <div className={styles.viewSectionHeader}>
                <h3 className={styles.viewSectionTitle}>Overview</h3>
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Title</label>
                <div className={styles.viewValue}>{viewModal.entry.title}</div>
              </div>
              {viewModal.entry.image && (
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Image</label>
                  <div className={styles.imagePreview}>
                    <img src={getImageUrl(viewModal.entry.image)} alt={viewModal.entry.title} />
                  </div>
                </div>
              )}
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Link</label>
                <div className={styles.viewValue}>
                  {viewModal.entry.link ? (
                    <a href={viewModal.entry.link} target="_blank" rel="noreferrer">
                      {viewModal.entry.link}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Description</label>
                <div
                  className={styles.viewValue}
                  dangerouslySetInnerHTML={{ __html: viewModal.entry.description || "—" }}
                />
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Created At</label>
                <div className={styles.viewValue}>
                  {viewModal.entry.createdAt ? new Date(viewModal.entry.createdAt).toLocaleString() : "—"}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!formMode}
        onClose={resetForm}
        title={formMode === "edit" ? "Edit Gallery Item" : "Create Gallery Item"}
      >
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Gallery Item Details</h3>
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
                  required
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Description</label>
                <div style={{ minHeight: "250px" }}>
                  <CKEditorWrapper
                    data={formData.description || ""}
                    config={editorConfiguration}
                    onChange={(event, editor) => {
                      const data = editor?.getData ? editor.getData() : event.target.value;
                      setFormData({ ...formData, description: data });
                    }}
                  />
                </div>
                <small className={styles.formHelp}>Optional rich description displayed with the image.</small>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Link (optional)</label>
                <input
                  type="url"
                  className={styles.formInput}
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Image {formMode === "add" && <span className={styles.required}>*</span>}
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
                    id="gallery-image-input"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <label
                    htmlFor="gallery-image-input"
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Select image</span>
                  </label>
                </div>
                {(imagePreview || formData.image) && (
                  <div style={{ marginTop: "1rem" }}>
                    <div
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        overflow: "hidden",
                        maxHeight: "220px",
                      }}
                    >
                      <img src={imagePreview || getImageUrl(formData.image)} alt="Gallery preview" />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setFormData({ ...formData, image: "" });
                        setImagePreview("");
                      }}
                      className={styles.formCancelBtn}
                      style={{ marginTop: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.formCancelBtn} onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className={styles.formSubmitBtn}>
                {formMode === "edit" ? "Update Gallery Item" : "Create Gallery Item"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

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
                  placeholder="Search gallery items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className={styles.searchClear}>
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
              <span className={styles.buttonTextFull}>Add Gallery Item</span>
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
          pageSizeOptions={[5, 10, 15, 20]}
          initialPageSize={10}
          noDataMessage="No gallery items found"
          noDataDescription={
            searchTerm
              ? "Try adjusting your search query."
              : "Create your first gallery item to showcase on the home page."
          }
          noDataAction={
            (!searchTerm)
              ? { onClick: openAddForm, text: "Create Gallery Item" }
              : null
          }
          loadingMessage="Loading gallery items..."
          showSerialNumber
          serialNumberField="srNo"
          serialNumberHeader="Sr.no."
          serialNumberWidth={80}
        />
      </div>
    </div>
  );
}
