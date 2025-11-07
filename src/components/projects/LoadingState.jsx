import React from "react";

/**
 * LoadingState component - Displays loading spinner with message
 */
const LoadingState = ({ message = "Loading..." }) => {
    return (
        <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{message}</p>
        </div>
    );
};

export default LoadingState;
