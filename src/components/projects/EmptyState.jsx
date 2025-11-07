import React from "react";

/**
 * EmptyState component - Displays when no projects match the filters
 */
const EmptyState = () => {
    return (
        <div className="empty-state">
            <svg
                className="empty-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3>No projects found</h3>
            <p>Try adjusting your search or filter criteria</p>
        </div>
    );
};

export default EmptyState;
