'use client';

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonDataGrid, { Tooltip } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from "./NewsList.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const COURSES_ENDPOINT = `${API_BASE_URL}/api/course`;

const CKEditorWrapper = dynamic(
  () => import("./CKEditorWrapper"),
  { ssr: false, loading: () => null }
);

const editorConfiguration = {
  height: 200,
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6m-2 7h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit") ? "Update course details" : "Create a new course"}
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

const initialFormState = {
  name: "",
  description: "",
  sortOrder: 0,
};

export default function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [editId, setEditId] = useState(null);
  const [viewModal, setViewModal] = useState({ isOpen: false, entry: null });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, name: "" });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(COURSES_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCourses(data.data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setFormMode("add");
    setFormData(initialFormState);
    setEditId(null);
  };

  const handleEdit = (entry) => {
    setFormMode("edit");
    setEditId(entry._id);
    setFormData({
      name: entry.name || "",
      description: entry.description || "",
      sortOrder: entry.sortOrder ?? 0,
    });
  };

  const resetForm = () => {
    setFormMode(null);
    setEditId(null);
    setFormData(initialFormState);
  };

  const buildPayload = () => {
    return {
      name: formData.name.trim(),
      description: formData.description.trim(),
      sortOrder: Number(formData.sortOrder) || 0,
    };
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      const payload = buildPayload();
      const url = formMode === "edit" ? `${COURSES_ENDPOINT}/${editId}` : COURSES_ENDPOINT;
      const method = formMode === "edit" ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("payload:", payload);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save course");
      }
      toast.success(`Course ${formMode === "edit" ? "updated" : "created"} successfully`);
      resetForm();
      fetchCourses();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${COURSES_ENDPOINT}/${confirmModal.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete course");
      }
      toast.success("Course deleted successfully");
      setConfirmModal({ isOpen: false, id: null, name: "" });
      fetchCourses();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const search = searchTerm.toLowerCase();
      return course.name?.toLowerCase().includes(search);
    });
  }, [courses, searchTerm]);

  const gridData = filteredCourses.map((course, index) => ({
    ...course,
    id: course._id,
    srNo: index + 1,
  }));

  const columns = [
    {
      field: "name",
      headerName: "Course Name",
      flex: 1,
      minWidth: 300,
      renderCell: (params) => (
        <Tooltip content={params.row.name}>
          <div className="text-truncate" style={{ maxWidth: "100%" }}>
            {params.row.name}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div className="d-flex gap-2">
          <button onClick={() => handleEdit(params.row)} className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#e0f2fe',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }} title="Edit"
            onMouseEnter={(e) => e.target.style.backgroundColor = '#bae6fd'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#e0f2fe'}
          >
            <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() =>
              setConfirmModal({ isOpen: true, id: params.row._id, name: params.row.name })
            }
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#fee2e2',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }} title="Delete"
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
    <div style={{ width: '100%', maxWidth: '100%', margin: 0, padding: 0 }}>
      <ToastContainer position="top-right" autoClose={4000} />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, name: "" })}
        onConfirm={handleDeleteConfirm}
        title="Delete Course"
        message={`Are you sure you want to delete "${confirmModal.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, entry: null })}
        title="Course Details"
      >
        {viewModal.entry && (
          <div className={styles.viewModalContent}>
            <div className={styles.viewSection}>
              <div className={styles.viewSectionHeader}>
                <h3 className={styles.viewSectionTitle}>Overview</h3>
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Name</label>
                <div className={styles.viewValue}>{viewModal.entry.name}</div>
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Description</label>
                <div
                  className={styles.viewValue}
                  dangerouslySetInnerHTML={{ __html: viewModal.entry.description || "—" }}
                />
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Sort Order</label>
                <div className={styles.viewValue}>{viewModal.entry.sortOrder ?? 0}</div>
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Created</label>
                <div className={styles.viewValue}>
                  {viewModal.entry.createdAt ? new Date(viewModal.entry.createdAt).toLocaleString() : "—"}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!formMode}
        onClose={resetForm}
        title={formMode === "edit" ? "Edit Course" : "Create Course"}
      >
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Course Details</h3>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.formCancelBtn} onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className={styles.formSubmitBtn}>
                {formMode === "edit" ? "Update Course" : "Create Course"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

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
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className={styles.searchClear}>
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
              <span className={styles.buttonTextFull}>Add Course</span>
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
          pageSizeOptions={[5, 10, 15, 20]}
          initialPageSize={10}
          noDataMessage="No courses found"
          noDataDescription={
            searchTerm
              ? "Try changing your search term."
              : "Start by creating your first course entry."
          }
          noDataAction={!searchTerm ? { onClick: openAddForm, text: "Create Course" } : null}
          loadingMessage="Loading courses..."
          showSerialNumber
          serialNumberField="srNo"
          serialNumberHeader="Sr.no."
          serialNumberWidth={80}
        />
      </div>
    </div>
  );
}
