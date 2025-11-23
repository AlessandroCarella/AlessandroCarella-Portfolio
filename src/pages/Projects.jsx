import React, { useState, useEffect } from "react";
import { useProjects } from "../hooks/useProjects.js";
import {
    filterProjects,
    getAllCategories,
} from "../components/utils/projectUtils.js";
import ProjectGrid from "../components/projects/ProjectGrid";
import ProjectFilters from "../components/projects/ProjectFilters";
import LoadingState from "../components/projects/LoadingState";
import EmptyState from "../components/projects/EmptyState";
import "./styles/Projects.css";

/**
 * Projects Page - Main page displaying all projects with filters
 */
const Projects = () => {
    const { projects, loading, error } = useProjects();
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Filter projects when dependencies change
    useEffect(() => {
        if (projects.length > 0) {
            const filtered = filterProjects(
                projects,
                searchTerm,
                selectedCategory
            );
            setFilteredProjects(filtered);
        }
    }, [projects, searchTerm, selectedCategory]);

    // Get unique categories from projects using utility function
    const categories = getAllCategories(projects);

    if (loading) {
        return (
            <div className="projects-container">
                <LoadingState message="Loading projects..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="projects-container">
                <div className="error-message">
                    <h2>Error Loading Projects</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="projects-container">
            <ProjectFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categories={categories}
            />

            {filteredProjects.length === 0 ? (
                <EmptyState />
            ) : (
                <ProjectGrid projects={filteredProjects} />
            )}
        </div>
    );
};

export default Projects;
