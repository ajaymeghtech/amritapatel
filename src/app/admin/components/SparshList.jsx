'use client';

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonDataGrid, { Tooltip } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from "./CMSList.module.css";

const CKEditorWrapper = dynamic(() => import("./CKEditorWrapper"), {
  ssr: false,
  loading: () => null,
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const SPARSH_ENDPOINT = `${API_BASE_URL}/api/sparsh`;

const initialFormState = {
  title: "",
  content: "",
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
                {title.includes("Edit") ? "Update Sparsh entry" : "Create a new Sparsh entry"}
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

export default function SparshList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, title: "" });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(SPARSH_ENDPOINT);
      const data = await res.json();
      setItems(data.data || []);
    } catch (err) {
      toast.error("Failed to load Sparsh items");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const searchMatch =
        searchTerm === "" ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchTerm.toLowerCase());
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
          <div className="fw-medium text-truncate" style={{ maxWidth: "100%" }}>
            {params.value}
          </div>
        </Tooltip>
      ),
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

  const openAddForm = () => {
    setFormMode("add");
    setFormData(initialFormState);
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    setEditId(item._id);
    setFormData({
      title: item.title || "",
      content: item.content || "",
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("content", formData.content || "");

      const url = formMode === "edit" ? `${SPARSH_ENDPOINT}/${editId}` : SPARSH_ENDPOINT;
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
      await fetch(`${SPARSH_ENDPOINT}/${confirmModal.id}`, { method: "DELETE" });
      toast.success("Deleted successfully!");
      setConfirmModal({ isOpen: false, id: null, title: "" });
      fetchItems();
    } catch (err) {
      toast.error(`Failed to delete: ${err.message}`);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "none", margin: 0, padding: 0 }}>
      <ToastContainer position="top-right" autoClose={4000} />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, title: "" })}
        onConfirm={handleDeleteConfirm}
        title="Delete Sparsh Item"
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
                  placeholder="Search Sparsh..."
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
          </div>
          <div className={styles.actionBarRight}>
            <button onClick={openAddForm} className={styles.addButton}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
              </svg>
              <span className={styles.buttonTextFull}>Add Sparsh</span>
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
          noDataMessage="No Sparsh items found"
          loadingMessage="Loading Sparsh..."
          showSerialNumber
          serialNumberField="srNo"
          serialNumberHeader="Sr.no."
          serialNumberWidth={80}
        />
      </div>

      <Modal isOpen={formMode !== null} onClose={() => setFormMode(null)} title={formMode === "edit" ? "Edit Sparsh" : "Add Sparsh"}>
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
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
                  placeholder="Enter Sparsh title..."
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Content</label>
                <div style={{ minHeight: "200px" }}>
                  <CKEditorWrapper
                    data={formData.content || ""}
                    onChange={(event, editor) => {
                      const data = editor?.getData ? editor.getData() : (event?.target?.value || "");
                      setFormData({ ...formData, content: data });
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={() => setFormMode(null)} className={styles.formCancelBtn}>
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

