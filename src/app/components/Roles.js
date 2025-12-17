'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Roles.module.css';

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit") ? "Update role information and permissions" : "Create a new role with specific permissions"}
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

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null); // 'add' or 'edit'
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    permissions: [],
    level: 1,
    color: "#3b82f6"
  });

  const availablePermissions = [
    "users.create", "users.read", "users.update", "users.delete",
    "roles.create", "roles.read", "roles.update", "roles.delete",
    "news.create", "news.read", "news.update", "news.delete",
    "events.create", "events.read", "events.update", "events.delete",
    "banners.create", "banners.read", "banners.update", "banners.delete",
    "cms.create", "cms.read", "cms.update", "cms.delete",
    "settings.read", "settings.update"
  ];

  useEffect(() => {
    // Simulate API call with sample data
    setTimeout(() => {
      setRoles([
        {
          id: 1,
          name: "Administrator",
          description: "Full system access with all permissions",
          status: "active",
          permissions: availablePermissions,
          level: 5,
          color: "#dc2626",
          userCount: 2,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: "Editor",
          description: "Content management and editing permissions",
          status: "active",
          permissions: ["news.create", "news.read", "news.update", "events.create", "events.read", "events.update"],
          level: 3,
          color: "#2563eb",
          userCount: 5,
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          name: "Viewer",
          description: "Read-only access to content",
          status: "active",
          permissions: ["news.read", "events.read", "banners.read"],
          level: 1,
          color: "#16a34a",
          userCount: 10,
          createdAt: new Date().toISOString()
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter roles based on search term and filters
  const filteredRoles = useMemo(() => {
    return roles.filter(role => {
      const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           role.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || role.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [roles, searchTerm, statusFilter]);

  // Get unique values for filters
  const uniqueStatuses = useMemo(() => {
    return [...new Set(roles.map(role => role.status))];
  }, [roles]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (formMode === "edit") {
      setRoles(prev => prev.map(role => 
        role.id === editId ? { ...role, ...formData } : role
      ));
      toast.success("Role updated successfully!");
    } else {
      const newRole = {
        id: Date.now(),
        ...formData,
        userCount: 0,
        createdAt: new Date().toISOString()
      };
      setRoles(prev => [...prev, newRole]);
      toast.success("Role created successfully!");
    }
    
    setFormMode(null);
    setEditId(null);
    setFormData({
      name: "",
      description: "",
      status: "active",
      permissions: [],
      level: 1,
      color: "#3b82f6"
    });
  };

  const handleEdit = (role) => {
    setFormData(role);
    setEditId(role.id);
    setFormMode("edit");
  };

  const handleDelete = (roleId) => {
    setRoles(prev => prev.filter(role => role.id !== roleId));
    setDeleteId(null);
    toast.success("Role deleted successfully!");
  };

  const handlePermissionToggle = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
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
      headerName: 'Role Name',
      width: 200,
      renderCell: (params) => (
        <div className={styles.roleCell}>
          <div className={styles.roleIndicator} style={{ backgroundColor: params.row.color }}></div>
          <div>
            <div className={styles.roleName}>{params.value}</div>
            <div className={styles.roleDescription}>{params.row.description}</div>
          </div>
        </div>
      ),
    },
    {
      field: 'level',
      headerName: 'Level',
      width: 100,
      renderCell: (params) => (
        <div className={styles.levelBadge}>
          Level {params.value}
        </div>
      ),
    },
    {
      field: 'permissions',
      headerName: 'Permissions',
      width: 150,
      renderCell: (params) => (
        <div className={styles.permissionsCount}>
          {params.value.length} permissions
        </div>
      ),
    },
    {
      field: 'userCount',
      headerName: 'Users',
      width: 100,
      renderCell: (params) => (
        <div className={styles.userCount}>
          {params.value} users
        </div>
      ),
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
            title="Edit role"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => setDeleteId(params.row.id)}
            className={styles.deleteBtn}
            title="Delete role"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const rows = filteredRoles.map((role, index) => ({
    id: role.id,
    ...role,
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
                  placeholder="Search roles..."
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
              <span>Add New Role</span>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className={styles.noDataContent}>
                      <h3 className={styles.noDataTitle}>No roles found</h3>
                      <p className={styles.noDataDescription}>
                        {searchTerm || statusFilter !== "all"
                          ? "Try adjusting your search criteria or filters."
                          : "Get started by creating your first role."
                        }
                      </p>
                      {(!searchTerm && statusFilter === "all") && (
                        <button
                          onClick={() => setFormMode("add")}
                          className={styles.noDataActionBtn}
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Create First Role
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
                  <p className={styles.loadingText}>Loading roles...</p>
                </div>
              ),
            }}
          />
        </div>
      </div>

      {/* Enhanced Modal for Add/Edit Role */}
      <Modal
        isOpen={formMode !== null}
        onClose={() => {
          setFormMode(null);
          setEditId(null);
          setFormData({
            name: "",
            description: "",
            status: "active",
            permissions: [],
            level: 1,
            color: "#3b82f6"
          });
        }}
        title={formMode === "edit" ? "Edit Role" : "Create New Role"}
      >
        {/* Enhanced Modal Content */}
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
            {/* Basic Information Section */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Basic Information</h3>
                <p className={styles.formSectionDescription}>Essential details for the role</p>
              </div>
              
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Role Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter role name..."
                    required
                  />
                </div>
                
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Role Level</label>
                  <select
                    className={styles.formSelect}
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                  >
                    <option value={1}>Level 1 - Basic</option>
                    <option value={2}>Level 2 - Standard</option>
                    <option value={3}>Level 3 - Advanced</option>
                    <option value={4}>Level 4 - Expert</option>
                    <option value={5}>Level 5 - Admin</option>
                  </select>
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Description <span className={styles.required}>*</span>
                </label>
                <textarea
                  className={styles.formTextarea}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter role description..."
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Role Settings Section */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Role Settings</h3>
                <p className={styles.formSectionDescription}>Status and visual settings</p>
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
                  <label className={styles.formLabel}>Role Color</label>
                  <div className={styles.colorInputWrapper}>
                    <input
                      type="color"
                      className={styles.colorInput}
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                    <input
                      type="text"
                      className={styles.colorTextInput}
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions Section */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Permissions</h3>
                <p className={styles.formSectionDescription}>Select permissions for this role</p>
              </div>
              
              <div className={styles.permissionsGrid}>
                {availablePermissions.map((permission) => (
                  <label key={permission} className={styles.permissionItem}>
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission)}
                      onChange={() => handlePermissionToggle(permission)}
                      className={styles.permissionCheckbox}
                    />
                    <span className={styles.permissionText}>{permission}</span>
                  </label>
                ))}
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
                    description: "",
                    status: "active",
                    permissions: [],
                    level: 1,
                    color: "#3b82f6"
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
                {formMode === "edit" ? "Update Role" : "Create Role"}
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
        title="Delete Role"
        message={`Are you sure you want to delete this role? This action cannot be undone and may affect users assigned to this role.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}