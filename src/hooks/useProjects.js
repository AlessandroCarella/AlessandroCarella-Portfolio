import { useState, useEffect } from "react";

/**
 * Custom hook to load all projects from the public/projects directory
 * @returns {object} Object containing projects, loading state, and error
 */
export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                setLoading(true);

                // Load the projects configuration
                const configResponse = await fetch(
                    "/projects/projects-config.json"
                );
                if (!configResponse.ok) {
                    throw new Error("Failed to load projects configuration");
                }
                const config = await configResponse.json();

                // Load each project's JSON file
                const projectsData = await Promise.all(
                    config.projects.map(async (projectConfig) => {
                        try {
                            const jsonPath = `/projects/${projectConfig.folder}/${projectConfig.jsonFile}`;
                            const response = await fetch(jsonPath);

                            if (!response.ok) {
                                console.warn(
                                    `Failed to load project: ${projectConfig.folder}`
                                );
                                return null;
                            }

                            const projectData = await response.json();

                            // Construct the project object with ALL config data embedded
                            return {
                                ...projectData,
                                // From config
                                slug: projectConfig.slug,
                                folderName: projectConfig.folder,
                                folderPath: `/projects/${projectConfig.folder}`,
                                categories: projectConfig.categories || [],
                                images: projectConfig.images || [],
                                pdfFiles: projectConfig.pdfFiles || {},
                                htmlFile: projectConfig.htmlFile,
                                // Standard fields
                                backgroundImage: "/defaultPicProjectsCard.png",
                                id: projectConfig.slug,
                            };
                        } catch (error) {
                            console.error(
                                `Error loading project ${projectConfig.folder}:`,
                                error
                            );
                            return null;
                        }
                    })
                );

                // Filter out null values (failed loads)
                const validProjects = projectsData.filter(
                    (project) => project !== null
                );

                setProjects(validProjects);
                setError(null);
            } catch (err) {
                console.error("Error loading projects:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, []);

    return { projects, loading, error };
};
