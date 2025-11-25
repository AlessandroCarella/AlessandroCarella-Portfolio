import React from "react";
import { ExternalLink, Briefcase } from "lucide-react";
import { SiNotion } from "react-icons/si";
import "./styles/ExamCard.css";

const ExamCard = ({
    exam,
    ssd,
    credits,
    link = "",
    projectLink = "",
    notesLink = "",
}) => {
    const hasLink = link !== "";
    const hasProjectLink = projectLink !== "";
    const hasNotesLink = notesLink !== "";

    const handleClick = () => {
        if (hasLink) {
            window.open(link, "_blank", "noopener,noreferrer");
        }
    };

    const handleProjectClick = (e) => {
        e.stopPropagation();
        window.open(projectLink, "_blank", "noopener,noreferrer");
    };

    const handleNotesClick = (e) => {
        e.stopPropagation();
        window.open(notesLink, "_blank", "noopener,noreferrer");
    };

    return (
        <div
            className={`exam-card ${hasLink ? "exam-card-clickable" : ""}`}
            onClick={handleClick}
        >
            <div className="exam-card-content">
                <div className="exam-card-header">
                    <h4 className="exam-title">{exam}</h4>
                    <div className="exam-icons">
                        {hasProjectLink && (
                            <Briefcase
                                size={16}
                                className="exam-icon exam-project-icon"
                                onClick={handleProjectClick}
                                title="View Project"
                            />
                        )}
                        {hasNotesLink && (
                            <SiNotion
                                size={16}
                                className="exam-icon exam-notes-icon"
                                onClick={handleNotesClick}
                                title="View Class Notes"
                            />
                        )}
                        {hasLink && (
                            <ExternalLink
                                size={16}
                                className="exam-icon exam-link-icon"
                            />
                        )}
                    </div>
                </div>
                <div className="exam-card-footer">
                    {ssd && <span className="exam-ssd">{ssd}</span>}
                    <span className="exam-credits">{credits} ECTS</span>
                </div>
            </div>
        </div>
    );
};

export default ExamCard;
