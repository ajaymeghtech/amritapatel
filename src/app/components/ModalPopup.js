'use client';

/**
 * NextJS Modal Example (single-file)
 * - Copy this file into your Next.js app (e.g. components/ModalExample.jsx)
 * - It uses a simple accessible modal implemented with React + portals
 * - No Tailwind required (pure inline styles). Works in Next.js 13+ app or pages router.
 *
 * Features:
 * - Open / close modal
 * - Close on overlay click or ESC
 * - Return focus to trigger button
 * - Basic aria attributes for accessibility
 *
 * How to use:
 * 1) Save this file as components/ModalExample.jsx
 * 2) Import and use <ModalExample /> in any page (e.g. app/page.jsx or pages/index.jsx)
 * 3) No extra packages required.
 */

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function useIsBrowser() {
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => setIsBrowser(true), []);
  return isBrowser;
}

function Modal({ isOpen, onClose, title, children }) {
  const isBrowser = useIsBrowser();
  const overlayRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    // Save focused element and move focus into modal
    previouslyFocused.current = document.activeElement;
    const firstFocusable = overlayRef.current?.querySelector('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
    firstFocusable?.focus();

    function onKey(e) {
      if (e.key === 'Escape') onClose();
      // very simple focus trap: prevent tabbing out of modal
      if (e.key === 'Tab') {
        const focusable = overlayRef.current.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden'; // prevent background scroll
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previouslyFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isBrowser || !isOpen) return null;

  return createPortal(
    <div
    id="modalOverlay"
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Modal dialog'}
      style={styles.overlay}
      onMouseDown={(e) => {
        // close when clicking outside the content
        if (e.target === e.currentTarget) onClose();
      }}
      ref={overlayRef}
    >
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={styles.closeButton}
          >
            ×
          </button>
        </div>
        <div style={styles.body}>{children}</div>
        <div style={styles.footer}>
          <button onClick={onClose} style={styles.primaryButton}>Close</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function ModalExample() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 12 }}>Next.js modal example</h1>
      <button
        onClick={() => setOpen(true)}
        style={styles.openButton}
      >
        Open Modal
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Example modal">
        <p style={{ marginTop: 0 }}>
          This is a simple modal. Put forms, text, or other content here.
        </p>
        <input placeholder="Example input" style={styles.input} />
      </Modal>
    </div>
  );
}


