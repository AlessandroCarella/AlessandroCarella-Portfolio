import React from "react";
import { useParams } from "react-router-dom";
import { useProjectDetail } from "../hooks/useProjectDetail.js";
import ProjectContent from "../components/projects/ProjectContent";
import LoadingState from "../components/projects/LoadingState";
import ErrorState from "../components/projects/ErrorState";
import "./styles/ProjectDetail.css";

/**
 * ProjectDetail Page - Displays individual project details
 */
const ProjectDetail = () => {
    const { projectSlug } = useParams();
    const { projectData, loading, error } = useProjectDetail(projectSlug);

    if (loading) {
        return <LoadingState message="Loading project..." />;
    }

    if (error || !projectData) {
        return (
            <ErrorState
                title="Project Not Found"
                message={error || "The requested project could not be found."}
                showBackButton={true}
            />
        );
    }

    return (
        <ProjectContent
            projectFolderName={projectData.projectFolderName}
            projectsFolder="/projects/"
            imageNames={projectData.imageNames}
            htmlFileName={projectData.htmlFile}
        />
    );
};

export default ProjectDetail;
