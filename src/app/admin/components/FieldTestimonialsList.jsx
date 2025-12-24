'use client';

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonDataGrid, { Tooltip } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from "./CMSList.module.css";

const CKEditorWrapper = dynamic(() => import("./CKEditorWrapper"), {
  ssr: false,
  loading: () => null,
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const FIELD_TESTIMONIAL_ENDPOINT = `${API_BASE_URL}/api/field-testimonials`;

const initialFormState = {
  title: "",
  description: "",
  shortDescription: "",
  designation: "",
  videos: [],
  subTestimonials: [],
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
                <path d="M4 4H20V6H4V4ZM4 9H20V11H4V9ZM4 14H20V16H4V14ZM4 19H20V21H4V19Z"
                  fill="currentColor" />
              </svg>
            </div>

            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit") ? "Update testimonial entry" : "Create a new testimonial entry"}
              </p>
            </div>
          </div>

          <button onClick={onClose} className={styles.modalCloseBtn}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
};

export default function FieldTestimonialsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, title: "" });
  const [newVideo, setNewVideo] = useState("");
  const [subForm, setSubForm] = useState({
    title: "",
    shortDescription: "",
    designation: "",
    description: "",
  });
  const [subTestimonialManager, setSubTestimonialManager] = useState({
    isOpen: false,
    parentId: null,
    parentTitle: "",
    subTestimonials: [],
  });
  const [subTestimonialFormMode, setSubTestimonialFormMode] = useState(null);
  const [subTestimonialEditIndex, setSubTestimonialEditIndex] = useState(null);
  const [subTestimonialFormData, setSubTestimonialFormData] = useState({
    title: "",
    shortDescription: "",
    designation: "",
    faculty: "",
    description: "",
    videos: [],
  });
  const [videoManager, setVideoManager] = useState({
    isOpen: false,
    parentId: null,
    parentTitle: "",
    videos: [],
  });
  const [videoFormMode, setVideoFormMode] = useState(null);
  const [videoEditIndex, setVideoEditIndex] = useState(null);
  const [videoFormUrl, setVideoFormUrl] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(FIELD_TESTIMONIAL_ENDPOINT);
      const data = await res.json();
      setItems(data.data || []);
    } catch (err) {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const match =
        searchTerm === "" ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.designation?.toLowerCase().includes(searchTerm.toLowerCase());
      return match;
    });
  }, [items, searchTerm]);

  const columns = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="fw-medium text-truncate" style={{ maxWidth: "100%" }}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "subTestimonials",
      headerName: "Sub Testimonials",
      width: 180,
      renderCell: (params) => {
        const subs = params.value || [];
        const count = Array.isArray(subs) ? subs.length : 0;
        return (
          <button
            onClick={() => openSubTestimonialManager(params.row)}
            className="btn btn-sm"
            style={{
              backgroundColor: "#fef3c7",
              border: "none",
              borderRadius: "6px",
              padding: "4px 12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            title="Manage Sub Testimonials"
          >
            <svg width="14" height="14" fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="badge bg-warning" style={{ fontSize: "12px" }}>{count}</span>
          </button>
        );
      },
    },
    {
      field: "videos",
      headerName: "Videos",
      width: 140,
      renderCell: (params) => {
        const videos = params.value || [];
        const count = Array.isArray(videos) ? videos.length : 0;
        return (
          <button
            onClick={() => openVideoManager(params.row)}
            className="btn btn-sm"
            style={{
              backgroundColor: "#dbeafe",
              border: "none",
              borderRadius: "6px",
              padding: "4px 12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            title="Manage Videos"
          >
            <svg width="14" height="14" fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="badge bg-primary" style={{ fontSize: "12px" }}>{count}</span>
          </button>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 280,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          <button
            onClick={() => handleEdit(params.row)}
            className="btn btn-sm"
            style={{ backgroundColor: "#e0f2fe", border: "none", borderRadius: "6px", padding: "4px 8px" }}
            title="Edit"
          >
            <svg width="14" height="14" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          {/* Delete button hidden */}
        </div>
      ),
    },
  ];

  const openAdd = () => {
    setFormMode("add");
    setFormData(initialFormState);
    setNewVideo("");
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    setEditId(item._id);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      shortDescription: item.shortDescription || "",
      designation: item.designation || "",
      videos: item.videos || [],
      subTestimonials: item.subTestimonials || [],
    });
    setNewVideo("");
  };

  const addVideo = () => {
    if (!newVideo.trim()) return;
    setFormData((prev) => ({ ...prev, videos: [...prev.videos, newVideo.trim()] }));
    setNewVideo("");
  };

  const addSubTestimonial = () => {
    if (!subForm.title.trim()) {
      toast.error("Sub testimonial title is required");
      return;
    }
    const subEntry = {
      title: subForm.title.trim(),
      shortDescription: subForm.shortDescription || "",
      designation: subForm.designation || "",
      description: subForm.description || "",
      videos: [],
    };
    setFormData((prev) => ({
      ...prev,
      subTestimonials: [...(prev.subTestimonials || []), subEntry],
    }));
    setSubForm({
      title: "",
      shortDescription: "",
      designation: "",
      description: "",
    });
  };

  const removeSubTestimonial = (index) => {
    setFormData((prev) => ({
      ...prev,
      subTestimonials: (prev.subTestimonials || []).filter((_, i) => i !== index),
    }));
  };

  const openVideoManager = (parent) => {
    setVideoManager({
      isOpen: true,
      parentId: parent._id,
      parentTitle: parent.title,
      videos: parent.videos || [],
    });
    setVideoFormMode(null);
    setVideoEditIndex(null);
    setVideoFormUrl("");
  };

  const openSubTestimonialManager = (parent) => {
    setSubTestimonialManager({
      isOpen: true,
      parentId: parent._id,
      parentTitle: parent.title,
      subTestimonials: parent.subTestimonials || [],
    });
    setSubTestimonialFormMode(null);
    setSubTestimonialEditIndex(null);
    setSubTestimonialFormData({
      title: "",
      shortDescription: "",
      designation: "",
      faculty: "",
      description: "",
      videos: [],
    });
    setNewSubVideo("");
  };

  const handleSubTestimonialEdit = (index) => {
    const sub = subTestimonialManager.subTestimonials[index];
    setSubTestimonialFormMode("edit");
    setSubTestimonialEditIndex(index);
    setSubTestimonialFormData({
      title: sub.title || "",
      shortDescription: sub.shortDescription || "",
      designation: sub.designation || "",
      faculty: sub.faculty || "",
      description: sub.description || "",
      videos: [],
    });
  };

  const handleSubTestimonialAdd = () => {
    setSubTestimonialFormMode("add");
    setSubTestimonialEditIndex(null);
    setSubTestimonialFormData({
      title: "",
      shortDescription: "",
      designation: "",
      faculty: "",
      description: "",
      videos: [],
    });
  };

  const handleSubTestimonialSave = async () => {
    if (!subTestimonialFormData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    const newSub = {
      title: subTestimonialFormData.title.trim(),
      shortDescription: subTestimonialFormData.shortDescription || "",
      designation: subTestimonialFormData.designation || "",
      faculty: subTestimonialFormData.faculty || "",
      description: subTestimonialFormData.description || "",
      videos: [],
    };

    let updatedSubs = [...subTestimonialManager.subTestimonials];
    if (subTestimonialFormMode === "edit" && subTestimonialEditIndex !== null) {
      updatedSubs[subTestimonialEditIndex] = newSub;
    } else {
      updatedSubs.push(newSub);
    }

    // Update parent testimonial
    try {
      const parent = items.find((item) => item._id === subTestimonialManager.parentId);
      if (!parent) {
        toast.error("Parent testimonial not found");
        return;
      }

      const payload = new FormData();
      payload.append("title", parent.title);
      payload.append("description", parent.description || "");
      payload.append("shortDescription", parent.shortDescription || "");
      payload.append("designation", parent.designation || "");
      payload.append("videos", JSON.stringify(parent.videos || []));
      payload.append("subTestimonials", JSON.stringify(updatedSubs));

      const res = await fetch(`${FIELD_TESTIMONIAL_ENDPOINT}/${subTestimonialManager.parentId}`, {
        method: "PUT",
        body: payload,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save");
      }

      toast.success("Sub testimonials updated successfully");
      setSubTestimonialManager((prev) => ({ ...prev, subTestimonials: updatedSubs }));
      setSubTestimonialFormMode(null);
      setSubTestimonialEditIndex(null);
      setSubTestimonialFormData({
        title: "",
        shortDescription: "",
        designation: "",
        faculty: "",
        description: "",
        videos: [],
      });
      fetchItems();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleVideoEdit = (index) => {
    setVideoFormMode("edit");
    setVideoEditIndex(index);
    setVideoFormUrl(videoManager.videos[index] || "");
  };

  const handleVideoAdd = () => {
    setVideoFormMode("add");
    setVideoEditIndex(null);
    setVideoFormUrl("");
  };

  const handleVideoSave = async () => {
    if (!videoFormUrl.trim()) {
      toast.error("Video URL is required");
      return;
    }

    let updatedVideos = [...videoManager.videos];
    if (videoFormMode === "edit" && videoEditIndex !== null) {
      updatedVideos[videoEditIndex] = videoFormUrl.trim();
    } else {
      updatedVideos.push(videoFormUrl.trim());
    }

    // Update parent testimonial
    try {
      const parent = items.find((item) => item._id === videoManager.parentId);
      if (!parent) {
        toast.error("Parent testimonial not found");
        return;
      }

      const payload = new FormData();
      payload.append("title", parent.title);
      payload.append("description", parent.description || "");
      payload.append("shortDescription", parent.shortDescription || "");
      payload.append("designation", parent.designation || "");
      payload.append("videos", JSON.stringify(updatedVideos));
      payload.append("subTestimonials", JSON.stringify(parent.subTestimonials || []));

      const res = await fetch(`${FIELD_TESTIMONIAL_ENDPOINT}/${videoManager.parentId}`, {
        method: "PUT",
        body: payload,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save");
      }

      toast.success("Videos updated successfully");
      setVideoManager((prev) => ({ ...prev, videos: updatedVideos }));
      setVideoFormMode(null);
      setVideoEditIndex(null);
      setVideoFormUrl("");
      fetchItems();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleVideoDelete = async (index) => {
    const updatedVideos = videoManager.videos.filter((_, i) => i !== index);

    try {
      const parent = items.find((item) => item._id === videoManager.parentId);
      if (!parent) {
        toast.error("Parent testimonial not found");
        return;
      }

      const payload = new FormData();
      payload.append("title", parent.title);
      payload.append("description", parent.description || "");
      payload.append("shortDescription", parent.shortDescription || "");
      payload.append("designation", parent.designation || "");
      payload.append("videos", JSON.stringify(updatedVideos));
      payload.append("subTestimonials", JSON.stringify(parent.subTestimonials || []));

      const res = await fetch(`${FIELD_TESTIMONIAL_ENDPOINT}/${videoManager.parentId}`, {
        method: "PUT",
        body: payload,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to delete");
      }

      toast.success("Video deleted successfully");
      setVideoManager((prev) => ({ ...prev, videos: updatedVideos }));
      fetchItems();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubTestimonialDelete = async (index) => {
    const updatedSubs = subTestimonialManager.subTestimonials.filter((_, i) => i !== index);

    try {
      const parent = items.find((item) => item._id === subTestimonialManager.parentId);
      if (!parent) {
        toast.error("Parent testimonial not found");
        return;
      }

      const payload = new FormData();
      payload.append("title", parent.title);
      payload.append("description", parent.description || "");
      payload.append("shortDescription", parent.shortDescription || "");
      payload.append("designation", parent.designation || "");
      payload.append("videos", JSON.stringify(parent.videos || []));
      payload.append("subTestimonials", JSON.stringify(updatedSubs));

      const res = await fetch(`${FIELD_TESTIMONIAL_ENDPOINT}/${subTestimonialManager.parentId}`, {
        method: "PUT",
        body: payload,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to delete");
      }

      toast.success("Sub testimonial deleted successfully");
      setSubTestimonialManager((prev) => ({ ...prev, subTestimonials: updatedSubs }));
      fetchItems();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const removeVideo = (index) => {
    setFormData((prev) => ({ ...prev, videos: prev.videos.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description || "");
      payload.append("shortDescription", formData.shortDescription || "");
      payload.append("designation", formData.designation || "");
      payload.append("videos", JSON.stringify(formData.videos || []));
      payload.append("subTestimonials", JSON.stringify(formData.subTestimonials || []));

      const url = formMode === "edit" ? `${FIELD_TESTIMONIAL_ENDPOINT}/${editId}` : FIELD_TESTIMONIAL_ENDPOINT;
      const method = formMode === "edit" ? "PUT" : "POST";
      const res = await fetch(url, { method, body: payload });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save");
      }
      toast.success(formMode === "edit" ? "Updated successfully" : "Created successfully");
      setFormMode(null);
      fetchItems();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(`${FIELD_TESTIMONIAL_ENDPOINT}/${confirmModal.id}`, { method: "DELETE" });
      toast.success("Deleted successfully!");
      setConfirmModal({ isOpen: false, id: null, title: "" });
      fetchItems();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "none", margin: 0, padding: 0 }}>
      <ToastContainer position="top-right" autoClose={4000} />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, title: "" })}
        onConfirm={handleDeleteConfirm}
        title="Delete Testimonial"
        message={`Are you sure you want to delete "${confirmModal.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

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
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className={styles.searchClear} title="Clear search">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className={styles.actionBarRight}>
            {/* Add button hidden */}
          </div>
        </div>
      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <CommonDataGrid
          data={filteredItems.map((item, index) => ({ ...item, id: item._id, srNo: index + 1 }))}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 15, 20, 50]}
          initialPageSize={10}
          noDataMessage="No testimonials found"
          loadingMessage="Loading testimonials..."
          showSerialNumber
          serialNumberField="srNo"
          serialNumberHeader="Sr.no."
          serialNumberWidth={80}
        />
      </div>

      <Modal
        isOpen={formMode !== null}
        onClose={() => setFormMode(null)}
        title={formMode === "edit" ? "Edit Testimonial" : "Add Testimonial"}
      >
        <div className={styles.modalFormContent}>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>Basic Information</h3>

              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Title <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter testimonial title..."
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Sub Title</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Enter sub title..."
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Description</label>
                <div style={{ minHeight: "200px" }}>
                  <CKEditorWrapper
                    data={formData.description || ""}
                    onChange={(event, editor) => {
                      const data = editor?.getData ? editor.getData() : (event?.target?.value || "");
                      setFormData({ ...formData, description: data });
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={() => setFormMode(null)} className={styles.formCancelBtn}>
                Cancel
              </button>
              <button type="submit" className={styles.formSubmitBtn}>
                {formMode === "edit" ? "Update Entry" : "Create Entry"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Video Manager Modal */}
      <Modal
        isOpen={videoManager.isOpen}
        onClose={() => setVideoManager({ isOpen: false, parentId: null, parentTitle: "", videos: [] })}
        title={`Manage Videos: ${videoManager.parentTitle || ''}`}
      >
        <div className={styles.modalFormContent}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <button
              onClick={handleVideoAdd}
              className="btn btn-sm"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Video
            </button>
          </div>

          {videoManager.videos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem', color: '#9ca3af' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>No videos yet. Click "Add Video" to create one.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <table className="table" style={{ marginBottom: 0, backgroundColor: 'white' }}>
                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <tr>
                    <th style={{ width: '5%', padding: '12px', fontWeight: 600, color: '#374151', fontSize: '0.875rem', textAlign: 'center' }}>#</th>
                    <th style={{ width: '70%', padding: '12px', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Video URL</th>
                    <th style={{ width: '25%', padding: '12px', fontWeight: 600, color: '#374151', fontSize: '0.875rem', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videoManager.videos.map((video, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px', verticalAlign: 'middle', textAlign: 'center', color: '#6b7280', fontWeight: 500 }}>{index + 1}</td>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#3b82f6', flexShrink: 0 }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <a
                            href={video}
                            target="_blank"
                            rel="noreferrer"
                            style={{ 
                              color: '#2563eb', 
                              textDecoration: 'none', 
                              maxWidth: '500px', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap', 
                              display: 'inline-block',
                              fontWeight: 500
                            }}
                            title={video}
                            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                          >
                            {video}
                          </a>
                        </div>
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'middle', textAlign: 'center' }}>
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            onClick={() => handleVideoEdit(index)}
                            className="btn btn-sm"
                            style={{ 
                              backgroundColor: '#e0f2fe', 
                              border: 'none', 
                              borderRadius: '6px', 
                              padding: '4px 8px',
                              transition: 'all 0.2s'
                            }}
                            title="Edit"
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#bae6fd'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#e0f2fe'}
                          >
                            <svg width="14" height="14" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleVideoDelete(index)}
                            className="btn btn-sm"
                            style={{ 
                              backgroundColor: '#fee2e2', 
                              border: 'none', 
                              borderRadius: '6px', 
                              padding: '4px 8px',
                              transition: 'all 0.2s'
                            }}
                            title="Delete"
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#fecaca'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#fee2e2'}
                          >
                            <svg width="14" height="14" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Modal>

      {/* Video Form Modal */}
      <Modal
        isOpen={videoFormMode !== null}
        onClose={() => {
          setVideoFormMode(null);
          setVideoEditIndex(null);
          setVideoFormUrl("");
        }}
        title={videoFormMode === "edit" ? "Edit Video" : "Add Video"}
      >
        <div className={styles.modalFormContent}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVideoSave();
            }}
            className={styles.formContainer}
          >
            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>Video Information</h3>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Video URL <span className={styles.required}>*</span>
                </label>
                <input
                  type="url"
                  className={styles.formInput}
                  value={videoFormUrl}
                  onChange={(e) => setVideoFormUrl(e.target.value)}
                  placeholder="Enter video URL (e.g., https://example.com/video)..."
                  required
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => {
                  setVideoFormMode(null);
                  setVideoEditIndex(null);
                  setVideoFormUrl("");
                }}
                className={styles.formCancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={styles.formSubmitBtn}>
                {videoFormMode === "edit" ? "Update Entry" : "Create Entry"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Sub-Testimonial Manager Modal */}
      <Modal
        isOpen={subTestimonialManager.isOpen}
        onClose={() => setSubTestimonialManager({ isOpen: false, parentId: null, parentTitle: "", subTestimonials: [] })}
        title={`Manage Sub Testimonials: ${subTestimonialManager.parentTitle || ''}`}
      >
        <div className={styles.modalFormContent}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <button
              onClick={handleSubTestimonialAdd}
              className="btn btn-sm"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Sub Testimonial
            </button>
          </div>

          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {subTestimonialManager.subTestimonials.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem', color: '#9ca3af' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>No sub testimonials yet. Click "Add Sub Testimonial" to create one.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <table className="table" style={{ marginBottom: 0, backgroundColor: 'white' }}>
                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <tr>
                    <th style={{ width: '20%', padding: '12px', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Title</th>
                    <th style={{ width: '18%', padding: '12px', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Short Description</th>
                    <th style={{ width: '15%', padding: '12px', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Designation</th>
                    <th style={{ width: '15%', padding: '12px', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Faculty</th>
                    <th style={{ width: '27%', padding: '12px', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Description</th>
                    <th style={{ width: '15%', padding: '12px', fontWeight: 600, color: '#374151', fontSize: '0.875rem', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subTestimonialManager.subTestimonials.map((sub, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        <div className="text-truncate" style={{ maxWidth: '150px', fontWeight: 500, color: '#111827' }} title={sub.title}>
                          {sub.title}
                        </div>
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        <div className="text-truncate" style={{ maxWidth: '150px', color: '#6b7280' }} title={sub.shortDescription}>
                          {sub.shortDescription || <span style={{ color: '#9ca3af' }}>—</span>}
                        </div>
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        <div className="text-truncate" style={{ maxWidth: '100px', color: '#6b7280' }} title={sub.designation}>
                          {sub.designation || <span style={{ color: '#9ca3af' }}>—</span>}
                        </div>
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        <div className="text-truncate" style={{ maxWidth: '100px', color: '#6b7280', fontWeight: 500 }} title={sub.faculty}>
                          {sub.faculty || <span style={{ color: '#9ca3af' }}>—</span>}
                        </div>
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        <div className="text-truncate" style={{ maxWidth: '250px', color: '#6b7280' }} title={sub.description}>
                          {sub.description ? sub.description.replace(/<[^>]*>/g, '').substring(0, 50) + '...' : <span style={{ color: '#9ca3af' }}>—</span>}
                        </div>
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'middle', textAlign: 'center' }}>
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            onClick={() => handleSubTestimonialEdit(index)}
                            className="btn btn-sm"
                            style={{ backgroundColor: '#e0f2fe', border: 'none', borderRadius: '6px', padding: '4px 8px', transition: 'all 0.2s' }}
                            title="Edit"
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#bae6fd'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#e0f2fe'}
                          >
                            <svg width="14" height="14" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleSubTestimonialDelete(index)}
                            className="btn btn-sm"
                            style={{ backgroundColor: '#fee2e2', border: 'none', borderRadius: '6px', padding: '4px 8px', transition: 'all 0.2s' }}
                            title="Delete"
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#fecaca'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#fee2e2'}
                          >
                            <svg width="14" height="14" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Sub-Testimonial Form Modal */}
      <Modal
        isOpen={subTestimonialFormMode !== null}
        onClose={() => {
          setSubTestimonialFormMode(null);
          setSubTestimonialEditIndex(null);
          setSubTestimonialFormData({
            title: "",
            shortDescription: "",
            designation: "",
            faculty: "",
            description: "",
            video: "",
          });
        }}
        title={subTestimonialFormMode === "edit" ? "Edit Sub Testimonial" : "Add Sub Testimonial"}
      >
        <div className={styles.modalFormContent}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubTestimonialSave();
            }}
            className={styles.formContainer}
          >
          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Basic Information</h3>

            <div className={styles.formField}>
              <label className={styles.formLabel}>
                Title <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.formInput}
                required
                value={subTestimonialFormData.title}
                onChange={(e) => setSubTestimonialFormData({ ...subTestimonialFormData, title: e.target.value })}
                placeholder="Enter sub testimonial title..."
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Short Description</label>
              <input
                type="text"
                className={styles.formInput}
                value={subTestimonialFormData.shortDescription}
                onChange={(e) => setSubTestimonialFormData({ ...subTestimonialFormData, shortDescription: e.target.value })}
                placeholder="Enter short description..."
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Designation</label>
              <input
                type="text"
                className={styles.formInput}
                value={subTestimonialFormData.designation}
                onChange={(e) => setSubTestimonialFormData({ ...subTestimonialFormData, designation: e.target.value })}
                placeholder="Enter designation..."
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Faculty</label>
              <input
                type="text"
                className={styles.formInput}
                value={subTestimonialFormData.faculty}
                onChange={(e) => setSubTestimonialFormData({ ...subTestimonialFormData, faculty: e.target.value })}
                placeholder="Enter faculty..."
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Description</label>
              <div style={{ minHeight: '200px' }}>
                <CKEditorWrapper
                  data={subTestimonialFormData.description || ''}
                  onChange={(event, editor) => {
                    const data = editor?.getData ? editor.getData() : (event?.target?.value || '');
                    setSubTestimonialFormData({ ...subTestimonialFormData, description: data });
                  }}
                />
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => {
                setSubTestimonialFormMode(null);
                setSubTestimonialEditIndex(null);
                setSubTestimonialFormData({
                  title: "",
                  shortDescription: "",
                  designation: "",
                  faculty: "",
                  description: "",
                  videos: [],
                });
              }}
              className={styles.formCancelBtn}
            >
              Cancel
            </button>
            <button type="submit" className={styles.formSubmitBtn}>
              {subTestimonialFormMode === "edit" ? "Update Entry" : "Create Entry"}
            </button>
          </div>
        </form>
        </div>
      </Modal>
    </div>
  );
}

