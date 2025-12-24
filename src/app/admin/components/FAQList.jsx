'use client';

import React, { useState, useEffect, useMemo } from "react";
import dynamic from 'next/dynamic';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonDataGrid, { Tooltip, StatusBadge } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from "./CMSList.module.css";

// CKEditor Wrapper Component to handle client-side only rendering
const CKEditorWrapper = dynamic(
  () => import('./CKEditorWrapper'),
  {
    ssr: false,
    loading: () => null
  }
);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '${API_BASE_URL}';
const FAQ_ENDPOINT = `${API_BASE_URL}/api/faq`;
const IMAGE_UPLOAD_URL = `${API_BASE_URL}/api/cms/upload-image`;

// Enhanced Modal Component
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
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalIcon}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title.includes("Edit") ? "Update FAQ details" : "Create a new FAQ entry"}
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
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
};

export default function FAQList() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });
  const [editId, setEditId] = useState(null);
  const [editorInstance, setEditorInstance] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    faqId: null,
    faqQuestion: ""
  });
  const [viewModal, setViewModal] = useState({
    isOpen: false,
    faq: null
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await fetch(FAQ_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch FAQs");
      const data = await response.json();
      setFaqs(data.data || []);
    } catch (err) {
      toast.error(`Failed to fetch FAQs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // CKEditor 4 configuration
  const editorConfiguration = {
    height: 300,
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
      { name: 'forms', items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'] },
      '/',
      { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
      { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'] },
      { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
      { name: 'insert', items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
      '/',
      { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
      { name: 'colors', items: ['TextColor', 'BGColor'] },
      { name: 'tools', items: ['Maximize', 'ShowBlocks'] }
    ]
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const latestAnswer = editorInstance?.getData ? editorInstance.getData() : formData.answer;
      const payload = {
        question: formData.question,
        answer: latestAnswer || "",
      };

      let response;
      if (formMode === "edit") {
        response = await fetch(`${FAQ_ENDPOINT}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(FAQ_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to save: ${errorData.message || 'Unknown error'}`);
        return;
      }

      toast.success(formMode === "edit" ? "FAQ updated successfully!" : "FAQ created successfully!");
      setFormMode(null);
      setEditId(null);
      setEditorInstance(null);
      setFormData({
        question: "",
        answer: "",
      });
      fetchFAQs();
    } catch (error) {
      toast.error(`Failed to save. Error: ${error.message}`);
    }
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    setEditId(item._id);
    setFormData({
      question: item.question || "",
      answer: item.answer || "",
    });
  };

  const handleDeleteClick = (id, question) => {
    setConfirmModal({
      isOpen: true,
      faqId: id,
      faqQuestion: question
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(`${FAQ_ENDPOINT}/${confirmModal.faqId}`, { method: "DELETE" });
      setFaqs(faqs.filter((item) => item._id !== confirmModal.faqId));
      toast.success("FAQ deleted successfully!");
    } catch (error) {
      toast.error(`Failed to delete FAQ: ${error.message}`);
    } finally {
      setConfirmModal({ isOpen: false, faqId: null, faqQuestion: "" });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmModal({ isOpen: false, faqId: null, faqQuestion: "" });
  };

  // Filter FAQs by search term
  const filteredFAQs = useMemo(() => {
    return faqs.filter((item) => {
      const searchMatch = searchTerm === "" ||
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase());

      return searchMatch;
    });
  }, [faqs, searchTerm]);

  // Define table columns
  const columns = [
    {
      field: 'question',
      headerName: 'Question',
      width: 300,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="fw-medium text-truncate" style={{ maxWidth: '280px' }} title={params.value}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: 'answer',
      headerName: 'Answer',
      width: 400,
      renderCell: (params) => (
        <Tooltip content={params.value}>
          <div className="text-muted text-truncate" style={{ maxWidth: '380px' }} title={params.value}>
            {params.value}
          </div>
        </Tooltip>
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
            onClick={() => setViewModal({ isOpen: true, faq: params.row })}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#e0f2fe',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }}
            title="View FAQ Details"
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
            title="Edit FAQ"
            onMouseEnter={(e) => e.target.style.backgroundColor = '#bae6fd'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#e0f2fe'}
          >
            <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleDeleteClick(params.row._id, params.row.question)}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#fee2e2',
              border: 'none',
              borderRadius: '6px',
              padding: 0
            }}
            title="Delete FAQ"
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
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete FAQ"
        message={`Are you sure you want to delete "${confirmModal.faqQuestion}"? This action cannot be undone.`}
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
                  placeholder="Search FAQs..."
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
              <span className={styles.buttonTextFull}>Add New FAQ</span>
              <span className={styles.buttonTextShort}>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <CommonDataGrid
        data={filteredFAQs}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 15, 20, 50]}
        initialPageSize={10}
        noDataMessage="No FAQs found"
        noDataDescription={
          searchTerm
            ? "Try adjusting your search criteria."
            : "Get started by creating your first FAQ."
        }
        noDataAction={
          !searchTerm ? {
            onClick: () => setFormMode("add"),
            text: "Create First FAQ"
          } : null
        }
        loadingMessage="Loading FAQs..."
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
          setEditorInstance(null);
          setFormData({
            question: "",
            answer: "",
          });
        }}
        title={formMode === "edit" ? "Edit FAQ" : "Create New FAQ"}
      >
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>FAQ Details</h3>
                <p className={styles.formSectionDescription}>Enter question and answer</p>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Question <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Enter the question"
                  required
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Answer <span className={styles.required}>*</span>
                </label>
                <div style={{ minHeight: '250px' }}>
                  <CKEditorWrapper
                    data={formData.answer || ''}
                    config={editorConfiguration}
                    onReady={(editor) => {
                      setEditorInstance(editor);
                      if (!editor) return;

                      // Configure upload URLs
                      editor.config.filebrowserUploadUrl = IMAGE_UPLOAD_URL;
                      editor.config.filebrowserImageUploadUrl = IMAGE_UPLOAD_URL;

                      // Handle file upload
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
                            toast.error(response?.message || 'Image upload failed. Please try again.');
                            return;
                          }

                          const fullUrl = response.url.startsWith('http')
                            ? response.url
                            : `${API_BASE_URL}${response.url}`;

                          evt.data.url = fullUrl;
                          toast.success('Image uploaded successfully!', { autoClose: 2000 });
                        } catch (parseError) {
                          evt.cancel();
                          toast.error('Unexpected upload response. Please try again.');
                        }
                      });
                    }}
                    onChange={(event, editor) => {
                      const data = editor?.getData ? editor.getData() : event.target.value;
                      setFormData((prev) => ({ ...prev, answer: data }));
                    }}
                  />
                </div>
                <small className={styles.formHelp}>
                  Format your answer using the toolbar. You can add images, links, and formatted text.
                </small>
              </div>

            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => {
                  setFormMode(null);
                  setEditId(null);
                  setEditorInstance(null);
                  setFormData({
                    question: "",
                    answer: "",
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
                {formMode === "edit" ? "Update FAQ" : "Create FAQ"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* View FAQ Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, faq: null })}
        title="View FAQ Details"
      >
        {viewModal.faq && (
          <div className={styles.viewModalContent}>
            <div className={styles.viewSection}>
              <div className={styles.viewSectionHeader}>
                <h3 className={styles.viewSectionTitle}>FAQ Information</h3>
              </div>

              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Question</label>
                <div className={styles.viewValue}>{viewModal.faq.question}</div>
              </div>

              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Answer</label>
                <div
                  className={`${styles.viewValue} ${styles.viewContentPreview || ''}`}
                  dangerouslySetInnerHTML={{ __html: viewModal.faq.answer || 'N/A' }}
                />
              </div>

              <div className={styles.viewField}>
                <label className={styles.viewLabel}>Created At</label>
                <div className={styles.viewValue}>
                  {viewModal.faq.createdAt ? new Date(viewModal.faq.createdAt).toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>

            <div className={styles.viewModalActions}>
              <button
                onClick={() => setViewModal({ isOpen: false, faq: null })}
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

