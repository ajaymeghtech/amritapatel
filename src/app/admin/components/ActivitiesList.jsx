'use client';

import React, { useState, useEffect, useMemo } from "react";
import dynamic from 'next/dynamic';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonDataGrid, { Tooltip } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from "./CMSList.module.css";

// CKEditor Wrapper Component
const CKEditorWrapper = dynamic(
  () => import('./CKEditorWrapper'),
  {
    ssr: false,
    loading: () => null
  }
);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '${API_BASE_URL}';
const ACTIVITIES_ENDPOINT = `${API_BASE_URL}/api/activities`;
const SUBACTIVITIES_ENDPOINT = `${API_BASE_URL}/api/subactivities`;
const THIRD_CATEGORIES_ENDPOINT = `${API_BASE_URL}/api/third-categories`;
const VIDEO_TESTIMONIALS_ENDPOINT = `${API_BASE_URL}/api/video-testimonial`;
const IMAGE_UPLOAD_URL = `${API_BASE_URL}/api/cms/upload-image`;

const getImageUrl = (path = "") => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
};

// Enhanced Modal Component
const Modal = ({ isOpen, onClose, title, children, headerAction }) => {
  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '900px' }}
      >
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalIcon}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
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

// CKEditor Configuration
const editorConfiguration = {
  height: 200,
  allowedContent: true,
  extraAllowedContent: '*(*);*{*};*[*]',
  extraPlugins: 'uploadimage,image2',
  removePlugins: 'easyimage,cloudservices',
  filebrowserUploadUrl: IMAGE_UPLOAD_URL,
  filebrowserImageUploadUrl: IMAGE_UPLOAD_URL,
  filebrowserUploadMethod: 'form',
  toolbar: [
    { name: 'document', items: ['Source', '-', 'Save', 'NewPage', 'Preview', '-', 'Templates'] },
    { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
    { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'] },
    '/',
    { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
    { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
    { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
    { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar'] },
    '/',
    { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
    { name: 'colors', items: ['TextColor', 'BGColor'] },
    { name: 'tools', items: ['Maximize', 'ShowBlocks'] }
  ]
};

export default function ActivitiesList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Activity Form State
  const [activityFormMode, setActivityFormMode] = useState(null);
  const [activityFormData, setActivityFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    status: "active",
  });
  const [activityImageFile, setActivityImageFile] = useState(null);
  const [activityImagePreview, setActivityImagePreview] = useState("");
  const [activityEditId, setActivityEditId] = useState(null);
  const [activityEditorInstance, setActivityEditorInstance] = useState(null);
  
  // Sub-Activity Management State
  const [subActivityManager, setSubActivityManager] = useState({
    isOpen: false,
    activity: null,
    subActivities: [],
    loading: false,
  });
  const [subActivityFormMode, setSubActivityFormMode] = useState(null);
  const [subActivityFormData, setSubActivityFormData] = useState({
    title: "",
    short_description: "",
    description: "",
    image: "",
  });
  const [subActivityImageFile, setSubActivityImageFile] = useState(null);
  const [subActivityImagePreview, setSubActivityImagePreview] = useState("");
  const [subActivityEditId, setSubActivityEditId] = useState(null);
  const [subActivityEditorInstance, setSubActivityEditorInstance] = useState(null);
  
  // Video Testimonial Management State
  const [videoManager, setVideoManager] = useState({
    isOpen: false,
    activity: null,
    videos: [],
    loading: false,
  });
  const [videoFormMode, setVideoFormMode] = useState(null);
  const [videoFormData, setVideoFormData] = useState({
    title: "",
    short_description: "",
    description: "",
    video_url: "",
    image: "",
  });
  const [videoImageFile, setVideoImageFile] = useState(null);
  const [videoImagePreview, setVideoImagePreview] = useState("");
  const [videoEditId, setVideoEditId] = useState(null);
  const [videoEditorInstance, setVideoEditorInstance] = useState(null);
  
  // Third Category Management State (depends on Sub-Activity)
  const [thirdCategoryManager, setThirdCategoryManager] = useState({
    isOpen: false,
    subActivity: null,
    thirdCategories: [],
    loading: false,
  });
  const [thirdCategoryFormMode, setThirdCategoryFormMode] = useState(null);
  const [thirdCategoryFormData, setThirdCategoryFormData] = useState({
    title: "",
    short_description: "",
    description: "",
    image: "",
  });
  const [thirdCategoryImageFile, setThirdCategoryImageFile] = useState(null);
  const [thirdCategoryImagePreview, setThirdCategoryImagePreview] = useState("");
  const [thirdCategoryEditId, setThirdCategoryEditId] = useState(null);
  const [thirdCategoryEditorInstance, setThirdCategoryEditorInstance] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // 'activity', 'subactivity', 'video', 'thirdcategory'
    id: null,
    name: ""
  });
  const [viewModal, setViewModal] = useState({
    isOpen: false,
    activity: null
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(ACTIVITIES_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch activities");
      const data = await response.json();
      setActivities(data.data || []);
    } catch (err) {
      toast.error(`Failed to fetch activities: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ========== ACTIVITY CRUD ==========
  const handleActivityFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const latestContent = activityEditorInstance?.getData ? activityEditorInstance.getData() : activityFormData.content;
      
      const payload = new FormData();
      payload.append("title", activityFormData.title);
      payload.append("subtitle", activityFormData.subtitle || "");
      payload.append("content", latestContent || "");
      payload.append("status", activityFormData.status);
      
      if (activityImageFile) {
        payload.append("image", activityImageFile);
      }

      let response;
      if (activityFormMode === "edit") {
        response = await fetch(`${ACTIVITIES_ENDPOINT}/${activityEditId}`, {
          method: "PUT",
          body: payload,
        });
      } else {
        response = await fetch(ACTIVITIES_ENDPOINT, {
          method: "POST",
          body: payload,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to save: ${errorData.message || 'Unknown error'}`);
        return;
      }

      toast.success(activityFormMode === "edit" ? "Activity updated successfully!" : "Activity created successfully!");
      resetActivityForm();
      fetchActivities();
    } catch (error) {
      toast.error(`Failed to save. Error: ${error.message}`);
    }
  };

  const resetActivityForm = () => {
    setActivityFormMode(null);
    setActivityEditId(null);
    setActivityEditorInstance(null);
    setActivityImageFile(null);
    setActivityImagePreview("");
    setActivityFormData({
      title: "",
      subtitle: "",
      content: "",
      status: "active",
    });
  };

  const handleActivityEdit = (item) => {
    setActivityFormMode("edit");
    setActivityEditId(item._id);
    setActivityFormData({
      title: item.title || "",
      subtitle: item.subtitle || "",
      content: item.content || "",
      status: item.status || "active",
    });
    setActivityImagePreview(item.image ? getImageUrl(item.image) : "");
    setActivityImageFile(null);
  };

  const handleActivityDelete = (id, title) => {
    setConfirmModal({
      isOpen: true,
      type: 'activity',
      id,
      name: title
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      let endpoint;
      if (confirmModal.type === 'activity') {
        endpoint = `${ACTIVITIES_ENDPOINT}/${confirmModal.id}`;
      } else if (confirmModal.type === 'subactivity') {
        endpoint = `${SUBACTIVITIES_ENDPOINT}/${confirmModal.id}`;
      } else if (confirmModal.type === 'video') {
        endpoint = `${VIDEO_TESTIMONIALS_ENDPOINT}/${confirmModal.id}`;
      } else if (confirmModal.type === 'thirdcategory') {
        endpoint = `${THIRD_CATEGORIES_ENDPOINT}/${confirmModal.id}`;
      }
      
      await fetch(endpoint, { method: "DELETE" });
      toast.success("Deleted successfully!");
      
      if (confirmModal.type === 'activity') {
        fetchActivities();
      } else if (confirmModal.type === 'subactivity') {
        fetchSubActivities(subActivityManager.activity._id);
      } else if (confirmModal.type === 'video') {
        fetchVideos(videoManager.activity._id);
      } else if (confirmModal.type === 'thirdcategory') {
        fetchThirdCategories(thirdCategoryManager.subActivity._id);
      }
    } catch (error) {
      toast.error(`Failed to delete: ${error.message}`);
    } finally {
      setConfirmModal({ isOpen: false, type: null, id: null, name: "" });
    }
  };

  // ========== SUB-ACTIVITY MANAGEMENT ==========
  const openSubActivityManager = (activity) => {
    setSubActivityManager({
      isOpen: true,
      activity,
      subActivities: [],
      loading: true,
    });
    resetSubActivityForm();
    fetchSubActivities(activity._id);
  };

  const fetchSubActivities = async (activityId) => {
    try {
      setSubActivityManager(prev => ({ ...prev, loading: true }));
      const response = await fetch(SUBACTIVITIES_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch sub-activities");
      const data = await response.json();
      // Filter by activityId
      const filtered = (data.data || []).filter(item => item.activityId === activityId);
      setSubActivityManager(prev => ({
        ...prev,
        subActivities: filtered,
        loading: false,
      }));
    } catch (err) {
      toast.error(`Failed to fetch sub-activities: ${err.message}`);
      setSubActivityManager(prev => ({ ...prev, loading: false }));
    }
  };

  const resetSubActivityForm = () => {
    setSubActivityFormMode(null);
    setSubActivityEditId(null);
    setSubActivityEditorInstance(null);
    setSubActivityImageFile(null);
    setSubActivityImagePreview("");
    setSubActivityFormData({
      title: "",
      short_description: "",
      description: "",
      image: "",
    });
  };

  const resetSubActivityFormForAddMore = () => {
    // Reset form data but keep modal open in add mode
    setSubActivityEditId(null);
    setSubActivityImageFile(null);
    setSubActivityImagePreview("");
    setSubActivityFormData({
      title: "",
      short_description: "",
      description: "",
      image: "",
    });
    // Clear CKEditor content
    if (subActivityEditorInstance) {
      subActivityEditorInstance.setData("");
    }
  };

  const handleSubActivityFormSubmit = async (e, closeAfterSubmit = false) => {
    e.preventDefault();
    if (!subActivityManager.activity?._id) {
      toast.error("Activity not selected");
      return;
    }
    
    try {
      const latestDescription = subActivityEditorInstance?.getData ? subActivityEditorInstance.getData() : subActivityFormData.description;
      
      const payload = new FormData();
      payload.append("activityId", subActivityManager.activity._id);
      payload.append("title", subActivityFormData.title);
      payload.append("short_description", subActivityFormData.short_description || "");
      payload.append("description", latestDescription || "");
      
      if (subActivityImageFile) {
        payload.append("image", subActivityImageFile);
      }

      let response;
      if (subActivityFormMode === "edit") {
        response = await fetch(`${SUBACTIVITIES_ENDPOINT}/${subActivityEditId}`, {
          method: "PUT",
          body: payload,
        });
      } else {
        response = await fetch(SUBACTIVITIES_ENDPOINT, {
          method: "POST",
          body: payload,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to save: ${errorData.message || 'Unknown error'}`);
        return;
      }

      toast.success(subActivityFormMode === "edit" ? "Sub-activity updated!" : "Sub-activity created!");
      
      if (subActivityFormMode === "edit" || closeAfterSubmit) {
        resetSubActivityForm();
      } else {
        // For add mode with "Add More", reset form but keep modal open
        resetSubActivityFormForAddMore();
      }
      
      fetchSubActivities(subActivityManager.activity._id);
      fetchActivities(); // Refresh main list
    } catch (error) {
      toast.error(`Failed to save. Error: ${error.message}`);
    }
  };

  const handleSubActivityEdit = (item) => {
    setSubActivityFormMode("edit");
    setSubActivityEditId(item._id);
    setSubActivityFormData({
      title: item.title || "",
      short_description: item.short_description || "",
      description: item.description || "",
      image: item.image || "",
    });
    setSubActivityImagePreview(item.image ? getImageUrl(item.image) : "");
    setSubActivityImageFile(null);
  };

  // ========== VIDEO TESTIMONIAL MANAGEMENT ==========
  const openVideoManager = (activity) => {
    setVideoManager({
      isOpen: true,
      activity,
      videos: [],
      loading: true,
    });
    resetVideoForm();
    fetchVideos(activity._id);
  };

  const fetchVideos = async (activityId) => {
    try {
      setVideoManager(prev => ({ ...prev, loading: true }));
      const response = await fetch(VIDEO_TESTIMONIALS_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch videos");
      const data = await response.json();
      // Filter by activityId
      const filtered = (data.data || []).filter(item => item.activityId === activityId);
      setVideoManager(prev => ({
        ...prev,
        videos: filtered,
        loading: false,
      }));
    } catch (err) {
      toast.error(`Failed to fetch videos: ${err.message}`);
      setVideoManager(prev => ({ ...prev, loading: false }));
    }
  };

  const resetVideoForm = () => {
    setVideoFormMode(null);
    setVideoEditId(null);
    setVideoEditorInstance(null);
    setVideoImageFile(null);
    setVideoImagePreview("");
    setVideoFormData({
      title: "",
      short_description: "",
      description: "",
      video_url: "",
      image: "",
    });
  };

  const handleVideoFormSubmit = async (e) => {
    e.preventDefault();
    if (!videoManager.activity?._id) {
      toast.error("Activity not selected");
      return;
    }
    
    try {
      const latestDescription = videoEditorInstance?.getData ? videoEditorInstance.getData() : videoFormData.description;
      
      const payload = new FormData();
      payload.append("activityId", videoManager.activity._id);
      payload.append("title", videoFormData.title);
      payload.append("short_description", videoFormData.short_description || "");
      payload.append("description", latestDescription || "");
      payload.append("video_url", videoFormData.video_url || "");
      
      if (videoImageFile) {
        payload.append("image", videoImageFile);
      }

      let response;
      if (videoFormMode === "edit") {
        response = await fetch(`${VIDEO_TESTIMONIALS_ENDPOINT}/${videoEditId}`, {
          method: "PUT",
          body: payload,
        });
      } else {
        response = await fetch(VIDEO_TESTIMONIALS_ENDPOINT, {
          method: "POST",
          body: payload,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to save: ${errorData.message || 'Unknown error'}`);
        return;
      }

      toast.success(videoFormMode === "edit" ? "Video testimonial updated!" : "Video testimonial created!");
      resetVideoForm();
      fetchVideos(videoManager.activity._id);
      fetchActivities(); // Refresh main list
    } catch (error) {
      toast.error(`Failed to save. Error: ${error.message}`);
    }
  };

  const handleVideoEdit = (item) => {
    setVideoFormMode("edit");
    setVideoEditId(item._id);
    setVideoFormData({
      title: item.title || "",
      short_description: item.short_description || "",
      description: item.description || "",
      video_url: item.video_url || "",
      image: item.image || "",
    });
    setVideoImagePreview(item.image ? getImageUrl(item.image) : "");
    setVideoImageFile(null);
  };

  // ========== THIRD CATEGORY MANAGEMENT ==========
  const openThirdCategoryManager = (subActivity) => {
    setThirdCategoryManager({
      isOpen: true,
      subActivity,
      thirdCategories: [],
      loading: true,
    });
    resetThirdCategoryForm();
    fetchThirdCategories(subActivity._id);
  };

  const fetchThirdCategories = async (subActivityId) => {
    try {
      setThirdCategoryManager(prev => ({ ...prev, loading: true }));
      const response = await fetch(THIRD_CATEGORIES_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch third categories");
      const data = await response.json();
      // Filter by subActivityId
      const filtered = (data.data || []).filter(item => item.subActivityId === subActivityId);
      setThirdCategoryManager(prev => ({
        ...prev,
        thirdCategories: filtered,
        loading: false,
      }));
    } catch (err) {
      toast.error(`Failed to fetch third categories: ${err.message}`);
      setThirdCategoryManager(prev => ({ ...prev, loading: false }));
    }
  };

  const resetThirdCategoryForm = () => {
    setThirdCategoryFormMode(null);
    setThirdCategoryEditId(null);
    setThirdCategoryEditorInstance(null);
    setThirdCategoryImageFile(null);
    setThirdCategoryImagePreview("");
    setThirdCategoryFormData({
      title: "",
      short_description: "",
      description: "",
      image: "",
    });
  };

  const resetThirdCategoryFormForAddMore = () => {
    setThirdCategoryEditId(null);
    setThirdCategoryImageFile(null);
    setThirdCategoryImagePreview("");
    setThirdCategoryFormData({
      title: "",
      short_description: "",
      description: "",
      image: "",
    });
    if (thirdCategoryEditorInstance) {
      thirdCategoryEditorInstance.setData("");
    }
  };

  const handleThirdCategoryFormSubmit = async (e, closeAfterSubmit = false) => {
    e.preventDefault();
    if (!thirdCategoryManager.subActivity?._id) {
      toast.error("Sub-Activity not selected");
      return;
    }
    
    try {
      const latestDescription = thirdCategoryEditorInstance?.getData ? thirdCategoryEditorInstance.getData() : thirdCategoryFormData.description;
      
      const payload = new FormData();
      payload.append("subActivityId", thirdCategoryManager.subActivity._id);
      payload.append("title", thirdCategoryFormData.title);
      payload.append("short_description", thirdCategoryFormData.short_description || "");
      payload.append("description", latestDescription || "");
      
      if (thirdCategoryImageFile) {
        payload.append("image", thirdCategoryImageFile);
      }

      let response;
      if (thirdCategoryFormMode === "edit") {
        response = await fetch(`${THIRD_CATEGORIES_ENDPOINT}/${thirdCategoryEditId}`, {
          method: "PUT",
          body: payload,
        });
      } else {
        response = await fetch(THIRD_CATEGORIES_ENDPOINT, {
          method: "POST",
          body: payload,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to save: ${errorData.message || 'Unknown error'}`);
        return;
      }

      toast.success(thirdCategoryFormMode === "edit" ? "Third category updated!" : "Third category created!");
      
      if (thirdCategoryFormMode === "edit" || closeAfterSubmit) {
        resetThirdCategoryForm();
      } else {
        resetThirdCategoryFormForAddMore();
      }
      
      fetchThirdCategories(thirdCategoryManager.subActivity._id);
      fetchSubActivities(subActivityManager.activity._id);
      fetchActivities();
    } catch (error) {
      toast.error(`Failed to save. Error: ${error.message}`);
    }
  };

  const handleThirdCategoryEdit = (item) => {
    setThirdCategoryFormMode("edit");
    setThirdCategoryEditId(item._id);
    setThirdCategoryFormData({
      title: item.title || "",
      short_description: item.short_description || "",
      description: item.description || "",
      image: item.image || "",
    });
    setThirdCategoryImagePreview(item.image ? getImageUrl(item.image) : "");
    setThirdCategoryImageFile(null);
  };

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      const statusMatch = statusFilter === "all" || item.status === statusFilter;
      const searchMatch = searchTerm === "" ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());

      return statusMatch && searchMatch;
    });
  }, [activities, statusFilter, searchTerm]);

  // Define table columns
  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden' }}>
          {params.value ? (
            <img
              src={getImageUrl(params.value)}
              alt={params.row.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/60';
              }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      ),
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 200,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="fw-medium text-truncate" style={{ maxWidth: '180px' }} title={params.value}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: 'subtitle',
      headerName: 'Subtitle',
      width: 200,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="text-muted text-truncate" style={{ maxWidth: '180px' }} title={params.value}>
            {params.value || "—"}
          </div>
        </Tooltip>
      ),
    },
    {
      field: 'subcategories',
      headerName: 'Sub-Activities',
      width: 120,
      renderCell: (params) => (
        <span className="badge bg-info">
          {params.value?.length || 0}
        </span>
      ),
    },
    {
      field: 'testimonial_video',
      headerName: 'Videos',
      width: 100,
      renderCell: (params) => (
        <span className="badge bg-primary">
          {params.value?.length || 0}
        </span>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => {
        const status = params.value || 'active';
        return (
          <span className={`badge ${status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 350,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
          <button
            onClick={() => setViewModal({ isOpen: true, activity: params.row })}
            className="btn btn-sm"
            style={{ backgroundColor: '#e0f2fe', border: 'none', borderRadius: '6px', padding: '4px 8px' }}
            title="View Details"
          >
            <svg width="14" height="14" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => handleActivityEdit(params.row)}
            className="btn btn-sm"
            style={{ backgroundColor: '#e0f2fe', border: 'none', borderRadius: '6px', padding: '4px 8px' }}
            title="Edit Activity"
          >
            <svg width="14" height="14" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => openSubActivityManager(params.row)}
            className="btn btn-sm"
            style={{ backgroundColor: '#fef3c7', border: 'none', borderRadius: '6px', padding: '4px 8px' }}
            title="Manage Sub-Activities"
          >
            <svg width="14" height="14" fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="ms-1" style={{ fontSize: '12px' }}>Sub ({params.row.subcategories?.length || 0})</span>
          </button>
          <button
            onClick={() => openVideoManager(params.row)}
            className="btn btn-sm"
            style={{ backgroundColor: '#dbeafe', border: 'none', borderRadius: '6px', padding: '4px 8px' }}
            title="Manage Videos"
          >
            <svg width="14" height="14" fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="ms-1" style={{ fontSize: '12px' }}>Videos ({params.row.testimonial_video?.length || 0})</span>
          </button>
          <button
            onClick={() => handleActivityDelete(params.row._id, params.row.title)}
            className="btn btn-sm"
            style={{ backgroundColor: '#fee2e2', border: 'none', borderRadius: '6px', padding: '4px 8px' }}
            title="Delete Activity"
          >
            <svg width="14" height="14" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
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

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null, id: null, name: "" })}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${confirmModal.type === 'activity' ? 'Activity' : confirmModal.type === 'subactivity' ? 'Sub-Activity' : confirmModal.type === 'thirdcategory' ? 'Third Category' : 'Video Testimonial'}`}
        message={`Are you sure you want to delete "${confirmModal.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.actionBarContent}>
          <div className={styles.actionBarLeft}>
            {/* Search Bar */}
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <svg className={styles.searchIcon} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search activities..."
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
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <span className={styles.dropdownIcon}>
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
              onClick={() => setActivityFormMode("add")}
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
                minWidth: '140px'
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className={styles.buttonTextFull}>Add New Activity</span>
              <span className={styles.buttonTextShort}>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <CommonDataGrid
        data={filteredActivities}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 15, 20, 50]}
        initialPageSize={10}
        noDataMessage="No activities found"
        noDataDescription={
          searchTerm || statusFilter !== "all"
            ? "Try adjusting your search criteria or filters."
            : "Get started by creating your first activity."
        }
        noDataAction={
          (!searchTerm && statusFilter === "all") ? {
            onClick: () => setActivityFormMode("add"),
            text: "Create First Activity"
          } : null
        }
        loadingMessage="Loading activities..."
        showSerialNumber={true}
        serialNumberField="id"
        serialNumberHeader="Sr.no."
        serialNumberWidth={100}
      />

      {/* Activity Form Modal */}
      <Modal
        isOpen={activityFormMode !== null}
        onClose={resetActivityForm}
        title={activityFormMode === "edit" ? "Edit Activity" : "Create New Activity"}
      >
        <div className={styles.modalFormContent}>
          <form onSubmit={handleActivityFormSubmit} className={styles.formContainer}>
            <div className={styles.formSection}>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Title <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={activityFormData.title}
                    onChange={(e) => setActivityFormData({ ...activityFormData, title: e.target.value })}
                    placeholder="Enter title"
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Subtitle</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={activityFormData.subtitle}
                    onChange={(e) => setActivityFormData({ ...activityFormData, subtitle: e.target.value })}
                    placeholder="Enter subtitle"
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Content <span className={styles.required}>*</span>
                </label>
                <div style={{ minHeight: '200px' }}>
                  <CKEditorWrapper
                    data={activityFormData.content || ''}
                    config={editorConfiguration}
                    onReady={(editor) => {
                      setActivityEditorInstance(editor);
                      if (!editor) return;
                      editor.config.filebrowserUploadUrl = IMAGE_UPLOAD_URL;
                      editor.config.filebrowserImageUploadUrl = IMAGE_UPLOAD_URL;
                      editor.on('fileUploadRequest', (evt) => {
                        const fileLoader = evt.data.fileLoader;
                        const xhr = fileLoader.xhr;
                        const formData = new FormData();
                        xhr.open('POST', IMAGE_UPLOAD_URL, true);
                        formData.append('image', fileLoader.file, fileLoader.fileName);
                        fileLoader.xhr.send(formData);
                        evt.stop();
                      });
                      editor.on('fileUploadResponse', (evt) => {
                        evt.stop();
                        try {
                          const response = JSON.parse(evt.data.xhr.responseText || '{}');
                          if (!response?.success || !response?.url) {
                            evt.cancel();
                            toast.error(response?.message || 'Image upload failed.');
                            return;
                          }
                          const fullUrl = response.url.startsWith('http') ? response.url : `${API_BASE_URL}${response.url}`;
                          evt.data.url = fullUrl;
                          toast.success('Image uploaded!', { autoClose: 2000 });
                        } catch (parseError) {
                          evt.cancel();
                          toast.error('Upload failed.');
                        }
                      });
                    }}
                    onChange={(event, editor) => {
                      const data = editor?.getData ? editor.getData() : event.target.value;
                      setActivityFormData((prev) => ({ ...prev, content: data }));
                    }}
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Status</label>
                  <select
                    className={styles.formInput}
                    value={activityFormData.status}
                    onChange={(e) => setActivityFormData({ ...activityFormData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Image</label>
                <div className={styles.imageUploadContainer}>
                  <input
                    type="file"
                    id="activityImageInput"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setActivityImageFile(file);
                        setActivityImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <label htmlFor="activityImageInput" className={styles.fileInputLabel}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Click to select image</span>
                  </label>
                </div>
                {(activityImagePreview || (activityFormMode === "edit" && activityFormData.image)) && (
                  <div className={styles.imagePreviewContainer}>
                    <div className={styles.imagePreview}>
                      <img
                        src={activityImagePreview || getImageUrl(activityFormData.image)}
                        alt="Preview"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActivityImagePreview("");
                        setActivityImageFile(null);
                      }}
                      className={styles.removeImageBtn}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={resetActivityForm}
                className={styles.formCancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={styles.formSubmitBtn}>
                {activityFormMode === "edit" ? "Update Activity" : "Create Activity"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Sub-Activity Manager Modal */}
      <Modal
        isOpen={subActivityManager.isOpen}
        onClose={() => setSubActivityManager({ isOpen: false, activity: null, subActivities: [], loading: false })}
        title={`Manage Sub-Activities: ${subActivityManager.activity?.title || ''}`}
        headerAction={
          <button
            onClick={() => setSubActivityFormMode("add")}
            className="btn btn-sm"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px'
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="me-1">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Sub-Activity
          </button>
        }
      >
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {subActivityManager.loading ? (
            <div className="text-center p-4">Loading...</div>
          ) : subActivityManager.subActivities.length === 0 ? (
            <div className="text-center p-4 text-muted">No sub-activities found. Add one to get started.</div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Short Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subActivityManager.subActivities.map((item) => (
                    <tr key={item._id}>
                      <td>
                        {item.image ? (
                          <img src={getImageUrl(item.image)} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                        ) : (
                          <div style={{ width: '50px', height: '50px', backgroundColor: '#e5e7eb', borderRadius: '4px' }} />
                        )}
                      </td>
                      <td>{item.title}</td>
                      <td>{item.short_description || '—'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => handleSubActivityEdit(item)}
                            className="btn btn-sm btn-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openThirdCategoryManager(item)}
                            className="btn btn-sm"
                            style={{
                              backgroundColor: '#f0f9ff',
                              borderColor: '#3b82f6',
                              color: '#3b82f6'
                            }}
                            title="Manage Third Categories"
                          >
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="me-1">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Third
                          </button>
                          <button
                            onClick={() => setConfirmModal({ isOpen: true, type: 'subactivity', id: item._id, name: item.title })}
                            className="btn btn-sm btn-danger"
                          >
                            Delete
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

      {/* Sub-Activity Form Modal */}
      <Modal
        isOpen={subActivityFormMode !== null}
        onClose={resetSubActivityForm}
        title={subActivityFormMode === "edit" ? "Edit Sub-Activity" : "Create Sub-Activity"}
      >
        <div className={styles.modalFormContent}>
          <form onSubmit={handleSubActivityFormSubmit} className={styles.formContainer}>
            <div className={styles.formSection}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Title <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={subActivityFormData.title}
                  onChange={(e) => setSubActivityFormData({ ...subActivityFormData, title: e.target.value })}
                  placeholder="Enter title"
                  required
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Short Description</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={subActivityFormData.short_description}
                  onChange={(e) => setSubActivityFormData({ ...subActivityFormData, short_description: e.target.value })}
                  placeholder="Enter short description"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Description</label>
                <div style={{ minHeight: '200px' }}>
                  <CKEditorWrapper
                    data={subActivityFormData.description || ''}
                    config={editorConfiguration}
                    onReady={(editor) => {
                      setSubActivityEditorInstance(editor);
                      if (!editor) return;
                      editor.config.filebrowserUploadUrl = IMAGE_UPLOAD_URL;
                      editor.config.filebrowserImageUploadUrl = IMAGE_UPLOAD_URL;
                    }}
                    onChange={(event, editor) => {
                      const data = editor?.getData ? editor.getData() : event.target.value;
                      setSubActivityFormData((prev) => ({ ...prev, description: data }));
                    }}
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Image</label>
                <div className={styles.imageUploadContainer}>
                  <input
                    type="file"
                    id="subActivityImageInput"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSubActivityImageFile(file);
                        setSubActivityImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <label htmlFor="subActivityImageInput" className={styles.fileInputLabel}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Click to select image</span>
                  </label>
                </div>
                {(subActivityImagePreview || (subActivityFormMode === "edit" && subActivityFormData.image)) && (
                  <div className={styles.imagePreviewContainer}>
                    <div className={styles.imagePreview}>
                      <img
                        src={subActivityImagePreview || getImageUrl(subActivityFormData.image)}
                        alt="Preview"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSubActivityImagePreview("");
                        setSubActivityImageFile(null);
                      }}
                      className={styles.removeImageBtn}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={resetSubActivityForm}
                className={styles.formCancelBtn}
              >
                Cancel
              </button>
              {subActivityFormMode === "add" && (
                <button
                  type="button"
                  className={styles.formSubmitBtn}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    marginRight: '8px'
                  }}
                  onClick={(e) => {
                    handleSubActivityFormSubmit(e, false);
                  }}
                >
                  Create & Add More
                </button>
              )}
              <button 
                type="button"
                className={styles.formSubmitBtn}
                onClick={(e) => {
                  handleSubActivityFormSubmit(e, true);
                }}
              >
                {subActivityFormMode === "edit" ? "Update Sub-Activity" : "Create Sub-Activity"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Video Testimonial Manager Modal */}
      <Modal
        isOpen={videoManager.isOpen}
        onClose={() => setVideoManager({ isOpen: false, activity: null, videos: [], loading: false })}
        title={`Manage Video Testimonials: ${videoManager.activity?.title || ''}`}
        headerAction={
          <button
            onClick={() => setVideoFormMode("add")}
            className="btn btn-sm"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px'
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="me-1">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Video
          </button>
        }
      >
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {videoManager.loading ? (
            <div className="text-center p-4">Loading...</div>
          ) : videoManager.videos.length === 0 ? (
            <div className="text-center p-4 text-muted">No video testimonials found. Add one to get started.</div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Video URL</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videoManager.videos.map((item) => (
                    <tr key={item._id}>
                      <td>
                        {item.image ? (
                          <img src={getImageUrl(item.image)} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                        ) : (
                          <div style={{ width: '50px', height: '50px', backgroundColor: '#e5e7eb', borderRadius: '4px' }} />
                        )}
                      </td>
                      <td>{item.title}</td>
                      <td>
                        <a href={item.video_url} target="_blank" rel="noreferrer" className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                          {item.video_url || '—'}
                        </a>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => handleVideoEdit(item)}
                            className="btn btn-sm btn-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setConfirmModal({ isOpen: true, type: 'video', id: item._id, name: item.title })}
                            className="btn btn-sm btn-danger"
                          >
                            Delete
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

      {/* Video Testimonial Form Modal */}
      <Modal
        isOpen={videoFormMode !== null}
        onClose={resetVideoForm}
        title={videoFormMode === "edit" ? "Edit Video Testimonial" : "Create Video Testimonial"}
      >
        <div className={styles.modalFormContent}>
          <form onSubmit={handleVideoFormSubmit} className={styles.formContainer}>
            <div className={styles.formSection}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Title <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={videoFormData.title}
                  onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                  placeholder="Enter title"
                  required
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Short Description</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={videoFormData.short_description}
                  onChange={(e) => setVideoFormData({ ...videoFormData, short_description: e.target.value })}
                  placeholder="Enter short description"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Video URL</label>
                <input
                  type="url"
                  className={styles.formInput}
                  value={videoFormData.video_url}
                  onChange={(e) => setVideoFormData({ ...videoFormData, video_url: e.target.value })}
                  placeholder="Enter video URL (YouTube, etc.)"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Description</label>
                <div style={{ minHeight: '200px' }}>
                  <CKEditorWrapper
                    data={videoFormData.description || ''}
                    config={editorConfiguration}
                    onReady={(editor) => {
                      setVideoEditorInstance(editor);
                      if (!editor) return;
                      editor.config.filebrowserUploadUrl = IMAGE_UPLOAD_URL;
                      editor.config.filebrowserImageUploadUrl = IMAGE_UPLOAD_URL;
                    }}
                    onChange={(event, editor) => {
                      const data = editor?.getData ? editor.getData() : event.target.value;
                      setVideoFormData((prev) => ({ ...prev, description: data }));
                    }}
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Image</label>
                <div className={styles.imageUploadContainer}>
                  <input
                    type="file"
                    id="videoImageInput"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setVideoImageFile(file);
                        setVideoImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <label htmlFor="videoImageInput" className={styles.fileInputLabel}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Click to select image</span>
                  </label>
                </div>
                {(videoImagePreview || (videoFormMode === "edit" && videoFormData.image)) && (
                  <div className={styles.imagePreviewContainer}>
                    <div className={styles.imagePreview}>
                      <img
                        src={videoImagePreview || getImageUrl(videoFormData.image)}
                        alt="Preview"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoImagePreview("");
                        setVideoImageFile(null);
                      }}
                      className={styles.removeImageBtn}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={resetVideoForm}
                className={styles.formCancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={styles.formSubmitBtn}>
                {videoFormMode === "edit" ? "Update Video" : "Create Video"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Third Category Manager Modal */}
      <Modal
        isOpen={thirdCategoryManager.isOpen}
        onClose={() => setThirdCategoryManager({ isOpen: false, subActivity: null, thirdCategories: [], loading: false })}
        title={`Manage Third Categories: ${thirdCategoryManager.subActivity?.title || ''}`}
        headerAction={
          <button
            onClick={() => setThirdCategoryFormMode("add")}
            className="btn btn-sm"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px'
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="me-1">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Third Category
          </button>
        }
      >
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {thirdCategoryManager.loading ? (
            <div className="text-center p-4">Loading...</div>
          ) : thirdCategoryManager.thirdCategories.length === 0 ? (
            <div className="text-center p-4 text-muted">No third categories found. Add one to get started.</div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Short Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {thirdCategoryManager.thirdCategories.map((item) => (
                    <tr key={item._id}>
                      <td>
                        {item.image ? (
                          <img src={getImageUrl(item.image)} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                        ) : (
                          <div style={{ width: '50px', height: '50px', backgroundColor: '#e5e7eb', borderRadius: '4px' }} />
                        )}
                      </td>
                      <td>{item.title}</td>
                      <td>{item.short_description || '—'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => handleThirdCategoryEdit(item)}
                            className="btn btn-sm btn-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setConfirmModal({ isOpen: true, type: 'thirdcategory', id: item._id, name: item.title })}
                            className="btn btn-sm btn-danger"
                          >
                            Delete
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

      {/* Third Category Form Modal */}
      <Modal
        isOpen={thirdCategoryFormMode !== null}
        onClose={resetThirdCategoryForm}
        title={thirdCategoryFormMode === "edit" ? "Edit Third Category" : "Create Third Category"}
      >
        <div className={styles.modalFormContent}>
          <form onSubmit={(e) => handleThirdCategoryFormSubmit(e, false)} className={styles.formContainer}>
            <div className={styles.formSection}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Title <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={thirdCategoryFormData.title}
                  onChange={(e) => setThirdCategoryFormData({ ...thirdCategoryFormData, title: e.target.value })}
                  placeholder="Enter title"
                  required
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Short Description</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={thirdCategoryFormData.short_description}
                  onChange={(e) => setThirdCategoryFormData({ ...thirdCategoryFormData, short_description: e.target.value })}
                  placeholder="Enter short description"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Description</label>
                <div style={{ minHeight: '200px' }}>
                  <CKEditorWrapper
                    data={thirdCategoryFormData.description || ''}
                    config={editorConfiguration}
                    onReady={(editor) => {
                      setThirdCategoryEditorInstance(editor);
                      if (!editor) return;
                      editor.config.filebrowserUploadUrl = IMAGE_UPLOAD_URL;
                      editor.config.filebrowserImageUploadUrl = IMAGE_UPLOAD_URL;
                    }}
                    onChange={(event, editor) => {
                      const data = editor?.getData ? editor.getData() : event.target.value;
                      setThirdCategoryFormData((prev) => ({ ...prev, description: data }));
                    }}
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Image</label>
                <div className={styles.imageUploadContainer}>
                  <input
                    type="file"
                    id="thirdCategoryImageInput"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setThirdCategoryImageFile(file);
                        setThirdCategoryImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <label htmlFor="thirdCategoryImageInput" className={styles.fileInputLabel}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Click to select image</span>
                  </label>
                </div>
                {(thirdCategoryImagePreview || (thirdCategoryFormMode === "edit" && thirdCategoryFormData.image)) && (
                  <div className={styles.imagePreviewContainer}>
                    <div className={styles.imagePreview}>
                      <img
                        src={thirdCategoryImagePreview || getImageUrl(thirdCategoryFormData.image)}
                        alt="Preview"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setThirdCategoryImagePreview("");
                        setThirdCategoryImageFile(null);
                      }}
                      className={styles.removeImageBtn}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={resetThirdCategoryForm}
                className={styles.formCancelBtn}
              >
                Cancel
              </button>
              {thirdCategoryFormMode === "add" && (
                <button
                  type="button"
                  className={styles.formSubmitBtn}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    marginRight: '8px'
                  }}
                  onClick={(e) => {
                    handleThirdCategoryFormSubmit(e, false);
                  }}
                >
                  Create & Add More
                </button>
              )}
              <button 
                type="button"
                className={styles.formSubmitBtn}
                onClick={(e) => {
                  handleThirdCategoryFormSubmit(e, true);
                }}
              >
                {thirdCategoryFormMode === "edit" ? "Update Third Category" : "Create Third Category"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* View Activity Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, activity: null })}
        title="View Activity Details"
      >
        {viewModal.activity && (
          <div className={styles.viewModalContent}>
            <div className={styles.viewSection}>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Title</label>
                <div className={styles.viewValue}>{viewModal.activity.title}</div>
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Subtitle</label>
                <div className={styles.viewValue}>{viewModal.activity.subtitle || 'N/A'}</div>
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Content</label>
                <div
                  className={`${styles.viewValue} ${styles.viewContentPreview || ''}`}
                  dangerouslySetInnerHTML={{ __html: viewModal.activity.content || 'N/A' }}
                />
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Status</label>
                <div className={styles.viewValue}>
                  <span className={`badge ${viewModal.activity.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                    {viewModal.activity.status}
                  </span>
                </div>
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Sub-Activities</label>
                <div className={styles.viewValue}>
                  {viewModal.activity.subcategories?.length > 0 ? (
                    <ul>
                      {viewModal.activity.subcategories.map((sub) => (
                        <li key={sub._id}>{sub.title}</li>
                      ))}
                    </ul>
                  ) : (
                    'None'
                  )}
                </div>
              </div>
              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Video Testimonials</label>
                <div className={styles.viewValue}>
                  {viewModal.activity.testimonial_video?.length > 0 ? (
                    <ul>
                      {viewModal.activity.testimonial_video.map((video) => (
                        <li key={video._id}>{video.title}</li>
                      ))}
                    </ul>
                  ) : (
                    'None'
                  )}
                </div>
              </div>
            </div>
            <div className={styles.viewModalActions}>
              <button
                onClick={() => setViewModal({ isOpen: false, activity: null })}
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

