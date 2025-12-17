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
const INSTITUTE_ENDPOINT = `${API_BASE_URL}/api/institute`;

const initialFormState = {
  name: "",
  url: "",
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
                {title.includes("Edit") ? "Update institute entry" : "Create a new institute entry"}
              </p>
            </div>
          </div>

          <button onClick={onClose} className={styles.modalCloseBtn}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
};

export default function InstituteList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, title: "" });
  const [viewModal, setViewModal] = useState({ isOpen: false, entry: null });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(INSTITUTE_ENDPOINT);
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
      name: entry.name,
      url: entry.url,
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
      name: formData.name,
      url: formData.url,
    };

    try {
      const url =
        formMode === "edit"
          ? `${INSTITUTE_ENDPOINT}/${editId}`
          : INSTITUTE_ENDPOINT;

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
    try {
      const response = await fetch(`${INSTITUTE_ENDPOINT}/${confirmModal.id}`, {
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

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const gridData = filteredItems.map((item, index) => ({
    ...item,
    id: item._id,
    srNo: index + 1,
  }));

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 250,
      renderCell: (params) => (
        <Tooltip content={params.row.name}>
          <div className="text-truncate" style={{ maxWidth: "220px" }}>
            {params.row.name}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "url",
      headerName: "Website URL",
      width: 300,
      renderCell: (params) => (
        <Tooltip content={params.row.url}>
          <div className="text-truncate" style={{ maxWidth: "270px" }}>
            {params.row.url}
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
               onClick={() =>
              setConfirmModal({
                isOpen: true,
                id: params.row._id,
                title: params.row.name,
              })
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
                  placeholder="Search institutes..."
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
              <span className={styles.buttonTextFull}>Add Institute</span>
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
        noDataMessage="No institutes found"
        loadingMessage="Loading institutes..."
        showSerialNumber={true}
        serialNumberHeader="Sr No."
      />

      {/* ADD / EDIT MODAL */}
      <Modal
        isOpen={formMode !== null}
        onClose={resetForm}
        title={formMode === "edit" ? "Edit Institute" : "Add Institute"}
      >
        <form onSubmit={handleFormSubmit} className={styles.formContainer}>
          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Basic Information</h3>

            {/* NAME */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>
                Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.formInput}
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter institute name..."
              />
            </div>

            {/* URL */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>
                Website URL <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.formInput}
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="Enter website URL..."
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={resetForm} className={styles.formCancelBtn}>
              Cancel
            </button>
            <button type="submit" className={styles.formSubmitBtn}>
              {formMode === "edit" ? "Update Entry" : "Create Entry"}
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW MODAL */}
      {viewModal.isOpen && (
        <Modal
          isOpen={true}
          onClose={() => setViewModal({ isOpen: false, entry: null })}
          title="View Institute Details"
        >
          <div className={styles.viewModalContent}>
            <h3 className={styles.viewSectionTitle}>Basic Information</h3>

            <div className={styles.viewField}>
              <label className={styles.viewLabel}>Name</label>
              <div className={styles.viewValue}>{viewModal.entry.name}</div>
            </div>

            <div className={styles.viewField}>
              <label className={styles.viewLabel}>Website URL</label>
              <div className={styles.viewValue}>{viewModal.entry.url}</div>
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRMATION */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleDeleteConfirm}
        title="Delete Institute"
        message={`Are you sure you want to delete "${confirmModal.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
