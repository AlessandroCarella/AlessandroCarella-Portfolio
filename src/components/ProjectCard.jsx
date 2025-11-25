import React from "react";
import { Github, FileText, Globe, Presentation } from "lucide-react";
import { SiNotion } from "react-icons/si";
import "./styles/ProjectCard.css";

const ProjectCard = ({
    title,
    description,
    backgroundImage,
    pdfLink,
    githubLink,
    presentationLink,
    liveVersionLink,
    classNotesLink,
}) => {
    return (
        <div className="project-card">
            <div className="card-content">
                {/* Image Section with Title Overlay - 40% */}
                <div
                    className="card-image-section"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                >
                    <div className="image-overlay-project-card"></div>
                    <h3 className="card-title">{title}</h3>
                </div>

                {/* Description Section - 50% */}
                <div className="card-description-section">
                    <p className="card-description">{description}</p>
                </div>

                {/* Action Buttons Section - 10% */}
                <div className="card-actions-section">
                    {pdfLink && (
                        <a
                            href={pdfLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-button"
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
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Globe className="button-icon" size={16} />
                            Live Demo
                        </a>
                    )}

                    {classNotesLink && (
                        <a
                            href={classNotesLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-button"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <SiNotion className="button-icon" size={16} />
                            Class Notes
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
