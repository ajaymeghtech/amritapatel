'use client';

import React, { useState, useEffect, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonDataGrid, { Tooltip } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from "./NewsList.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const TESTIMONIAL_CATEGORY_ENDPOINT = `${API_BASE_URL}/api/testimonial-categories`;

const initialFormState = {
  title: "",
  description: "",
  status: "active",
  sortOrder: 0,
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
                {title.includes("Edit") ? "Update category details" : "Create a new testimonial category"}
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

export default function TestimonialCategoryList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, title: "" });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(TESTIMONIAL_CATEGORY_ENDPOINT);
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
      title: entry.title || "",
      description: entry.description || "",
      status: entry.status || "active",
      sortOrder: entry.sortOrder || 0,
    });
  };

  const resetForm = () => {
    setFormMode(null);
    setEditId(null);
    setFormData(initialFormState);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || formData.title.trim() === "") {
      toast.error("Title is required");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description || "",
      status: formData.status,
      sortOrder: parseInt(formData.sortOrder) || 0,
    };

    try {
      const url = formMode === "edit" ? `${TESTIMONIAL_CATEGORY_ENDPOINT}/${editId}` : TESTIMONIAL_CATEGORY_ENDPOINT;
      const method = formMode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save");

      const result = await response.json();
      toast.success(result.message || "Category saved successfully");
      resetForm();
      fetchItems();
    } catch (error) {
      toast.error(error.message || "Failed to save category");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmModal.id) return;
    try {
      const response = await fetch(`${TESTIMONIAL_CATEGORY_ENDPOINT}/${confirmModal.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      toast.success("Category deleted successfully");
      setConfirmModal({ isOpen: false, id: null, title: "" });
      fetchItems();
    } catch (error) {
      toast.error(error.message || "Failed to delete category");
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
      field: "srNo",
      headerName: "Sr. No.",
      width: 100,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 300,
      renderCell: (params) => (
        <Tooltip content={params.row.title || "Untitled"}>
          <div className="text-truncate" style={{ maxWidth: "100%" }}>
            {params.row.title || "Untitled"}
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
      field: "sortOrder",
      headerName: "Sort Order",
      width: 120,
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
            onClick={() => setConfirmModal({ isOpen: true, id: params.row._id, title: params.row.title })}
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
                  placeholder="Search categories..."
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
          </div>
          <div className={styles.actionBarRight}>
            <button onClick={openAddForm} className={styles.addButton}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
              </svg>
              <span className={styles.buttonTextFull}>Add Category</span>
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
          noDataMessage="No categories found"
          loadingMessage="Loading categories..."
          showSerialNumber={true}
          serialNumberHeader="Sr No."
        />
      </div>

      <Modal isOpen={formMode !== null} onClose={resetForm} title={formMode === "edit" ? "Edit Category" : "Add Category"}>
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Basic Information</h3>
                <p className={styles.formSectionDescription}>Enter category details</p>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Title <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  className={styles.formInput}
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter category title..."
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.formTextarea}
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter category description..."
                />
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
                    onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
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
        onClose={() => setConfirmModal({ isOpen: false, id: null, title: "" })}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete "${confirmModal.title}"? This action cannot be undone.`}
      />
    </div>
  );
}

