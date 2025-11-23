import React, { useState, useEffect } from "react";
import ProjectSidebar from "./ProjectSidebar";
import ProjectMainContent from "./ProjectMainContent";
import PDFOverlay from "../PDFOverlay";
import "../../pages/styles/ProjectPage.css";

/**
 * ProjectContent component - Main container for project content
 */
const ProjectContent = ({
    projectFolderName,
    projectsFolder = "/projects/",
    imageNames = [],
    htmlFileName = null,
}) => {
    const [projectData, setProjectData] = useState(null);
    const [htmlContent, setHtmlContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activePDF, setActivePDF] = useState(null);

    useEffect(() => {
        const loadProjectData = async () => {
            try {
                setLoading(true);

                const basePath = `${projectsFolder}${projectFolderName}`;

                // Load config to get exact filenames
                const configResponse = await fetch(
                    "/projects/projects-config.json"
                );
                if (!configResponse.ok) {
                    throw new Error("Failed to load projects configuration");
                }
                console.log(configResponse)
                const config = await configResponse.json();
                // Find this project's config
                const projectConfig = config.find(
                    (p) => p.folder === projectFolderName
                );

                if (!projectConfig) {
                    throw new Error("Project configuration not found");
                }

                // Load JSON file using exact filename from config
                const jsonPath = `${basePath}/${projectConfig.jsonFile}`;
                const jsonResponse = await fetch(jsonPath);
                if (!jsonResponse.ok) {
                    throw new Error("Failed to load project JSON");
                }
                const jsonData = await jsonResponse.json();

                setProjectData(jsonData);

                // Load HTML content using exact filename from config
                if (projectConfig.htmlFile) {
                    const htmlPath = `${basePath}/${projectConfig.htmlFile}`;
                    const htmlResponse = await fetch(htmlPath);
                    if (htmlResponse.ok) {
                        let htmlText = await htmlResponse.text();

                        // Extract image names from HTML content
                        const imgRegex = /src=["']([^"']+)["']/g;
                        let match;
                        const extractedImages = new Set();

                        while ((match = imgRegex.exec(htmlText)) !== null) {
                            const src = match[1];
                            // Only process relative paths (not absolute URLs or already processed paths)
                            if (
                                !src.startsWith("http") &&
                                !src.startsWith("/") &&
                                !src.startsWith("data:")
                            ) {
                                extractedImages.add(src);
                            }
                        }

                        // Replace image paths with correct absolute paths
                        extractedImages.forEach((imageName) => {
                            const imagePath = `${basePath}/${imageName}`;
                            // Escape special regex characters in the image name
                            const escapedImageName = imageName.replace(
                                /[.*+?^${}()|[\]\\]/g,
                                "\\$&"
                            );
                            const regex = new RegExp(
                                `src=["']${escapedImageName}["']`,
                                "g"
                            );
                            htmlText = htmlText.replace(
                                regex,
                                `src="${imagePath}"`
                            );
                        });

                        setHtmlContent(htmlText);
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error("Error loading project data:", err);
                setError(
                    `Error Loading Project: ${err.message}. Please check that the project files exist.`
                );
                setLoading(false);
            }
        };

        if (projectFolderName) {
            loadProjectData();
        }
    }, [projectFolderName, projectsFolder, imageNames, htmlFileName]);

    const handleOpenPDF = (type, path) => {
        const fullPath = `${projectsFolder}${projectFolderName}/${path}`;
        setActivePDF({ type, path: fullPath });
    };

    const handleClosePDF = () => {
        setActivePDF(null);
    };

    if (loading) {
        return (
            <div className="loading-message">
                <div className="loading-spinner"></div>
                <p>Loading project...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-message">
                <p>{error}</p>
            </div>
        );
    }

    if (!projectData) {
        return null;
    }

    return (
        <div className="project-page-wrapper">
            {/* Project Title Section */}
            <div className="project-title-section">
                <h1 className="project-main-title heading-xl">
                    {projectData.projectName}
                </h1>
            </div>

            {/* Project Page Container */}
            <div className="project-page-container">
                {/* Main Content */}
                <ProjectMainContent
                    htmlContent={htmlContent}
                    projectData={projectData}
                />

                {/* Sidebar */}
                <ProjectSidebar
                    projectData={projectData}
                    onOpenPDF={handleOpenPDF}
                />
            </div>

            {/* PDF Overlay */}
            {activePDF && (
                <PDFOverlay
                    pdfPath={activePDF.path}
                    title={activePDF.type}
                    onClose={handleClosePDF}
                />
            )}
        </div>
    );
};

export default ProjectContent;
