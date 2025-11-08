import React from "react";
import { ExternalLink } from "lucide-react";
import "./styles/ExamCard.css";

const ExamCard = ({ exam, ssd, credits, link = "" }) => {
    const hasLink = link !== "";

    const handleClick = () => {
        if (hasLink) {
            window.open(link, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div
            className={`exam-card ${hasLink ? "exam-card-clickable" : ""}`}
            onClick={handleClick}
        >
            <div className="exam-card-content">
                <div className="exam-card-header">
                    <h4 className="exam-title">{exam}</h4>
                    {hasLink && (
                        <ExternalLink size={16} className="exam-link-icon" />
                    )}
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
