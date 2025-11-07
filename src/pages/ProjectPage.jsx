import React, { useState, useEffect } from "react";
import TextCapsule from "../components/text/TextCapsule";
import SkillSection from "../components/SkillSection";
import PDFOverlay from "../components/PDFOverlay";
import CollapsibleSection from "../components/CollapsibleSection";
import { Github, Linkedin, FileText, BookOpen } from "lucide-react";
import { SiNotion } from "react-icons/si";

import "./styles/ProjectPage.css";

const ProjectPage = ({
    projectFolderName,
    projectsFolder = "/projects/",
    imageNames = [],
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

                // Construct paths - files are in public folder
                const basePath = `${projectsFolder}${projectFolderName}`;

                // Try to find the JSON file - need to handle different naming conventions
                let jsonData = null;
                let htmlText = null;

                // Try different possible JSON file names
                const possibleJsonNames = [
                    `${projectFolderName}.json`,
                    `${projectFolderName.replace(/\s+/g, "_")}.json`,
                    `${projectFolderName
                        .replace(/\s+/g, "_")
                        .replace(/_(\d)/g, " $1")}.json`,
                ];

                for (const jsonName of possibleJsonNames) {
                    try {
                        const jsonPath = `${basePath}/${jsonName}`;
                        const jsonResponse = await fetch(jsonPath);
                        if (jsonResponse.ok) {
                            jsonData = await jsonResponse.json();
                            break;
                        }
                    } catch (e) {
                        // Continue to next possibility
                    }
                }

                if (!jsonData) {
                    throw new Error("Failed to load project JSON");
                }

                setProjectData(jsonData);

                // Try to load HTML content if specified
                if (jsonData.content) {
                    const htmlPath = `${basePath}/${jsonData.content}`;
                    const htmlResponse = await fetch(htmlPath);
                    if (htmlResponse.ok) {
                        htmlText = await htmlResponse.text();

                        // Replace image paths with correct paths
                        imageNames.forEach((imageName) => {
                            const imagePath = `${basePath}/${imageName}`;
                            htmlText = htmlText.replace(
                                new RegExp(`src="${imageName}"`, "g"),
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
                    `Error Loading Project: ${err.message}. Please check that the project files exist at: ${projectsFolder}${projectFolderName}/`
                );
                setLoading(false);
            }
        };

        if (projectFolderName) {
            loadProjectData();
        }
    }, [projectFolderName, projectsFolder, imageNames]);

    // Parse HTML content into sections based on headings
    const parseHtmlIntoSections = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const body = doc.body;

        const sections = [];
        let currentSection = null;
        let currentSubsection = null;
        let introContent = [];

        // Apply custom classes to elements first
        doc.querySelectorAll("h1").forEach(
            (el) => (el.className = "heading-xl")
        );
        doc.querySelectorAll("h2").forEach(
            (el) => (el.className = "heading-lg")
        );
        doc.querySelectorAll("h3").forEach(
            (el) => (el.className = "heading-md")
        );
        doc.querySelectorAll("h4").forEach(
            (el) => (el.className = "heading-md")
        );
        doc.querySelectorAll("p").forEach((el) => (el.className = "paragraph"));
        doc.querySelectorAll("a").forEach((el) => (el.className = "text-link"));
        doc.querySelectorAll("img").forEach((el) => {
            el.className = "project-image";
        });
        doc.querySelectorAll("strong").forEach(
            (el) => (el.className = "text-emphasis")
        );
        doc.querySelectorAll("em").forEach(
            (el) => (el.style.fontStyle = "italic")
        );

        // Parse through all child nodes
        Array.from(body.childNodes).forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toLowerCase();

                if (tagName === "h2") {
                    // Save previous section if exists
                    if (currentSection) {
                        if (currentSubsection) {
                            currentSection.subsections.push(currentSubsection);
                            currentSubsection = null;
                        }
                        sections.push(currentSection);
                    }

                    // Start new section
                    currentSection = {
                        title: node.textContent,
                        content: [],
                        subsections: [],
                    };
                } else {
                    // Add content to appropriate location
                    const htmlContent = node.outerHTML;

                    if (currentSubsection) {
                        currentSubsection.content.push(htmlContent);
                    } else if (currentSection) {
                        currentSection.content.push(htmlContent);
                    } else {
                        // Content before first heading
                        introContent.push(htmlContent);
                    }
                }
            }
        });

        // Save last section and subsection
        if (currentSubsection && currentSection) {
            currentSection.subsections.push(currentSubsection);
        }
        if (currentSection) {
            sections.push(currentSection);
        }

        return { introContent, sections };
    };

    // Extract collaborator names from LinkedIn URLs
    const getCollaboratorName = (url) => {
        try {
            const match = url.match(/\/in\/([^/]+)\/?$/);
            if (match) {
                // Convert URL-encoded name to readable format and split by "-"
                const rawParts = match[1]
                    .replace(/%C3%A9/g, "é")
                    .replace(/%C3%AD/g, "í")
                    .split("-");

                // Remove any part containing digits
                const filteredParts = rawParts.filter(
                    (part) => !/\d/.test(part)
                );

                // Capitalize each part and join with space
                const name = filteredParts
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                return name;
            }
        } catch (e) {
            console.error("Error parsing collaborator name:", e);
        }
        return "Collaborator";
    };

    // Extract repository name from GitHub URL
    const getRepositoryName = (url) => {
        try {
            const match = url.match(/github\.com\/[^/]+\/([^/]+)/);
            if (match) {
                return match[1].replace(/-/g, " ");
            }
        } catch (e) {
            console.error("Error parsing repository name:", e);
        }
        return "Repository";
    };

    // Format keywords into display-friendly structure
    const formatKeyWords = (keyWords) => {
        if (!keyWords) return {};

        const formatted = {};
        Object.entries(keyWords).forEach(([key, values]) => {
            const displayKey = key
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            formatted[displayKey] = Array.isArray(values) ? values : [values];
        });

        return formatted;
    };

    // Handle PDF opening
    const handleOpenPDF = (type, path) => {
        // Construct full path to PDF in public folder
        const fullPath = `${projectsFolder}${projectFolderName}/${path}`;
        setActivePDF({ type, path: fullPath });
    };

    const handleClosePDF = () => {
        setActivePDF(null);
    };

    const colors = {
        background: "#f0f6fc",
        text: "#010409",
        border: "#d1d9e0",
        hover: "#e6edf3",
    };

    if (loading) {
        return (
            <div className="project-page-loading">
                <div className="loading-spinner"></div>
                <p>Loading project...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="project-page-error">
                <h2>Error Loading Project</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (!projectData) {
        return (
            <div className="project-page-error">
                <h2>No Project Data</h2>
                <p>Project data could not be loaded.</p>
            </div>
        );
    }

    const { introContent, sections } = htmlContent
        ? parseHtmlIntoSections(htmlContent)
        : { introContent: [], sections: [] };

    return (
        <div className="project-page-container">
            <div className="project-page-layout">
                {/* Main Content - 70% */}
                <main className="project-main-content">
                    {/* Project Header */}
                    <header className="project-header">
                        <h1 className="heading-xl project-title">
                            {projectData.projectName}
                        </h1>
                        {projectData.quickSummary && (
                            <p className="paragraph project-summary">
                                {projectData.quickSummary}
                            </p>
                        )}
                    </header>

                    {/* Introduction Content */}
                    {introContent.length > 0 && (
                        <div
                            className="project-intro"
                            dangerouslySetInnerHTML={{
                                __html: introContent.join(""),
                            }}
                        />
                    )}

                    {/* Collapsible Sections */}
                    <div className="project-sections">
                        {sections.map((section, index) => (
                            <CollapsibleSection
                                key={`section-${index}`}
                                title={section.title}
                                isInitiallyExpanded={index === 0}
                            >
                                {section.content.length > 0 && (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: section.content.join(""),
                                        }}
                                    />
                                )}
                            </CollapsibleSection>
                        ))}
                    </div>
                </main>

                {/* Sidebar - 30% */}
                <aside className="project-sidebar">
                    <div className="project-sidebar-content">
                        {/* Collaborators */}
                        {projectData.collaborators &&
                            projectData.collaborators.length > 0 && (
                                <div className="project-sidebar-section">
                                    <h3 className="heading-md sidebar-section-title">
                                        Collaborators
                                    </h3>
                                    <div className="sidebar-items">
                                        {projectData.collaborators.map(
                                            (url, index) => (
                                                <TextCapsule
                                                    key={`collab-${index}`}
                                                    name={getCollaboratorName(
                                                        url
                                                    )}
                                                    link={url}
                                                    icon={
                                                        <Linkedin size={16} />
                                                    }
                                                    fontSize={16}
                                                    onClick={(link) =>
                                                        window.open(
                                                            link,
                                                            "_blank",
                                                            "noopener,noreferrer"
                                                        )
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Repository */}
                        {projectData.repository && (
                            <div className="project-sidebar-section">
                                <h3 className="heading-md sidebar-section-title">
                                    Repository
                                </h3>
                                <div className="sidebar-items">
                                    <TextCapsule
                                        name={getRepositoryName(
                                            projectData.repository
                                        )}
                                        link={projectData.repository}
                                        icon={<Github size={16} />}
                                        fontSize={16}
                                        onClick={(link) =>
                                            window.open(
                                                link,
                                                "_blank",
                                                "noopener,noreferrer"
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        {/* Class Notes */}
                        {projectData.classNotes && (
                            <div className="project-sidebar-section">
                                <h3 className="heading-md sidebar-section-title">
                                    Class Notes
                                </h3>
                                <div className="sidebar-items">
                                    <TextCapsule
                                        name="View Notes"
                                        link={projectData.classNotes}
                                        icon={<SiNotion className="w-6 h-6" />}
                                        fontSize={16}
                                        onClick={(link) =>
                                            window.open(
                                                link,
                                                "_blank",
                                                "noopener,noreferrer"
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        {/* Report PDF */}
                        {projectData.report && (
                            <div className="project-sidebar-section">
                                <h3 className="heading-md sidebar-section-title">
                                    Report
                                </h3>
                                <div className="sidebar-items">
                                    <TextCapsule
                                        name="View Report"
                                        link={projectData.report}
                                        icon={<FileText size={16} />}
                                        fontSize={16}
                                        onClick={() =>
                                            handleOpenPDF(
                                                "Report",
                                                projectData.report
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        {/* Slides PDF */}
                        {projectData.slides && (
                            <div className="project-sidebar-section">
                                <h3 className="heading-md sidebar-section-title">
                                    Slides
                                </h3>
                                <div className="sidebar-items">
                                    <TextCapsule
                                        name="View Slides"
                                        link={projectData.slides}
                                        icon={<FileText size={16} />}
                                        fontSize={16}
                                        onClick={() =>
                                            handleOpenPDF(
                                                "Slides",
                                                projectData.slides
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        {/* Keywords */}
                        {projectData.keyWords && (
                            <div className="project-sidebar-section keywords-section">
                                <h3 className="heading-md sidebar-section-title">
                                    Keywords
                                </h3>
                                <div className="keywords-wrapper">
                                    {Object.entries(
                                        formatKeyWords(projectData.keyWords)
                                    ).map(([category, items], index) => (
                                        <SkillSection
                                            key={`keyword-${index}`}
                                            sectionName={category}
                                            skills={items}
                                            colors={colors}
                                            onSkillClick={() => {}}
                                            onSkillHover={() => {}}
                                            onSkillLeave={() => {}}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
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

export default ProjectPage;
