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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "${API_BASE_URL}";
const CALENDAR_ENDPOINT = `${API_BASE_URL}/api/academic-calendars`;

const editorConfiguration = {
  height: 200,
};

const initialFormState = {
  title: "",
  description: "",
  pdf: "",
  years: [],
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit") ? "Update the calendar entry" : "Create a new academic calendar"}
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

export default function AcademicCalendarsList() {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [pdfFile, setPdfFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [yearInput, setYearInput] = useState("");
  const [viewModal, setViewModal] = useState({ isOpen: false, entry: null });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, title: "" });

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    try {
      setLoading(true);
      const response = await fetch(CALENDAR_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch academic calendars");
      const data = await response.json();
      setCalendars(data.data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setFormMode("add");
    setFormData(initialFormState);
    setPdfFile(null);
    setEditId(null);
    setYearInput("");
  };

  const handleEdit = (entry) => {
    setFormMode("edit");
    setEditId(entry._id);
    setFormData({
      title: entry.title || "",
      description: entry.description || "",
      pdf: entry.pdf || "",
      years: Array.isArray(entry.years) ? entry.years : [],
    });
    setPdfFile(null);
    setYearInput("");
  };

  const resetForm = () => {
    setFormMode(null);
    setEditId(null);
    setFormData(initialFormState);
    setPdfFile(null);
    setYearInput("");
  };

  const addYear = () => {
    const value = yearInput.trim();
    if (!value) return;
    const parsed = Number(value);
    if (isNaN(parsed)) {
      toast.error("Enter a valid year");
      return;
    }
    if (formData.years.includes(parsed)) {
      toast.info("Year already added");
      return;
    }
    setFormData({ ...formData, years: [...formData.years, parsed] });
    setYearInput("");
  };

  const removeYear = (year) => {
    setFormData({ ...formData, years: formData.years.filter((y) => y !== year) });
  };

  const buildPayload = () => {
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description || "");
    if (formData.years.length) {
      formData.years.forEach((year) => payload.append("years", year));
    }
    if (pdfFile) {
      payload.append("pdf", pdfFile);
    } else if (formData.pdf) {
      payload.append("pdf", formData.pdf);
    }
    return payload;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formMode === "add" && !pdfFile) {
      toast.error("PDF is required");
      return;
    }
    try {
      const payload = buildPayload();
      const url = formMode === "edit" ? `${CALENDAR_ENDPOINT}/${editId}` : CALENDAR_ENDPOINT;
      const method = formMode === "edit" ? "PUT" : "POST";
      const response = await fetch(url, { method, body: payload });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save academic calendar");
      }
      toast.success(`Academic calendar ${formMode === "edit" ? "updated" : "created"} successfully`);
      resetForm();
      fetchCalendars();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${CALENDAR_ENDPOINT}/${confirmModal.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete academic calendar");
      }
      toast.success("Academic calendar deleted successfully");
      setConfirmModal({ isOpen: false, id: null, title: "" });
      fetchCalendars();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredCalendars = useMemo(() => {
    return calendars.filter((item) => {
      const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear =
        yearFilter === "all" || (Array.isArray(item.years) && item.years.includes(Number(yearFilter)));
      return matchesSearch && matchesYear;
    });
  }, [calendars, searchTerm, yearFilter]);

  const yearOptions = useMemo(() => {
    const set = new Set();
    calendars.forEach((calendar) => {
      (calendar.years || []).forEach((year) => set.add(year));
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [calendars]);

  const gridData = filteredCalendars.map((calendar, index) => ({
    ...calendar,
    id: calendar._id,
    srNo: index + 1,
  }));

  const columns = [
    {
      field: "title",
      headerName: "Title",
      width: 240,
      renderCell: (params) => (
        <Tooltip content={params.row.title}>
          <div className="text-truncate" style={{ maxWidth: "220px" }}>
            {params.row.title}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "years",
      headerName: "Years",
      width: 180,
      renderCell: (params) => (
        <span className="text-muted">
          {(params.row.years || []).length ? params.row.years.join(", ") : "—"}
        </span>
      ),
    },
    {
      field: "pdf",
      headerName: "PDF",
      width: 160,
      renderCell: (params) => (
        params.row.pdf ? (
          <a href={`${API_BASE_URL}${params?.row?.pdf}`} target="_blank" rel="noreferrer">
            Download
          </a>
        ) : (
          <span className="text-muted">—</span>
        )
      ),
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 160,
      renderCell: (params) => (
        <span className="small text-muted">
          {params.row.createdAt ? new Date(params.row.createdAt).toLocaleDateString() : "—"}
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
            title="View Banner Details"
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
            title="Edit Banner"
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
            title="Delete Banner"
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
      <ToastContainer position="top-right" autoClose={4000} />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, title: "" })}
        onConfirm={handleDeleteConfirm}
        title="Delete Academic Calendar"
        message={`Are you sure you want to delete "${confirmModal.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, entry: null })}
        title="Academic Calendar Details"
      >
        {viewModal.entry && (
          <div className={styles.viewModalContent}>
            <div className={styles.viewSection}>
              <div className={styles.viewSectionHeader}>
                <h3 className={styles.viewSectionTitle}>{viewModal.entry.title}</h3>
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Years</label>
                <div className={styles.viewValue}>
                  {(viewModal.entry.years || []).length ? viewModal.entry.years.join(", ") : "—"}
                </div>
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Description</label>
                <div
                  className={styles.viewValue}
                  dangerouslySetInnerHTML={{ __html: viewModal.entry.description || "—" }}
                />
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>PDF</label>
                <div className={styles.viewValue}>
                  {viewModal.entry.pdf ? (
                    <a href={`${API_BASE_URL}${viewModal?.entry?.pdf}`} target="_blank" rel="noreferrer">
                      Download file
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
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
        title={formMode === "edit" ? "Edit Academic Calendar" : "Create Academic Calendar"}
      >
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Calendar Details</h3>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Title <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Description</label>
                <CKEditorWrapper
                  data={formData.description || ""}
                  config={editorConfiguration}
                  onChange={(event, editor) => {
                    const data = editor?.getData ? editor.getData() : event.target.value;
                    setFormData({ ...formData, description: data });
                  }}
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Years</label>
                <div className={styles.yearInputGroup}>
                  <input
                    type="number"
                    className={styles.formInput}
                    placeholder="Add year (e.g. 2025)"
                    value={yearInput}
                    onChange={(e) => setYearInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addYear();
                      }
                    }}
                  />
                  <button type="button" className={styles.addButton} style={{ minWidth: "80px" }} onClick={addYear}>
                    Add
                  </button>
                </div>
                <div className={styles.yearChips}>
                  {formData.years.map((year) => (
                    <span key={year} className={styles.yearChip}>
                      {year}
                      <button type="button" onClick={() => removeYear(year)}>×</button>
                    </span>
                  ))}
                  {!formData.years.length && (
                    <span className="text-muted">No years added yet</span>
                  )}
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  PDF {formMode === "add" && <span className={styles.required}>*</span>}
                </label>
                <input
                  type="file"
                  className={styles.formInput}
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.type !== 'application/pdf') {
                      toast.error('Please select a PDF file');
                      return;
                    }
                    setPdfFile(file || null);
                  }}
                />
                {formData.pdf && !pdfFile && (
                  <p className={styles.formHelp}>
                    Current file:
                    <a href={`${API_BASE_URL}${formData?.pdf}`} target="_blank" rel="noreferrer" style={{ marginLeft: '0.5rem' }}>
                      View PDF
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.formCancelBtn} onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className={styles.formSubmitBtn}>
                {formMode === "edit" ? "Update Calendar" : "Create Calendar"}
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
                  placeholder="Search by title..."
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
            <div className={styles.filtersContainer}>
              <div className={styles.filterGroup}>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">All years</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className={styles.actionBarRight}>
            <button onClick={openAddForm} className={styles.addButton}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
              </svg>
              <span className={styles.buttonTextFull}>Add Academic Calendar</span>
              <span className={styles.buttonTextShort}>Add</span>
            </button>
          </div>
        </div>
      </div>

      <CommonDataGrid
        data={gridData}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 15, 20]}
        initialPageSize={10}
        noDataMessage="No academic calendars found"
        noDataDescription={
          searchTerm || yearFilter !== "all"
            ? "Try adjusting your search or year filter."
            : "Create your first academic calendar entry."
        }
        noDataAction={
          (!searchTerm && yearFilter === "all") ? { onClick: openAddForm, text: "Create Calendar" } : null
        }
        loadingMessage="Loading academic calendars..."
        showSerialNumber
        serialNumberField="srNo"
        serialNumberHeader="Sr.no."
        serialNumberWidth={80}
      />
    </div>
  );
}
