import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * ErrorState component - Displays error message with back button
 */
const ErrorState = ({ title = "Error", message, showBackButton = true }) => {
    const navigate = useNavigate();

    return (
        <div className="error-message">
            <h2>{title}</h2>
            <p>{message || "An error occurred. Please try again."}</p>
            {showBackButton && (
                <button
                    onClick={() => navigate("/projects")}
                    className="back-button"
                >
                    ← Back to Projects
                </button>
            )}
        </div>
    );
};

export default ErrorState;
