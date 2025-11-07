import { useState, useEffect } from "react";

/**
 * Custom hook to load a single project's details
 * @param {string} projectSlug - The URL slug of the project
 * @returns {object} Object containing project data, loading state, and error
 */
export const useProjectDetail = (projectSlug) => {
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProjectData = async () => {
            if (!projectSlug) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Load the projects configuration to find the project
                const configResponse = await fetch(
                    "/projects/projects-config.json"
                );
                if (!configResponse.ok) {
                    throw new Error("Failed to load projects configuration");
                }

                const config = await configResponse.json();
                const projectConfig = config.projects.find(
                    (p) => p.slug === projectSlug
                );

                if (!projectConfig) {
                    throw new Error("Project not found");
                }

                // Fetch the project's JSON file
                const jsonPath = `/projects/${projectConfig.folder}/${projectConfig.jsonFile}`;
                const response = await fetch(jsonPath);

                if (!response.ok) {
                    throw new Error(
                        `Failed to load project: ${response.status}`
                    );
                }

                const foundProject = await response.json();

                // Use image names from config (not extracting from project data)
                const imageNames = projectConfig.images || [];

                setProjectData({
                    projectFolderName: projectConfig.folder,
                    imageNames,
                    projectInfo: foundProject,
                    slug: projectSlug,
                    htmlFile: projectConfig.htmlFile,
                    pdfFiles: projectConfig.pdfFiles || {},
                    categories: projectConfig.categories || [],
                });
            } catch (err) {
                console.error("Error loading project:", err);
                setError(err.message || "Failed to load project");
            } finally {
                setLoading(false);
            }
        };

        loadProjectData();
    }, [projectSlug]);

    return { projectData, loading, error };
};
