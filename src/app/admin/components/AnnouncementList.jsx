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

const editorConfiguration = {
  height: 300,
};

const Modal = ({ isOpen, onClose, title, children, headerAction }) => {
  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalIcon}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m0 0V8m0 4H7m5 4h6m0 0v-4m0 0h2l1 5h-2l-2 4v-5h-4M7 12H5a2 2 0 01-2-2V9a2 2 0 012-2h3.5L10 4h4l.5 3H19a2 2 0 012 2v1" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit")
                  ? "Update announcement details"
                  : "Create a new announcement"}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {headerAction}
            <button onClick={onClose} className={styles.modalCloseBtn} aria-label="Close modal">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
};

const initialFormState = {
  title: "",
  shortTitle: "",
  icon: "",
  content: "",
  category: "",
  startDate: "",
  endDate: "",
  link: "",
  location: "",
  image: "",
  announcement_year_id: "",
  isPublished: true,
};

const initialImageFormState = {
  title: "",
  short_description: "",
  description: "",
  file: null,
  preview: "",
};

const getImageUrl = (path = "") => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
};

export default function AnnouncementList() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, title: "" });
  const [viewModal, setViewModal] = useState({ isOpen: false, entry: null });
  const [years, setYears] = useState([]);
  const [imageManager, setImageManager] = useState({
    isOpen: false,
    announcement: null,
    images: [],
    loading: false,
  });
  const [imageForm, setImageForm] = useState(initialImageFormState);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageDeleteModal, setImageDeleteModal] = useState({ isOpen: false, id: null, title: "" });
  const [showImageUploadForm, setShowImageUploadForm] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
    fetchYears();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/announcements`);
      if (!response.ok) throw new Error("Failed to fetch announcements");
      const data = await response.json();
      setAnnouncements(data.data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncementImages = async (announcementId) => {
    if (!announcementId) return;
    try {
      setImageManager((prev) => ({ ...prev, loading: true }));
      const response = await fetch(
        `${API_BASE_URL}/api/announcement-images?announcement_id=${announcementId}`
      );
      if (!response.ok) throw new Error("Failed to fetch announcement images");
      const result = await response.json();
      setImageManager((prev) => ({
        ...prev,
        images: Array.isArray(result.data) ? result.data : [],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.message);
      setImageManager((prev) => ({ ...prev, loading: false }));
    }
  };

  const openImageManager = (announcement) => {
    if (!announcement?._id) return;
    setImageManager({
      isOpen: true,
      announcement,
      images: [],
      loading: true,
    });
    setImageForm(initialImageFormState);
    setShowImageUploadForm(false);
    fetchAnnouncementImages(announcement._id);
  };

  const closeImageManager = () => {
    setImageManager({
      isOpen: false,
      announcement: null,
      images: [],
      loading: false,
    });
    setImageForm(initialImageFormState);
    setShowImageUploadForm(false);
  };

  const handleImageFieldChange = (field, value) => {
    setImageForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageForm((prev) => ({
      ...prev,
      file,
      preview: file ? URL.createObjectURL(file) : "",
    }));
  };

  const handleImageUploadSubmit = async (event) => {
    event.preventDefault();
    if (!imageManager.announcement?._id) {
      toast.error("Announcement not selected");
      return;
    }
    if (!imageForm.file) {
      toast.error("Please choose an image to upload");
      return;
    }
    try {
      setImageUploading(true);
      const payload = new FormData();
      payload.append("announcement_id", imageManager.announcement._id);
      payload.append("title", imageForm.title);
      payload.append("short_description", imageForm.short_description);
      payload.append("description", imageForm.description);
      payload.append("image", imageForm.file);

      const response = await fetch(`${API_BASE_URL}/api/announcement-images`, {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to upload image");
      }

      toast.success("Announcement image uploaded");
      setImageForm(initialImageFormState);
      setShowImageUploadForm(false);
      fetchAnnouncementImages(imageManager.announcement._id);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageDeleteClick = (image) => {
    setImageDeleteModal({
      isOpen: true,
      id: image?._id || null,
      title: image?.title || "Selected image",
    });
  };

  const handleImageDeleteConfirm = async () => {
    if (!imageDeleteModal.id) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/announcement-images/${imageDeleteModal.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete announcement image");
      }
      toast.success("Announcement image deleted");
      setImageDeleteModal({ isOpen: false, id: null, title: "" });
      if (imageManager.announcement?._id) {
        fetchAnnouncementImages(imageManager.announcement._id);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openAddForm = () => {
    setFormMode("add");
    setFormData(initialFormState);
    setImageFile(null);
    setImagePreview("");
  };

  const handleEdit = (entry) => {
    setFormMode("edit");
    setEditId(entry._id);
    const yearField = entry?.announcement_year_id;
    const announcementYearId =
      typeof yearField === "object" && yearField !== null
        ? yearField._id || yearField.id || ""
        : yearField || "";

    setFormData({
      title: entry.title || "",
      shortTitle: entry.shortTitle || "",
      icon: entry.icon || "",
      content: entry.content || "",
      category: entry.category || "",
      startDate: entry.startDate ? entry.startDate.split("T")[0] : "",
      endDate: entry.endDate ? entry.endDate.split("T")[0] : "",
      link: entry.link || "",
      location: entry.location || "",
      image: entry.image || "",
      announcement_year_id: announcementYearId,
      isPublished: entry.isPublished ?? true,
    });
    setImageFile(null);
    setImagePreview(getImageUrl(entry.image));
  };

  const resetForm = () => {
    setFormMode(null);
    setEditId(null);
    setFormData(initialFormState);
    setImageFile(null);
    setImagePreview("");
  };

  const buildPayload = () => {
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "image") return;
      payload.append(key, value ?? "");
    });
    if (imageFile) {
      payload.append("image", imageFile);
    } else if (formData.image) {
      payload.append("image", formData.image);
    }
    return payload;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formMode === "add" && !imageFile) {
      toast.error("Announcement image is required");
      return;
    }
    if (!formData.announcement_year_id) {
      toast.error("Announcement year is required");
      return;
    }
    try {
      const payload = buildPayload();
      const url =
        formMode === "edit"
          ? `${API_BASE_URL}/api/announcements/${editId}`
          : `${API_BASE_URL}/api/announcements`;
      const method = formMode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, { method, body: payload });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save announcement");
      }

      toast.success(`Announcement ${formMode === "edit" ? "updated" : "created"} successfully`);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/announcements/${confirmModal.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete announcement");
      }
      toast.success("Announcement deleted successfully");
      setConfirmModal({ isOpen: false, id: null, title: "" });
      fetchAnnouncements();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStatusToggle = async (entry) => {
    try {
      const payload = new FormData();
      payload.append("isPublished", entry.isPublished ? "false" : "true");
      const response = await fetch(`${API_BASE_URL}/api/announcements/${entry._id}`, {
        method: "PUT",
        body: payload,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }
      toast.success("Announcement status updated");
      fetchAnnouncements();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const matchesSearch =
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shortTitle?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && item.isPublished) ||
        (statusFilter === "draft" && !item.isPublished);
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [announcements, searchTerm, statusFilter, categoryFilter]);

  const categoryOptions = useMemo(() => {
    return Array.from(new Set(announcements.map((item) => item.category).filter(Boolean)));
  }, [announcements]);

  const gridData = filteredAnnouncements.map((item, index) => ({
    ...item,
    id: item._id,
    srNo: index + 1,
  }));

  const columns = [
    {
      field: "title",
      headerName: "Title",
      width: 220,
      renderCell: (params) => (
        <Tooltip content={params.row.title}>
          <div className=" text-truncate" style={{ maxWidth: "200px" }}>
            {params.row.title || "—"}
          </div>
        </Tooltip>
      ),
    },

    {
      field: "category",
      headerName: "Category",
      width: 140,
      renderCell: (params) => (
        <span className="badge bg-light text-dark text-capitalize">
          {params.row.category || "general"}
        </span>
      ),
    },
    {
      field: "announcement_year_label",
      headerName: "Year",
      width: 100,
      renderCell: (params) => (
        <span className="badge bg-light text-dark">
          {params.row.announcement_year_label || "—"}
        </span>
      ),
    },
    {
      field: "manageImages",
      headerName: "Images",
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <button
          onClick={() => openImageManager(params.row)}
          className="btn btn-sm d-flex align-items-center justify-content-center"
          style={{
            width: "32px",
            height: "32px",
            backgroundColor: "#e0f2fe",
            border: "none",
            borderRadius: "6px",
            padding: 0,
          }}
          title="Manage announcement images"
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#bae6fd")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e0f2fe")}
        >
          <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m0 0l3-3m-3 3v4H4a2 2 0 01-2-2V6a2 2 0 012-2h12"
            />
          </svg>
        </button>
      ),
    },
    {
      field: "Date",
      headerName: "date",
      width: 140,
      renderCell: (params) => (
        <span className="small text-muted">
          {params.row.date ? new Date(params.row.date).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      field: "isPublished",
      headerName: "Status",
      width: 140,
      renderCell: (params) => (
        <button
          className={`badge ${params.row.isPublished ? "bg-success" : "bg-secondary"}`}
          style={{ border: "none", cursor: "pointer" }}
          onClick={() => handleStatusToggle(params.row)}
        >
          {params.row.isPublished ? "Published" : "Draft"}
        </button>
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

  const imageColumns = [
    {
      field: "title",
      headerName: "Title",
      width: 350,
      renderCell: (params) => (
        <Tooltip content={params.row.title}>
          <div className=" text-truncate" style={{ maxWidth: "350px" }}>
            {params.row.title || "—"}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "Image",
      headerName: "Image",
      width: 120,
      renderCell: (params) => {
        const imgUrl = getImageUrl(params.row.image);

        return (
          <Tooltip content={imgUrl}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {params.row.image ? (
                <img
                  src={imgUrl}
                  alt="Announcement"
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                  }}
                />
              ) : (
                <span>—</span>
              )}
            </div>
          </Tooltip>
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

          {/* <button
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
          </button> */}

          {/* Delete Button */}
          <button
            onClick={() => handleImageDeleteClick(params.row)}
            // onClick={() =>
            //   setConfirmModal({ isOpen: true, id: params.row._id, title: params.row.title })
            // }
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

  const fetchYears = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/announcement-years`);
      if (!res.ok) throw new Error("Failed to fetch announcement years");

      const data = await res.json();
      setYears(data.data || []);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const yearOptions = useMemo(() => {
    return years.map((y) => ({
      id: y._id,
      year: y.year
    }));
  }, [years]);

  console.log('announcements', announcements);
  return (
    <div style={{ width: "100%" }}>
      <ToastContainer position="top-right" autoClose={4000} />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, title: "" })}
        onConfirm={handleDeleteConfirm}
        title="Delete Announcement"
        message={`Are you sure you want to delete "${confirmModal.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <ConfirmationModal
        isOpen={imageDeleteModal.isOpen}
        onClose={() => setImageDeleteModal({ isOpen: false, id: null, title: "" })}
        onConfirm={handleImageDeleteConfirm}
        title="Delete Announcement Image"
        message={`Are you sure you want to delete "${imageDeleteModal.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, entry: null })}
        title="Announcement Details"
      >
        {viewModal.entry && (
          <div className={styles.viewModalContent}>
            <div className={styles.viewSection}>
              <div className={styles.viewSectionHeader}>
                <h3 className={styles.viewSectionTitle}>{viewModal.entry.title}</h3>
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Short Title</label>
                <div className={styles.viewValue}>{viewModal.entry.shortTitle || "—"}</div>
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Announcement Year</label>
                <div className={styles.viewValue}>
                  {viewModal.entry?.announcement_year_label ||
                    viewModal.entry?.announcement_year_id?.year ||
                    "—"}
                </div>
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Category</label>
                <div className={styles.viewValue}>{viewModal.entry.category || "—"}</div>
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Date Range</label>
                <div className={styles.viewValue}>
                  {viewModal.entry.startDate
                    ? new Date(viewModal.entry.startDate).toLocaleDateString()
                    : "—"}
                  {" "}-{" "}
                  {viewModal.entry.endDate
                    ? new Date(viewModal.entry.endDate).toLocaleDateString()
                    : "—"}
                </div>
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Location</label>
                <div className={styles.viewValue}>{viewModal.entry.location || "—"}</div>
              </div>
              {viewModal.entry.image && (
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Image</label>
                  <div className={styles.imagePreview}>
                    <img src={getImageUrl(viewModal.entry.image)} alt="Announcement" />
                  </div>
                </div>
              )}
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Content</label>
                <div
                  className={styles.viewValue}
                  dangerouslySetInnerHTML={{ __html: viewModal.entry.content || "—" }}
                />
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Link</label>
                <div className={styles.viewValue}>
                  {viewModal.entry.link ? (
                    <a href={viewModal.entry.link} target="_blank" rel="noreferrer">
                      {viewModal.entry.link}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={imageManager.isOpen}
        onClose={closeImageManager}
        title={`Manage Announcement Images${imageManager.announcement ? ` - ${imageManager.announcement.title}` : ""
          }`}
      >
        <div className={styles.modalFormContent}>
          {showImageUploadForm && (
            <form onSubmit={handleImageUploadSubmit} className={styles.formContainer} style={{ marginBottom: "2rem" }}>
              <div className={styles.formSection}>
                <div className={styles.formSectionHeader}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem"
                    }}
                  >
                    <div>
                      <h3 className={styles.formSectionTitle} style={{ margin: 0 }}>
                        Upload New Image
                      </h3>
                      <p className={styles.formSectionDescription} style={{ margin: 0 }}>
                        Add supporting images for this announcement
                      </p>
                    </div>

                    {/* <button
                      type="button"
                      onClick={() => {
                        setImageForm(initialImageFormState);
                        setShowImageUploadForm(false);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "22px",
                        fontWeight: "600",
                        cursor: "pointer",
                        color: "#444",
                        marginLeft: "1rem",
                        marginTop: "-10px"
                      }}
                      title="Close"
                    >
                      ×
                    </button> */}
                  </div>
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Title</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={imageForm.title}
                    onChange={(e) => handleImageFieldChange("title", e.target.value)}
                    placeholder="Enter title"
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Image <span className={styles.required}>*</span>
                  </label>
                  <div
                    style={{
                      border: "1px dashed #cbd5f5",
                      padding: "1rem",
                      borderRadius: "8px",
                      background: "#f8fafc",
                      textAlign: "center",
                    }}
                  >
                    <input
                      type="file"
                      id="announcement-support-image"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageFileChange}
                    />
                    <label
                      htmlFor="announcement-support-image"
                      style={{
                        display: "inline-flex",
                        gap: "0.5rem",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#2563eb",
                        fontWeight: 600,
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Select image</span>
                    </label>
                  </div>
                  {imageForm.preview && (
                    <div style={{ marginTop: "1rem" }}>
                      <div
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          overflow: "hidden",
                          maxHeight: "220px",
                        }}
                      >
                        <img src={imageForm.preview} alt="Preview" />
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.formCancelBtn}
                    onClick={() => {
                      setImageForm(initialImageFormState);
                      setShowImageUploadForm(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.formSubmitBtn} disabled={imageUploading}>
                    {imageUploading ? "Uploading..." : "Upload Image"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Show List section ONLY when Add New is NOT open */}
          {!showImageUploadForm && (
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div>
                    <h3 className={styles.formSectionTitle}>Announcement Images</h3>
                    <p className={styles.formSectionDescription}>
                      Manage uploaded images for this announcement
                    </p>
                  </div>

                  <button
                    onClick={() => setShowImageUploadForm(true)}
                    className={styles.addButton}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "8px 16px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "14px",
                      cursor: "pointer",
                      height: "fit-content",
                    }}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v12m6-6H6"
                      />
                    </svg>
                    <span>Add New</span>
                  </button>
                </div>
              </div>

              {imageManager.loading ? (
                <p className="text-muted mb-0">Loading images...</p>
              ) : (
                <CommonDataGrid
                  data={imageManager.images.map((img, index) => ({
                    ...img,
                    id: img._id,
                    srNo: index + 1,
                  }))}
                  columns={imageColumns}
                  loading={imageManager.loading}
                  pageSizeOptions={[5, 10, 15, 20]}
                  initialPageSize={10}
                  noDataMessage="No images uploaded yet"
                  noDataDescription="Click 'Add New' to upload your first image"
                  loadingMessage="Loading images..."
                  showSerialNumber={false}
                />
              )}
            </div>
          )}


          {/* <div className={styles.formSection}>
            <div className={styles.formSectionHeader}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <div>
                  <h3 className={styles.formSectionTitle}>Announcement Images</h3>
                  <p className={styles.formSectionDescription}>
                    Manage uploaded images for this announcement
                  </p>
                </div>
                <button
                  onClick={() => setShowImageUploadForm(true)}
                  className={styles.addButton}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "8px 16px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "14px",
                    cursor: "pointer",
                    height: "fit-content",
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                  </svg>
                  <span>Add New</span>
                </button>
              </div>
            </div>

            {imageManager.loading ? (
              <p className="text-muted mb-0">Loading images...</p>
            ) : (
              <CommonDataGrid
                data={imageManager.images.map((img, index) => ({
                  ...img,
                  id: img._id,
                  srNo: index + 1,
                }))}
                columns={[
                  {
                    field: "srNo",
                    headerName: "Sr. No.",
                    width: 100,
                  },
                  {
                    field: "image",
                    headerName: "Image",
                    width: 200,
                    renderCell: (params) => (
                      params.row.image ? (
                        <div style={{ padding: "0.5rem" }}>
                          <img
                            src={getImageUrl(params.row.image)}
                            alt={params.row.title || "Announcement image"}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid #e5e7eb",
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-muted">No image</span>
                      )
                    ),
                  },
                  {
                    field: "title",
                    headerName: "Title",
                    width: 200,
                    renderCell: (params) => (
                      <Tooltip content={params.row.title || "Untitled"}>
                        <div className="text-truncate" style={{ maxWidth: "180px" }}>
                          {params.row.title || "Untitled"}
                        </div>
                      </Tooltip>
                    ),
                  },
                  {
                    field: "short_description",
                    headerName: "Short Description",
                    width: 250,
                    renderCell: (params) => (
                      <Tooltip content={params.row.short_description || "—"}>
                        <div className="text-truncate text-muted" style={{ maxWidth: "230px" }}>
                          {params.row.short_description || "—"}
                        </div>
                      </Tooltip>
                    ),
                  },
                  {
                    field: "description",
                    headerName: "Description",
                    width: 300,
                    renderCell: (params) => (
                      <Tooltip content={params.row.description || "—"}>
                        <div className="text-truncate text-muted" style={{ maxWidth: "280px" }}>
                          {params.row.description || "—"}
                        </div>
                      </Tooltip>
                    ),
                  },
                  {
                    field: "createdAt",
                    headerName: "Created At",
                    width: 150,
                    renderCell: (params) => (
                      <span className="small text-muted">
                        {params.row.createdAt
                          ? new Date(params.row.createdAt).toLocaleDateString()
                          : "—"}
                      </span>
                    ),
                  },
                  {
                    field: "actions",
                    headerName: "Actions",
                    width: 120,
                    sortable: false,
                    filterable: false,
                    align: "center",
                    headerAlign: "center",
                    renderCell: (params) => (
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <button
                          onClick={() => handleImageDeleteClick(params.row)}
                          className="btn btn-sm d-flex align-items-center justify-content-center"
                          style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor: "#fee2e2",
                            border: "none",
                            borderRadius: "6px",
                            padding: 0,
                          }}
                          title="Delete Image"
                          onMouseEnter={(e) => (e.target.style.backgroundColor = "#fecaca")}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = "#fee2e2")}
                        >
                          <svg width="16" height="16" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ),
                  },
                ]}
                loading={imageManager.loading}
                pageSizeOptions={[5, 10, 15, 20]}
                initialPageSize={10}
                noDataMessage="No images uploaded yet"
                noDataDescription="Click 'Add New' to upload your first image"
                loadingMessage="Loading images..."
                showSerialNumber={false}
              />
            )}
          </div> */}
        </div>
      </Modal>

      <Modal
        isOpen={!!formMode}
        onClose={resetForm}
        title={formMode === "edit" ? "Edit Announcement" : "Create Announcement"}
      >
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Announcement Details</h3>
              </div>

              <div className={styles.formGrid}>
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
                  <label className={styles.formLabel}>Location</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Date</label>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Announcement Year *</label>
                  <select
                    className="form-control"
                    value={formData.announcement_year_id}
                    onChange={(e) =>
                      setFormData({ ...formData, announcement_year_id: e.target.value })
                    }
                  >
                    <option value="">Select Year</option>
                    {yearOptions.map((y) => (
                      <option key={y.id} value={y.id}>{y.year}</option>
                    ))}
                  </select>
                </div>

              </div>
              <div className={styles.formGrid}>
        
              <div className={styles.formField}>
                <label className={styles.formLabel}>Link</label>
                <input
                  type="url"
                  className={styles.formInput}
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

             </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Content</label>
                <div style={{ minHeight: "300px" }}>
                  <CKEditorWrapper
                    data={formData.content || ""}
                    config={editorConfiguration}
                    onChange={(event, editor) => {
                      const data = editor?.getData ? editor.getData() : event.target.value;
                      setFormData({ ...formData, content: data });
                    }}
                  />
                </div>
                <small className={styles.formHelp}>
                  Use the toolbar above to format the announcement content. (Optional)
                </small>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Announcement Image {formMode === "add" && <span className={styles.required}>*</span>}
                </label>
                <div
                  style={{
                    border: "1px dashed #cbd5f5",
                    padding: "1rem",
                    borderRadius: "8px",
                    background: "#f8fafc",
                    textAlign: "center",
                  }}
                >
                  <input
                    type="file"
                    id="announcement-image-input"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <label
                    htmlFor="announcement-image-input"
                    style={{
                      display: "inline-flex",
                      gap: "0.5rem",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#2563eb",
                      fontWeight: 600,
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Select image</span>
                  </label>
                </div>
                {(imagePreview || formData.image) && (
                  <div style={{ marginTop: "1rem" }}>
                    <div
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        overflow: "hidden",
                        maxHeight: "220px",
                      }}
                    >
                      <img src={imagePreview || getImageUrl(formData.image)} alt="Announcement preview" />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setFormData({ ...formData, image: "" });
                        setImagePreview("");
                      }}
                      className={styles.formCancelBtn}
                      style={{ marginTop: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.formCancelBtn} onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className={styles.formSubmitBtn}>
                {formMode === "edit" ? "Update Announcement" : "Create Announcement"}
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
                  placeholder="Search announcements..."
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
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">All Categories</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
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
              <span className={styles.buttonTextFull}>Add Announcement</span>
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
        noDataMessage="No announcements found"
        noDataDescription={
          searchTerm || statusFilter !== "all" || categoryFilter !== "all"
            ? "Try changing your filters or search term."
            : "Create your first announcement entry."
        }
        noDataAction={
          (!searchTerm && statusFilter === "all" && categoryFilter === "all")
            ? { onClick: openAddForm, text: "Create Announcement" }
            : null
        }
        loadingMessage="Loading announcements..."
        showSerialNumber
        serialNumberField="srNo"
        serialNumberHeader="Sr.no."
        serialNumberWidth={80}
      />
    </div>
  );
}
