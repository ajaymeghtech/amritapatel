'use client';

import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import styles from './DataGrid.module.css';

// Tooltip Component
const Tooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 max-w-xs">
          <div className="whitespace-pre-wrap break-words">{content}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status, statusConfig }) => {
  const defaultConfig = {
    published: { color: "bg-green-100 text-green-800", label: "Published" },
    draft: { color: "bg-yellow-100 text-yellow-800", label: "Draft" },
    archived: { color: "bg-gray-100 text-gray-800", label: "Archived" },
    active: { color: "bg-green-100 text-green-800", label: "Active" },
    inactive: { color: "bg-red-100 text-red-800", label: "Inactive" },
    pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" }
  };

  const config = statusConfig ? statusConfig[status] : defaultConfig[status] || defaultConfig.draft;

  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
};

// Common DataGrid Component
const CommonDataGrid = ({
  data = [],
  columns = [],
  loading = false,
  pageSizeOptions = [5, 10, 15, 20, 50],
  initialPageSize = 10,
  onRowClick = null,
  disableRowSelectionOnClick = true,
  customStyles = {},
  noDataMessage = "No data found",
  noDataDescription = "No records available at the moment.",
  noDataAction = null,
  loadingMessage = "Loading data...",
  showSerialNumber = true,
  serialNumberField = 'id',
  serialNumberHeader = 'Sr.no.',
  serialNumberWidth = 100,
  customSlots = {},
  ...props
}) => {
  
  // Prepare data for MUI DataGrid with serial numbers
  const rows = data.map((item, index) => {
    const row = {
      id: item._id || item.id || index, // MUI DataGrid requires unique id field
      [serialNumberField]: index + 1, // Add serial number
    };
    // Copy all properties from item to row
    Object.keys(item).forEach(key => {
      if (key !== 'id' && key !== 'params') {
        row[key] = item[key];
      }
    });
    return row;
  });

  // Default columns with serial number
  const defaultColumns = showSerialNumber ? [
    {
      field: serialNumberField,
      headerName: serialNumberHeader,
      width: serialNumberWidth,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <span className="d-flex align-items-center justify-content-center"
          style={{ width: '32px', height: '32px' }}>
          {params.value}
        </span>
      ),
    },
    ...columns
  ] : columns;

  // Default styles
  const defaultStyles = {
    '& .MuiDataGrid-root': {
      border: 'none',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },
    '& .MuiDataGrid-main': {
      borderRadius: '12px',
    },
    '& .MuiDataGrid-cell': {
      borderBottom: '1px solid #f1f5f9',
      fontSize: '14px',
      padding: '12px 16px',
    },
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: '#f8fafc',
      borderBottom: '2px solid #e2e8f0',
      fontSize: '12px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: '#374151',
      padding: '16px',
    },
    '& .MuiDataGrid-columnHeader': {
      padding: '0 16px',
    },
    '& .MuiDataGrid-row:nth-of-type(even)': {
      backgroundColor: '#fafbfc',
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: '#f1f5f9',
      cursor: onRowClick ? 'pointer' : 'default',
    },
    '& .MuiDataGrid-footerContainer': {
      backgroundColor: '#f8fafc',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      minHeight: '60px',
    },
    '& .MuiTablePagination-root': {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      color: '#6b7280',
    },
    '& .MuiTablePagination-toolbar': {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'nowrap',
      fontSize: '14px',
    },
    '& .MuiTablePagination-selectLabel': {
      margin: 0,
      whiteSpace: 'nowrap',
      fontSize: '14px',
      fontWeight: '500',
    },
    '& .MuiTablePagination-displayedRows': {
      margin: 0,
      whiteSpace: 'nowrap',
      fontSize: '14px',
      fontWeight: '500',
    },
    '& .MuiTablePagination-actions': {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    '& .MuiIconButton-root': {
      padding: '8px',
      borderRadius: '6px',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: '#e2e8f0',
      },
    },
    '& .MuiSelect-select': {
      padding: '8px 12px',
      borderRadius: '6px',
      border: '1px solid #d1d5db',
      fontSize: '14px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& .MuiDataGrid-selectedRowCount': {
      fontSize: '14px',
      color: '#6b7280',
    },
    ...customStyles
  };

  // Default slots
  const defaultSlots = {
    noRowsOverlay: () => (
      <div className={styles.noDataContainer}>
        <div className={styles.noDataContent}>
          <div className={styles.noDataIcon}>
            <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className={styles.noDataContent}>
            <h3 className={styles.noDataTitle}>{noDataMessage}</h3>
            <p className={styles.noDataDescription}>
              {noDataDescription}
            </p>
            {noDataAction && (
              <button
                onClick={noDataAction.onClick}
                className={styles.noDataActionBtn}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {noDataAction.text}
              </button>
            )}
          </div>
        </div>
      </div>
    ),
    loadingOverlay: () => (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <svg className={styles.loadingIcon} width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <p className={styles.loadingText}>{loadingMessage}</p>
      </div>
    ),
    ...customSlots
  };

  return (
    <div className={styles.dataTableContainer}>
      <div className={styles.dataTableWrapper}>
        <DataGrid
          rows={rows}
          columns={defaultColumns}
          loading={loading}
          pageSizeOptions={pageSizeOptions}
          initialState={{
            pagination: {
              paginationModel: { pageSize: initialPageSize },
            },
          }}
          disableRowSelectionOnClick={disableRowSelectionOnClick}
          onRowClick={onRowClick}
          sx={defaultStyles}
          slots={defaultSlots}
          {...props}
        />
      </div>
    </div>
  );
};

// Export both the component and utility components
export default CommonDataGrid;
export { Tooltip, StatusBadge };
