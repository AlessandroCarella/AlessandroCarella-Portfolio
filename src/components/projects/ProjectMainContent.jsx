import React, { useRef } from "react";
import CollapsibleSection from "../CollapsibleSection";
import useCarousel from "../hooks/useCarousel.js";

/**
 * ProjectMainContent component - Displays the main content area with parsed HTML sections
 */
const ProjectMainContent = ({ htmlContent, projectData }) => {
    const contentRef = useRef(null);

    // Initialize carousels using the custom hook
    useCarousel(contentRef, htmlContent);

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

            // Wrap image in figure with figcaption if it has alt text
            const altText = el.getAttribute("alt");
            if (
                altText &&
                altText.trim() &&
                !el.parentElement.classList.contains("carousel-slide")
            ) {
                const figure = doc.createElement("figure");
                figure.className = "project-image-figure";

                const figcaption = doc.createElement("figcaption");
                figcaption.className = "project-image-caption";
                figcaption.textContent = altText;

                // Replace img with figure containing img and caption
                el.parentNode.replaceChild(figure, el);
                figure.appendChild(el);
                figure.appendChild(figcaption);
            }
        });
        doc.querySelectorAll("strong").forEach(
            (el) => (el.className = "text-emphasis")
        );
        doc.querySelectorAll("i").forEach(
            (el) => (el.className = "text-italic")
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
        <main className="project-main-content" ref={contentRef}>
            <div className="project-content-wrapper">
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
                        defaultOpen={
                            section.title.toLowerCase().includes("what") &&
                            section.title.toLowerCase().includes("learned")
                        }
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
