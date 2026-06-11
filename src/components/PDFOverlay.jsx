import React, { useEffect, useRef, useState } from "react";
import { X, ZoomIn, ZoomOut, Download } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./styles/PDFOverlay.css";

// Configure the pdf.js worker (bundled by Vite from pdfjs-dist)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_STEP = 0.25;

const PDFOverlay = ({ pdfPath, onClose, title = "Document" }) => {
    const containerRef = useRef(null);
    const pageRefs = useRef([]);
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [baseWidth, setBaseWidth] = useState(0);
    const [scale, setScale] = useState(1);
    const [error, setError] = useState(null);

    const handleOverlayClick = (e) => {
        if (e.target.className === "pdf-overlay") {
            onClose();
        }
    };

    const zoomIn = () =>
        setScale((s) => Math.min(MAX_SCALE, +(s + SCALE_STEP).toFixed(2)));
    const zoomOut = () =>
        setScale((s) => Math.max(MIN_SCALE, +(s - SCALE_STEP).toFixed(2)));

    // Track container width so pages render at the right base size
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const update = () => {
            // Subtract horizontal padding (2rem each side) so pages don't overflow
            const padding = 64;
            setBaseWidth(Math.max(0, el.clientWidth - padding));
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Track the most-visible page to show the current page number
    useEffect(() => {
        if (!numPages) return;
        const root = containerRef.current;
        if (!root) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (visible) {
                    const page = Number(visible.target.dataset.pageNumber);
                    if (page) setCurrentPage(page);
                }
            },
            { root, threshold: [0.25, 0.5, 0.75] }
        );

        pageRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, [numPages]);

    const fileName = decodeURIComponent(
        (pdfPath || "").split("/").pop() || "document.pdf"
    );

    return (
        <div className="pdf-overlay" onClick={handleOverlayClick}>
            <div className="pdf-overlay-content">
                {/* Header */}
                <div className="pdf-overlay-header">
                    <h2 className="heading-md pdf-overlay-title">{title}</h2>
                    <div className="pdf-overlay-controls">
                        {numPages && (
                            <span className="pdf-page-count">
                                {currentPage} / {numPages}
                            </span>
                        )}

                        <button
                            className="pdf-control-button"
                            onClick={zoomOut}
                            disabled={scale <= MIN_SCALE}
                            title="Zoom out"
                        >
                            <ZoomOut size={20} />
                        </button>
                        <span className="pdf-zoom-level">
                            {Math.round(scale * 100)}%
                        </span>
                        <button
                            className="pdf-control-button"
                            onClick={zoomIn}
                            disabled={scale >= MAX_SCALE}
                            title="Zoom in"
                        >
                            <ZoomIn size={20} />
                        </button>

                        <a
                            className="pdf-control-button"
                            href={pdfPath}
                            download={fileName}
                            title="Download"
                        >
                            <Download size={20} />
                        </a>

                        <button
                            className="pdf-control-button pdf-close-button"
                            onClick={onClose}
                            title="Close"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* PDF Viewer */}
                <div className="pdf-viewer-container" ref={containerRef}>
                    {error ? (
                        <p className="pdf-viewer-message">{error}</p>
                    ) : (
                        <Document
                            file={pdfPath}
                            className="pdf-document"
                            loading={
                                <p className="pdf-viewer-message">
                                    Loading PDF…
                                </p>
                            }
                            onLoadSuccess={({ numPages }) => {
                                pageRefs.current = [];
                                setNumPages(numPages);
                            }}
                            onLoadError={(err) =>
                                setError(`Failed to load PDF: ${err.message}`)
                            }
                        >
                            {Array.from({ length: numPages || 0 }, (_, i) => (
                                <div
                                    key={`page_${i + 1}`}
                                    data-page-number={i + 1}
                                    ref={(el) => (pageRefs.current[i] = el)}
                                >
                                    <Page
                                        pageNumber={i + 1}
                                        width={
                                            baseWidth
                                                ? baseWidth * scale
                                                : undefined
                                        }
                                        className="pdf-page"
                                        renderAnnotationLayer={false}
                                        renderTextLayer={false}
                                    />
                                </div>
                            ))}
                        </Document>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PDFOverlay;
