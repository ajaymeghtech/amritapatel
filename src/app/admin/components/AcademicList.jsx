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
const ACADEMIC_ENDPOINT = `${API_BASE_URL}/api/academic`;

const getImageUrl = (path = "") => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
};

const initialFormState = {
  title: "",
  subtitle: "",
  content: "",
  image: "",
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit") ? "Update academic entry" : "Create a new academic entry"}
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

export default function AcademicList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, title: "" });
  const [viewModal, setViewModal] = useState({ isOpen: false, entry: null });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(ACADEMIC_ENDPOINT);
      const data = await response.json();
      setItems(data.data || []);
    } catch (error) {
      toast.error("Failed to load academic data");
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
      subtitle: entry.subtitle || "",
      content: entry.content || "",
      image: entry.image || "",
    });
    setImageFile(null);
    setImagePreview(entry.image ? getImageUrl(entry.image) : "");
  };

  const resetForm = () => {
    setFormMode(null);
    setEditId(null);
    setFormData(initialFormState);
    setImageFile(null);
    setImagePreview("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e, closeAfterSubmit = true) => {
    e.preventDefault();

    if (!formData.title || !formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("subtitle", formData.subtitle || "");
      formDataToSend.append("content", formData.content || "");
    
    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    try {
      const url = formMode === "edit" ? `${ACADEMIC_ENDPOINT}/${editId}` : ACADEMIC_ENDPOINT;
      const method = formMode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save");
      }

      toast.success(formMode === "edit" ? "Updated successfully" : "Created successfully");
      
      if (formMode === "edit" || closeAfterSubmit) {
        resetForm();
      } else {
        // For add mode with "Add More", reset form but keep modal open
        setFormData({
          title: "",
          subtitle: "",
          content: "",
          image: "",
        });
        setImageFile(null);
        setImagePreview("");
      }
      
      fetchItems();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${ACADEMIC_ENDPOINT}/${confirmModal.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");

      toast.success("Deleted successfully");
      setConfirmModal({ isOpen: false, id: null, title: "" });
      fetchItems();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const searchMatch = searchTerm === "" ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());
      return searchMatch;
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
          <div style={{ maxWidth: "100%" }} className="text-truncate">{params.value}</div>
        </Tooltip>
      )
    },
    {
      field: "subacademic",
      headerName: "Sub-Academic",
      width: 120,
      renderCell: (params) => (
        <span className="badge bg-info">
          {params.value?.length || 0}
        </span>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      flex: 0,
      renderCell: (params) => {
        const item = params.row;
        return (
          <div className="d-flex justify-content-center align-items-center gap-2">
            <button
              title="Edit"
              onClick={() => handleEdit(item)}
              className="btn btn-sm d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px", backgroundColor: "#e0f2fe", border: "none", borderRadius: "6px", padding: 0 }}
            >
              <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              title="Delete"
              onClick={() => setConfirmModal({ isOpen: true, id: item._id, title: item.title })}
              className="btn btn-sm d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px", backgroundColor: "#fee2e2", border: "none", borderRadius: "6px", padding: 0 }}
            >
              <svg width="16" height="16" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        );
      }
    },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "none", margin: 0, padding: 0, position: "relative", left: 0, right: 0 }}>
      <ToastContainer position="top-right" autoClose={4000} />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, title: "" })}
        onConfirm={handleDeleteConfirm}
        title="Delete Academic"
        message={`Are you sure you want to delete "${confirmModal.title}"? This action cannot be undone.`}
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
                  placeholder="Search academic..."
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
            <button onClick={openAddForm} className={styles.addButton} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '10px 16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white',
              border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer'
            }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Academic</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <CommonDataGrid
          data={filteredItems.map((item) => ({ ...item, id: item._id }))}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 15, 20, 50]}
          initialPageSize={10}
          noDataMessage="No academic entries found"
          loadingMessage="Loading academic entries..."
          showSerialNumber
          serialNumberField="srNo"
          serialNumberHeader="Sr.no."
        />
      </div>

      <Modal isOpen={formMode !== null} onClose={resetForm} title={formMode === "edit" ? "Edit Academic" : "Create New Academic"}>
        <form onSubmit={handleFormSubmit} className={styles.formContainer}>
          <div className={styles.formSection}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Title *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Subtitle</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>

              <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
                <label className={styles.formLabel}>Content</label>
                <div style={{ minHeight: '200px' }}>
                  <CKEditorWrapper
                    data={formData.content || ''}
                    onChange={(event, editor) => {
                      const data = editor?.getData ? editor.getData() : (event?.target?.value || '');
                      setFormData((prevFormData) => ({ ...prevFormData, content: data }));
                    }}
                  />
                </div>
              </div>

              <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
                <label className={styles.formLabel}>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.formInput}
                />
                {imagePreview && (
                  <div style={{ marginTop: "10px" }}>
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: "200px", maxHeight: "150px", borderRadius: "8px" }} />
                  </div>
                )}
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
              {formMode === "edit" ? "Update Academic" : "Create Academic"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

