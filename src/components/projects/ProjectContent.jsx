import React, { useState, useEffect, Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import { SITE_URL } from "../../../site.config.js";
import Seo from "../Seo";
import ProjectSidebar from "./ProjectSidebar";
import ProjectMainContent from "./ProjectMainContent";
import ImageOverlay from "../ImageOverlay";

// Lazy-load the PDF viewer (react-pdf + pdfjs worker, ~1 MB) only on first open.
const PDFOverlay = lazy(() => import("../PDFOverlay"));
import "../../pages/styles/ProjectPage.css";
import "../styles/Carousel.css";

/**
 * ProjectContent component - Main container for project content
 */
const ProjectContent = ({
    projectFolderName,
    projectsFolder = "/projects/",
    imageNames = [],
    htmlFileName = null,
}) => {
    const { projectSlug } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [htmlContent, setHtmlContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activePDF, setActivePDF] = useState(null);
    const [activeImage, setActiveImage] = useState(null);

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

    const handleOpenImage = (imageSrc, alt) => {
        setActiveImage({ src: imageSrc, alt: alt || "Project Image" });
    };

    const handleCloseImage = () => {
        setActiveImage(null);
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
            <Seo
                title={projectData.projectName}
                description={
                    projectData.quickSummary ||
                    `${projectData.projectName} — a data science project by Alessandro Carella.`
                }
                path={`/projects/${projectSlug ?? ""}`}
                breadcrumb={[
                    { name: "Home", item: `${SITE_URL}/home` },
                    { name: "Projects", item: `${SITE_URL}/projects` },
                    {
                        name: projectData.projectName,
                        item: `${SITE_URL}/projects/${projectSlug ?? ""}`,
                    },
                ]}
            />
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
                    onImageClick={handleOpenImage}
                />

                {/* Sidebar */}
                <ProjectSidebar
                    projectData={projectData}
                    onOpenPDF={handleOpenPDF}
                />
            </div>

            {/* PDF Overlay */}
            {activePDF && (
                <Suspense fallback={null}>
                    <PDFOverlay
                        pdfPath={activePDF.path}
                        title={activePDF.type}
                        onClose={handleClosePDF}
                    />
                </Suspense>
            )}

            {/* Image Overlay */}
            {activeImage && activeImage.src && (
                <ImageOverlay
                    imageSrc={activeImage.src}
                    alt={activeImage.alt}
                    onClose={handleCloseImage}
                />
            )}
        </div>
    );
};

export default ProjectContent;
