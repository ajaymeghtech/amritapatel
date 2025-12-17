'use client';

import React, { useState, useEffect, useMemo } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommonDataGrid, { Tooltip, StatusBadge } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from './UsersList.module.css';

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit") ? "Update user details and settings" : "Create a new user account with all details"}
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

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formMode, setFormMode] = useState(null); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "viewer"
  });
  const [editId, setEditId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    userId: null,
    userName: ""
  });

  // View modal state
  const [viewModal, setViewModal] = useState({
    isOpen: false,
    user: null
  });

  // Role colors mapping
  const roleColors = {
    admin: 'bg-danger',
    editor: 'bg-primary',
    viewer: 'bg-info'
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/users/`);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      // Handle new API response format with data property
      setUsers(data.data || data || []);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to fetch users: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Updated delete functions
  const handleDeleteClick = (id, name) => {
    setConfirmModal({
      isOpen: true,
      userId: id,
      userName: name
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/users/${confirmModal.userId}`, { method: "DELETE" });
      setUsers(users.filter((item) => item._id !== confirmModal.userId));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error(`Failed to delete user: ${error.message}`);
    } finally {
      setConfirmModal({ isOpen: false, userId: null, userName: "" });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmModal({ isOpen: false, userId: null, userName: "" });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting user data:', formData);

      let response;
      if (formMode === "edit") {
        response = await fetch(`${API_BASE_URL}/api/users/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/api/users/`, {
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
        name: "",
        email: "",
        role: "viewer"
      });

      toast.success(formMode === "edit" ? "User updated successfully!" : "User created successfully!");
      fetchUsers();
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(`Failed to save. Error: ${error.message}`);
    }
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    setEditId(item._id);
    setFormData({
      name: item.name || "",
      email: item.email || "",
      role: item.role || "viewer"
    });
  };

  const uniqueRoles = useMemo(() => {
    const roles = [...new Set(users.map(item => item.role).filter(Boolean))];
    return roles.sort();
  }, [users]);

  // Filter users by role and search term
  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const roleMatch = roleFilter === "all" || item.role === roleFilter;
      const searchMatch = searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase());

      return roleMatch && searchMatch;
    });
  }, [users, roleFilter, searchTerm]);

  // Define table columns for Common DataGrid
  const columns = [
    // Name column
    {
      field: 'name',
      headerName: 'Name',
      width: 180,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="fw-medium text-truncate" style={{ maxWidth: '160px' }} title={params.value}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },

    // Email column
    {
      field: 'email',
      headerName: 'Email',
      width: 220,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="text-muted text-truncate" style={{ maxWidth: '200px' }} title={params.value}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },

    // Role column
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: (params) => {
        return (
          <span className={`badge ${roleColors[params.value] || 'bg-secondary'}`}>
            {params.value ? params.value.charAt(0).toUpperCase() + params.value.slice(1) : 'N/A'}
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
            onClick={() => setViewModal({ isOpen: true, user: params.row })}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{ 
              width: '32px', 
              height: '32px',
              backgroundColor: '#e0f2fe',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }}
            title="View User Details"
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
            title="Edit User"
            onMouseEnter={(e) => e.target.style.backgroundColor = '#bae6fd'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#e0f2fe'}
          >
            <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleDeleteClick(params.row._id, params.row.name)}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{ 
              width: '32px', 
              height: '32px',
              backgroundColor: '#fee2e2',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }}
            title="Delete User"
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
        title="Delete User"
        message={`Are you sure you want to delete "${confirmModal.userName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Enhanced Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.actionBarContent}>
          {/* Left Section - Search and Filters */}
          <div className={styles.actionBarLeft}>
            {/* Search Bar */}
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <svg className={styles.searchIcon} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search users..."
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

            {/* Filters */}
            <div className={styles.filtersContainer}>
              <div className={styles.filterGroup}>
                <div className={styles.filterSelectWrapper}>
                  <select
                    value={roleFilter}
                    onChange={(e) => {
                      setRoleFilter(e.target.value);
                      setRoleDropdownOpen(false);
                    }}
                    onMouseDown={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Roles</option>
                    {uniqueRoles.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                  <span className={`${styles.dropdownIcon} ${roleDropdownOpen ? styles.rotatedIcon : ''}`}>
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
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className={styles.buttonTextFull}>Add New User</span>
              <span className={styles.buttonTextShort}>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Data Table */}
      <CommonDataGrid
        data={filteredUsers}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 15, 20, 50]}
        initialPageSize={10}
        noDataMessage="No users found"
        noDataDescription={
          searchTerm || roleFilter !== "all"
            ? "Try adjusting your search criteria or filters."
            : "Get started by creating your first user."
        }
        noDataAction={
          (!searchTerm && roleFilter === "all") ? {
            onClick: () => setFormMode("add"),
            text: "Create First User"
          } : null
        }
        loadingMessage="Loading users..."
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
            name: "",
            email: "",
            role: "viewer"
          });
        }}
        title={formMode === "edit" ? "Edit User" : "Create New User"}
      >
        {/* Enhanced Modal Content */}
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
            {/* Basic Information Section */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>User Details</h3>
                <p className={styles.formSectionDescription}>Essential information for the user account</p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter user name..."
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Email <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    className={styles.formInput}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address..."
                    required
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Role <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.formSelect}
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
                <small className={styles.formHelp}>
                  Admin: Full access, Editor: Content management, Viewer: Read-only access
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
                    name: "",
                    email: "",
                    role: "viewer"
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
                {formMode === "edit" ? "Update User" : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* View User Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, user: null })}
        title="View User Details"
      >
        {viewModal.user && (
          <div className={styles.viewModalContent}>
            <div className={styles.viewSection}>
              <div className={styles.viewSectionHeader}>
                <h3 className={styles.viewSectionTitle}>User Information</h3>
              </div>
              
              <div className={styles.viewGrid}>
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Name</label>
                  <div className={styles.viewValue}>{viewModal.user.name}</div>
                </div>
                
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Email</label>
                  <div className={styles.viewValue}>{viewModal.user.email || 'N/A'}</div>
                </div>
              </div>

              <div className={styles.viewGrid}>
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Role</label>
                  <div className={styles.viewValue}>
                    <span className={`badge ${roleColors[viewModal.user.role] || 'bg-secondary'}`}>
                      {viewModal.user.role ? viewModal.user.role.charAt(0).toUpperCase() + viewModal.user.role.slice(1) : 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Created At</label>
                  <div className={styles.viewValue}>
                    {viewModal.user.createdAt ? new Date(viewModal.user.createdAt).toLocaleString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.viewModalActions}>
              <button
                onClick={() => setViewModal({ isOpen: false, user: null })}
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

