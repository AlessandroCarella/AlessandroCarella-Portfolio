import React from "react";
import TextCapsule from "../text/TextCapsule";
import SkillSection from "../SkillSection";
import { Github, Linkedin, FileText } from "lucide-react";
import { SiNotion } from "react-icons/si";

/**
 * ProjectSidebar component - Displays project metadata, links, and keywords
 */
const ProjectSidebar = ({ projectData, onOpenPDF }) => {
    const colors = {
        skill: "#667eea",
        hoverColor: "#764ba2",
    };

    // Helper function to extract collaborator name from URL
    const getCollaboratorName = (url) => {
        const match = url.match(/linkedin\.com\/in\/([^/]+)/);
        return match
            ? match[1]
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())
            : "View Profile";
    };

    // Helper function to extract repository name from URL
    const getRepositoryName = (url) => {
        const match = url.match(/github\.com\/[^/]+\/([^/]+)/);
        return match ? match[1].replace(/-/g, " ") : "View Repository";
    };

    // Helper function to format category names
    const formatCategoryName = (category) => {
        return category
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    // Format keywords into categories
    const formatKeyWords = (keyWords) => {
        if (typeof keyWords === "string") {
            return { Keywords: keyWords.split(",").map((k) => k.trim()) };
        }
        if (Array.isArray(keyWords)) {
            return { Keywords: keyWords };
        }
        if (typeof keyWords === "object") {
            return keyWords;
        }
        return {};
    };

    return (
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
                                {projectData.collaborators.map((url, index) => (
                                    <TextCapsule
                                        key={`collab-${index}`}
                                        name={getCollaboratorName(url)}
                                        link={url}
                                        icon={<Linkedin size={16} />}
                                        fontSize={16}
                                        onClick={(link) =>
                                            window.open(
                                                link,
                                                "_blank",
                                                "noopener,noreferrer"
                                            )
                                        }
                                    />
                                ))}
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
                                name={getRepositoryName(projectData.repository)}
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
                                    onOpenPDF("Report", projectData.report)
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
                                    onOpenPDF("Slides", projectData.slides)
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
                                    key={`keyword-${category}-${index}`}
                                    sectionName={formatCategoryName(category)}
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
    );
};

export default ProjectSidebar;