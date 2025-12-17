'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Users.module.css';

// Enhanced Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type = "default" }) => {
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

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: '#fef2f2',
          borderColor: '#fecaca',
          iconColor: '#dc2626',
          buttonColor: '#dc2626',
          icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
        };
      case 'warning':
        return {
          iconBg: '#fffbeb',
          borderColor: '#fed7aa',
          iconColor: '#f59e0b',
          buttonColor: '#f59e0b',
          icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
        };
      default:
        return {
          iconBg: '#eff6ff',
          borderColor: '#bfdbfe',
          iconColor: '#3b82f6',
          buttonColor: '#3b82f6',
          icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        };
    }
  };

  const styles = getTypeStyles();

  if (!isOpen) return null;

  return (
    <div className={styles.confirmationModalOverlay} onClick={onClose}>
      <div className={styles.confirmationModalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.confirmationModalContent}>
          <div className={styles.confirmationModalIcon} style={{ backgroundColor: styles.iconBg, borderColor: styles.borderColor }}>
            <svg className={styles.confirmationModalIconSvg} style={{ color: styles.iconColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={styles.icon} />
            </svg>
          </div>
          
          <div className={styles.confirmationModalText}>
            <h3 className={styles.confirmationModalTitle}>{title}</h3>
            <p className={styles.confirmationModalMessage}>{message}</p>
          </div>
        </div>

        <div className={styles.confirmationModalActions}>
          <button
            onClick={onClose}
            className={styles.confirmationModalCancelBtn}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={styles.confirmationModalConfirmBtn}
            style={{ backgroundColor: styles.buttonColor }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit") ? "Update user information and settings" : "Create a new user account with all details"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={styles.modalCloseBtn}
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null); // 'add' or 'edit'
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active",
    department: "",
    phone: "",
    avatar: "",
    bio: "",
    permissions: []
  });

  useEffect(() => {
    // Simulate API call with sample data
    setTimeout(() => {
      setUsers([
        {
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          role: "admin",
          status: "active",
          department: "IT",
          phone: "+1 (555) 123-4567",
          avatar: "",
          bio: "System administrator with 5 years of experience",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.smith@example.com",
          role: "editor",
          status: "active",
          department: "Marketing",
          phone: "+1 (555) 987-6543",
          avatar: "",
          bio: "Content editor and marketing specialist",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        },
        {
          id: 3,
          name: "Bob Johnson",
          email: "bob.johnson@example.com",
          role: "user",
          status: "inactive",
          department: "Sales",
          phone: "+1 (555) 456-7890",
          avatar: "",
          bio: "Sales representative",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter users based on search term and filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  // Get unique values for filters
  const uniqueStatuses = useMemo(() => {
    return [...new Set(users.map(user => user.status))];
  }, [users]);

  const uniqueRoles = useMemo(() => {
    return [...new Set(users.map(user => user.role))];
  }, [users]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (formMode === "edit") {
      setUsers(prev => prev.map(user => 
        user.id === editId ? { ...user, ...formData } : user
      ));
      toast.success("User updated successfully!");
    } else {
      const newUser = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      setUsers(prev => [...prev, newUser]);
      toast.success("User created successfully!");
    }
    
    setFormMode(null);
    setEditId(null);
    setFormData({
      name: "",
      email: "",
      role: "user",
      status: "active",
      department: "",
      phone: "",
      avatar: "",
      bio: "",
      permissions: []
    });
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditId(user.id);
    setFormMode("edit");
  };

  const handleDelete = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    setDeleteId(null);
    toast.success("User deleted successfully!");
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params) => (
        <div className={styles.userCell}>
          <div className={styles.avatar}>
            {params.row.avatar ? (
              <img src={params.row.avatar} alt={params.value} />
            ) : (
              <span>{params.value.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <div className={styles.userName}>{params.value}</div>
            <div className={styles.userEmail}>{params.row.email}</div>
          </div>
        </div>
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: (params) => (
        <span className={`${styles.roleBadge} ${styles[params.value]}`}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <span className={`${styles.statusBadge} ${styles[params.value]}`}>
          <span className={styles.statusDot}></span>
          {params.value}
        </span>
      ),
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 150,
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 120,
      renderCell: (params) => (
        <span>{new Date(params.value).toLocaleDateString()}</span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div className={styles.actionButtons}>
          <button
            onClick={() => handleEdit(params.row)}
            className={styles.editBtn}
            title="Edit user"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => setDeleteId(params.row.id)}
            className={styles.deleteBtn}
            title="Delete user"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const rows = filteredUsers.map((user, index) => ({
    id: user.id,
    ...user,
  }));

  return (
    <div style={{ width: '100%', maxWidth: 'none', margin: 0, padding: 0 }}>
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
                <label className={styles.filterLabel}>Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">All Status</option>
                  {uniqueStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">All Roles</option>
                  {uniqueRoles.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className={styles.actionBarRight}>
            <button
              onClick={() => setFormMode("add")}
              className={styles.addButton}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add New User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Data Table */}
      <div className={styles.dataTableContainer}>
        <div className={styles.dataTableWrapper}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            pageSizeOptions={[5, 10, 15, 20, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f1f5f9',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f8fafc',
                borderBottom: '2px solid #e2e8f0',
                fontWeight: 600,
                fontSize: '14px',
                color: '#374151',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f8fafc',
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
              },
              '& .MuiTablePagination-root': {
                fontSize: '14px',
                color: '#6b7280',
              },
            }}
            slots={{
              noRowsOverlay: () => (
                <div className={styles.noDataContainer}>
                  <div className={styles.noDataContent}>
                    <div className={styles.noDataIcon}>
                      <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div className={styles.noDataContent}>
                      <h3 className={styles.noDataTitle}>No users found</h3>
                      <p className={styles.noDataDescription}>
                        {searchTerm || statusFilter !== "all" || roleFilter !== "all" 
                          ? "Try adjusting your search criteria or filters."
                          : "Get started by creating your first user."
                        }
                      </p>
                      {(!searchTerm && statusFilter === "all" && roleFilter === "all") && (
                        <button
                          onClick={() => setFormMode("add")}
                          className={styles.noDataActionBtn}
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Create First User
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ),
              loadingOverlay: () => (
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingSpinner}>
                    <svg className={styles.loadingIcon} width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <p className={styles.loadingText}>Loading users...</p>
                </div>
              ),
            }}
          />
        </div>
      </div>

      {/* Enhanced Modal for Add/Edit User */}
      <Modal
        isOpen={formMode !== null}
        onClose={() => {
          setFormMode(null);
          setEditId(null);
          setFormData({
            name: "",
            email: "",
            role: "user",
            status: "active",
            department: "",
            phone: "",
            avatar: "",
            bio: "",
            permissions: []
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
                <h3 className={styles.formSectionTitle}>Basic Information</h3>
                <p className={styles.formSectionDescription}>Essential details for the user account</p>
              </div>
              
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Full Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name..."
                    required
                  />
                </div>
                
                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Email Address <span className={styles.required}>*</span>
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
            </div>

            {/* Role and Status Section */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Role & Status</h3>
                <p className={styles.formSectionDescription}>User role and account status</p>
              </div>
              
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Role</label>
                  <select
                    className={styles.formSelect}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Status</label>
                  <select
                    className={styles.formSelect}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Additional Information</h3>
                <p className={styles.formSectionDescription}>Optional user details</p>
              </div>
              
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Department</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Enter department..."
                  />
                </div>
                
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Phone Number</label>
                  <input
                    type="tel"
                    className={styles.formInput}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number..."
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Bio</label>
                <textarea
                  className={styles.formTextarea}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Enter user bio..."
                  rows={3}
                />
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
                    role: "user",
                    status: "active",
                    department: "",
                    phone: "",
                    avatar: "",
                    bio: "",
                    permissions: []
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {formMode === "edit" ? "Update User" : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Enhanced Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId)}
        title="Delete User"
        message={`Are you sure you want to delete this user? This action cannot be undone and will permanently remove all user data.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}