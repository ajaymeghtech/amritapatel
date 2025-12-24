'use client';

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./CMSList.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const SUBACADEMIC_ENDPOINT = `${API_BASE_URL}/api/sub-academic`;
const ACADEMIC_ENDPOINT = `${API_BASE_URL}/api/academic`;

const getImageUrl = (path = "") => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
};

/**
 * Reusable Sub-Academic Selector Component
 * @param {Array} selectedSubAcademicIds - Array of selected Sub-Academic IDs
 * @param {Function} onChange - Callback function when selection changes (receives array of IDs)
 * @param {String} label - Label for the selector
 * @param {Boolean} multiple - Allow multiple selection
 */
export default function SubAcademicSelector({ 
  selectedSubAcademicIds = [], 
  onChange, 
  label = "Select Sub-Academic",
  multiple = true 
}) {
  const [subAcademic, setSubAcademic] = useState([]);
  const [academic, setAcademic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [academicFilter, setAcademicFilter] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchSubAcademic();
    fetchAcademic();
  }, []);

  useEffect(() => {
    // Load selected items when IDs change
    if (selectedSubAcademicIds && selectedSubAcademicIds.length > 0) {
      const items = subAcademic.filter(item => 
        selectedSubAcademicIds.includes(item._id)
      );
      setSelectedItems(items);
    } else {
      setSelectedItems([]);
    }
  }, [selectedSubAcademicIds, subAcademic]);

  const fetchAcademic = async () => {
    try {
      const response = await fetch(ACADEMIC_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch academic");
      const data = await response.json();
      setAcademic(data.data || []);
    } catch (err) {
      toast.error(`Failed to fetch academic: ${err.message}`);
    }
  };

  const fetchSubAcademic = async () => {
    try {
      setLoading(true);
      const response = await fetch(SUBACADEMIC_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch sub-academic");
      const data = await response.json();
      setSubAcademic(data.data || []);
    } catch (err) {
      toast.error(`Failed to fetch sub-academic: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getAcademicName = (academicId) => {
    const acad = academic.find(a => a._id === academicId);
    return acad?.title || academicId || "—";
  };

  const filteredSubAcademic = subAcademic.filter((item) => {
    const academicMatch = academicFilter === "all" || item.academicId === academicFilter;
    const searchMatch = searchTerm === "" ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getAcademicName(item.academicId)?.toLowerCase().includes(searchTerm.toLowerCase());
    return academicMatch && searchMatch;
  });

  const handleSelect = (item) => {
    if (multiple) {
      const isSelected = selectedItems.some(selected => selected._id === item._id);
      let newSelected;
      
      if (isSelected) {
        // Remove if already selected
        newSelected = selectedItems.filter(selected => selected._id !== item._id);
      } else {
        // Add to selection
        newSelected = [...selectedItems, item];
      }
      
      setSelectedItems(newSelected);
      if (onChange) {
        onChange(newSelected.map(item => item._id));
      }
    } else {
      // Single selection
      setSelectedItems([item]);
      if (onChange) {
        onChange([item._id]);
      }
      setIsDropdownOpen(false);
    }
  };

  const removeSelected = (itemId) => {
    const newSelected = selectedItems.filter(item => item._id !== itemId);
    setSelectedItems(newSelected);
    if (onChange) {
      onChange(newSelected.map(item => item._id));
    }
  };

  const isItemSelected = (itemId) => {
    return selectedItems.some(item => item._id === itemId);
  };

  return (
    <div className={styles.formField}>
      <label className={styles.formLabel}>
        {label} {multiple && <span className="text-muted">(Multiple selection)</span>}
      </label>
      
      {/* Selected Items Display */}
      {selectedItems.length > 0 && (
        <div style={{ 
          marginBottom: "12px", 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "8px" 
        }}>
          {selectedItems.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                backgroundColor: "#e0f2fe",
                borderRadius: "8px",
                border: "1px solid #0ea5e9"
              }}
            >
              {/* First image thumbnail */}
              {item.images && item.images.length > 0 && (
                <img
                  src={getImageUrl(item.images[0])}
                  alt={item.title}
                  style={{
                    width: "32px",
                    height: "32px",
                    objectFit: "cover",
                    borderRadius: "4px"
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <span style={{ fontSize: "14px", fontWeight: "500" }}>
                {item.title}
              </span>
              <button
                type="button"
                onClick={() => removeSelected(item._id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  display: "flex",
                  alignItems: "center"
                }}
                title="Remove"
              >
                <svg width="16" height="16" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown */}
      <div style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={styles.formInput}
          style={{
            textAlign: "left",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <span>{selectedItems.length > 0 ? `${selectedItems.length} selected` : "Click to select Sub-Academic"}</span>
          <svg 
            width="16" 
            height="16" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{
              transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s"
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            maxHeight: "400px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column"
          }}>
            {/* Search and Filter */}
            <div style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
              <input
                type="text"
                placeholder="Search Sub-Academic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  marginBottom: "8px"
                }}
              />
              <select
                value={academicFilter}
                onChange={(e) => setAcademicFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px"
                }}
              >
                <option value="all">All Academic</option>
                {academic.map((acad) => (
                  <option key={acad._id} value={acad._id}>
                    {acad.title}
                  </option>
                ))}
              </select>
            </div>

            {/* List */}
            <div style={{ overflowY: "auto", maxHeight: "300px" }}>
              {loading ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
                  Loading...
                </div>
              ) : filteredSubAcademic.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
                  No Sub-Academic found
                </div>
              ) : (
                filteredSubAcademic.map((item) => {
                  const isSelected = isItemSelected(item._id);
                  return (
                    <div
                      key={item._id}
                      onClick={() => handleSelect(item)}
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #f3f4f6",
                        cursor: "pointer",
                        backgroundColor: isSelected ? "#e0f2fe" : "white",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        transition: "background-color 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = "#f9fafb";
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = "white";
                      }}
                    >
                      {/* Checkbox */}
                      <div style={{
                        width: "20px",
                        height: "20px",
                        border: "2px solid #d1d5db",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isSelected ? "#0ea5e9" : "white"
                      }}>
                        {isSelected && (
                          <svg width="12" height="12" fill="none" stroke="white" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>

                      {/* Image */}
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={getImageUrl(item.images[0])}
                          alt={item.title}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            border: "1px solid #e5e7eb"
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div style={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: "#f3f4f6",
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <svg width="24" height="24" fill="none" stroke="#9ca3af" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}

                      {/* Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: "600", fontSize: "14px", marginBottom: "4px" }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6b7280" }}>
                          {getAcademicName(item.academicId)}
                        </div>
                        {item.eventType && (
                          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
                            {item.eventType}
                          </div>
                        )}
                        {item.images && item.images.length > 0 && (
                          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>
                            {item.images.length} image{item.images.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isDropdownOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}

