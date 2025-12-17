'use client';

import React, { useState, useEffect, useMemo } from "react";
// import { usePermissions } from "../hooks/usePermissions";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PermissionGate from "@/app/components/PermissionGate";
import CommonDataGrid, { Tooltip, StatusBadge } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from './NewsList.module.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit") ? "Update article details and settings" : "Create a new article with all details"}
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

export default function NewsCategoryList() {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const { hasPermission } = usePermissions();

  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState({
    year: "",
    slug: "",
    status: "active"
  });

  const [editId, setEditId] = useState(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setFormData({ ...formData, content: editor.getHTML() });
    },
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
    },
  });

  // Update editor content when formData.content changes
  useEffect(() => {
    if (editor && formData.content !== editor.getHTML()) {
      editor.commands.setContent(formData.content);
    }
  }, [formData.content, editor]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [authorFilter, setAuthorFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    yearsId: null,
    yearsTitle: ""
  });

  // View modal state
  const [viewModal, setViewModal] = useState({
    isOpen: false,
    article: null
  });

  useEffect(() => {
    fetchyears();
  }, []);

  const fetchyears = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/news-years`);
      if (!response.ok) throw new Error("Failed to fetch years");
      const data = await response.json();
      console.log("data:", data);
      setYears(data.data || data || []);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to fetch years: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Updated delete functions
  const handleDeleteClick = (id, title) => {
    console.log('Delete clicked for:', id, title);
    console.log('Current confirmModal state:', confirmModal);
    setConfirmModal({
      isOpen: true,
      yearsId: id,
      yearsTitle: title
    });
    console.log('Set confirmModal to:', { isOpen: true, yearsId: id, yearsTitle: title });
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/news-years/${confirmModal.yearsId}`, { method: "DELETE" });
      setYears(years.filter((item) => item._id !== confirmModal.yearsId));
      toast.success("deleted successfully!");
    } catch (error) {
      toast.error(`Failed to delete: ${error.message}`);
    } finally {
      setConfirmModal({ isOpen: false, yearsId: null, yearsTitle: "" });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmModal({ isOpen: false, yearsId: null, yearsTitle: "" });
  };

  // New handler functions for additional actions
  const handleView = (item) => {
    // Open article in a new tab or modal for viewing
    if (item.slug) {
      window.open(`/news-years/${item.slug}`, '_blank');
    } else {
      toast.info("Article preview not available - no slug found");
    }
  };



  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Generate slug from title if not provided
      const submitData = {
        year: formData.year,
        slug: formData.slug || formData.year.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        status: formData.status
      };


      console.log('Submitting data:', submitData);

      let response;
      if (formMode === "edit") {
        response = await fetch(`${API_BASE_URL}/api/news-years/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/api/news-years`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        });
      }

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        toast.error(`Failed to save: ${errorData.error || 'Unknown error'}`);
        return;
      }

      const result = await response.json();
      console.log('Success response:', result);

      setFormMode(null);
      setEditId(null);
      setFormData({
        title: "",
        slug: "",
        subtitle: "",
        content: "",
        category: "General",
        tags: [],
        author: "",
        gallery: [],
        videoUrl: "",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: [],
        status: "draft",
        featured: false,
        views: 0
      });

      toast.success(formMode === "edit" ? "Article updated successfully!" : "Article created successfully!");
      fetchyears();
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(`Failed to save. Error: ${error.message}`);
    }
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    setEditId(item._id);

    setFormData({
      year: item.year || "",
      slug: item.slug || "",
      status: item.status || "active"
    });
  };


  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(years.map(item => item.status).filter(Boolean))];
    return statuses.sort();
  }, [years]);


  // Define table columns for Common DataGrid
  const columns = [
    // Title column
    {
      field: 'year',
      headerName: 'Year',
      width: 180,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="fw-medium text-truncate" style={{ maxWidth: '180px' }} title={params.value}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },

    // Content column
    {
      field: '_id',
      headerName: 'ID',
      width: 180,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="text-muted text-truncate" style={{ maxWidth: '180px' }} title={params.value}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },

    // Created At column
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 120,
      renderCell: (params) => {
        const date = new Date(params.value);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;
        const formattedTime = date.toLocaleTimeString(); 
        return (
          <span className="small text-muted">
            {formattedDate}, {formattedTime}
          </span>
        );
      },
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
            onClick={() => setViewModal({ isOpen: true, article: params.row })}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#e0f2fe',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }}
            title="View Details"
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
            onClick={() => handleDeleteClick(params.row._id, params.row.year)}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#fee2e2',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }}
            title="Delete Year"
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
        title="Delete"
        message={`Are you sure you want to delete "${confirmModal.yearsTitle}"? This action cannot be undone.`}
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
                  placeholder="Search year..."
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
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setStatusDropdownOpen(false);
                    }}
                    onMouseDown={() => setStatusDropdownOpen(!statusDropdownOpen)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Status</option>
                    {uniqueStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  <span className={`${styles.dropdownIcon} ${statusDropdownOpen ? styles.rotatedIcon : ''}`}>
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
              <span className={styles.buttonTextFull}>Add</span>
            </button>
          </div>
        </div>
      </div>


      {/* Enhanced Data Table */}
      <CommonDataGrid
        data={years}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 15, 20, 50]}
        initialPageSize={10}
        noDataMessage="No articles found"
        noDataDescription={
          searchTerm || statusFilter !== "all" || authorFilter !== "all"
            ? "Try adjusting your search criteria or filters."
            : "Get started by creating your first article."
        }
        noDataAction={
          (!searchTerm && statusFilter === "all" && authorFilter === "all") ? {
            onClick: () => setFormMode("add"),
            text: "Create First Article"
          } : null
        }
        loadingMessage="Loading articles..."
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
            title: "",
            slug: "",
            subtitle: "",
            content: "",
            category: "General",
            tags: [],
            author: "",
            gallery: [],
            videoUrl: "",
            metaTitle: "",
            metaDescription: "",
            metaKeywords: [],
            status: "draft",
            featured: false,
            views: 0
          });
        }}
        title={formMode === "edit" ? "Edit Article" : "Create New Article"}
      >

        {/* Enhanced Modal Content */}
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
            {/* Basic Information Section */}
            <div className={styles.formSection}>


              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Year<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="Enter a compelling title..."
                    required
                  />
                </div>

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
                    year: "",
                    slug: "",
                    status: "active"
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

                {formMode === "edit" ? "Update Year" : "Create Year"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* View Article Modal */}
      <Modal
        isOpen={viewModal.article}
        onClose={() => setViewModal({ isOpen: false, article: null })}
        title="View Details"
      >
        {viewModal.isOpen && (
          <div className={styles.viewModalContent}>
            <div className={styles.viewSection}>
              <div className={styles.viewSectionHeader}>
                <h3 className={styles.viewSectionTitle}>View Year</h3>
              </div>

              <div className={styles.viewGrid}>
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>ID</label>
                  <div className={styles.viewValue}>{viewModal.article._id}</div>
                </div>

                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Year</label>
                  <div className={styles.viewValue}>{viewModal.article.year || 'N/A'}</div>
                </div>
              </div>

              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Created</label>
                <div
                  className={`${styles.viewValue} viewRichContent`} style={{
                    padding: '0.75rem',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    lineHeight: '1.5',
                    wordWrap: 'break-word'
                  }}
                >{new Date(viewModal.article.createdAt).toLocaleString()}</div>
              </div>

            </div>

          </div>
        )}
      </Modal>
    </div>
  );
}






// export default function NewsCategoryList() {
//   const [years, setYears] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [formMode, setFormMode] = useState("add"); // add | edit
//   const [editId, setEditId] = useState(null);

//   const [formYear, setFormYear] = useState("");

//   const [viewModal, setViewModal] = useState({
//     isOpen: false,
//     data: null
//   });

//   const [confirmModal, setConfirmModal] = useState({
//     isOpen: false,
//     yearId: null
//   });

//   // Fetch years list
//   useEffect(() => {
//     fetchYears();
//   }, []);

//   const fetchYears = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE_URL}/api/years`);
//       const data = await res.json();
//       setYears(data.data || []);
//     } catch (err) {
//       toast.error("Failed to fetch years");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------
//   // CREATE + UPDATE HANDLER
//   // --------------------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = { year: formYear };

//     try {
//       let response;

//       if (formMode === "edit") {
//         response = await fetch(`${API_BASE_URL}/api/years/${editId}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//       } else {
//         response = await fetch(`${API_BASE_URL}/api/years`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//       }

//       if (!response.ok) throw new Error("Unable to save");

//       toast.success(formMode === "edit" ? "Year updated!" : "Year added!");
//       setModalOpen(false);
//       setEditId(null);
//       setFormYear("");
//       fetchYears();
//     } catch (err) {
//       toast.error("Failed to save");
//     }
//   };

//   // --------------------------
//   // DELETE
//   // --------------------------
//   const handleDelete = async () => {
//     try {
//       await fetch(`${API_BASE_URL}/api/years/${confirmModal.yearId}`, {
//         method: "DELETE"
//       });

//       toast.success("Year deleted!");
//       fetchYears();
//     } catch (err) {
//       toast.error("Failed to delete");
//     } finally {
//       setConfirmModal({ isOpen: false, yearId: null });
//     }
//   };

//   // --------------------------
//   // EDIT
//   // --------------------------
//   const handleEdit = (row) => {
//     setFormMode("edit");
//     setEditId(row._id);
//     setFormYear(row.year);
//     setModalOpen(true);
//   };

//   // --------------------------
//   // VIEW
//   // --------------------------
//   const handleView = (row) => {
//     setViewModal({ isOpen: true, data: row });
//   };

//   // --------------------------
//   // DataGrid Columns
//   // --------------------------
//   const columns = [
//     {
//       field: 'year',
//       headerName: 'Year',
//       width: 150
//     },
//     {
//       field: '_id',
//       headerName: 'ID',
//       width: 220
//     },
//     {
//       field: 'createdAt',
//       headerName: 'Created',
//       width: 150,
//       renderCell: (p) => new Date(p.value).toLocaleDateString()
//     },
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       width: 250,
//       renderCell: (params) => (
//         <div className="d-flex gap-2">
//           <button className="btn btn-sm btn-info"
//             onClick={() => handleView(params.row)}
//           >View</button>

//           <button className="btn btn-sm btn-primary"
//             onClick={() => handleEdit(params.row)}
//           >Edit</button>

//           <button className="btn btn-sm btn-danger"
//             onClick={() => setConfirmModal({ isOpen: true, yearId: params.row._id })}
//           >Delete</button>
//         </div>
//       )
//     }
//   ];

//   return (
//     <div className="container-fluid p-0">

//       <ToastContainer />

//       <div className="d-flex justify-content-between mb-3">
//         <h2>Years List</h2>
//         <button
//           className="btn btn-success"
//           onClick={() => { setModalOpen(true); setFormMode("add"); setFormYear(""); }}
//         >
//           + Add Year
//         </button>
//       </div>

//       {/* DataGrid */}
//       <CommonDataGrid
//         rows={years}
//         columns={columns}
//         loading={loading}
//         getRowId={(row) => row._id}
//       />

//       {/* Add/Edit Modal */}
//       {modalOpen && (
//         <div className={styles.modalOverlay}>
//           <div className={styles.modalContainer}>
//             <h3>{formMode === "edit" ? "Edit Year" : "Add Year"}</h3>

//             <form onSubmit={handleSubmit}>
//               <label>Year</label>
//               <input
//                 type="text"
//                 className="form-control mb-3"
//                 value={formYear}
//                 onChange={(e) => setFormYear(e.target.value)}
//                 required
//               />

//               <button type="submit" className="btn btn-primary">
//                 Save
//               </button>

//               <button
//                 type="button"
//                 className="btn btn-secondary ms-2"
//                 onClick={() => setModalOpen(false)}
//               >
//                 Cancel
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* View Modal */}
//       {viewModal.isOpen && (
//         <div className={styles.modalOverlay}>
//           <div className={styles.modalContainer}>
//             <h3>View Year</h3>

//             <p><strong>ID:</strong> {viewModal.data._id}</p>
//             <p><strong>Year:</strong> {viewModal.data.year}</p>
//             <p><strong>Created:</strong> {new Date(viewModal.data.createdAt).toLocaleString()}</p>

//             <button
//               className="btn btn-secondary"
//               onClick={() => setViewModal({ isOpen: false, data: null })}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation */}
//       <ConfirmationModal
//         isOpen={confirmModal.isOpen}
//         title="Delete Year"
//         message="Are you sure you want to delete this year?"
//         onConfirm={handleDelete}
//         onClose={() => setConfirmModal({ isOpen: false, yearId: null })}
//       />
//     </div>
//   );
// }
