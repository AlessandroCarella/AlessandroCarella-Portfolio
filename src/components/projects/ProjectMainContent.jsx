import React from "react";
import CollapsibleSection from "../CollapsibleSection";

/**
 * ProjectMainContent component - Displays the main content area with parsed HTML sections
 */
const ProjectMainContent = ({ htmlContent, projectData }) => {
    // Parse HTML content into sections based on headings
    const parseHtmlIntoSections = (html) => {
        if (!html) return { introContent: [], sections: [] };

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const body = doc.body;

        const sections = [];
        let currentSection = null;
        let introContent = [];

        // Apply custom classes to elements
        doc.querySelectorAll("h1").forEach(
            (el) => (el.className = "heading-xl")
        );
        doc.querySelectorAll("h2").forEach(
            (el) => (el.className = "heading-lg")
        );
        doc.querySelectorAll("h3").forEach(
            (el) => (el.className = "heading-md")
        );
        doc.querySelectorAll("h4").forEach(
            (el) => (el.className = "heading-md")
        );
        doc.querySelectorAll("p").forEach((el) => (el.className = "paragraph"));
        doc.querySelectorAll("a").forEach((el) => (el.className = "text-link"));
        doc.querySelectorAll("img").forEach((el) => {
            el.className = "project-image";
        });
        doc.querySelectorAll("strong").forEach(
            (el) => (el.className = "text-emphasis")
        );
        doc.querySelectorAll("em").forEach(
            (el) => (el.style.fontStyle = "italic")
        );

        // Parse through all child nodes
        Array.from(body.childNodes).forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toLowerCase();

                if (tagName === "h2") {
                    // Save previous section if exists
                    if (currentSection) {
                        sections.push(currentSection);
                    }

                    // Start new section
                    currentSection = {
                        title: node.textContent,
                        content: [],
                        subsections: [],
                    };
                } else {
                    // Add content to appropriate location
                    const htmlContent = node.outerHTML;

                    if (currentSection) {
                        currentSection.content.push(htmlContent);
                    } else {
                        // Content before first heading
                        introContent.push(htmlContent);
                    }
                }
            }
        });

        // Save last section
        if (currentSection) {
            sections.push(currentSection);
        }

        return { introContent, sections };
    };

    const { introContent, sections } = parseHtmlIntoSections(htmlContent);

    return (
        <main className="project-main-content">
            <div className="project-content-wrapper">
                {/* Quick Summary */}
                {projectData.quickSummary && (
                    <div className="project-intro">
                        <p className="paragraph">{projectData.quickSummary}</p>
                    </div>
                )}

                {/* Intro Content */}
                {introContent.length > 0 && (
                    <div
                        className="intro-content"
                        dangerouslySetInnerHTML={{
                            __html: introContent.join(""),
                        }}
                    />
                )}

                {/* Sections */}
                {sections.map((section, index) => (
                    <CollapsibleSection
                        key={`section-${index}`}
                        title={section.title}
                        defaultOpen={index === 0}
                    >
                        <div
                            dangerouslySetInnerHTML={{
                                __html: section.content.join(""),
                            }}
                        />
                        {section.subsections?.map((subsection, subIndex) => (
                            <CollapsibleSection
                                key={`subsection-${index}-${subIndex}`}
                                title={subsection.title}
                                defaultOpen={false}
                            >
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: subsection.content.join(""),
                                    }}
                                />
                            </CollapsibleSection>
                        ))}
                    </CollapsibleSection>
                ))}
            </div>
        </main>
    );
};

export default ProjectMainContent;
