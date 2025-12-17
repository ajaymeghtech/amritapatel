'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommonDataGrid from '@/app/components/DataGrid';
import ConfirmationModal from '@/app/admin/common/ConfirmationModal';
import styles from './CertificateList.module.css'; // reuse existing styles or create CareerList.module.css

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

/* ---------- Simple Modal component (same pattern as before) ---------- */
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
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalIcon}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 12a5 5 0 1110 0 5 5 0 01-10 0z" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
};

export default function CareerList() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formMode, setFormMode] = useState(null); 
  const [editId, setEditId] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(null);


  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    description: '',
  });

  // File states (store File when user picks new file)
  const [imageFile, setImageFile] = useState(null);
  const [applyFile, setApplyFile] = useState(null);
  const [viewFile, setViewFile] = useState(null);

  // Previews / existing URLs
  const [imagePreview, setImagePreview] = useState(null);
  const [applyUrl, setApplyUrl] = useState('');
  const [viewUrl, setViewUrl] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
const [applyPreview, setApplyPreview] = useState(null);
const [viewPreview, setViewPreview] = useState(null);
const [applyName, setApplyName] = useState("");
const [viewName, setViewName] = useState("");

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/career/`);
      const json = await res.json();
      if (json.status && Array.isArray(json.data)) {
        setCareers(json.data);
      } else {
        setCareers([]);
        toast.error(json.message || 'Failed to load careers');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching career list');
    } finally {
      setLoading(false);
    }
  };

  const filteredCareers = useMemo(() => {
    if (!searchTerm) return careers;
    return careers.filter(c =>
      (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.short_description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [careers, searchTerm]);

  /* ---------- Helpers ---------- */
  const getFullUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // Ensure no double slashes
    return `${API_BASE_URL.replace(/\/$/, '')}${path}`;
  };

  const getFileName = (path = '') => {
    if (!path) return '';
    return path.split('/').pop();
  };

  /* ---------- File input handlers ---------- */
  const onImageChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

const onApplyChange = (e) => {
  const f = e.target.files?.[0];
  if (!f) return;
  setApplyFile(f);
  setApplyPreview(URL.createObjectURL(f)); 
   setApplyName(f.name); 
};


const onViewChange = (e) => {
  const f = e.target.files?.[0];
  if (!f) return;
  setViewFile(f);
  setViewPreview(URL.createObjectURL(f));  
};


  /* ---------- Edit handler ---------- */
  const handleEdit = (item) => {
    setFormMode('edit');
    setEditId(item._id);
    setApplyPreview(item.applynow ? getFullUrl(item.applynow) : null);
setViewPreview(item.view_details ? getFullUrl(item.view_details) : null);
setApplyName(item.applynow ? item.applynow.split("/").pop() : "");
setViewName(item.view_details ? item.view_details.split("/").pop() : "");

    setFormData({
      title: item.title || '',
      short_description: item.short_description || '',
      description: item.description || '',
    });

    setImageFile(null);
    setApplyFile(null);
    setViewFile(null);

    const imgUrl = item.image ? getFullUrl(item.image) : null;
    setImagePreview(imgUrl || null);

    setApplyUrl(item.applynow ? getFullUrl(item.applynow) : '');
    setViewUrl(item.view_details ? getFullUrl(item.view_details) : '');
  };

  /* ---------- Create / Update submit ---------- */
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.short_description) {
      toast.error('Please fill required fields: Title and Short Description');
      return;
    }

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('short_description', formData.short_description);
      payload.append('description', formData.description || '');

      // Append files if chosen
      if (imageFile) payload.append('image', imageFile);
      if (applyFile) payload.append('applynow', applyFile);
      if (viewFile) payload.append('view_details', viewFile);

      const isEdit = !!editId;
      const url = isEdit ? `${API_BASE_URL}/api/career/${editId}` : `${API_BASE_URL}/api/career`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: payload,
      });

      const json = await res.json();
      if (json.status) {
        toast.success(isEdit ? 'Career updated' : 'Career created');
        // cleanup
        setFormMode(null);
        setEditId(null);
        setImageFile(null);
        setApplyFile(null);
        setViewFile(null);
        setImagePreview(null);
        setApplyUrl('');
        setViewUrl('');
        setFormData({ title: '', short_description: '', description: '' });
        fetchCareers();
      } else {
        toast.error(json.message || 'Save failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error saving career');
    }
  };

  /* ---------- Delete flow ---------- */
  const handleDeleteClick = (id) => {
    setConfirmDelete(id);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/career/${confirmDelete}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.status) {
        toast.success('Career deleted');
        setConfirmDelete(null);
        fetchCareers();
      } else {
        toast.error(json.message || 'Delete failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting career');
    }
  };

  /* ---------- Columns for DataGrid ---------- */
  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      width: 220,
      sortable: true,
    },
    {
      field: 'short_description',
      headerName: 'Short Description',
      width: 260,
      sortable: false,
    },
    {
      field: 'image',
      headerName: 'Image',
      width: 120,
      renderCell: (params) => {
        const imgPath = params.value;
        const url = imgPath ? getFullUrl(imgPath) : null;
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {url ? (
              <img
                src={url}
                alt={params.row.title}
                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div style={{
                width: 60, height: 60, background: '#f3f4f6', borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 12
              }}>
                No Image
              </div>
            )}
          </div>
        );
      }
    },
    {
      field: 'applynow',
      headerName: 'Apply Now',
      width: 160,
      renderCell: (params) => {
        const p = params.value;
        if (!p) return <span className="text-muted">—</span>;
        const url = getFullUrl(p);
        const name = getFileName(p);
        return <a href={url} target="_blank" rel="noreferrer" title="Open file">{name}</a>;
      }
    },
    {
      field: 'view_details',
      headerName: 'View Details',
      width: 160,
      renderCell: (params) => {
        const p = params.value;
        if (!p) return <span className="text-muted">—</span>;
        const url = getFullUrl(p);
        const name = getFileName(p);
        return <a href={url} target="_blank" rel="noreferrer" title="Open file">{name}</a>;
      }
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 140,
      renderCell: (params) => (params.value ? new Date(params.value).toLocaleDateString() : 'N/A')
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => handleEdit(params.row)}
            title="Edit"
            style={{
              width: 36, height: 36, borderRadius: 8, border: 'none', background: '#e0f2fe', cursor: 'pointer'
            }}
          >
            <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>

          <button
            onClick={() => handleDeleteClick(params.row._id)}
            title="Delete"
            style={{
              width: 36, height: 36, borderRadius: 8, border: 'none', background: '#fee2e2', cursor: 'pointer'
            }}
          >
            <svg width="16" height="16" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{ width: '100%', padding: 0 }}>
      <ToastContainer position="top-right" autoClose={5000} />
      <ConfirmationModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Career"
        message="Are you sure you want to delete this career entry? This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* ACTION BAR */}
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
                  placeholder="Search careers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className={styles.searchClear} title="Clear search">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={styles.actionBarRight}>
            <button
              onClick={() => {
                setFormMode('add');
                setEditId(null);
                setFormData({ title: '', short_description: '', description: '' });
                setImageFile(null); setApplyFile(null); setViewFile(null);
                setImagePreview(null); setApplyUrl(''); setViewUrl('');
              }}
              className={styles.addButton}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              Add Career
            </button>
          </div>
        </div>
      </div>

      {/* DATA GRID */}
      <CommonDataGrid
        data={filteredCareers}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5,10,15,20]}
        initialPageSize={10}
        noDataMessage="No career entries found"
        noDataDescription={searchTerm ? 'Try different keywords.' : 'Create your first career entry.'}
        noDataAction={!searchTerm ? { onClick: () => setFormMode('add'), text: 'Create Career' } : null}
        showSerialNumber
        serialNumberHeader="Sr.no."
        serialNumberWidth={80}
      />

      {/* ---------- Modal for Add/Edit ---------- */}
      <Modal
        isOpen={formMode !== null}
        onClose={() => {
          setFormMode(null);
          setEditId(null);
          setFormData({ title: '', short_description: '', description: '' });
          setImageFile(null); setApplyFile(null); setViewFile(null);
          setImagePreview(null); setApplyUrl(''); setViewUrl('');
        }}
        title={formMode === 'edit' ? 'Edit Career' : 'Create New Career'}
      >
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>

            <div className={styles.formGroup}>
              <label className={styles.label}>Title <span style={{color:'#d32f2f'}}>*</span></label>
              <input type="text" name="title" value={formData.title} onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))} className={styles.input} required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Short Description <span style={{color:'#d32f2f'}}>*</span></label>
              <input type="text" name="short_description" value={formData.short_description} onChange={(e) => setFormData(prev => ({...prev, short_description: e.target.value}))} className={styles.input} required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea name="description" value={formData.description} onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))} className={styles.textarea} rows={6} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Image (JPG/PNG)</label>
              <div className={styles.fileInputWrapper}>
                <input type="file" accept="image/*" id="careerImage" onChange={onImageChange} className={styles.fileInput} />
                <label htmlFor="careerImage" className={styles.fileLabel}>{imagePreview ? 'Change Image' : 'Upload Image'}</label>
              </div>
              {applyName && (
                <p style={{ marginTop: "5px", fontSize: "14px" }}>
                  Selected File: <strong>{applyName}</strong>
                </p>
              )}

              {imagePreview && (
                <div className={styles.previewContainer} style={{ marginTop: 8 }}>
                  <img src={imagePreview} alt="preview" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6 }} onError={(e)=> e.target.style.display='none'} />
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Apply Now (PDF)</label>
              <div className={styles.fileInputWrapper}>
                <input type="file" accept="application/pdf" id="applyPdf" onChange={onApplyChange} className={styles.fileInput} />
                <label htmlFor="applyPdf" className={styles.fileLabel}>{applyFile ? 'Change PDF' : (applyUrl ? getFileName(applyUrl) : 'Upload PDF')}</label>
              </div>
              {viewName && (
                <p style={{ marginTop: "5px", fontSize: "14px" }}>
                  Selected File: <strong>{viewName}</strong>
                </p>
              )}

             {applyPreview && (
                <iframe
                  src={applyPreview}
                  width="100%"
                  height="200"
                  style={{ marginTop: "10px", border: "1px solid #ddd" }}
                ></iframe>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>View Details (PDF)</label>
              <div className={styles.fileInputWrapper}>
                <input type="file" accept="application/pdf" id="viewPdf" onChange={onViewChange} className={styles.fileInput} />
                <label htmlFor="viewPdf" className={styles.fileLabel}>{viewFile ? 'Change PDF' : (viewUrl ? getFileName(viewUrl) : 'Upload PDF')}</label>
              </div>
             {viewPreview && (
                <iframe
                  src={viewPreview}
                  width="100%"
                  height="200"
                  style={{ marginTop: "10px", border: "1px solid #ddd" }}
                ></iframe>
              )}
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.cancelButton} onClick={() => { setFormMode(null); }}>
                Cancel
              </button>
              <button type="submit" className={styles.submitButton}>
                {editId ? 'Update Career' : 'Create Career'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}


// 'use client';

// import React, { useState, useEffect, useMemo } from "react";
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import CommonDataGrid from "@/app/components/DataGrid";
// import ConfirmationModal from "@/app/admin/common/ConfirmationModal";
// import styles from './CertificateList.module.css';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// // Modal Component
// const Modal = ({ isOpen, onClose, title, children }) => {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       setIsVisible(true);
//       document.body.style.overflow = 'hidden';
//     } else {
//       setIsVisible(false);
//       document.body.style.overflow = 'unset';
//     }

//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className={styles.modalOverlay} onClick={onClose}>
//       <div
//         className={styles.modalContainer}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className={styles.modalHeader}>
//           <div className={styles.modalHeaderLeft}>
//             <div className={styles.modalIcon}>
//               <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 12a5 5 0 1110 0 5 5 0 01-10 0z" />
//               </svg>
//             </div>
//             <div className={styles.modalTitleSection}>
//               <h2 className={styles.modalTitle}>{title}</h2>
//               <p className={styles.modalSubtitle}>
//                 {title.includes("Edit") ? "Update certificate details" : "Create a new certificate"}
//               </p>
//             </div>
//           </div>
//           <button className={styles.closeButton} onClick={onClose}>
//             <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>
//         <div className={styles.modalBody}>{children}</div>
//       </div>
//     </div>
//   );
// };

// export default function CareerList() {
//   const [certificates, setCertificates] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [formMode, setFormMode] = useState(null);
//   const [editId, setEditId] = useState(null);
//   const [confirmDelete, setConfirmDelete] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     status: 'active'
//   });

//   useEffect(() => {
//     fetchCertificates();
//   }, []);

//   const filteredCertificates = useMemo(() => {
//     return certificates.filter(cert =>
//       cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       cert.description.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [certificates, searchTerm]);

//   const fetchCertificates = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}/api/certifications/`);
//       const data = await response.json();
      
//       if (data.status && data.data) {
//         setCertificates(data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching certificates:', error);
//       toast.error('Failed to fetch certificates');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleEdit = (cert) => {
//     setFormMode("edit");
//     setEditId(cert._id);
//     setImageFile(null);
//     setImagePreview(cert.logo || null);
//     setFormData({
//       title: cert.title,
//       description: cert.description,
//       status: cert.status
//     });
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.title || !formData.description) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     try {
//       const submitData = new FormData();
//       submitData.append('title', formData.title);
//       submitData.append('description', formData.description);
//       submitData.append('status', formData.status);
      
//       if (imageFile) {
//         submitData.append('logo', imageFile);
//       }

//       const method = editId ? 'PUT' : 'POST';
//       const url = editId 
//         ? `${API_BASE_URL}/api/certifications/${editId}`
//         : `${API_BASE_URL}/api/certifications`;

//       const response = await fetch(url, {
//         method,
//         body: submitData
//       });

//       const data = await response.json();

//       if (data.status) {
//         toast.success(editId ? 'Certificate updated successfully' : 'Certificate created successfully');
//         setFormMode(null);
//         setEditId(null);
//         setImageFile(null);
//         setImagePreview(null);
//         fetchCertificates();
//       } else {
//         toast.error(data.message || 'Failed to save certificate');
//       }
//     } catch (error) {
//       console.error('Error saving certificate:', error);
//       toast.error('Error saving certificate');
//     }
//   };

//   const handleDeleteClick = (id) => {
//     setConfirmDelete(id);
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/certifications/${confirmDelete}`, {
//         method: 'DELETE',
//       });

//       const data = await response.json();
//       if (data.status) {
//         toast.success('Certificate deleted successfully');
//         setConfirmDelete(null);
//         fetchCertificates();
//       } else {
//         toast.error(data.message || 'Failed to delete certificate');
//       }
//     } catch (error) {
//       console.error('Error deleting certificate:', error);
//       toast.error('Error deleting certificate');
//     }
//   };

//   const columns = [
//     {
//       field: 'title',
//       headerName: 'Title',
//       width: 200,
//       sortable: true,
//       filterable: true,
//     },
//     {
//       field: 'description',
//       headerName: 'Description',
//       width: 250,
//       sortable: false,
//       filterable: true,
//       renderCell: (params) => (
//         <div style={{ 
//           whiteSpace: 'normal', 
//           wordBreak: 'break-word',
//           display: '-webkit-box',
//           WebkitLineClamp: 2,
//           WebkitBoxOrient: 'vertical',
//           overflow: 'hidden'
//         }}>
//           {params.value}
//         </div>
//       ),
//     },
//     {
//       field: 'logo',
//       headerName: 'Logo',
//       width: 100,
//       sortable: false,
//       renderCell: (params) => (
//         <div className="d-flex align-items-center justify-content-center">
//           {params.value ? (
//             <img 
//               src={params.value} 
//               alt="Certificate"
//               style={{ 
//                 width: '50px', 
//                 height: '50px', 
//                 objectFit: 'contain',
//                 borderRadius: '6px',
//                 border: '1px solid #d1d5db'
//               }}
//               onError={(e) => {
//                 e.target.style.display = 'none';
//               }}
//             />
//           ) : (
//             <div style={{ 
//               width: '50px', 
//               height: '50px', 
//               backgroundColor: '#f3f4f6',
//               borderRadius: '6px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               color: '#9ca3af',
//               fontSize: '12px'
//             }}>
//               No Image
//             </div>
//           )}
//         </div>
//       ),
//     },
//     {
//       field: 'status',
//       headerName: 'Status',
//       width: 100,
//       sortable: true,
//       renderCell: (params) => (
//         <span style={{
//           padding: '4px 12px',
//           borderRadius: '20px',
//           fontSize: '12px',
//           fontWeight: '600',
//           backgroundColor: params.value === 'active' ? '#d4edda' : '#f8d7da',
//           color: params.value === 'active' ? '#155724' : '#721c24'
//         }}>
//           {params.value}
//         </span>
//       ),
//     },

//     {
//       field: 'actions',
//       headerName: 'Actions',
//       width: 150,
//       sortable: false,
//       filterable: false,
//       align: 'center',
//       headerAlign: 'center',
//       renderCell: (params) => (
//         <div className="d-flex justify-content-center align-items-center gap-2">
//           <button
//             onClick={() => handleEdit(params.row)}
//             className="btn btn-sm d-flex align-items-center justify-content-center"
//             style={{ 
//               width: '32px', 
//               height: '32px',
//               backgroundColor: '#e0f2fe',
//               border: 'none',
//               borderRadius: '6px',
//               padding: 0
//             }}
//             title="Edit Certificate"
//             onMouseEnter={(e) => e.target.style.backgroundColor = '#bae6fd'}
//             onMouseLeave={(e) => e.target.style.backgroundColor = '#e0f2fe'}
//           >
//             <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//             </svg>
//           </button>

//           <button
//             onClick={() => handleDeleteClick(params.row._id)}
//             className="btn btn-sm d-flex align-items-center justify-content-center"
//             style={{ 
//               width: '32px', 
//               height: '32px',
//               backgroundColor: '#fee2e2',
//               border: 'none',
//               borderRadius: '6px',
//               padding: 0
//             }}
//             title="Delete Certificate"
//             onMouseEnter={(e) => e.target.style.backgroundColor = '#fecaca'}
//             onMouseLeave={(e) => e.target.style.backgroundColor = '#fee2e2'}
//           >
//             <svg width="16" height="16" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//             </svg>
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div style={{
//       width: '100%',
//       maxWidth: 'none',
//       margin: 0,
//       padding: 0,
//       position: 'relative',
//       left: 0,
//       right: 0
//     }}>
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//         toastStyle={{
//           borderRadius: '8px',
//           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
//         }}
//       />

//       <ConfirmationModal
//         isOpen={!!confirmDelete}
//         onClose={() => setConfirmDelete(null)}
//         onConfirm={handleDeleteConfirm}
//         title="Delete Certificate"
//         message="Are you sure you want to delete this certificate? This action cannot be undone."
//         confirmText="Delete"
//         cancelText="Cancel"
//         type="danger"
//       />

//       {/* Action Bar */}
//       <div className={styles.actionBar}>
//         <div className={styles.actionBarContent}>
//           <div className={styles.actionBarLeft}>
//             <div className={styles.searchContainer}>
//               <div className={styles.searchInputWrapper}>
//                 <svg className={styles.searchIcon} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//                 <input
//                   type="text"
//                   placeholder="Search certificates..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className={styles.searchInput}
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm("")}
//                     className={styles.searchClear}
//                     title="Clear search"
//                   >
//                     <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className={styles.actionBarRight}>
//             <button
//               onClick={() => {
//                 setFormMode("add");
//                 setEditId(null);
//                 setImageFile(null);
//                 setImagePreview(null);
//                 setFormData({
//                   title: '',
//                   description: '',
//                   status: 'active'
//                 });
//               }}
//               className={styles.addButton}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '0.5rem',
//                 padding: '10px 16px',
//                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '8px',
//                 fontWeight: '600',
//                 fontSize: '14px',
//                 cursor: 'pointer',
//                 minWidth: '160px'
//               }}
//             >
//               <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               Add Certificate
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Data Table */}
//       <CommonDataGrid
//         data={filteredCertificates}
//         columns={columns}
//         loading={loading}
//         pageSizeOptions={[5, 10, 15, 20]}
//         initialPageSize={10}
//         noDataMessage="No certificates found"
//         noDataDescription={
//           searchTerm
//             ? "Try adjusting your search criteria."
//             : "Get started by creating your first certificate."
//         }
//         noDataAction={
//           !searchTerm ? {
//             onClick: () => setFormMode("add"),
//             text: "Create First Certificate"
//           } : null
//         }
//         loadingMessage="Loading certificates..."
//         showSerialNumber={true}
//         serialNumberField="id"
//         serialNumberHeader="Sr.no."
//         serialNumberWidth={80}
//       />

//       {/* Modal for Add/Edit Form */}
//       <Modal
//         isOpen={formMode !== null}
//         onClose={() => {
//           setFormMode(null);
//           setEditId(null);
//           setImageFile(null);
//           setImagePreview(null);
//           setFormData({
//             title: '',
//             description: '',
//             status: 'active'
//           });
//         }}
//         title={formMode === "edit" ? "Edit Certificate" : "Create New Certificate"}
//       >
//         <div className={styles.modalFormContent}>
//           <form onSubmit={handleFormSubmit} className={styles.formContainer}>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>
//                 Title <span style={{color: '#d32f2f'}}>*</span>
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 className={styles.input}
//                 placeholder="Enter certificate title"
//                 required
//               />
//             </div>

//             <div className={styles.formGroup}>
//               <label className={styles.label}>
//                 Description <span style={{color: '#d32f2f'}}>*</span>
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 className={styles.textarea}
//                 placeholder="Enter certificate description"
//                 rows="4"
//                 required
//               />
//             </div>

//             <div className={styles.formGroup}>
//               <label className={styles.label}>Logo Image</label>
//               <div className={styles.fileInputWrapper}>
//                 <input
//                   type="file"
//                   name="logo"
//                   onChange={handleFileChange}
//                   accept="image/*"
//                   className={styles.fileInput}
//                   id="logoInput"
//                 />
//                 <label htmlFor="logoInput" className={styles.fileLabel}>
//                   <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                   </svg>
//                   {imagePreview ? 'Change Logo' : 'Upload Logo'}
//                 </label>
//               </div>
//               {imagePreview && (
//                 <div className={styles.previewContainer}>
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     style={{
//                       maxWidth: '100px',
//                       maxHeight: '100px',
//                       objectFit: 'contain',
//                       borderRadius: '6px',
//                     }}
//                   />
//                 </div>
//               )}
//             </div>

//             <div className={styles.formRow}>
//               <div className={styles.formGroup}>
//                 <label className={styles.label}>Status</label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleInputChange}
//                   className={styles.select}
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </div>
//             </div>

//             <div className={styles.formActions}>
//               <button
//                 type="button"
//                 className={styles.cancelButton}
//                 onClick={() => setFormMode(null)}
//               >
//                 Cancel
//               </button>
//               <button type="submit" className={styles.submitButton}>
//                 {editId ? 'Update Certificate' : 'Create Certificate'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </Modal>
//     </div>
//   );
// }
