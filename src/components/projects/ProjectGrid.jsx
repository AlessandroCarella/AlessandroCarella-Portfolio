import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../ProjectCard";
import PDFOverlay from "../PDFOverlay";
import { getProjectLinks } from "../utils/projectUtils";

/**
 * ProjectGrid component - Displays grid of project cards
 */
const ProjectGrid = ({ projects }) => {
    const navigate = useNavigate();
    const [activePDF, setActivePDF] = useState(null);

    const handleCardClick = (project) => {
        navigate(`/projects/${project.slug}`);
    };

    const handleOpenPDF = (type, path) => {
        setActivePDF({ type, path });
    };

    const handleClosePDF = () => {
        setActivePDF(null);
    };

    return (
        <div className="projects-grid">
            {projects.map((project) => {
                // Get links using the new utility function with config data
                const links = getProjectLinks(
                    {
                        pdfFiles: project.pdfFiles,
                    },
                    project,
                    project.folderPath
                );

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
                            liveVersionLink={links.liveVersionLink}
                            classNotesLink={links.classNotesLink}
                            onOpenPDF={handleOpenPDF}
                        />
                    </div>
                );
            })}

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

export default ProjectGrid;
