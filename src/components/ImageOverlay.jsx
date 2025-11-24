import React, { useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import "./styles/ImageOverlay.css";

const ImageOverlay = ({ imageSrc, onClose, alt = "Image" }) => {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleOverlayClick = (e) => {
        if (e.target.className === "image-overlay") {
            onClose();
        }
    };

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.25, 0.5));
    };

    const handleReset = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && zoom > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            handleZoomIn();
        } else {
            handleZoomOut();
        }
    };

    return (
        <div className="image-overlay" onClick={handleOverlayClick}>
            <div className="image-overlay-content">
                {/* Header */}
                <div className="image-overlay-header">
                    <h2 className="heading-md image-overlay-title">{alt}</h2>
                    <div className="image-overlay-controls">
                        <button
                            className="image-control-button"
                            onClick={handleZoomOut}
                            title="Zoom Out"
                            disabled={zoom <= 0.5}
                        >
                            <ZoomOut size={20} />
                        </button>
                        <span className="zoom-level">
                            {Math.round(zoom * 100)}%
                        </span>
                        <button
                            className="image-control-button"
                            onClick={handleZoomIn}
                            title="Zoom In"
                            disabled={zoom >= 3}
                        >
                            <ZoomIn size={20} />
                        </button>
                        <button
                            className="image-control-button"
                            onClick={handleReset}
                            title="Reset"
                        >
                            <RotateCcw size={20} />
                        </button>
                        <button
                            className="image-control-button image-close-button"
                            onClick={onClose}
                            title="Close"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Image Viewer */}
                <div
                    className="image-viewer-container"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                >
                    <img
                        src={imageSrc}
                        alt={alt}
                        className="image-viewer"
                        style={{
                            transform: `scale(${zoom}) translate(${
                                position.x / zoom
                            }px, ${position.y / zoom}px)`,
                            cursor:
                                zoom > 1
                                    ? isDragging
                                        ? "grabbing"
                                        : "grab"
                                    : "default",
                        }}
                        draggable={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageOverlay;
