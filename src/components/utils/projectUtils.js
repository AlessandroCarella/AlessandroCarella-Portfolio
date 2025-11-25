/**
 * Utility functions for project operations
 * All data now comes from projects-config.json - no fuzzy matching
 */

/**
 * Gets the primary category for a project based on its categories array
 * @param {string[]} categories - Array of category keywords
 * @returns {string} Primary category name
 */
export const getPrimaryCategory = (categories) => {
    if (!categories || categories.length === 0) return "default";
    // Return the first category as primary
    return categories[0];
};

/**
 * Gets the project links (PDF, GitHub, Presentation) from config
 * @param {object} projectConfig - The project config object
 * @param {object} projectData - The project JSON data
 * @param {string} folderPath - The folder path
 * @returns {object} Object with pdfLink, githubLink, and presentationLink
 */
export const getProjectLinks = (projectConfig, projectData, folderPath) => {
    const links = {
        pdfLink: null,
        githubLink: null,
        presentationLink: null,
        liveVersionLink:null,
        classNotesLink:null
    };

    // Get report PDF from config
    if (projectConfig.pdfFiles && projectConfig.pdfFiles.report) {
        links.pdfLink = `${folderPath}/${projectConfig.pdfFiles.report}`;
    }

    // Get presentation PDF from config
    if (projectConfig.pdfFiles && projectConfig.pdfFiles.presentation) {
        links.presentationLink = `${folderPath}/${projectConfig.pdfFiles.presentation}`;
    }

    // Get GitHub link from project JSON data
    if (projectData && projectData.repository) {
        links.githubLink = projectData.repository;
    }

    // Get Live version link from project JSON data
    if (projectData && projectData.liveVersion) {
        links.liveVersionLink = projectData.liveVersion;
    }
    
    // Get Class notes link from project JSON data
    if (projectData && projectData.classNotes) {
        links.classNotesLink = projectData.classNotes;
    }

    return links;
};

/**
 * Filters projects based on search term and category
 * @param {Array} projects - Array of projects (with config embedded)
 * @param {string} searchTerm - Search term
 * @param {string} category - Selected category
 * @returns {Array} Filtered projects
 */
export const filterProjects = (projects, searchTerm, category) => {
    let filtered = [...projects];

    // Filter by category using the categories array from config
    if (category !== "all") {
        filtered = filtered.filter((project) => {
            return project.categories && project.categories.includes(category);
        });
    }

    // Filter by search term
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter((project) => {
            const matchesName = project.projectName
                ?.toLowerCase()
                .includes(term);
            const matchesSummary = project.quickSummary
                ?.toLowerCase()
                .includes(term);
            const matchesCategories =
                project.categories &&
                project.categories.some((cat) =>
                    cat.toLowerCase().includes(term)
                );
            return matchesName || matchesSummary || matchesCategories;
        });
    }

    return filtered;
};

/**
 * Gets all unique categories from all projects
 * @param {Array} projects - Array of projects
 * @returns {string[]} Array of unique category names, sorted
 */
export const getAllCategories = (projects) => {
    const categoriesSet = new Set();

    projects.forEach((project) => {
        if (project.categories && Array.isArray(project.categories)) {
            project.categories.forEach((cat) => categoriesSet.add(cat));
        }
    });

    return Array.from(categoriesSet).sort();
};
