import React, { useState, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../ProjectCard";
import { getProjectLinks } from "../utils/projectUtils";

// Lazy-load the PDF viewer (react-pdf + pdfjs worker, ~1 MB) only on first open.
const PDFOverlay = lazy(() => import("../PDFOverlay"));

/**
 * ProjectGrid component - Displays grid of project cards
 */
const ProjectGrid = ({ projects }) => {
    const [activePDF, setActivePDF] = useState(null);

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
                        className="project-card-wrapper"
                    >
                        {/* Stretched overlay link makes the whole card a crawlable
                            <a href>, while action buttons stay clickable (raised
                            above it in CSS). Kept as a sibling of ProjectCard so the
                            inner GitHub/Live <a> are never nested inside this anchor. */}
                        <Link
                            to={`/projects/${project.slug}`}
                            className="project-card-link"
                            aria-label={`View project: ${project.projectName}`}
                        />
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
                <Suspense fallback={null}>
                    <PDFOverlay
                        pdfPath={activePDF.path}
                        title={activePDF.type}
                        onClose={handleClosePDF}
                    />
                </Suspense>
            )}
        </div>
    );
};

export default ProjectGrid;
