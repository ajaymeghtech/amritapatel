'use client';

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonDataGrid, { Tooltip } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from "./NewsList.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// -----------------------
// Modal Reusable Component
// -----------------------
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalIcon}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m0 0V8m0 4H7m5 4h6m0 0v-4m0 0h2l1 5h-2l-2 4v-5h-4M7 12H5a2 2 0 01-2-2V9a2 2 0 012-2h3.5L10 4h4l.5 3H19a2 2 0 012 2v1"
                />
              </svg>
            </div>
            <div>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit")
                  ? "Update announcement year"
                  : "Create new announcement year"}
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

// --------------------------
// Initial Form State (Year)
// --------------------------
const initialFormState = {
  year: "",
};

export default function AnnouncementCategoryList() {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [editId, setEditId] = useState(null);

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

  // ----------------------------------
  // Fetch Announcement Years
  // ----------------------------------
  const fetchYears = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/announcement-years`);
      if (!res.ok) throw new Error("Failed to fetch announcement years");

      const data = await res.json();
      setYears(data.data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  // ----------------------------------
  // Add Form
  // ----------------------------------
  const openAddForm = () => {
    setFormMode("add");
    setFormData(initialFormState);
    setEditId(null);
  };

  // ----------------------------------
  // Edit Form
  // ----------------------------------
  const handleEdit = (row) => {
    setFormMode("edit");
    setEditId(row._id);
    setFormData({ year: row.year });
  };

  const resetForm = () => {
    setFormMode(null);
    setFormData(initialFormState);
    setEditId(null);
  };

  // ----------------------------------
  // Submit Add/Edit
  // ----------------------------------
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.year) {
      toast.error("Year is required");
      return;
    }

    try {
      const url =
        formMode === "edit"
          ? `${API_BASE_URL}/api/announcement-years/${editId}`
          : `${API_BASE_URL}/api/announcement-years`;

      const method = formMode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: formData.year }),
      });

      if (!response.ok) throw new Error("Failed to save year");

      toast.success(`Year ${formMode === "edit" ? "updated" : "added"} successfully`);
      resetForm();
      fetchYears();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ----------------------------------
  // Delete Year
  // ----------------------------------
  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/announcement-years/${confirmModal.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete year");

      toast.success("Year deleted successfully");
      setConfirmModal({ isOpen: false, id: null });
      fetchYears();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ----------------------------------
  // Grid Data
  // ----------------------------------
  const filteredYears = useMemo(() => {
    if (!searchTerm) return years;
    return years.filter((item) =>
      `${item.year}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [years, searchTerm]);

  const gridData = filteredYears.map((item, index) => ({
    ...item,
    id: index + 1,
  }));

  const columns = [

    { field: "year", headerName: "Year", width: 200 },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          {/* View Button */}
          <button
            onClick={() => setViewModal({ isOpen: true, entry: params.row })}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#e0f2fe',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }}
            title="View Article Details"
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
            title="Edit Article"
            onMouseEnter={(e) => e.target.style.backgroundColor = '#bae6fd'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#e0f2fe'}
          >
            <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() =>
              setConfirmModal({ isOpen: true, id: params.row._id, title: params.row.title })
            }
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#fee2e2',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }}
            title="Delete Article"
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
    <div style={{ width: "100%" }}>
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
                  placeholder="Search announcement years..."
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
              <span className={styles.buttonTextFull}>Add Year</span>
              <span className={styles.buttonTextShort}>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* DataGrid */}
      <CommonDataGrid
        rows={gridData}
        columns={columns}
        loading={loading}
        autoHeight
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={!!formMode}
        onClose={resetForm}
        title={formMode === "edit" ? "Edit Year" : "Add Year"}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label className="form-label">Year</label>
            <input
              type="text"
              className="form-control"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              placeholder="Enter Year (e.g., 2025)"
            />
          </div>

          <div className="text-end">
            <button type="button" className="btn btn-secondary me-2" onClick={resetForm}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              {formMode === "edit" ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Announcement Year"
        message="Are you sure you want to delete this year?"
      />
    </div>
  );
}
