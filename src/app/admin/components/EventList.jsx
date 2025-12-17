'use client';

import React, { useState, useEffect, useMemo } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommonDataGrid, { Tooltip, StatusBadge } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from './EventList.module.css';

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit") ? "Update event details and settings" : "Create a new event with all details"}
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

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formMode, setFormMode] = useState(null); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    author: "",
    image: ""
  });
  const [editId, setEditId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [authorDropdownOpen, setAuthorDropdownOpen] = useState(false);

  // Image upload state
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    eventId: null,
    eventName: ""
  });

  // View modal state
  const [viewModal, setViewModal] = useState({
    isOpen: false,
    event: null,
    loading: false
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        setImagePreview(dataUrl); // Set preview for display
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetch event details by ID
  const fetchEventById = async (id) => {
    try {
      setViewModal({ isOpen: true, event: null, loading: true });
      const response = await fetch(`${API_BASE_URL}/api/events/${id}`);
      if (!response.ok) throw new Error("Failed to fetch event details");
      const data = await response.json();
      const eventData = data.data || data;
      setViewModal({ isOpen: true, event: eventData, loading: false });
    } catch (err) {
      toast.error(`Failed to fetch event details: ${err.message}`);
      setViewModal({ isOpen: false, event: null, loading: false });
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/events/`);
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      // Handle new API response format with data property
      setEvents(data.data || data || []);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to fetch events: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Updated delete functions
  const handleDeleteClick = (id, name) => {
    setConfirmModal({
      isOpen: true,
      eventId: id,
      eventName: name
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/events/${confirmModal.eventId}`, { method: "DELETE" });
      setEvents(events.filter((item) => item._id !== confirmModal.eventId));
      toast.success("Event deleted successfully!");
    } catch (error) {
      toast.error(`Failed to delete event: ${error.message}`);
    } finally {
      setConfirmModal({ isOpen: false, eventId: null, eventName: "" });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmModal({ isOpen: false, eventId: null, eventName: "" });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create FormData object for multipart/form-data
      const submitFormData = new FormData();
      
      // Add text fields
      submitFormData.append('name', formData.name);
      submitFormData.append('description', formData.description);
      submitFormData.append('location', formData.location);
      submitFormData.append('author', formData.author);
      
      // Add date field
      if (formData.date) {
        submitFormData.append('date', formData.date);
      }

      // Handle image file
      if (imageFile) {
        // If we have a new file, append it
        submitFormData.append('image', imageFile);
      } else if (formMode === "edit" && formData.image && formData.image.startsWith('http')) {
        // For edit mode without new file upload, skip image field
        console.log('Edit mode: keeping existing image');
      }

      console.log('Submitting event data as FormData');
      console.log('Form mode:', formMode);
      console.log('Has image file:', !!imageFile);

      let response;
      if (formMode === "edit") {
        response = await fetch(`${API_BASE_URL}/api/events/${editId}`, {
          method: "PUT",
          body: submitFormData,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/api/events/`, {
          method: "POST",
          body: submitFormData,
        });
      }

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.log('Error response:', errorData);
        } catch (e) {
          console.log('Could not parse error response as JSON');
        }
        toast.error(`Failed to save: ${errorData?.error || response.statusText || 'Unknown error'}`);
        return;
      }

      try {
        const result = await response.json();
        console.log('Success response:', result);
      } catch (jsonError) {
        console.log('No JSON response or empty response');
      }

      setFormMode(null);
      setEditId(null);
      setImageFile(null);
      setImagePreview(null);
      setFormData({
        name: "",
        description: "",
        date: "",
        location: "",
        author: "",
        image: ""
      });

      toast.success(formMode === "edit" ? "Event updated successfully!" : "Event created successfully!");
      fetchEvents();
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(`Failed to save. Error: ${error.message}`);
    }
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    setEditId(item._id);
    setImageFile(null);
    setImagePreview(item.image || null);
    
    setFormData({
      name: item.name || "",
      description: item.description || "",
      date: item.date ? new Date(item.date).toISOString().slice(0, 16) : "",
      location: item.location || "",
      author: item.author || "",
      image: item.image || ""
    });
  };

  const uniqueAuthors = useMemo(() => {
    const authors = [...new Set(events.map(item => item.author).filter(Boolean))];
    return authors.sort();
  }, [events]);

  // Filter events by author and search term
  const filteredEvents = useMemo(() => {
    return events.filter((item) => {
      const authorMatch = authorFilter === "all" || item.author === authorFilter;
      const searchMatch = searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase()));

      return authorMatch && searchMatch;
    });
  }, [events, authorFilter, searchTerm]);

  // Define table columns for Common DataGrid
  const columns = [
    // Name column
    {
      field: 'name',
      headerName: 'Event Name',
      width: 180,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="text-truncate" style={{ maxWidth: '160px' }} title={params.value}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },

    // Description column
    {
      field: 'description',
      headerName: 'Description',
      width: 180,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="text-muted text-truncate" style={{ maxWidth: '160px' }} title={params.value}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },

    // Date column
    {
      field: 'date',
      headerName: 'Date',
      width: 120,
      renderCell: (params) => (
        <span className="small text-muted">
          {params.value ? new Date(params.value).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },

    // Location column
    {
      field: 'location',
      headerName: 'Location',
      width: 120,
      renderCell: (params) => (
        <div className="d-flex align-items-center">
          <span className="small text-truncate" style={{ maxWidth: '120px' }} title={params.value}>
            {params.value}
          </span>
        </div>
      ),
    },

    // Author column
    {
      field: 'author',
      headerName: 'Author',
      width: 120,
      renderCell: (params) => (
        <div className="d-flex align-items-center">
          <span className="small text-truncate" style={{ maxWidth: '120px' }} title={params.value}>
            {params.value}
          </span>
        </div>
      ),
    },

    // Created At column
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 110,
      renderCell: (params) => (
        <span className="small text-muted">
          {params.value ? new Date(params.value).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    // Image column
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <div className="d-flex align-items-center justify-content-center">
          {params.value ? (
            <img 
              src={params.value} 
              alt="Event"
              style={{ 
                width: '50px', 
                height: '50px', 
                objectFit: 'cover',
                borderRadius: '6px',
                border: '1px solid #d1d5db'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div style={{ 
              width: '50px', 
              height: '50px', 
              backgroundColor: '#f3f4f6',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
              fontSize: '12px'
            }}>
              No Image
            </div>
          )}
        </div>
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
            onClick={() => fetchEventById(params.row._id)}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{ 
              width: '32px', 
              height: '32px',
              backgroundColor: '#e0f2fe',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }}
            title="View Event Details"
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
            title="Edit Event"
            onMouseEnter={(e) => e.target.style.backgroundColor = '#bae6fd'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#e0f2fe'}
          >
            <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleDeleteClick(params.row._id, params.row.name)}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{ 
              width: '32px', 
              height: '32px',
              backgroundColor: '#fee2e2',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }}
            title="Delete Event"
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
        title="Delete Event"
        message={`Are you sure you want to delete "${confirmModal.eventName}"? This action cannot be undone.`}
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
                  placeholder="Search events..."
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
                    value={authorFilter}
                    onChange={(e) => {
                      setAuthorFilter(e.target.value);
                      setAuthorDropdownOpen(false);
                    }}
                    onMouseDown={() => setAuthorDropdownOpen(!authorDropdownOpen)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Authors</option>
                    {uniqueAuthors.map((author) => (
                      <option key={author} value={author}>
                        {author}
                      </option>
                    ))}
                  </select>
                  <span className={`${styles.dropdownIcon} ${authorDropdownOpen ? styles.rotatedIcon : ''}`}>
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
                minWidth: '140px'
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className={styles.buttonTextFull}>Add New Event</span>
              <span className={styles.buttonTextShort}>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Data Table */}
      <CommonDataGrid
        data={filteredEvents}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 15, 20, 50]}
        initialPageSize={10}
        noDataMessage="No events found"
        noDataDescription={
          searchTerm || authorFilter !== "all"
            ? "Try adjusting your search criteria or filters."
            : "Get started by creating your first event."
        }
        noDataAction={
          (!searchTerm && authorFilter === "all") ? {
            onClick: () => setFormMode("add"),
            text: "Create First Event"
          } : null
        }
        loadingMessage="Loading events..."
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
          setImageFile(null);
          setImagePreview(null);
          setFormData({
            name: "",
            description: "",
            date: "",
            location: "",
            author: "",
            image: ""
          });
        }}
        title={formMode === "edit" ? "Edit Event" : "Create New Event"}
      >
        {/* Enhanced Modal Content */}
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
            {/* Basic Information Section */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Event Details</h3>
                <p className={styles.formSectionDescription}>Essential information for the event</p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Event Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter event name..."
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Event Date <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className={styles.formInput}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
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
                  placeholder="Enter event description..."
                  required
                />
              </div>
            </div>

            {/* Additional Information Section */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Location & Organizer</h3>
                <p className={styles.formSectionDescription}>Where and who is organizing the event</p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Location <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Enter event location..."
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    Author/Organizer <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Enter author/organizer name..."
                    required
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={styles.formInput}
                  style={{ padding: '8px' }}
                />
                <small className={styles.formHelp}>Upload event image (max 5MB, JPG, PNG, GIF)</small>
                {imagePreview && (
                  <div style={{ marginTop: '10px' }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '200px', 
                        borderRadius: '8px',
                        border: '1px solid #d1d5db'
                      }} 
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => {
                  setFormMode(null);
                  setEditId(null);
                  setImageFile(null);
                  setImagePreview(null);
                  setFormData({
                    name: "",
                    description: "",
                    date: "",
                    location: "",
                    author: "",
                    image: ""
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
                {formMode === "edit" ? "Update Event" : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* View Event Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, event: null, loading: false })}
        title="View Event Details"
      >
        {viewModal.loading ? (
          <div className={styles.viewModalContent} style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading event details...</p>
          </div>
        ) : viewModal.event ? (
          <div className={styles.viewModalContent}>
            <div className={styles.viewSection}>
              <div className={styles.viewSectionHeader}>
                <h3 className={styles.viewSectionTitle}>Event Information</h3>
              </div>
              
              <div className={styles.viewGrid}>
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Name</label>
                  <div className={styles.viewValue}>{viewModal.event.name}</div>
                </div>
                
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Author</label>
                  <div className={styles.viewValue}>{viewModal.event.author || 'N/A'}</div>
                </div>
              </div>

              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Description</label>
                <div className={styles.viewValue}>{viewModal.event.description || 'N/A'}</div>
              </div>

              <div className={styles.viewGrid}>
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Date</label>
                  <div className={styles.viewValue}>
                    {viewModal.event.date ? new Date(viewModal.event.date).toLocaleString() : 'N/A'}
                  </div>
                </div>
                
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Location</label>
                  <div className={styles.viewValue}>{viewModal.event.location || 'N/A'}</div>
                </div>

                 <div className={styles.viewField}>
                <label className={styles.viewLabel}>Created At</label>
                <div className={styles.viewValue}>
                  {viewModal.event.createdAt ? new Date(viewModal.event.createdAt).toLocaleString() : 'N/A'}
                </div>
              </div>
              </div>
            </div>

            <div className={styles.viewModalActions}>
              <button
                onClick={() => setViewModal({ isOpen: false, event: null, loading: false })}
                className={styles.viewCloseBtn}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.viewModalContent} style={{ textAlign: 'center', padding: '2rem' }}>
            <p className="text-muted">Unable to load event details</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

