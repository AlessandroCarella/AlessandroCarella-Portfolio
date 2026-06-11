import React from "react";
import { Search } from "lucide-react";

/**
 * ProjectFilters component - Search bar and category filters
 */
const ProjectFilters = ({
    searchTerm,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    categories = [],
}) => {
    // Tags are stored lowercase; title-case them for display only
    const titleCase = (str) =>
        str.replace(/\b\w/g, (char) => char.toUpperCase());

    return (
        <div className="projects-controls">
            {/* Search Bar */}
            <div className="search-bar">
                <Search className="search-icon" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Category Filters */}
            {Object.keys(categories).length > 0 && (
                <div className="category-filters">
                    <button
                        className={`category-button ${
                            selectedCategory === "all" ? "active" : ""
                        }`}
                        onClick={() => onCategoryChange("all")}
                    >
                        All
                    </button>
                    {Object.entries(categories).map(([category, color]) => (
                        <button
                            key={category}
                            style={{ "--tag-color": color }}
                            className={`category-button ${
                                selectedCategory === category ? "active" : ""
                            }`}
                            onClick={() => onCategoryChange(category)}
                        >
                            {titleCase(category)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectFilters;
