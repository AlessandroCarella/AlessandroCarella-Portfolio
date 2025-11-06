import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import "./styles/Projects.css";

const Projects = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        filterProjects();
    }, [projects, searchTerm, selectedCategory]);

    const loadProjects = async () => {
        try {
            // Dynamically import all JSON files from the projects directory
            const projectModules = import.meta.glob(
                "/src/pages/projects/**/*.json"
            );

            const projectsData = [];

            for (const path in projectModules) {
                try {
                    const module = await projectModules[path]();
                    const projectData = module.default;

                    // Extract folder path to construct correct paths
                    const folderMatch = path.match(
                        /\/src\/pages\/projects\/([^/]+)\//
                    );
                    const folderName = folderMatch ? folderMatch[1] : "";

                    // Determine background image
                    let backgroundImage = "/defaultPicProjectsCard.png";
                    // You can add logic here to check for specific images in the project folder

                    // Create URL-friendly slug for routing
                    const urlSlug = folderName
                        .toLowerCase()
                        .replace(/\s+/g, "-");

                    projectsData.push({
                        ...projectData,
                        folderName: folderName, // Original folder name for ProjectPage
                        folderPath: `/src/pages/projects/${folderName}`,
                        backgroundImage,
                        id: folderName,
                        urlSlug: urlSlug, // URL-friendly version
                    });
                } catch (error) {
                    console.error(`Error loading project from ${path}:`, error);
                }
            }

            setProjects(projectsData);
            setLoading(false);
        } catch (error) {
            console.error("Error loading projects:", error);
            setLoading(false);
        }
    };

    const categorizeProject = (project) => {
        const name = project.projectName.toLowerCase();
        if (name.includes("data mining")) return "data mining";
        if (name.includes("business") || name.includes("management"))
            return "business";
        if (name.includes("visual") || name.includes("information retrieval"))
            return "visualization";
        if (name.includes("thesis")) return "thesis";
        return "other";
    };

    const filterProjects = () => {
        let filtered = [...projects];

        // Filter by category
        if (selectedCategory !== "all") {
            filtered = filtered.filter(
                (project) => categorizeProject(project) === selectedCategory
            );
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (project) =>
                    project.projectName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    project.quickSummary
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProjects(filtered);
    };

    const handleCardClick = (project) => {
        // Navigate to the project detail page using URL slug
        navigate(`/projects/${project.urlSlug}`);
    };

    const getProjectLinks = (project) => {
        return {
            pdfLink: project.report
                ? `${project.folderPath}/${project.report}`
                : null,
            githubLink: project.repository || null,
            presentationLink: project.slides
                ? `${project.folderPath}/${project.slides}`
                : null,
        };
    };

    const getProjectColors = (category) => {
        const colorSchemes = {
            "data mining": {
                cardBackground: "#1a1f2e",
                titleColor: "#64b5f6",
                overlayGradientStart: "rgba(25, 118, 210, 0.1)",
                overlayGradientEnd: "rgba(25, 118, 210, 0.6)",
            },
            business: {
                cardBackground: "#1e1a2e",
                titleColor: "#ba68c8",
                overlayGradientStart: "rgba(123, 31, 162, 0.1)",
                overlayGradientEnd: "rgba(123, 31, 162, 0.6)",
            },
            visualization: {
                cardBackground: "#1a2e1f",
                titleColor: "#81c784",
                overlayGradientStart: "rgba(56, 142, 60, 0.1)",
                overlayGradientEnd: "rgba(56, 142, 60, 0.6)",
            },
            thesis: {
                cardBackground: "#2e1a1a",
                titleColor: "#e57373",
                overlayGradientStart: "rgba(211, 47, 47, 0.1)",
                overlayGradientEnd: "rgba(211, 47, 47, 0.6)",
            },
            other: {
                cardBackground: "#1a2a2e",
                titleColor: "#ffffff",
                overlayGradientStart: "rgba(0, 0, 0, 0.1)",
                overlayGradientEnd: "rgba(0, 0, 0, 0.5)",
            },
        };

        return colorSchemes[category] || colorSchemes.other;
    };

    if (loading) {
        return (
            <div className="projects-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading projects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="projects-container">
            {filteredProjects.length === 0 ? (
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
            ) : (
                <div className="projects-grid">
                    {filteredProjects.map((project) => {
                        const category = categorizeProject(project);
                        const links = getProjectLinks(project);
                        const colors = getProjectColors(category);

                        return (
                            <div
                                key={project.id}
                                onClick={() => handleCardClick(project)}
                                className="project-card-wrapper"
                            >
                                <ProjectCard
                                    title={project.projectName}
                                    description={
                                        project.quickSummary ||
                                        "No description available."
                                    }
                                    backgroundImage={project.backgroundImage}
                                    pdfLink={links.pdfLink}
                                    githubLink={links.githubLink}
                                    presentationLink={links.presentationLink}
                                    colors={colors}
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Projects;
