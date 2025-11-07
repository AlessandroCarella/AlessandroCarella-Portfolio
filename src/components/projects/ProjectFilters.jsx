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
            {categories.length > 0 && (
                <div className="category-filters">
                    <button
                        className={`category-button ${
                            selectedCategory === "all" ? "active" : ""
                        }`}
                        onClick={() => onCategoryChange("all")}
                    >
                        All
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`category-button ${
                                selectedCategory === category ? "active" : ""
                            }`}
                            onClick={() => onCategoryChange(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectFilters;
