import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectPage from "./ProjectPage";
import "./styles/ProjectPageWrapper.css";

/**
 * ProjectPageWrapper - Dynamic wrapper for ProjectPage component
 *
 * This component:
 * 1. Reads the project slug from the URL (e.g., /projects/data-mining-1)
 * 2. Fetches the project JSON file from public folder
 * 3. Extracts image filenames from the project data
 * 4. Passes the correct props to ProjectPage component
 *
 * IMPORTANT: Project folders must be in /public/projects/ directory
 * Structure: /public/projects/Data Mining 1/Data_Mining_1.json
 */

// Map of URL slugs to project folder names and JSON file names
// This needs to be manually maintained or generated during build
const PROJECT_MAP = {
    "data-mining-1": {
        folder: "Data Mining 1",
        jsonFile: "data_Mining_1.json",
    },
    "data-mining-2": {
        folder: "Data Mining 2",
        jsonFile: "Data_Mining_2.json",
    },
    "decision-support-system": {
        folder: "Decision Support System",
        jsonFile: "Decision Support System.json",
    },
    "bachelor-thesis": {
        folder: "Bachelor Thesis",
        jsonFile: "Bachelor_Thesis.json",
    },
    "business-process-mining": {
        folder: "Business Process Mining",
        jsonFile: "Business_Process_Mining.json",
    },
    "fundamentals-of-business-management": {
        folder: "Fundamentals of Business Management",
        jsonFile: "Fundamentals_of_Business_Management.json",
    },
    "hackathon-xai": {
        folder: "Hackathon XAI",
        jsonFile: "Hackathon_XAI.json",
    },
    "healthy-catering": {
        folder: "Healthy Catering",
        jsonFile: "Healthy_Catering.json",
    },
    "information-retrieval": {
        folder: "Information Retrieval",
        jsonFile: "Information_Retrieval.json",
    },
    "master-thesis": {
        folder: "Master Thesis",
        jsonFile: "Master_Thesis.json",
    },
    "optimization-for-data-science": {
        folder: "Optimization for Data Science",
        jsonFile: "Optimization_for_Data_Science.json",
    },
    "project-design-and-management": {
        folder: "Project Design and Management",
        jsonFile: "Project_Design_and_Management.json",
    },
    scomodo: {
        folder: "Scomodo",
        jsonFile: "Scomodo.json",
    },
    "statistics-for-data-science": {
        folder: "Statistics for Data Science",
        jsonFile: "Statistics_for_Data_Science.json",
    },
    "strategic-and-competitive-intelligence": {
        folder: "Strategic and Competitive Intelligence",
        jsonFile: "Strategic_and_Competitive_Intelligence.json",
    },
    "technologies-for-web-marketing": {
        folder: "Technologies for Web Marketing",
        jsonFile: "Technologies_for_Web_Marketing.json",
    },
    "visual-analytics": {
        folder: "Visual Analytics",
        jsonFile: "Visual_Analytics.json",
    },
};

const ProjectPageWrapper = () => {
    const { projectSlug } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projectData, setProjectData] = useState(null);

    useEffect(() => {
        loadProjectData();
    }, [projectSlug]);

    const loadProjectData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Check if project exists in our map
            const projectInfo = PROJECT_MAP[projectSlug];

            if (!projectInfo) {
                setError("Project not found");
                setLoading(false);
                return;
            }

            // Fetch the JSON file from public folder
            const jsonPath = `/projects/${projectInfo.folder}/${projectInfo.jsonFile}`;

            const response = await fetch(jsonPath);

            if (!response.ok) {
                throw new Error(`Failed to load project: ${response.status}`);
            }

            const foundProject = await response.json();

            // Extract image names from the project data
            const imageNames = extractImageNames(foundProject);

            setProjectData({
                projectFolderName: projectInfo.folder,
                imageNames,
                projectInfo: foundProject,
            });

            setLoading(false);
        } catch (error) {
            console.error("Error loading project:", error);
            setError("Failed to load project");
            setLoading(false);
        }
    };

    /**
     * Extract image filenames from project data
     * Looks for common image fields and file extensions
     */
    const extractImageNames = (projectData) => {
        const imageNames = [];
        const imageExtensions = [
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".webp",
            ".svg",
        ];

        // Recursively search through the project data for image references
        const findImages = (obj) => {
            if (typeof obj === "string") {
                // Check if string ends with image extension
                const lowerStr = obj.toLowerCase();
                if (imageExtensions.some((ext) => lowerStr.endsWith(ext))) {
                    // Extract just the filename if it's a path
                    const filename = obj.split("/").pop();
                    if (!imageNames.includes(filename)) {
                        imageNames.push(filename);
                    }
                }
            } else if (Array.isArray(obj)) {
                obj.forEach((item) => findImages(item));
            } else if (obj && typeof obj === "object") {
                Object.values(obj).forEach((value) => findImages(value));
            }
        };

        findImages(projectData);

        // Also check for common image field names
        const commonImageFields = [
            "images",
            "screenshots",
            "diagrams",
            "charts",
            "figures",
        ];
        commonImageFields.forEach((field) => {
            if (projectData[field]) {
                if (Array.isArray(projectData[field])) {
                    projectData[field].forEach((img) => {
                        if (
                            typeof img === "string" &&
                            !imageNames.includes(img)
                        ) {
                            imageNames.push(img);
                        }
                    });
                }
            }
        });

        return imageNames;
    };

    if (loading) {
        return (
            <div className="loading-message">
                <div className="loading-spinner"></div>
                <p>Loading project...</p>
            </div>
        );
    }

    if (error || !projectData) {
        return (
            <div className="error-message">
                <h2>Project Not Found</h2>
                <p>{error || "The requested project could not be found."}</p>
                <button
                    onClick={() => navigate("/projects")}
                    className="back-button"
                >
                    ← Back to Projects
                </button>
            </div>
        );
    }

    return (
        <ProjectPage
            projectFolderName={projectData.projectFolderName}
            projectsFolder="/projects/"
            imageNames={projectData.imageNames}
        />
    );
};

export default ProjectPageWrapper;
