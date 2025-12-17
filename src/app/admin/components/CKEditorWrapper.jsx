'use client';

import React, { useEffect, useRef, useState } from 'react';

const CKEDITOR_VERSION = '4.22.1';

// Matches ANY CKEditor insecure version warning
const isCKEditorVersionWarning = (msg) =>
  typeof msg === "string" &&
  msg.includes("CKEditor") &&
  msg.includes("not secure");

export default function CKEditorWrapper({ data, config, onReady, onChange }) {
  const editorInstanceRef = useRef(null);
  const containerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const originalConsoleErrorRef = useRef(null);
  const consolePatchedRef = useRef(false);

  // Mount check (avoid hydration error)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === "undefined" || !containerRef.current) return;

    let isActive = true;

    const init = async () => {
      try {
        // Patch console.error only once
        if (!consolePatchedRef.current) {
          originalConsoleErrorRef.current = console.error;

          console.error = (...args) => {
            // 🔥 FILTER OUT insecure CKEditor warning, prevent React error
            if (args.length && isCKEditorVersionWarning(args[0])) {
              return;
            }
            originalConsoleErrorRef.current?.(...args);
          };

          consolePatchedRef.current = true;
        }

        // Load CKEditor CSS only once
        if (!document.getElementById("ckeditor-css")) {
          const link = document.createElement("link");
          link.id = "ckeditor-css";
          link.rel = "stylesheet";
          link.href = `https://cdn.ckeditor.com/${CKEDITOR_VERSION}/full-all/contents.css`;
          document.head.appendChild(link);
        }

        // Load CKEditor JS (full-all)
        if (!window.CKEDITOR) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = `https://cdn.ckeditor.com/${CKEDITOR_VERSION}/full-all/ckeditor.js`;
            script.async = true;

            script.onload = () => {
              const check = setInterval(() => {
                if (window.CKEDITOR) {
                  clearInterval(check);
                  resolve();
                }
              }, 50);

              setTimeout(() => {
                clearInterval(check);
                reject(new Error("CKEditor failed to load"));
              }, 8000);
            };

            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        // Safety delay
        await new Promise((r) => setTimeout(r, 150));

        if (!isActive || !containerRef.current || editorInstanceRef.current) return;

        // Global config
        window.CKEDITOR.disableAutoInline = true;
        window.CKEDITOR.config.allowedContent = true;
        window.CKEDITOR.config.autoParagraph = false;
        window.CKEDITOR.config.fillEmptyBlocks = false;

        // Allow complex HTML structures
        if (window.CKEDITOR.dtd?.$removeEmpty) {
          const e = window.CKEDITOR.dtd.$removeEmpty;
          e.span = e.i = e.a = e.li = false;
        }

        // Init editor
        editorInstanceRef.current = window.CKEDITOR.replace(containerRef.current, {
          height: 400,
          allowedContent: true,
          extraAllowedContent: "*(*){*}[*];li(*);ul(*);ol(*)",
          ...config,
        });

        // Set initial data
        setTimeout(() => {
          if (editorInstanceRef.current && data) {
            editorInstanceRef.current.setData(data);
          }
        }, 100);

        // On change
        editorInstanceRef.current.on("change", () => {
          const value = editorInstanceRef.current.getData();
          if (onChange) {
            onChange({ target: { value } }, { getData: () => value });
          }
        });

        // On ready
        editorInstanceRef.current.on("instanceReady", () => {
          if (!isActive) return;

          if (containerRef.current) {
            containerRef.current.style.display = "none";
          }

          onReady?.(editorInstanceRef.current);
        });

      } catch (err) {
        console.error("Failed to initialize CKEditor:", err);
      }
    };

    const timer = setTimeout(() => init(), 80);

    return () => {
      isActive = false;
      clearTimeout(timer);

      // Destroy editor
      if (editorInstanceRef.current) {
        try {
          editorInstanceRef.current.destroy();
        } catch {}
        editorInstanceRef.current = null;
      }

      // Restore console
      if (consolePatchedRef.current && originalConsoleErrorRef.current) {
        console.error = originalConsoleErrorRef.current;
        consolePatchedRef.current = false;
      }
    };
  }, [isMounted]);

  // Update content when `data` changes
  useEffect(() => {
    if (editorInstanceRef.current && data !== undefined) {
      const current = editorInstanceRef.current.getData();
      if (current !== data) {
        editorInstanceRef.current.setData(data || "");
      }
    }
  }, [data]);

  if (!isMounted) return null;

  return (
    <div style={{ minHeight: "400px", width: "100%" }}>
      <textarea
        ref={containerRef}
        defaultValue={data || ""}
        suppressHydrationWarning
        style={{
          width: "100%",
          minHeight: "400px",
          visibility: "visible",
          display: "block",
        }}
      />
    </div>
  );
}







// 'use client';

// import React, { useEffect, useRef, useState } from 'react';

// const CKEDITOR_VERSION = '4.22.1';
// const INSECURE_WARNING =
//   `This CKEditor ${CKEDITOR_VERSION} version is not secure. Consider upgrading to the latest one, 4.25.1-lts`;

// export default function CKEditorWrapper({ data, config, onReady, onChange }) {
//   const editorRef = useRef(null);
//   const editorInstanceRef = useRef(null);
//   const containerRef = useRef(null);
//   const [isMounted, setIsMounted] = useState(false);
//   const [editorReady, setEditorReady] = useState(false);
//   const originalConsoleErrorRef = useRef(null);
//   const consolePatchedRef = useRef(false);

//   // Only render on client side to avoid hydration errors
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   useEffect(() => {
//     if (typeof window === 'undefined' || !isMounted || !containerRef.current) return;

//     let componentMounted = true;

//     const initEditor = async () => {
//       try {
//         // Patch console.error to silence CKEditor insecure version warning (free version requirement)
//         if (!consolePatchedRef.current) {
//           originalConsoleErrorRef.current = console.error;
//           console.error = (...args) => {
//             if (
//               args.length &&
//               typeof args[0] === 'string' &&
//               args[0].includes(INSECURE_WARNING)
//             ) {
//               return;
//             }
//             originalConsoleErrorRef.current?.(...args);
//           };
//           consolePatchedRef.current = true;
//         }

//         // Load CKEditor CSS from CDN (full-all build includes uploadimage/image2)
//         if (!document.getElementById('ckeditor-css')) {
//           const link = document.createElement('link');
//           link.id = 'ckeditor-css';
//           link.rel = 'stylesheet';
//           link.href = `https://cdn.ckeditor.com/${CKEDITOR_VERSION}/full-all/contents.css`;
//           document.head.appendChild(link);
//         }

//         const applyGlobalConfig = () => {
//           if (!window.CKEDITOR) return;
//           window.CKEDITOR.disableAutoInline = true;
//           window.CKEDITOR.config.allowedContent = true;
//           window.CKEDITOR.config.extraAllowedContent = '*(*){*}[*];li(*);li[*];li{*};ul(*);ul[*];ul{*};ol(*);ol[*];ol{*}';
//           window.CKEDITOR.config.autoParagraph = false;
//           window.CKEDITOR.config.fillEmptyBlocks = false;
//           if (window.CKEDITOR.dtd?.$removeEmpty) {
//             window.CKEDITOR.dtd.$removeEmpty.span = false;
//             window.CKEDITOR.dtd.$removeEmpty.i = false;
//             window.CKEDITOR.dtd.$removeEmpty.a = false;
//             window.CKEDITOR.dtd.$removeEmpty.li = false;
//           }
//         };

//         // Load CKEditor from CDN (full-all build gives access to uploadimage/image2 plugins)
//         if (!window.CKEDITOR) {
//           const script = document.createElement('script');
//           script.src = `https://cdn.ckeditor.com/${CKEDITOR_VERSION}/full-all/ckeditor.js`;
//           script.async = true;
          
//           await new Promise((resolve, reject) => {
//             script.onload = () => {
//               // Wait for CKEDITOR to be fully loaded
//               const checkCKEditor = setInterval(() => {
//                 if (window.CKEDITOR) {
//                   clearInterval(checkCKEditor);
//                   applyGlobalConfig();
//                   resolve();
//                 }
//               }, 50);
//               setTimeout(() => {
//                 clearInterval(checkCKEditor);
//                 reject(new Error('CKEditor failed to load'));
//               }, 10000);
//             };
//             script.onerror = reject;
//             document.head.appendChild(script);
//           });
//         } else {
//           applyGlobalConfig();
//         }

//         // Wait a bit for CKEDITOR to be ready and ensure DOM is ready
//         await new Promise(resolve => setTimeout(resolve, 200));

//         // Check if component is still mounted and textarea exists
//         if (!componentMounted || !containerRef.current) return;

//         // Initialize CKEditor only if not already initialized
//         if (window.CKEDITOR && containerRef.current && !editorInstanceRef.current) {
//           try {
//             // Make sure textarea is visible for CKEditor to replace it
//             if (containerRef.current) {
//               containerRef.current.style.visibility = 'visible';
//               containerRef.current.style.display = 'block';
//             }

//             applyGlobalConfig();
//             editorInstanceRef.current = window.CKEDITOR.replace(containerRef.current, {
//               height: 400,
//               allowedContent: true,
//               extraAllowedContent: '*(*){*}[*];li(*);li[*];li{*};ul(*);ul[*];ul{*};ol(*);ol[*];ol{*}',
//               ...config
//             });

//             // Set initial data after a small delay to ensure editor is ready
//             setTimeout(() => {
//               if (editorInstanceRef.current && data) {
//                 editorInstanceRef.current.setData(data);
//               }
//             }, 100);

//             // Handle content changes
//             editorInstanceRef.current.on('change', () => {
//               if (editorInstanceRef.current) {
//                 const editorData = editorInstanceRef.current.getData();
//                 if (onChange) {
//                   // CKEditor 4 compatibility - pass data directly
//                   const fakeEvent = { target: { value: editorData } };
//                   onChange(fakeEvent, { getData: () => editorData });
//                 }
//               }
//             });

//             // Call onReady callback
//             editorInstanceRef.current.on('instanceReady', () => {
//               setEditorReady(true);
//               // Hide the original textarea after editor is ready
//               if (containerRef.current) {
//                 containerRef.current.style.display = 'none';
//               }
//               if (onReady && editorInstanceRef.current) {
//                 onReady(editorInstanceRef.current);
//               }
//             });
//           } catch (initError) {
//             console.error('Error initializing CKEditor instance:', initError);
//             setEditorReady(false);
//           }
//         }
//       } catch (error) {
//         console.error('Failed to initialize CKEditor:', error);
//       }
//     };

//     // Small delay to ensure textarea is in DOM
//     const timer = setTimeout(() => {
//       if (containerRef.current && componentMounted) {
//         initEditor();
//       }
//     }, 100);

//     // Cleanup
//     return () => {
//       componentMounted = false;
//       clearTimeout(timer);
//       if (editorInstanceRef.current) {
//         try {
//           editorInstanceRef.current.destroy();
//         } catch (e) {
//           // Ignore destroy errors
//         }
//         editorInstanceRef.current = null;
//       }
//       if (consolePatchedRef.current && originalConsoleErrorRef.current) {
//         console.error = originalConsoleErrorRef.current;
//         consolePatchedRef.current = false;
//       }
//     };
//   }, [isMounted]); // Only depend on isMounted to avoid re-initialization

//   // Update editor content when data prop changes
//   useEffect(() => {
//     if (editorInstanceRef.current && data !== undefined) {
//       const currentData = editorInstanceRef.current.getData();
//       if (currentData !== data) {
//         editorInstanceRef.current.setData(data || '');
//       }
//     }
//   }, [data, isMounted]);

//   // Don't render anything until mounted to avoid hydration mismatch
//   if (!isMounted) {
//     return null;
//   }

//   return (
//     <div style={{ minHeight: '400px', width: '100%' }}>
//       <textarea
//         ref={containerRef}
//         name="editor"
//         id="ckeditor-textarea"
//         defaultValue={data || ''}
//         suppressHydrationWarning
//         style={{ 
//           width: '100%', 
//           minHeight: '400px',
//           display: 'block',
//           visibility: 'visible'
//         }}
//       />
//     </div>
//   );
// }

