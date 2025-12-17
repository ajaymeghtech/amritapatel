// ResearchList.jsx
'use client';

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonDataGrid, { Tooltip } from "@/app/components/DataGrid";
import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
import styles from "./NewsList.module.css"; // reuse existing admin styles

const CKEditorWrapper = dynamic(() => import("./CKEditorWrapper"), { ssr: false, loading: () => null });

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const emptyResearch = {
  title: "",
  slug: "",
  short_description: "",
  description: "",
  researcher: "",
  image: "",
  pdf: "",
  status: "active"
};

const emptySubcategory = {
  name: "",
  short_description: "",
  description: "",
  image: "",
  link: ""
};

function slugify(text = "") {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-");
}

/** Modal component copied from projectlist.js style */
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalIcon}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <p className={styles.modalSubtitle}>
                {title && title.includes("Edit") ? "Update research details" : "Create a new research entry"}
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

export default function Research() {
  const [researchList, setResearchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Research form state
  const [formMode, setFormMode] = useState(null); // 'add' | 'edit' | null
  const [formData, setFormData] = useState(emptyResearch);
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [editId, setEditId] = useState(null);

  // Subcategory state & modal
  const [subModal, setSubModal] = useState({ isOpen: false, researchId: null, mode: null, data: emptySubcategory, editId: null });
  const [subImageFile, setSubImageFile] = useState(null);

  // View modal
  const [viewModal, setViewModal] = useState({ isOpen: false, item: null });

  // Delete confirmation
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, type: null, title: "" });
  // type: 'research' | 'subcategory'

  useEffect(() => {
    loadResearch();
  }, []);

  // ----------------------
  // API helpers
  // ----------------------
  const loadResearch = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/research/`);
      const json = await res.json();
      if (json.status && Array.isArray(json.data)) {
        setResearchList(json.data);
      } else {
        setResearchList([]);
      }
    } catch (err) {
      console.error("loadResearch error:", err);
      toast.error("Failed to load research list");
    } finally {
      setLoading(false);
    }
  };

  const createResearch = async (payloadFormData) => {
    const res = await fetch(`${API_BASE_URL}/api/research`, {
      method: "POST",
      body: payloadFormData
    });
    return res;
  };

  const updateResearch = async (id, payloadFormData) => {
    const res = await fetch(`${API_BASE_URL}/api/research/${id}`, {
      method: "PUT",
      body: payloadFormData
    });
    return res;
  };

  const deleteResearch = async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/research/${id}`, { method: "DELETE" });
    return res;
  };

  // Subcategory endpoints (assumed)
  const createSubcategory = async (payloadFormData) => {
    const res = await fetch(`${API_BASE_URL}/api/research/subcategory`, { method: "POST", body: payloadFormData });
    return res;
  };
  const updateSubcategory = async (id, payloadFormData) => {
    const res = await fetch(`${API_BASE_URL}/api/research/subcategory/${id}`, { method: "PUT", body: payloadFormData });
    return res;
  };
  const deleteSubcategory = async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/research/subcategory/${id}`, { method: "DELETE" });
    return res;
  };

  // ----------------------
  // Form helpers
  // ----------------------
  const resetForm = () => {
    setFormMode(null);
    setEditId(null);
    setFormData(emptyResearch);
    setImageFile(null);
    setPdfFile(null);
  };

  const openAddForm = () => {
    setFormMode("add");
    setFormData({ ...emptyResearch, slug: "" });
    setImageFile(null);
    setPdfFile(null);
  };

  const openEditForm = (item) => {
    setFormMode("edit");
    setEditId(item._id);
    setFormData({
      title: item.title || "",
      slug: item.slug || slugify(item.title || ""),
      short_description: item.short_description || "",
      description: item.description || "",
      researcher: item.researcher || "",
      image: item.image || "",
      pdf: item.pdf || "",
      status: item.status || "active"
    });
    setImageFile(null);
    setPdfFile(null);
  };

  const buildResearchFormData = () => {
    const fd = new FormData();
    fd.append("title", formData.title || "");
    fd.append("slug", formData.slug || slugify(formData.title || ""));
    fd.append("short_description", formData.short_description || "");
    fd.append("description", formData.description || "");
    fd.append("researcher", formData.researcher || "");
    fd.append("status", formData.status || "active");
    // files
    if (imageFile) fd.append("image", imageFile);
    else if (formData.image) fd.append("image", formData.image);

    if (pdfFile) fd.append("pdf", pdfFile);
    else if (formData.pdf) fd.append("pdf", formData.pdf);

    return fd;
  };

  // ----------------------
  // Submit handlers
  // ----------------------
  const handleResearchSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      setLoading(true);
      const fd = buildResearchFormData();

      let res;
      if (formMode === "edit" && editId) {
        res = await updateResearch(editId, fd);
      } else {
        res = await createResearch(fd);
      }

      const json = await res.json().catch(() => ({}));
      if (res.ok && json.status) {
        toast.success(`Research ${formMode === "edit" ? "updated" : "created"} successfully`);
        resetForm();
        await loadResearch();
      } else {
        const msg = json.message || "Failed to save research";
        toast.error(msg);
      }
    } catch (err) {
      console.error("handleResearchSubmit error:", err);
      toast.error("Failed to save research");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------
  // Delete handlers
  // ----------------------
  const confirmDelete = (id, type, title = "") => {
    setConfirmModal({ isOpen: true, id, type, title });
  };

  const handleDeleteConfirm = async () => {
    const { id, type } = confirmModal;
    if (!id) {
      setConfirmModal({ isOpen: false, id: null, type: null, title: "" });
      return;
    }
    try {
      setLoading(true);
      if (type === "research") {
        const res = await deleteResearch(id);
        const json = await res.json().catch(() => ({}));
        if (res.ok && json.status) {
          toast.success("Research deleted");
          await loadResearch();
        } else {
          toast.error(json.message || "Failed to delete research");
        }
      } else if (type === "subcategory") {
        const res = await deleteSubcategory(id);
        const json = await res.json().catch(() => ({}));
        if (res.ok && json.status) {
          toast.success("Subcategory deleted");
          // reload research list to reflect subcategory removal
          await loadResearch();
        } else {
          toast.error(json.message || "Failed to delete subcategory");
        }
      }
    } catch (err) {
      console.error("handleDeleteConfirm error:", err);
      toast.error("Deletion failed");
    } finally {
      setConfirmModal({ isOpen: false, id: null, type: null, title: "" });
      setLoading(false);
    }
  };

  // ----------------------
  // Subcategory CRUD
  // ----------------------
  const openAddSub = (researchId) => {
    setSubModal({ isOpen: true, researchId, mode: "add", data: emptySubcategory, editId: null });
    setSubImageFile(null);
  };

  const openEditSub = (researchId, sub) => {
    setSubModal({
      isOpen: true,
      researchId,
      mode: "edit",
      data: {
        name: sub.name || "",
        short_description: sub.short_description || "",
        description: sub.description || "",
        image: sub.image || "",
        link: sub.link || ""
      },
      editId: sub._id
    });
    setSubImageFile(null);
  };

  const buildSubFormData = () => {
    const fd = new FormData();
    fd.append("name", subModal.data.name || "");
    fd.append("short_description", subModal.data.short_description || "");
    fd.append("description", subModal.data.description || "");
    fd.append("link", subModal.data.link || "");
    fd.append("research_id", subModal.researchId || "");
    if (subImageFile) fd.append("image", subImageFile);
    else if (subModal.data.image) fd.append("image", subModal.data.image);
    return fd;
  };

  const handleSubSubmit = async (e) => {
    e.preventDefault();
    if (!subModal.data.name?.trim()) {
      toast.error("Subcategory name is required");
      return;
    }
    try {
      setLoading(true);
      const fd = buildSubFormData();
      let res;
      if (subModal.mode === "edit" && subModal.editId) {
        res = await updateSubcategory(subModal.editId, fd);
      } else {
        res = await createSubcategory(fd);
      }
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.status) {
        toast.success(`Subcategory ${subModal.mode === "edit" ? "updated" : "created"} successfully`);
        setSubModal({ isOpen: false, researchId: null, mode: null, data: emptySubcategory, editId: null });
        await loadResearch();
      } else {
        toast.error(json.message || "Failed to save subcategory");
      }
    } catch (err) {
      console.error("handleSubSubmit error:", err);
      toast.error("Failed to save subcategory");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------
  // UI utilities
  // ----------------------
  const filteredList = useMemo(() => {
    return researchList.filter((r) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch = !q || (r.title || "").toLowerCase().includes(q) || (r.researcher || "").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || (r.status || "") === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [researchList, searchTerm, statusFilter]);

  // DataGrid rows — ensure id is unique
  const gridData = filteredList.map((item, idx) => ({ ...item, id: item._id }));

  // Columns for CommonDataGrid
  const columns = [
    {
      field: "title",
      headerName: "Title",
      width: 260,
      renderCell: (params) => (
        <Tooltip content={params.row.title}>
          <div style={{ maxWidth: 220 }} className="text-truncate">{params.row.title}</div>
        </Tooltip>
      )
    },
  
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => <span className={`badge ${params.row.status === "active" ? "bg-success" : "bg-secondary"}`}>{params.row.status}</span>
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          {/* View */}
          <button
            title="View"

            onClick={() => setViewModal({ isOpen: true, item: params.row })}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#e0f2fe",
              border: "none",
              borderRadius: "6px",
              padding: 0,
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#bae6fd")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#e0f2fe")}
          >
            <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          {/* Edit */}
          <button
            title="Edit"
            onClick={() => openEditForm(params.row)}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#e0f2fe",
              border: "none",
              borderRadius: "6px",
              padding: 0,
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#bae6fd")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#e0f2fe")}
          >
            <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          {/* Add Subcategory */}
          {/* <button
            title="Add Subcategory"
            className={`${styles.actionBtn} ${styles.addSubBtn}`}
            onClick={() => openAddSub(params.row._id)}
            aria-label="Add subcategory"
          >
            <svg width="14" height="14" fill="none" stroke="#84cc16" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
          </button> */}

          {/* Delete */}
          <button
            title="Delete"
            onClick={() => confirmDelete(params.row._id, "research", params.row.title)}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#fee2e2",
              border: "none",
              borderRadius: "6px",
              padding: 0,
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#fecaca")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#fee2e2")}
          >
            <svg width="16" height="16" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  // ----------------------
  // Render
  // ----------------------
  return (
    <div style={{ width: "100%" }}>
      <ToastContainer position="top-right" autoClose={4000} />

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, type: null, title: "" })}
        onConfirm={handleDeleteConfirm}
        title={confirmModal.type === "subcategory" ? "Delete Subcategory" : "Delete Research"}
        message={`Are you sure you want to delete "${confirmModal.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* View Modal (uses shared Modal component for consistent header/close) */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, item: null })}
        title="View Research"
      >
        {viewModal.item && (
          <div className={styles.viewModalContent}>
            <div className={styles.viewSection}>

              <div className={styles.formGrid}>
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Title</label>
                  <div className={styles.viewValue}>{viewModal.item.title}</div>
                </div>

              </div>

              <div style={{ marginTop: 12 }}>
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Short description</label>
                  <div className={styles.viewValue}>{viewModal.item.short_description || "—"}</div>
                </div>

                <div className={styles.viewField} style={{ marginTop: 8 }}>
                  <label className={styles.viewLabel}>Description</label>
                  <div className={styles.viewValue}>
                    <div dangerouslySetInnerHTML={{ __html: viewModal.item.description || "" }} />
                  </div>
                </div>

                {viewModal.item.image && (
                  <div style={{ marginTop: 8 }}>
                    <img src={`${API_BASE_URL}${viewModal?.item?.image}`} alt="research" style={{ maxWidth: "100%" }} />
                  </div>
                )}

                {viewModal.item.pdf && (
                  <div style={{ marginTop: 8 }}>
                    <a href={`${API_BASE_URL}${viewModal?.item?.pdf}`} target="_blank" rel="noreferrer">View PDF</a>
                  </div>
                )}

                {/* Subcategories */}
                {/* <div style={{ marginTop: 12 }}>
                  <h5>Subcategories</h5>
                  <div>
                    {Array.isArray(viewModal.item.subcategories) && viewModal.item.subcategories.length ? (
                      viewModal.item.subcategories.map((s) => (
                        <div key={s._id} className={styles.subItem}>
                          <div className={styles.subItemHeader}>
                            <strong>{s.name}</strong>
                            <div className={styles.subItemActions}>
                              <button className="btn btn-sm" onClick={() => openEditSub(viewModal.item._id, s)}>Edit</button>
                              <button className="btn btn-sm" onClick={() => confirmDelete(s._id, "subcategory", s.name)}>Delete</button>
                            </div>
                          </div>
                          <div>{s.short_description}</div>
                          {s.image && <img src={`${API_BASE_URL}${s.image}`} alt={s.name} style={{ maxWidth: 160, marginTop: 8 }} />}
                          {s.link && <div style={{ marginTop: 6 }}><a href={s.link} target="_blank" rel="noreferrer">{s.link}</a></div>}
                        </div>
                      ))
                    ) : (
                      <div className="text-muted">No subcategories</div>
                    )}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <button className="btn" onClick={() => openAddSub(viewModal.item._id)}>Add Subcategory</button>
                  </div>
                </div> */}

              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Research Add/Edit Modal */}
      <Modal
        isOpen={!!formMode}
        onClose={resetForm}
        title={formMode === "edit" ? "Edit Research" : "Create Research"}
      >
        <div className={styles.modalFormContent}>
          <form onSubmit={handleResearchSubmit} className={styles.formContainer}>
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Research Details</h3>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Title <span className={styles.required}>*</span></label>
                  <input className={styles.formInput} value={formData.title} onChange={(e) => { setFormData({ ...formData, title: e.target.value, slug: slugify(e.target.value) }); }} />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Short Description</label>
                  <textarea className={styles.formInput} rows={3} value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} />
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Description</label>
                <div style={{ minHeight: 200 }}>
                  <CKEditorWrapper data={formData.description || ""} onChange={(evt, editor) => {
                    const data = editor?.getData ? editor.getData() : "";
                    setFormData({ ...formData, description: data });
                  }} />
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Status</label>
                <select className={styles.formSelect} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.formCancelBtn} onClick={resetForm}>Cancel</button>
              <button type="submit" className={styles.formSubmitBtn}>{formMode === "edit" ? "Update" : "Create"}</button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Subcategory Modal */}
      {subModal.isOpen && (
        <div className={styles.modalOverlay} onClick={() => setSubModal({ isOpen: false, researchId: null, mode: null, data: emptySubcategory, editId: null })}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{subModal.mode === "edit" ? "Edit Subcategory" : "Add Subcategory"}</h3>
              <button onClick={() => setSubModal({ isOpen: false, researchId: null, mode: null, data: emptySubcategory, editId: null })} className={styles.modalCloseBtn}>✕</button>
            </div>
            <div className={styles.modalContent}>
              <form onSubmit={handleSubSubmit}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Name <span className={styles.required}>*</span></label>
                  <input className={styles.formInput} value={subModal.data.name} onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, name: e.target.value } })} />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Short Description</label>
                  <textarea className={styles.formInput} rows={2} value={subModal.data.short_description} onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, short_description: e.target.value } })} />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Description</label>
                  <textarea className={styles.formInput} rows={4} value={subModal.data.description} onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, description: e.target.value } })} />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Link</label>
                  <input className={styles.formInput} value={subModal.data.link} onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, link: e.target.value } })} />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Image</label>
                  <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setSubImageFile(f); }} />
                  {(subImageFile || subModal.data.image) && (
                    <div style={{ marginTop: 8 }}>
                      <img src={subImageFile ? URL.createObjectURL(subImageFile) : `${API_BASE_URL}${subModal?.data?.image}`} alt="preview" style={{ maxWidth: 140 }} />
                      <div><button type="button" onClick={() => { setSubImageFile(null); setSubModal({ ...subModal, data: { ...subModal.data, image: "" } }); }}>Remove</button></div>
                    </div>
                  )}
                </div>

                <div className={styles.formActions} style={{ marginTop: 12 }}>
                  <button type="button" className={styles.formCancelBtn} onClick={() => setSubModal({ isOpen: false, researchId: null, mode: null, data: emptySubcategory, editId: null })}>Cancel</button>
                  <button type="submit" className={styles.formSubmitBtn}>{subModal.mode === "edit" ? "Update Subcategory" : "Create Subcategory"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Action bar */}
      <div className={styles.actionBar} style={{ marginBottom: 12 }}>
        <div className={styles.actionBarContent}>
          <div className={styles.actionBarLeft}>
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <input type="text" placeholder="Search research..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={styles.searchInput} />
                {searchTerm && <button onClick={() => setSearchTerm("")} className={styles.searchClear}>✕</button>}
              </div>
            </div>

            <div style={{ marginLeft: 12 }}>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.filterSelect}>
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
              <span className={styles.buttonTextFull}>Add Research</span>
              <span className={styles.buttonTextShort}>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <CommonDataGrid
        data={gridData}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 15]}
        initialPageSize={10}
        noDataMessage="No research items found"
        loadingMessage="Loading research..."
        showSerialNumber
        serialNumberField="srNo"
        serialNumberHeader="Sr.no."
      />
    </div>
  );
}