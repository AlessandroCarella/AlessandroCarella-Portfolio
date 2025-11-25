import React from "react";
import TextCapsule from "../text/TextCapsule";
import SkillSection from "../SkillSection";
import { Github, Linkedin, FileText, Globe } from "lucide-react";
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
        if (!match) return "View Profile";

        let username = match[1];

        // Decode URL-encoded characters (e.g., %C3%A9 → é)
        try {
            username = decodeURIComponent(username);
        } catch (e) {
            // If decoding fails, continue with original string
        }

        // Split by hyphens
        const parts = username.split("-");

        // Remove trailing LinkedIn ID (usually alphanumeric like "2ba11a214")
        // LinkedIn IDs typically contain numbers and are at the end
        while (parts.length > 1) {
            const lastPart = parts[parts.length - 1];
            // Check if the last part looks like an ID (contains numbers)
            if (/\d/.test(lastPart)) {
                parts.pop();
            } else {
                break;
            }
        }

        // Capitalize each word and join with spaces
        const name = parts
            .map(
                (part) =>
                    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            )
            .join(" ");

        return name || "View Profile";
    };

    // Helper function to check if a string is a URL
    const isUrl = (str) => {
        return str.startsWith("http://") || str.startsWith("https://");
    };

    // Helper function to get collaborator display info
    const getCollaboratorInfo = (collaborator) => {
        if (isUrl(collaborator)) {
            return {
                name: getCollaboratorName(collaborator),
                link: collaborator,
            };
        }
        // It's just a name, no link
        return {
            name: collaborator,
            link: null,
        };
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
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    // Format keywords into categories
    const formatKeyWords = (keywords) => {
        if (typeof keywords === "string") {
            return { Keywords: keywords.split(",").map((k) => k.trim()) };
        }
        if (Array.isArray(keywords)) {
            return { Keywords: keywords };
        }
        if (typeof keywords === "object") {
            return keywords;
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
                                {projectData.collaborators.map(
                                    (collaborator, index) => {
                                        const { name, link } =
                                            getCollaboratorInfo(collaborator);
                                        return (
                                            <TextCapsule
                                                key={`collab-${index}`}
                                                name={name}
                                                link={link}
                                                icon={<Linkedin size={16} />}
                                                onClick={
                                                    link
                                                        ? (url) =>
                                                              window.open(
                                                                  url,
                                                                  "_blank",
                                                                  "noopener,noreferrer"
                                                              )
                                                        : undefined
                                                }
                                            />
                                        );
                                    }
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
                                name={getRepositoryName(projectData.repository)}
                                link={projectData.repository}
                                icon={<Github size={16} />}
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

                {/* Live version */}
                {projectData.liveVersion && (
                    <div className="project-sidebar-section">
                        <h3 className="heading-md sidebar-section-title">
                            Live Version
                        </h3>
                        <div className="sidebar-items">
                            <TextCapsule
                                name={"Live version"}
                                link={projectData.liveVersion}
                                icon={<Globe size={16} />}
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
                                onClick={() =>
                                    onOpenPDF("Report", projectData.report)
                                }
                            />
                        </div>
                    </div>
                )}

                {/* Thesis PDF */}
                {projectData.thesis && (
                    <div className="project-sidebar-section">
                        <h3 className="heading-md sidebar-section-title">
                            Thesis
                        </h3>
                        <div className="sidebar-items">
                            <TextCapsule
                                name="View Thesis"
                                link={projectData.thesis}
                                icon={<FileText size={16} />}
                                onClick={() =>
                                    onOpenPDF("Thesis", projectData.thesis)
                                }
                            />
                        </div>
                    </div>
                )}

                {/* Saverio thesis port PDF */}
                {projectData.saverioThesis && (
                    <div className="project-sidebar-section">
                        <h3 className="heading-md sidebar-section-title">
                            Saverio's Thesis
                        </h3>
                        <div className="sidebar-items">
                            <TextCapsule
                                name="View Saverio's Thesis"
                                link={projectData.saverioThesis}
                                icon={<Github size={16} />}
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
                                onClick={() =>
                                    onOpenPDF("Slides", projectData.slides)
                                }
                            />
                        </div>
                    </div>
                )}

                {/* Keywords */}
                {projectData.keywords && (
                    <div className="project-sidebar-section keywords-section">
                        <h3 className="heading-md sidebar-section-title">
                            Keywords
                        </h3>
                        <div className="keywords-wrapper">
                            {Object.entries(
                                formatKeyWords(projectData.keywords)
                            ).map(([category, items], index) => (
                                <SkillSection
                                    key={`keyword-${category}-${index}`}
                                    sectionName={formatCategoryName(category)}
                                    skills={items.map((str) =>
                                        str
                                            .split(" ")
                                            .map(
                                                (word) =>
                                                    word
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    word.slice(1)
                                            )
                                            .join(" ")
                                    )}
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
