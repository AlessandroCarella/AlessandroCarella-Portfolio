import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjects } from "../hooks/useProjects.js";
import {
    filterProjects,
    PROJECT_TAGS,
    tagToSlug,
    slugToTag,
} from "../components/utils/projectUtils.js";
import ProjectGrid from "../components/projects/ProjectGrid";
import ProjectFilters from "../components/projects/ProjectFilters";
import LoadingState from "../components/projects/LoadingState";
import EmptyState from "../components/projects/EmptyState";
import Seo from "../components/Seo";
import "./styles/Projects.css";

/**
 * Projects Page - Main page displaying all projects with filters
 */
const Projects = () => {
    const { projectSlug } = useParams();
    const navigate = useNavigate();
    const { projects, loading, error } = useProjects();
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const categoryFromUrl = projectSlug ? (slugToTag(projectSlug) ?? "all") : "all";
    const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);

    // Sync state when URL changes (e.g. browser back/forward)
    useEffect(() => {
        setSelectedCategory(categoryFromUrl);
    }, [categoryFromUrl]);

    const handleCategoryChange = (category) => {
        if (category === "all") {
            navigate("/projects");
        } else {
            navigate(`/projects/${tagToSlug(category)}`);
        }
    };

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
            <Seo
                title="Projects"
                description="19 data science and data visualization projects: explainable AI, machine learning, visual analytics, and full-stack tools."
                path="/projects"
            />
            <h1 className="visually-hidden">Projects</h1>
            <ProjectFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                categories={PROJECT_TAGS}
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
