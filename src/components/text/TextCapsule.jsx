import React from "react";
import "./styles/TextCapsule.css";

const TextCapsule = ({
    name,
    link,
    icon,
    onHover,
    onLeave,
    onClick,
}) => {
    return (
        <div
            className="text-capsule"
            style={{ cursor: link ? "pointer" : "default" }}
            onMouseEnter={(e) => {
                if (link && onHover) {
                    onHover(link, e);
                }
            }}
            onMouseLeave={() => {
                if (onLeave) {
                    onLeave();
                }
            }}
            onClick={() => {
                if (link && onClick) {
                    onClick(link);
                }
            }}
        >
            {icon && (
                <span className="capsule-icon">
                    {icon}
                </span>
            )}
            <span className="capsule-text">
                {name}
            </span>
        </div>
    );
};

export default TextCapsule;
