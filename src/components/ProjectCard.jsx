import React, { useState } from "react";
import { Github, FileText, Globe, Presentation } from "lucide-react";
import "./styles/ProjectCard.css";

const ProjectCard = ({
    title,
    description,
    backgroundImage,
    pdfLink,
    githubLink,
    presentationLink,
    liveVersionLink,
    colors = {
        cardBackground: "#ffffff",
        titleColor: "#ffffff",
        titleShadow: "rgba(0, 0, 0, 0.3)",
        descriptionColor: "#4a5568",
        buttonBackground: "#f7fafc",
        buttonBorder: "#e2e8f0",
        buttonText: "#2d3748",
        buttonHoverBackground: "#edf2f7",
        buttonHoverBorder: "#cbd5e0",
        dividerColor: "#e2e8f0",
        scrollbarTrack: "#f1f1f1",
        scrollbarThumb: "#cbd5e0",
        scrollbarThumbHover: "#a0aec0",
        overlayGradientStart: "rgba(0, 0, 0, 0.1)",
        overlayGradientEnd: "rgba(0, 0, 0, 0.5)",
    },
}) => {
    return (
        <div
            className="project-card"
            style={{ "--card-bg": colors.cardBackground }}
        >
            <div className="card-content">
                {/* Image Section with Title Overlay - 40% */}
                <div
                    className="card-image-section"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        "--overlay-start": colors.overlayGradientStart,
                        "--overlay-end": colors.overlayGradientEnd,
                    }}
                >
                    <div className="image-overlay-project-card"></div>
                    <h3
                        className="card-title"
                        style={{
                            color: colors.titleColor,
                            textShadow: `0 2px 4px ${colors.titleShadow}`,
                        }}
                    >
                        {title}
                    </h3>
                </div>

                {/* Description Section - 50% */}
                <div
                    className="card-description-section"
                    style={{
                        "--scrollbar-track": colors.scrollbarTrack,
                        "--scrollbar-thumb": colors.scrollbarThumb,
                        "--scrollbar-thumb-hover": colors.scrollbarThumbHover,
                    }}
                >
                    <p
                        className="card-description"
                        style={{ color: colors.descriptionColor }}
                    >
                        {description}
                    </p>
                </div>

                {/* Action Buttons Section - 10% */}
                <div
                    className="card-actions-section"
                    style={{ borderTopColor: colors.dividerColor }}
                >
                    {pdfLink && (
                        <a
                            href={pdfLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-button"
                            style={{
                                "--btn-bg": colors.buttonBackground,
                                "--btn-border": colors.buttonBorder,
                                "--btn-text": colors.buttonText,
                                "--btn-hover-bg": colors.buttonHoverBackground,
                                "--btn-hover-border": colors.buttonHoverBorder,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FileText className="button-icon" size={16} />
                            Report
                        </a>
                    )}

                    {githubLink && (
                        <a
                            href={githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-button"
                            style={{
                                "--btn-bg": colors.buttonBackground,
                                "--btn-border": colors.buttonBorder,
                                "--btn-text": colors.buttonText,
                                "--btn-hover-bg": colors.buttonHoverBackground,
                                "--btn-hover-border": colors.buttonHoverBorder,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Github className="button-icon" size={16} />
                            GitHub
                        </a>
                    )}

                    {presentationLink && (
                        <a
                            href={presentationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-button"
                            style={{
                                "--btn-bg": colors.buttonBackground,
                                "--btn-border": colors.buttonBorder,
                                "--btn-text": colors.buttonText,
                                "--btn-hover-bg": colors.buttonHoverBackground,
                                "--btn-hover-border": colors.buttonHoverBorder,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Presentation className="button-icon" size={16} />
                            Slides
                        </a>
                    )}

                    {liveVersionLink && (
                        <a
                            href={liveVersionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-button"
                            style={{
                                "--btn-bg": colors.buttonBackground,
                                "--btn-border": colors.buttonBorder,
                                "--btn-text": colors.buttonText,
                                "--btn-hover-bg": colors.buttonHoverBackground,
                                "--btn-hover-border": colors.buttonHoverBorder,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Globe className="button-icon" size={16} />
                            Live Demo
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
