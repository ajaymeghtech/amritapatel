'use client';

import React, { useState, useEffect, useMemo } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommonDataGrid, { Tooltip, StatusBadge } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from './PermissionsList.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '${API_BASE_URL}';

// Enhanced Modal Component with Better Design and Animations
const Modal = ({ isOpen, onClose, title, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalIcon}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit") ? "Update permission details" : "Create a new permission"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={styles.modalCloseBtn}
            aria-label="Close modal"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className={styles.modalContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default function PermissionsList() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formMode, setFormMode] = useState(null); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    key: "",
    label: ""
  });
  const [editId, setEditId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    permissionId: null,
    permissionKey: ""
  });

  // View modal state
  const [viewModal, setViewModal] = useState({
    isOpen: false,
    permission: null
  });

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/permissions/`);
      if (!response.ok) throw new Error("Failed to fetch permissions");
      const data = await response.json();
      // Handle new API response format with data property
      setPermissions(data.data || data || []);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to fetch permissions: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Updated delete functions
  const handleDeleteClick = (id, key) => {
    setConfirmModal({
      isOpen: true,
      permissionId: id,
      permissionKey: key
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/permissions/${confirmModal.permissionId}`, { method: "DELETE" });
      setPermissions(permissions.filter((item) => item._id !== confirmModal.permissionId));
      toast.success("Permission deleted successfully!");
    } catch (error) {
      toast.error(`Failed to delete permission: ${error.message}`);
    } finally {
      setConfirmModal({ isOpen: false, permissionId: null, permissionKey: "" });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmModal({ isOpen: false, permissionId: null, permissionKey: "" });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting permission data:', formData);

      let response;
      if (formMode === "edit") {
        response = await fetch(`${API_BASE_URL}/api/permissions/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/api/permissions/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to save: ${errorData.error || 'Unknown error'}`);
        return;
      }

      const result = await response.json();
      console.log('Success response:', result);

      setFormMode(null);
      setEditId(null);
      setFormData({
        key: "",
        label: ""
      });

      toast.success(formMode === "edit" ? "Permission updated successfully!" : "Permission created successfully!");
      fetchPermissions();
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(`Failed to save. Error: ${error.message}`);
    }
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    setEditId(item._id);
    setFormData({
      key: item.key || "",
      label: item.label || ""
    });
  };

  // Filter permissions by search term
  const filteredPermissions = useMemo(() => {
    return permissions.filter((item) => {
      const searchMatch = searchTerm === "" ||
        item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.label.toLowerCase().includes(searchTerm.toLowerCase());

      return searchMatch;
    });
  }, [permissions, searchTerm]);

  // Define table columns for Common DataGrid
  const columns = [
    // Key column
    {
      field: 'key',
      headerName: 'Permission Key',
      width: 250,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="fw-medium text-muted" style={{ fontFamily: 'monospace', fontSize: '13px' }} title={params.value}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },

    // Label column
    {
      field: 'label',
      headerName: 'Label',
      width: 300,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="text-truncate" style={{ maxWidth: '280px' }} title={params.value}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },

    // Category column (derived from key)
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      renderCell: (params) => {
        const key = params.row.key;
        const category = key ? key.split('.')[0] : '';
        const colors = {
          news: 'bg-primary',
          banners: 'bg-success',
          events: 'bg-info',
          cms: 'bg-warning',
          users: 'bg-danger',
          roles: 'bg-secondary',
          settings: 'bg-dark'
        };
        return (
          <span className={`badge ${colors[category] || 'bg-secondary'} text-capitalize`}>
            {category}
          </span>
        );
      },
    },

    // Created At column
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 120,
      renderCell: (params) => (
        <span className="small text-muted">
          {params.value ? new Date(params.value).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
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
            onClick={() => setViewModal({ isOpen: true, permission: params.row })}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{ 
              width: '32px', 
              height: '32px',
              backgroundColor: '#e0f2fe',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }}
            title="View Permission Details"
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
            title="Edit Permission"
            onMouseEnter={(e) => e.target.style.backgroundColor = '#bae6fd'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#e0f2fe'}
          >
            <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleDeleteClick(params.row._id, params.row.key)}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{ 
              width: '32px', 
              height: '32px',
              backgroundColor: '#fee2e2',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }}
            title="Delete Permission"
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
    <div style={{
      width: '100%',
      maxWidth: 'none',
      margin: 0,
      padding: 0,
      position: 'relative',
      left: 0,
      right: 0
    }}>
      {/* Toast Container */}
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
        toastStyle={{
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Permission"
        message={`Are you sure you want to delete "${confirmModal.permissionKey}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Enhanced Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.actionBarContent}>
          {/* Left Section - Search */}
          <div className={styles.actionBarLeft}>
            {/* Search Bar */}
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <svg className={styles.searchIcon} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search permissions..."
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
              <span className={styles.buttonTextFull}>Add New Permission</span>
              <span className={styles.buttonTextShort}>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Data Table */}
      <CommonDataGrid
        data={filteredPermissions}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 15, 20, 50]}
        initialPageSize={10}
        noDataMessage="No permissions found"
        noDataDescription={
          searchTerm
            ? "Try adjusting your search criteria."
            : "Get started by creating your first permission."
        }
        noDataAction={
          !searchTerm ? {
            onClick: () => setFormMode("add"),
            text: "Create First Permission"
          } : null
        }
        loadingMessage="Loading permissions..."
        showSerialNumber={true}
        serialNumberField="id"
        serialNumberHeader="Sr.no."
        serialNumberWidth={100}
      />

      {/* Modal for Add/Edit Form */}
      <Modal
        isOpen={formMode !== null}
        onClose={() => {
          setFormMode(null);
          setEditId(null);
          setFormData({
            key: "",
            label: ""
          });
        }}
        title={formMode === "edit" ? "Edit Permission" : "Create New Permission"}
      >
        {/* Enhanced Modal Content */}
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
            {/* Basic Information Section */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Permission Details</h3>
                <p className={styles.formSectionDescription}>Define the permission key and label</p>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Permission Key <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="e.g., news.create, banners.update"
                  required
                  pattern="[a-z]+\.[a-z]+"
                  title="Format: category.action (e.g., news.create)"
                />
                <small className={styles.formHelp}>
                  Format: category.action (e.g., news.create, banners.update, events.delete)
                </small>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Label <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g., Create News"
                  required
                />
                <small className={styles.formHelp}>
                  Human-readable description of the permission
                </small>
              </div>
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => {
                  setFormMode(null);
                  setEditId(null);
                  setFormData({
                    key: "",
                    label: ""
                  });
                }}
                className={styles.formCancelBtn}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              <button
                type="submit"
                className={styles.formSubmitBtn}
              >
                {formMode === "edit" ? "Update Permission" : "Create Permission"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* View Permission Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, permission: null })}
        title="View Permission Details"
      >
        {viewModal.permission && (
          <div className={styles.viewModalContent}>
            <div className={styles.viewSection}>
              <div className={styles.viewSectionHeader}>
                <h3 className={styles.viewSectionTitle}>Permission Information</h3>
              </div>
              
              <div className={styles.viewGrid}>
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Key</label>
                  <div className={styles.viewValue} style={{ fontFamily: 'monospace' }}>{viewModal.permission.key}</div>
                </div>
                
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Category</label>
                  <div className={styles.viewValue}>
                    {viewModal.permission.key ? (
                      <span className="badge bg-info">
                        {viewModal.permission.key.split('.')[0]}
                      </span>
                    ) : 'N/A'}
                  </div>
                </div>
              </div>

              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Label</label>
                <div className={styles.viewValue}>{viewModal.permission.label}</div>
              </div>

              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Created At</label>
                <div className={styles.viewValue}>
                  {viewModal.permission.createdAt ? new Date(viewModal.permission.createdAt).toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>

            <div className={styles.viewModalActions}>
              <button
                onClick={() => setViewModal({ isOpen: false, permission: null })}
                className={styles.viewCloseBtn}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

