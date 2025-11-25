import React from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../ProjectCard";
import { getPrimaryCategory, getProjectLinks } from "../utils/projectUtils";

/**
 * ProjectGrid component - Displays grid of project cards
 */
const ProjectGrid = ({ projects }) => {
    const navigate = useNavigate();

    const handleCardClick = (project) => {
        navigate(`/projects/${project.slug}`);
    };

    return (
        <div className="projects-grid">
            {projects.map((project) => {
                // Get primary category from project's categories array
                const primaryCategory = getPrimaryCategory(project.categories);

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
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default ProjectGrid;
