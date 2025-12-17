# CommonDataGrid Component

A reusable DataGrid component built on top of MUI DataGrid that can be used across all pages and components in the application.

## Features

- ✅ **Reusable**: Use across all pages with consistent styling
- ✅ **Configurable**: Pass columns and data as props
- ✅ **Serial Numbers**: Automatic serial number column
- ✅ **Status Badges**: Built-in status badge component
- ✅ **Tooltips**: Tooltip component for long content
- ✅ **Loading States**: Built-in loading and no-data states
- ✅ **Responsive**: Mobile-friendly design
- ✅ **Customizable**: Override styles and add custom slots

## Installation

The component is already set up in your project. Import it like this:

```jsx
import CommonDataGrid, { Tooltip, StatusBadge } from '@/app/components/DataGrid';
```

## Basic Usage

```jsx
import React, { useState, useEffect } from 'react';
import CommonDataGrid from '@/app/components/DataGrid';

function MyComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusBadge status={params.value} />,
    },
  ];

  return (
    <CommonDataGrid
      data={data}
      columns={columns}
      loading={loading}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | Array | `[]` | Array of data objects to display |
| `columns` | Array | `[]` | Column definitions for the grid |
| `loading` | Boolean | `false` | Show loading state |
| `pageSizeOptions` | Array | `[5, 10, 15, 20, 50]` | Available page sizes |
| `initialPageSize` | Number | `10` | Initial page size |
| `onRowClick` | Function | `null` | Callback when row is clicked |
| `disableRowSelectionOnClick` | Boolean | `true` | Disable row selection on click |
| `customStyles` | Object | `{}` | Custom MUI styles to override defaults |
| `noDataMessage` | String | `"No data found"` | Message when no data |
| `noDataDescription` | String | `"No records available at the moment."` | Description when no data |
| `noDataAction` | Object | `null` | Action button when no data |
| `loadingMessage` | String | `"Loading data..."` | Message during loading |
| `showSerialNumber` | Boolean | `true` | Show serial number column |
| `serialNumberField` | String | `'id'` | Field name for serial number |
| `serialNumberHeader` | String | `'Sr.no.'` | Header text for serial number |
| `serialNumberWidth` | Number | `100` | Width of serial number column |
| `customSlots` | Object | `{}` | Custom MUI slots |

## Column Definition

Each column object should have the following structure:

```jsx
{
  field: 'fieldName',           // Required: Field name in data
  headerName: 'Display Name',   // Required: Column header
  width: 200,                   // Required: Column width
  align: 'left',               // Optional: Text alignment
  headerAlign: 'left',          // Optional: Header alignment
  sortable: true,               // Optional: Enable sorting
  filterable: true,             // Optional: Enable filtering
  renderCell: (params) => {     // Optional: Custom cell renderer
    return <div>{params.value}</div>;
  }
}
```

## Status Badge Component

Use the built-in StatusBadge component for status columns:

```jsx
import { StatusBadge } from '@/app/components/DataGrid';

// In your column definition
{
  field: 'status',
  headerName: 'Status',
  width: 120,
  renderCell: (params) => <StatusBadge status={params.value} />
}
```

### Default Status Configurations

- `published`: Green badge
- `draft`: Yellow badge  
- `archived`: Gray badge
- `active`: Green badge
- `inactive`: Red badge
- `pending`: Yellow badge

### Custom Status Configuration

```jsx
const customStatusConfig = {
  'custom-status': { 
    color: "bg-blue-100 text-blue-800", 
    label: "Custom Status" 
  }
};

<StatusBadge status="custom-status" statusConfig={customStatusConfig} />
```

## Tooltip Component

Use the built-in Tooltip component for long content:

```jsx
import { Tooltip } from '@/app/components/DataGrid';

// In your column definition
{
  field: 'description',
  headerName: 'Description',
  width: 200,
  renderCell: (params) => (
    <Tooltip content={params.value}>
      <div className="text-truncate" style={{ maxWidth: '180px' }}>
        {params.value}
      </div>
    </Tooltip>
  )
}
```

## No Data Action

Provide an action button when no data is available:

```jsx
<CommonDataGrid
  data={data}
  columns={columns}
  noDataAction={{
    onClick: () => handleAddNew(),
    text: "Add First Item"
  }}
/>
```

## Custom Styles

Override default styles by passing custom styles:

```jsx
<CommonDataGrid
  data={data}
  columns={columns}
  customStyles={{
    '& .MuiDataGrid-root': {
      border: '2px solid #e2e8f0',
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: '#f0f9ff',
    }
  }}
/>
```

## Custom Slots

Add custom slots for advanced customization:

```jsx
<CommonDataGrid
  data={data}
  columns={columns}
  customSlots={{
    noRowsOverlay: () => <div>Custom No Data Component</div>,
    loadingOverlay: () => <div>Custom Loading Component</div>
  }}
/>
```

## Examples

### News List Component

```jsx
const columns = [
  {
    field: 'title',
    headerName: 'Title',
    width: 200,
    renderCell: (params) => (
      <Tooltip content={params.value}>
        <div className="fw-medium text-truncate" style={{ maxWidth: '180px' }}>
          {params.value}
        </div>
      </Tooltip>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => <StatusBadge status={params.value} />,
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 200,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <div className="d-flex gap-2">
        <button className="btn btn-outline-primary btn-sm">Edit</button>
        <button className="btn btn-outline-danger btn-sm">Delete</button>
      </div>
    ),
  },
];

<CommonDataGrid
  data={news}
  columns={columns}
  loading={loading}
  noDataMessage="No articles found"
  noDataDescription="Get started by creating your first article."
  noDataAction={{
    onClick: () => setFormMode("add"),
    text: "Create First Article"
  }}
/>
```

### Users List Component

```jsx
const columns = [
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 250,
  },
  {
    field: 'role',
    headerName: 'Role',
    width: 120,
    renderCell: (params) => (
      <span className="badge bg-secondary">{params.value}</span>
    ),
  },
];

<CommonDataGrid
  data={users}
  columns={columns}
  loading={loading}
  showSerialNumber={true}
  serialNumberHeader="Sr.no."
/>
```

## Migration from MUI DataGrid

If you're migrating from direct MUI DataGrid usage:

1. **Remove MUI DataGrid import**:
   ```jsx
   // Remove this
   import { DataGrid } from '@mui/x-data-grid';
   
   // Add this
   import CommonDataGrid from '@/app/components/DataGrid';
   ```

2. **Update component usage**:
   ```jsx
   // Before
   <DataGrid
     rows={rows}
     columns={columns}
     loading={loading}
     // ... other props
   />
   
   // After
   <CommonDataGrid
     data={data}  // Note: data instead of rows
     columns={columns}
     loading={loading}
     // ... other props
   />
   ```

3. **Remove custom styling** (optional):
   The CommonDataGrid comes with built-in styling, but you can override with `customStyles` prop.

## Best Practices

1. **Always provide unique IDs**: Ensure your data has unique `_id` or `id` fields
2. **Use appropriate column widths**: Total width should not exceed container width
3. **Implement proper loading states**: Show loading while fetching data
4. **Handle empty states**: Provide meaningful no-data messages and actions
5. **Use StatusBadge for status columns**: Consistent status display across the app
6. **Use Tooltip for long content**: Prevent layout issues with long text
7. **Implement proper error handling**: Handle API errors gracefully

## File Structure

```
src/app/components/
├── DataGrid.jsx              # Main component
├── DataGrid.module.css       # Component styles
└── examples/
    └── UsersList.jsx         # Usage example
```

This component provides a consistent, reusable solution for data tables across your entire application!
