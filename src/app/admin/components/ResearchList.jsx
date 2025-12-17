



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

const emptySubcategory = {
  name: "",
  short_description: "",
  description: "",
  link: "",
  research_id: ""
};

function safeBase() {
  return String(API_BASE_URL || "").replace(/\/+$/, "");
}

function formatDate(dt) {
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return dt || "";
  }
}

/** Simple modal wrapper */
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

export default function ResearchList() {
  // subcategories list
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // research categories for dropdown
  const [researchCats, setResearchCats] = useState([]);

  // grid / filters
  const [searchTerm, setSearchTerm] = useState("");

  // add/edit modal state for subcategory
  const [subModal, setSubModal] = useState({
    isOpen: false,
    mode: null, // 'add' | 'edit'
    data: emptySubcategory,
    editId: null
  });
  const [subImageFile, setSubImageFile] = useState(null);

  // view modal
  const [viewModal, setViewModal] = useState({ isOpen: false, item: null });

  // delete confirmation
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, title: "" });

  // load on mount
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    await Promise.all([loadSubcategories(), loadResearchCats()]);
  };

  // ----------------------
  // API helpers (Option A)
  // ----------------------
  const loadSubcategories = async () => {
    try {
      setLoading(true);
      const base = safeBase();
      const res = await fetch(`${base}/api/research-subcategory/`);
      const json = await res.json().catch(() => ({}));
      if (json && json.status && Array.isArray(json.data)) {
        setList(json.data);
      } else {
        setList([]);
      }
    } catch (err) {
      console.error("loadSubcategories error:", err);
      toast.error("Failed to load subcategories");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadResearchCats = async () => {
    try {
      const base = safeBase();
      const res = await fetch(`${base}/api/research/`);
      const json = await res.json().catch(() => ({}));
      console.log("Research categories loaded:", json);
      if (json && json.status && Array.isArray(json.data)) {
        // map to minimal shape
        setResearchCats(json.data.map((r) => ({ id: r._id, title: r.title })));
      } else {
        setResearchCats([]);
      }
    } catch (err) {
      console.error("loadResearchCats error:", err);
      toast.error("Failed to load research categories");
      setResearchCats([]);
    }
  };

  const createSubcategory = async (fd) => {
    const base = safeBase();
    return await fetch(`${base}/api/research-subcategory/`, { method: "POST", body: fd });
  };

  const updateSubcategory = async (id, fd) => {
    const base = safeBase();
    return await fetch(`${base}/api/research-subcategory/${id}`, { method: "PUT", body: fd });
  };

  const deleteSubcategory = async (id) => {
    const base = safeBase();
    return await fetch(`${base}/api/research-subcategory/${id}`, { method: "DELETE" });
  };

  // ----------------------
  // Subcategory form helpers
  // ----------------------
  const openAddSub = () => {
    setSubModal({ isOpen: true, mode: "add", data: { ...emptySubcategory }, editId: null });
    setSubImageFile(null);
  };

 const openEditSub = (item) => {
  setSubModal({
    isOpen: true,
    mode: "edit",
    data: {
      name: item?.name || "",
      short_description: item?.short_description || "",
      description: item?.description || "",
      link: item?.link || item?.link_url || "",
      research_id: item?.research_id?._id || item?.research_id || ""
    },
    editId: item?._id || null
  });

  setSubImageFile(null);
};


  const buildSubFormData = () => {
    const fd = new FormData();
    fd.append("name", subModal.data.name || "");
    fd.append("short_description", subModal.data.short_description || "");
    fd.append("description", subModal.data.description || "");
    if (subModal.data.link) fd.append("link", subModal.data.link);
    fd.append("research_id", subModal.data.research_id || "");
    if (subImageFile) fd.append("image", subImageFile);
    // If editing and no new image provided, backend usually keeps existing image; avoid appending empty.
    return fd;
  };

  const handleSubSubmit = async (e) => {
    e.preventDefault();
    if (!subModal.data.name?.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!subModal.data.research_id) {
      toast.error("Please select parent research");
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
        setSubModal({ isOpen: false, mode: null, data: emptySubcategory, editId: null });
        setSubImageFile(null);
        await loadSubcategories();
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
  // Delete
  // ----------------------
  const confirmDelete = (id, title) => {
    setConfirmModal({ isOpen: true, id, title });
  };

  const handleDeleteConfirm = async () => {
    const { id } = confirmModal;
    if (!id) {
      setConfirmModal({ isOpen: false, id: null, title: "" });
      return;
    }
    try {
      setLoading(true);
      const res = await deleteSubcategory(id);
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.status) {
        toast.success("Subcategory deleted");
        await loadSubcategories();
      } else {
        toast.error(json.message || "Failed to delete subcategory");
      }
    } catch (err) {
      console.error("delete error:", err);
      toast.error("Deletion failed");
    } finally {
      setConfirmModal({ isOpen: false, id: null, title: "" });
      setLoading(false);
    }
  };

  // ----------------------
  // View modal
  // ----------------------
  const openView = (item) => {
    setViewModal({ isOpen: true, item });
  };

  // ----------------------
  // Grid / UI utilities
  // ----------------------
  const filteredList = useMemo(() => {
    const q = (searchTerm || "").trim().toLowerCase();
    if (!q) return list;
    return list.filter((r) => {
      const name = (r.name || "").toString().toLowerCase();
      const sd = (r.short_description || "").toString().toLowerCase();
      const researchTitle = (r.research_id && r.research_id.title) ? r.research_id.title.toLowerCase() : (r.research_id || "").toString().toLowerCase();
      return name.includes(q) || sd.includes(q) || researchTitle.includes(q);
    });
  }, [list, searchTerm]);

  const gridData = filteredList.map((item) => ({ ...item, id: item._id }));

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 280,
      renderCell: (params) => (
        <Tooltip content={params.row.name}>
          <div style={{ maxWidth: 260 }} className="text-truncate">{params.row.name}</div>
        </Tooltip>
      )
    },
   
    {
      field: "research",
      headerName: "Research",
      width: 200,
      renderCell: (params) => {
        const r = params.row.research_id;
        const title = r && typeof r === "object" ? r.title : (r || "");
        return <div style={{ maxWidth: 180 }} className="text-truncate">{title}</div>;
      }
    },
    {
      field: "link",
      headerName: "Link",
      width: 180,
      renderCell: (params) => {
        const l = params.row.link || params.row.link_url || "";
        if (!l) return <span>—</span>;
        const isExternal = /^https?:\/\//i.test(l);
        return (
          <a href={isExternal ? l : (String(l).startsWith("http") ? l : l)} target="_blank" rel="noreferrer" className="text-truncate" style={{ display: "inline-block", maxWidth: 160 }}>
            {l}
          </a>
        );
      }
    },
    {
      field: "image",
      headerName: "Image",
      width: 120,
      renderCell: (params) => {
        const img = params.row.image;
        if (!img) return <span>—</span>;
        const src = `${safeBase()}${img}`;
        return <img src={src} alt={params.row.name} style={{ width: 72, height: 40, objectFit: "cover", borderRadius: 6 }} />;
      }
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 170,
      renderCell: (params) => <div>{formatDate(params.row.createdAt)}</div>
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const item = params.row;
        return (
          <div className="d-flex justify-content-center align-items-center gap-2">
            <button
              title="View"
              onClick={() => openView(item)}
              className="btn btn-sm d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px", backgroundColor: "#e0f2fe", border: "none", borderRadius: "6px", padding: 0 }}
            >
              <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>

            <button
              title="Edit"
              onClick={() => openEditSub(item)}
              className="btn btn-sm d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px", backgroundColor: "#f0f9ff", border: "none", borderRadius: "6px", padding: 0 }}
            >
              <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>

            <button
              title="Delete"
              onClick={() => confirmDelete(item._id, item.name)}
              className="btn btn-sm d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px", backgroundColor: "#fff1f2", border: "none", borderRadius: "6px", padding: 0 }}
            >
              <svg width="16" height="16" fill="none" stroke="#ef4444" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        );
      }
    }
  ];

  // ----------------------
  // RENDER
  // ----------------------
  return (
    <div style={{ width: "100%" }}>
      <ToastContainer position="top-right" autoClose={4000} />

      {/* Delete confirmation */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, title: "" })}
        onConfirm={handleDeleteConfirm}
        title="Delete Subcategory"
        message={`Are you sure you want to delete "${confirmModal.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* View Modal */}
      <Modal isOpen={viewModal.isOpen} onClose={() => setViewModal({ isOpen: false, item: null })} title="View Subcategory">
        {viewModal.item && (
          <div className={styles.viewModalContent}>
            <div className={styles.viewField}>
              <label className={styles.viewLabel}>Name</label>
              <div className={styles.viewValue}>{viewModal.item.name}</div>
            </div>

            <div style={{ marginTop: 8 }}>
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

              <div className={styles.viewField} style={{ marginTop: 8 }}>
                <label className={styles.viewLabel}>Research</label>
                <div className={styles.viewValue}>{viewModal.item.research_id && viewModal.item.research_id.title ? viewModal.item.research_id.title : viewModal.item.research_id || "—"}</div>
              </div>

              {viewModal.item.image && (
                <div style={{ marginTop: 8 }}>
                  <img src={`${safeBase()}${viewModal.item.image}`} alt="sub" style={{ maxWidth: "100%" }} />
                </div>
              )}

              { (viewModal.item.link || viewModal.item.link_url) && (
                <div style={{ marginTop: 8 }}>
                  <a href={viewModal.item.link || viewModal.item.link_url} target="_blank" rel="noreferrer">{viewModal.item.link || viewModal.item.link_url}</a>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Subcategory Add/Edit Modal */}
   <Modal
  isOpen={subModal.isOpen}
  onClose={() =>
    setSubModal({ isOpen: false, mode: null, data: emptySubcategory, editId: null })
  }
  title={subModal.mode === "edit" ? "Edit Subcategory" : "Add Subcategory"}
>
  <div className={styles.modalFormContent}>
    <form onSubmit={handleSubSubmit} className={styles.formContainer}>

      {/* Section Header */}
      <div className={styles.formSection}>
        <div className={styles.formSectionHeader}>
          <h3 className={styles.formSectionTitle}>Subcategory Details</h3>
        </div>

        {/* Name */}
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>
              Name <span className={styles.required}>*</span>
            </label>
            <input
  type="text"
  value={subModal.data.name}
  onChange={(e) =>
    setSubModal((prev) => ({
      ...prev,
      data: { ...prev.data, name: e.target.value }
    }))
  }
/>

          </div>
        </div>

        {/* Short Description */}
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Short Description</label>
            <textarea
              className={styles.formInput}
              rows={2}
              value={subModal.data.short_description}
              onChange={(e) =>
                setSubModal({
                  ...subModal,
                  data: { ...subModal.data, short_description: e.target.value },
                })
              }
            />
          </div>
        </div>

        {/* Description */}
        <div className={styles.formField}>
          <label className={styles.formLabel}>Description</label>
          <div style={{ minHeight: 180 }}>
            <CKEditorWrapper
              data={subModal.data.description || ""}
              onChange={(evt, editor) => {
                const data = editor?.getData ? editor.getData() : "";
                setSubModal({
                  ...subModal,
                  data: { ...subModal.data, description: data },
                });
              }}
            />
          </div>
        </div>

        {/* Parent Research Dropdown */}
        <div className={styles.formField}>
          <label className={styles.formLabel}>
            Research (Parent) <span className={styles.required}>*</span>
          </label>
          <select
            className={styles.formSelect}
            value={subModal.data.research_id || ""}
            onChange={(e) =>
              setSubModal({
                ...subModal,
                data: { ...subModal.data, research_id: e.target.value },
              })
            }
          >
            <option value="">-- Select Research --</option>
            {researchCats.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </div>

        {/* Link URL */}
        <div className={styles.formField}>
          <label className={styles.formLabel}>Link</label>
          <input
            className={styles.formInput}
            value={subModal.data.link}
            onChange={(e) =>
              setSubModal({
                ...subModal,
                data: { ...subModal.data, link: e.target.value },
              })
            }
          />
        </div>

        {/* Image Upload */}
        <div className={styles.formField}>
          <label className={styles.formLabel}>Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setSubImageFile(f);
            }}
          />

          {(subImageFile || subModal.data.image) && (
            <div style={{ marginTop: 8 }}>
              <img
                src={
                  subImageFile
                    ? URL.createObjectURL(subImageFile)
                    : `${safeBase()}${subModal.data.image}`
                }
                alt="preview"
                style={{ maxWidth: 140 }}
              />

              <div style={{ marginTop: 5 }}>
                <button
                  type="button"
                  className={styles.formCancelBtn}
                  onClick={() => {
                    setSubImageFile(null);
                    setSubModal({
                      ...subModal,
                      data: { ...subModal.data, image: "" },
                    });
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Buttons */}
      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.formCancelBtn}
          onClick={() =>
            setSubModal({
              isOpen: false,
              mode: null,
              data: emptySubcategory,
              editId: null,
            })
          }
        >
          Cancel
        </button>

        <button type="submit" className={styles.formSubmitBtn}>
          {subModal.mode === "edit" ? "Update Subcategory" : "Create Subcategory"}
        </button>
      </div>
    </form>
  </div>
</Modal>


      {/* Action bar */}
      <div className={styles.actionBar} style={{ marginBottom: 12 }}>
        <div className={styles.actionBarContent}>
          <div className={styles.actionBarLeft}>
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <input type="text" placeholder="Search subcategories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={styles.searchInput} />
                {searchTerm && <button onClick={() => setSearchTerm("")} className={styles.searchClear}>✕</button>}
              </div>
            </div>
          </div>

          <div className={styles.actionBarRight}>
            <button onClick={openAddSub} className={styles.addButton}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
              </svg>
              <span className={styles.buttonTextFull}>Add Subcategory</span>
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
        noDataMessage="No subcategories found"
        loadingMessage="Loading subcategories..."
        showSerialNumber
        serialNumberField="srNo"
        serialNumberHeader="Sr.no."
      />
    </div>
  );
}
