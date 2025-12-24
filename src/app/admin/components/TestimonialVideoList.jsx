'use client';

import React, { useState, useEffect, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonDataGrid, { Tooltip } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from "./NewsList.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const TESTIMONIAL_VIDEO_ENDPOINT = `${API_BASE_URL}/api/testimonial-categories/videos/all`;
const TESTIMONIAL_CATEGORY_ENDPOINT = `${API_BASE_URL}/api/testimonial-categories`;

const getImageUrl = (path = "") => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 4H20V6H4V4ZM4 9H20V11H4V9ZM4 14H20V16H4V14ZM4 19H20V21H4V19Z" fill="currentColor" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit") ? "Update video details" : "Create a new testimonial video"}
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

export default function TestimonialVideoList() {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState({
    category_id: "",
    title: "",
    video_url: "",
    description: "",
    status: "active",
    sortOrder: 0,
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    id: null,
    title: "",
    categoryId: null
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [categoryFilter]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(TESTIMONIAL_CATEGORY_ENDPOINT);
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const url = categoryFilter !== "all" 
        ? `${TESTIMONIAL_VIDEO_ENDPOINT}?category_id=${categoryFilter}`
        : TESTIMONIAL_VIDEO_ENDPOINT;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch videos");
      const data = await response.json();
      setVideos(data.data || []);
    } catch (err) {
      toast.error(`Failed to fetch videos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_id) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.title || !formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.video_url || !formData.video_url.trim()) {
      toast.error("Video URL is required");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("video_url", formData.video_url.trim());
      payload.append("description", formData.description || "");
      payload.append("status", formData.status);
      payload.append("sortOrder", formData.sortOrder || 0);

      if (thumbnailFile) {
        payload.append("thumbnail", thumbnailFile);
      }

      let url, method;
      if (formMode === "edit") {
        // Extract categoryId and videoId from editId (format: "categoryId_videoId")
        const [categoryId, videoId] = editId.split("_");
        url = `${TESTIMONIAL_CATEGORY_ENDPOINT}/${categoryId}/videos/${videoId}`;
        method = "PUT";
      } else {
        url = `${TESTIMONIAL_CATEGORY_ENDPOINT}/${formData.category_id}/videos`;
        method = "POST";
      }

      const response = await fetch(url, {
        method,
        body: payload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to save: ${errorData.message || 'Unknown error'}`);
        return;
      }

      toast.success(formMode === "edit" ? "Video updated successfully!" : "Video created successfully!");
      resetForm();
      fetchVideos();
    } catch (error) {
      toast.error(`Failed to save. Error: ${error.message}`);
    }
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    // Store as "categoryId_videoId" for nested update
    const categoryId = item.category_id?._id || item.category_id || "";
    const videoId = item._id;
    setEditId(`${categoryId}_${videoId}`);
    setFormData({
      category_id: categoryId,
      title: item.title || "",
      video_url: item.video_url || "",
      description: item.description || "",
      status: item.status || "active",
      sortOrder: item.sortOrder || 0,
    });
    setThumbnailPreview(item.thumbnail ? getImageUrl(item.thumbnail) : "");
    setThumbnailFile(null);
  };

  const openAddForm = () => {
    setFormMode("add");
    setEditId(null);
    setFormData({
      category_id: "",
      title: "",
      video_url: "",
      description: "",
      status: "active",
      sortOrder: 0,
    });
    setThumbnailFile(null);
    setThumbnailPreview("");
  };

  const resetForm = () => {
    setFormMode(null);
    setEditId(null);
    setFormData({
      category_id: "",
      title: "",
      video_url: "",
      description: "",
      status: "active",
      sortOrder: 0,
    });
    setThumbnailFile(null);
    setThumbnailPreview("");
  };

  const handleDeleteConfirm = async () => {
    if (!confirmModal.id || !confirmModal.categoryId) return;
    try {
      const response = await fetch(
        `${TESTIMONIAL_CATEGORY_ENDPOINT}/${confirmModal.categoryId}/videos/${confirmModal.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete");
      toast.success("Video deleted successfully!");
      setConfirmModal({ isOpen: false, id: null, title: "", categoryId: null });
      fetchVideos();
    } catch (error) {
      toast.error(`Failed to delete video: ${error.message}`);
    }
  };

  const filteredVideos = useMemo(() => {
    return videos.filter((item) => {
      const statusMatch = statusFilter === "all" || item.status === statusFilter;
      const categoryMatch = categoryFilter === "all" || 
        (item.category_id?._id || item.category_id || "") === categoryFilter;
      const searchMatch = searchTerm === "" ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.video_url?.toLowerCase().includes(searchTerm.toLowerCase());

      return statusMatch && categoryMatch && searchMatch;
    });
  }, [videos, statusFilter, categoryFilter, searchTerm]);

  const gridData = filteredVideos.map((item, index) => ({
    ...item,
    id: item._id,
    srNo: index + 1,
  }));

  const columns = [
    {
      field: "srNo",
      headerName: "Sr. No.",
      width: 100,
    },
    {
      field: "category",
      headerName: "Category",
      width: 200,
      renderCell: (params) => (
        <Tooltip content={params.row.category_title || "—"}>
          <div className="text-truncate" style={{ maxWidth: "180px" }}>
            {params.row.category_title || "—"}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "title",
      headerName: "Title",
      width: 250,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="fw-medium text-truncate" style={{ maxWidth: "230px" }}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "video_url",
      headerName: "Video URL",
      width: 300,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="text-truncate text-primary" style={{ maxWidth: "280px" }}>
            <a href={params.value} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              {params.value}
            </a>
          </div>
        </Tooltip>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <span
          style={{
            padding: "4px 12px",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: 600,
            backgroundColor: params.row.status === "active" ? "#d1fae5" : "#fee2e2",
            color: params.row.status === "active" ? "#065f46" : "#991b1b",
          }}
        >
          {params.row.status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      field: "sortOrder",
      headerName: "Sort Order",
      width: 120,
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
            onClick={() => handleEdit(params.row)}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#e0f2fe",
              border: "none",
              borderRadius: "6px",
              padding: 0
            }}
            title="Edit"
          >
            <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => setConfirmModal({ 
              isOpen: true, 
              id: params.row._id, 
              title: params.row.title,
              categoryId: params.row.category_id?._id || params.row.category_id || ""
            })}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#fee2e2",
              border: "none",
              borderRadius: "6px",
              padding: 0
            }}
            title="Delete"
          >
            <svg width="16" height="16" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: 0, padding: 0 }}>
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
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className={styles.searchClear} aria-label="Clear search">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className={styles.filterContainer}>
              <label className={styles.filterLabel}>Category</label>
              <select
                className={styles.filterSelect}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterContainer}>
              <label className={styles.filterLabel}>Status</label>
              <select
                className={styles.filterSelect}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className={styles.actionBarRight}>
            <button onClick={openAddForm} className={styles.addButton}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
              </svg>
              <span className={styles.buttonTextFull}>Add Video</span>
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
          pageSizeOptions={[5, 10, 15, 20, 50]}
          initialPageSize={10}
          noDataMessage="No videos found"
          loadingMessage="Loading videos..."
          showSerialNumber={true}
          serialNumberHeader="Sr No."
        />
      </div>

      <Modal isOpen={formMode !== null} onClose={resetForm} title={formMode === "edit" ? "Edit Video" : "Add Video"}>
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Basic Information</h3>
                <p className={styles.formSectionDescription}>Enter video details</p>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Category <span className={styles.required}>*</span></label>
                <select
                  className={styles.formSelect}
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Title <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  className={styles.formInput}
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter video title..."
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Video URL <span className={styles.required}>*</span></label>
                <input
                  type="url"
                  className={styles.formInput}
                  required
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
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
                  <label className={styles.formLabel}>Sort Order</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={resetForm} className={styles.formCancelBtn}>Cancel</button>
              <button type="submit" className={styles.formSubmitBtn}>
                {formMode === "edit" ? "Update Entry" : "Create Entry"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, title: "", categoryId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Video"
        message={`Are you sure you want to delete "${confirmModal.title}"? This action cannot be undone.`}
      />
    </div>
  );
}

