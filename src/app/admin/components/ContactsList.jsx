'use client';

import React, { useState, useEffect, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonDataGrid, { Tooltip } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from "./NewsList.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "${API_BASE_URL}";
const CONTACTS_ENDPOINT = `${API_BASE_URL}/api/contact`;

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalIcon}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>Full details of the contact request</p>
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

const STATUS_OPTIONS = [
  { value: "new", label: "New", color: "#0ea5e9" },
  { value: "in_progress", label: "In Progress", color: "#f97316" },
  { value: "resolved", label: "Resolved", color: "#22c55e" }
];

const getStatusMeta = (status = "new") =>
  STATUS_OPTIONS.find((opt) => opt.value === status) || STATUS_OPTIONS[0];

export default function ContactsList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewModal, setViewModal] = useState({ isOpen: false, entry: null });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, name: "" });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch(CONTACTS_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch contact requests");
      const data = await response.json();
      setContacts(data.data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (entry, nextStatus) => {
    try {
      const payload = new FormData();
      payload.append("status", nextStatus);
      const response = await fetch(`${CONTACTS_ENDPOINT}/${entry._id}`, {
        method: "PUT",
        body: payload,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }
      toast.success(`Status updated to ${getStatusMeta(nextStatus).label}`);
      fetchContacts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${CONTACTS_ENDPOINT}/${confirmModal.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete contact");
      }
      toast.success("Contact request deleted");
      setConfirmModal({ isOpen: false, id: null, name: "" });
      fetchContacts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch =
        contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchTerm, statusFilter]);

  const gridData = filteredContacts.map((contact, index) => ({
    ...contact,
    id: contact._id,
    srNo: index + 1,
  }));

  const columns = [
    {
      field: "firstName",
      headerName: "First Name",
      width: 200,
      renderCell: (params) => (
        <Tooltip content={params.row.firstName}>
          <div className="text-truncate" style={{ maxWidth: "180px" }}>
            {params.row.firstName}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 200,
      renderCell: (params) => (
        <Tooltip content={params.row.lastName}>
          <div className="text-truncate" style={{ maxWidth: "180px" }}>
            {params.row.lastName || "—"}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
      renderCell: (params) => (
        <span className="text-muted text-truncate" style={{ maxWidth: "200px" }}>
          {params.row.email}
        </span>
      ),
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 140,
    },


    {
      field: "createdAt",
      headerName: "Received",
      width: 150,
      renderCell: (params) => (
        <span className="small text-muted">
          {params.row.createdAt ? new Date(params.row.createdAt).toLocaleString() : "—"}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="d-flex gap-2">
          <button
            onClick={() => setViewModal({ isOpen: true, entry: params.row })}
            className="btn btn-light btn-sm"
          >
            <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
    <div style={{ width: "100%" }}>
      <ToastContainer position="top-right" autoClose={4000} />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, name: "" })}
        onConfirm={handleDeleteConfirm}
        title="Delete Contact Request"
        message={`Are you sure you want to delete the message from "${confirmModal.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, entry: null })}
        title="Contact Request Details"
      >
        {viewModal.entry && (
          <div className={styles.viewModalContent}>
            <div className={styles.viewSection}>
              <div className={styles.viewSectionHeader}>
                <h3 className={styles.viewSectionTitle}>Sender Information</h3>
              </div>
              <div className={styles.viewGrid}>
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>First Name</label>
                  <div className={styles.viewValue}>{viewModal.entry.firstName}</div>
                </div>
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Last Name</label>
                  <div className={styles.viewValue}>{viewModal.entry.lastName || "—"}</div>
                </div>
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Email</label>
                  <div className={styles.viewValue}>{viewModal.entry.email}</div>
                </div>
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Phone</label>
                  <div className={styles.viewValue}>{viewModal.entry.phone || "—"}</div>
                </div>
              </div>
              <div className={styles.viewGrid}>

                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Status</label>
                  <div className={styles.viewValue}>{getStatusMeta(viewModal.entry.status).label}</div>
                </div>
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Institute / Course</label>
                  <div className={styles.viewValue}>
                    {viewModal.entry.institute || "—"} {viewModal.entry.course ? `• ${viewModal.entry.course}` : ""}
                  </div>
                </div>
              </div>

              <div className={styles.viewGrid}>
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Message</label>
                  <div className={styles.viewValue} style={{ whiteSpace: "pre-line" }}>
                    {viewModal.entry.message || "—"}
                  </div>
                </div>
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Received On</label>
                  <div className={styles.viewValue}>
                    {viewModal.entry.createdAt ? new Date(viewModal.entry.createdAt).toLocaleString() : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
                  placeholder="Search contacts by name, email or phone"
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">All Status</option>
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CommonDataGrid
        data={gridData}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 15, 20]}
        initialPageSize={10}
        noDataMessage="No contact requests found"
        noDataDescription={
          searchTerm || statusFilter !== "all"
            ? "Try adjusting your filters or search query."
            : "New contact submissions will appear here."
        }
        loadingMessage="Loading contact requests..."
        showSerialNumber
        serialNumberField="srNo"
        serialNumberHeader="Sr.no."
        serialNumberWidth={80}
      />
    </div>
  );
}
