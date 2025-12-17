'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommonDataGrid, { Tooltip } from '@/app/components/DataGrid';
import ConfirmationModal from '@/app/admin/common/ConfirmationModal';
import styles from './NewsList.module.css'; // reuse existing styles or create one

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const initialFormState = {
  title: '',
  link: '',
  courses: '', // stored as comma-separated string in UI; backend expects array
  order: 0,
  isActive: true,
  iconImage: '', // existing icon path
};

const getImageUrl = (path = '') => {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5v14" />
              </svg>
            </div>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>{title}</h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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

export default function ProgramsList() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState('');
  const [editId, setEditId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, title: '' });
  const [viewModal, setViewModal] = useState({ isOpen: false, entry: null });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/programs`);
      if (!res.ok) throw new Error('Failed to fetch programs');
      const json = await res.json();
      setPrograms(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      toast.error(err.message || 'Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setFormMode('add');
    setFormData(initialFormState);
    setIconFile(null);
    setIconPreview('');
    setEditId(null);
  };

  const handleEdit = (entry) => {
    setFormMode('edit');
    setEditId(entry._id);
    setFormData({
      title: entry.title || '',
      link: entry.link || '',
      courses: Array.isArray(entry.courses) ? entry.courses.join(', ') : (entry.courses || ''),
      order: typeof entry.order === 'number' ? entry.order : (entry.order ? Number(entry.order) : 0),
      isActive: typeof entry.isActive === 'boolean' ? entry.isActive : !!entry.isActive,
      iconImage: entry.iconImage || '',
    });
    setIconFile(null);
    setImagePreview(getImageUrl(entry.image));
    setIconPreview(getImageUrl(entry.iconImage));
  };

  const resetForm = () => {
    setFormMode(null);
    setEditId(null);
    setFormData(initialFormState);
    setIconFile(null);
    setIconPreview('');
  };

  const handleIconChange = (file) => {
    setIconFile(file || null);
    setIconPreview(file ? URL.createObjectURL(file) : '');
    if (!file && formMode === 'edit' && formData.iconImage) {
      setIconPreview(getImageUrl(formData.iconImage));
    }
  };

  const buildPayload = () => {
    const payload = new FormData();
    payload.append('title', formData.title || '');
    payload.append('link', formData.link || '');

    // courses -> array
    const coursesArr = (formData.courses || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    coursesArr.forEach((c) => payload.append('courses', c));

    payload.append('order', String(formData.order ?? 0));
    payload.append('isActive', formData.isActive ? 'true' : 'false');

    if (iconFile) {
      payload.append('iconImage', iconFile);
    }

    return payload;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    // If adding, prefer to require at least image or icon? Not forcing here.
    try {
      console.log('Appending new icon file',buildPayload);

      const payload = buildPayload();
      const url = formMode === 'edit' ? `${API_BASE_URL}/api/programs/${editId}` : `${API_BASE_URL}/api/programs`;
      const method = formMode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: payload,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Failed to save program');
      }

      toast.success(`Program ${formMode === 'edit' ? 'updated' : 'created'} successfully`);
      resetForm();
      fetchPrograms();
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/programs/${confirmModal.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Failed to delete program');
      }
      toast.success('Program deleted successfully');
      setConfirmModal({ isOpen: false, id: null, title: '' });
      fetchPrograms();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const q = searchTerm.trim().toLowerCase();
      if (!q) return true;
      return (
        (p.title || '').toLowerCase().includes(q) ||
        (p.link || '').toLowerCase().includes(q) ||
        (Array.isArray(p.courses) && p.courses.join(' ').toLowerCase().includes(q))
      );
    });
  }, [programs, searchTerm]);

  const gridData = filteredPrograms.map((p, idx) => ({ ...p, id: p._id, srNo: idx + 1 }));

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Tooltip content={params.row.title || '—'}>
          <div className="text-truncate" style={{ maxWidth: 220 }}>
            {params.row.title || '—'}
          </div>
        </Tooltip>
      ),
    },
    {
      field: 'iconImage',
      headerName: 'Icon',
      flex: 0.5,
      minWidth: 80,
      renderCell: (params) => {
        const url = getImageUrl(params.row.iconImage);
        return url ? (
          <div style={{ padding: 6 }}>
            <img
              src={url}
              alt={params.row.title || 'icon'}
              style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' }}
            />
          </div>
        ) : (
          <span className="text-muted">—</span>
        );
      },
    },
    {
      field: 'courses',
      headerName: 'Courses',
      flex: 1.5,
      minWidth: 220,
      renderCell: (params) => {
        const coursesArr = Array.isArray(params.row.courses) ? params.row.courses : (params.row.courses ? [params.row.courses] : []);
        return (
          <Tooltip content={coursesArr.join(', ')}>
            <div className="text-truncate" style={{ maxWidth: 280 }}>
              {coursesArr.length ? coursesArr.join(', ') : '—'}
            </div>
          </Tooltip>
        );
      },
    },
    {
      field: 'link',
      headerName: 'Link',
      flex: 1,
      minWidth: 160,
      renderCell: (params) =>
        params.row.link ? (
          <a href={params.row.link} target="_blank" rel="noreferrer" className="text-truncate" style={{ maxWidth: 140, display: 'block' }}>
            {params.row.link}
          </a>
        ) : (
          <span className="text-muted">—</span>
        ),
    },

    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="d-flex gap-2">
          {/* View */}
          <button
            onClick={() => setViewModal({ isOpen: true, entry: params.row })}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32, backgroundColor: '#e0f2fe', border: 'none', borderRadius: 6, padding: 0 }}
            title="View"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#bae6fd')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e0f2fe')}
          >
            <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          {/* Edit */}
          <button
            onClick={() => handleEdit(params.row)}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32, backgroundColor: '#e0f2fe', border: 'none', borderRadius: 6, padding: 0 }}
            title="Edit"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#bae6fd')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e0f2fe')}
          >
            <svg width="16" height="16" fill="none" stroke="#0ea5e9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete */}
          <button
            onClick={() => setConfirmModal({ isOpen: true, id: params.row._id, title: params.row.title })}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32, backgroundColor: '#fee2e2', border: 'none', borderRadius: 6, padding: 0 }}
            title="Delete"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fecaca')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
          >
            <svg width="16" height="16" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 11v6m4-6v6M9 7h6" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      <ToastContainer position="top-right" autoClose={4000} />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, title: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Program"
        message={`Are you sure you want to delete "${confirmModal.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* View Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, entry: null })}
        title="Program Details"
      >
        {viewModal.entry && (
          <div className={styles.viewModalContent}>
            <div className={styles.viewSection}>
              <div className={styles.viewSectionHeader}>
                <h3 className={styles.viewSectionTitle}>{viewModal.entry.title}</h3>
              </div>
              <div className={styles.viewGrid}>

                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Courses</label>
                  <div className={styles.viewValue}>
                    {Array.isArray(viewModal.entry.courses) ? viewModal.entry.courses.join(', ') : (viewModal.entry.courses || '—')}
                  </div>
                </div>

                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Link</label>
                  <div className={styles.viewValue}>
                    {viewModal.entry.link ? <a href={viewModal.entry.link} target="_blank" rel="noreferrer">{viewModal.entry.link}</a> : '—'}
                  </div>
                </div>
              </div>
              <div className={styles.viewGrid}>

                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Order</label>
                  <div className={styles.viewValue}>{viewModal.entry.order ?? 0}</div>
                </div>

                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Active</label>
                  <div className={styles.viewValue}>{viewModal.entry.isActive ? 'Yes' : 'No'}</div>
                </div>
              </div>

              {viewModal.entry.iconImage && (
                <div className={styles.viewField}>
                  <label className={styles.viewLabel}>Icon</label>
                  <div className={styles.imagePreview}>
                    <img src={getImageUrl(viewModal.entry.iconImage)} alt="Icon" style={{ maxWidth: '100px' }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={!!formMode}
        onClose={resetForm}
        title={formMode === 'edit' ? 'Edit Program' : 'Create Program'}
        headerAction={formMode && (
          <button onClick={() => { setFormMode('add'); setFormData(initialFormState); setIconFile(null); setIconPreview(''); setEditId(null); }} className={styles.addButton}>
            New
          </button>
        )}
      >
        <div className={styles.modalFormContent}>
          <form onSubmit={handleFormSubmit} className={styles.formContainer}>
            <div className={styles.formSection}>
              <div className={styles.formSectionHeader}>
                <h3 className={styles.formSectionTitle}>Program Details</h3>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Title <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Link</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/courses/medicine"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Courses (comma separated)</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.courses}
                  onChange={(e) => setFormData({ ...formData, courses: e.target.value })}
                  placeholder="MBBS, MD / MS, DNB"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Order</label>
                <input
                  type="number"
                  className={styles.formInput}
                  value={String(formData.order ?? 0)}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value || 0) })}
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Active</label>
                <div>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={!!formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: !!e.target.checked })}
                    />
                    <span>{formData.isActive ? 'Yes' : 'No'}</span>
                  </label>
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Icon Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.formInput}
                  onChange={(e) => handleIconChange(e.target.files?.[0] || null)}
                />
                {iconPreview ? (
                  <div style={{ marginTop: 8 }}>
                    <img src={iconPreview} alt="Icon Preview" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 6, border: '1px solid #e5e7eb' }} />
                  </div>
                ) : formData.iconImage ? (
                  <div style={{ marginTop: 8 }}>
                    <img src={getImageUrl(formData.iconImage)} alt="Existing icon" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 6 }} />
                  </div>
                ) : null}
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.formCancelBtn} onClick={resetForm}>Cancel</button>
              <button type="submit" className={styles.formSubmitBtn}>{formMode === 'edit' ? 'Update Program' : 'Create Program'}</button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Action bar */}
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
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className={styles.searchClear}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={styles.actionBarRight}>
            <button onClick={openAddForm} className={styles.addButton}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" /></svg>
              <span className={styles.buttonTextFull}>Add Program</span>
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
        noDataMessage="No programs found"
        noDataDescription={searchTerm ? 'Try adjusting your search.' : 'Create your first program.'}
        noDataAction={!searchTerm ? { onClick: openAddForm, text: 'Create Program' } : null}
        loadingMessage="Loading programs..."
        showSerialNumber
        serialNumberField="srNo"
        serialNumberHeader="Sr.no."
        serialNumberWidth={80}
      />
    </div>
  );
}
