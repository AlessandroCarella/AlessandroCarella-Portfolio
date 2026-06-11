/**
 * Utility functions for project operations
 * All data now comes from projects-config.json - no fuzzy matching
 */

/**
 * Canonical, ordered list of project tags used by the filter UI.
 * Stored lowercase in each project JSON; title-cased only for display.
 * @type {string[]}
 */
export const PROJECT_TAGS = {
    "master":           "#FA4549",  // red.4
    "bachelor":         "#23EA57",  // green.4
    "data science":     "#FFD743",  // yellow.2
    "explainable AI":   "#F08A3A",  // orange.3
    "hackathon":        "#B870FF",  // purple.3
    "business":         "#FF7B56",  // coral.3
    "volunteering":     "#39DAD2",  // teal.3
    "web development":  "#3094FF",  // blue.4
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
 * Filters projects based on search term and tag
 * @param {Array} projects - Array of projects (with tags embedded)
 * @param {string} searchTerm - Search term
 * @param {string} tag - Selected tag, or "all"
 * @returns {Array} Filtered projects
 */
export const filterProjects = (projects, searchTerm, tag) => {
    let filtered = [...projects];

    // Filter by tag using the tags array from each project
    if (tag !== "all") {
        filtered = filtered.filter((project) => {
            return project.tags && project.tags.includes(tag);
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
            const matchesTags =
                project.tags &&
                project.tags.some((t) => t.toLowerCase().includes(term));
            return matchesName || matchesSummary || matchesTags;
        });
    }

    return filtered;
};
