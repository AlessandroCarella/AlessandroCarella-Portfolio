import React, { useEffect, useRef } from "react";
import CollapsibleSection from "../CollapsibleSection";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/carousel.css"

/**
 * ProjectMainContent component - Displays the main content area with parsed HTML sections
 */
const ProjectMainContent = ({ htmlContent, projectData }) => {
    const contentRef = useRef(null);

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

    // Initialize carousels after content is rendered
    useEffect(() => {
        if (!contentRef.current) return;

        const carousels = contentRef.current.querySelectorAll(".carousel");

        carousels.forEach((carousel, carouselIndex) => {
            // Skip if already initialized
            if (carousel.classList.contains("carousel-initialized")) return;

            const images = carousel.querySelectorAll("img");
            if (images.length === 0) return;

            // Mark as initialized
            carousel.classList.add("carousel-initialized");

            // Wrap carousel content
            const carouselTrack = document.createElement("div");
            carouselTrack.className = "carousel-track";

            const carouselViewport = document.createElement("div");
            carouselViewport.className = "carousel-viewport";

            // Move images to track
            images.forEach((img, index) => {
                const slide = document.createElement("div");
                slide.className = "carousel-slide";
                if (index === 0) slide.classList.add("active");
                slide.appendChild(img.cloneNode(true));
                carouselTrack.appendChild(slide);
            });

            // Clear original content and add structured carousel
            carousel.innerHTML = "";
            carouselViewport.appendChild(carouselTrack);
            carousel.appendChild(carouselViewport);

            // Add navigation controls
            const controls = document.createElement("div");
            controls.className = "carousel-controls";

            const prevBtn = document.createElement("button");
            prevBtn.className = "carousel-btn carousel-btn-prev";
            prevBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
            prevBtn.setAttribute("aria-label", "Previous image");

            const nextBtn = document.createElement("button");
            nextBtn.className = "carousel-btn carousel-btn-next";
            nextBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
            nextBtn.setAttribute("aria-label", "Next image");

            controls.appendChild(prevBtn);
            controls.appendChild(nextBtn);
            carousel.appendChild(controls);

            // Add indicators
            if (images.length > 1) {
                const indicators = document.createElement("div");
                indicators.className = "carousel-indicators";

                for (let i = 0; i < images.length; i++) {
                    const indicator = document.createElement("button");
                    indicator.className = "carousel-indicator";
                    if (i === 0) indicator.classList.add("active");
                    indicator.setAttribute(
                        "aria-label",
                        `Go to image ${i + 1}`
                    );
                    indicators.appendChild(indicator);
                }

                carousel.appendChild(indicators);
            }

            // Carousel state
            let currentIndex = 0;
            const slides = carouselTrack.querySelectorAll(".carousel-slide");
            const indicatorButtons = carousel.querySelectorAll(
                ".carousel-indicator"
            );

            // Update carousel display
            const updateCarousel = (newIndex) => {
                // Remove active class from current slide and indicator
                slides[currentIndex].classList.remove("active");
                if (indicatorButtons[currentIndex]) {
                    indicatorButtons[currentIndex].classList.remove("active");
                }

                // Update index
                currentIndex = newIndex;

                // Add active class to new slide and indicator
                slides[currentIndex].classList.add("active");
                if (indicatorButtons[currentIndex]) {
                    indicatorButtons[currentIndex].classList.add("active");
                }

                // Smooth scroll to the active slide
                const slideWidth = slides[currentIndex].offsetWidth;
                carouselTrack.style.transform = `translateX(-${
                    currentIndex * slideWidth
                }px)`;
            };

            // Navigation handlers
            const goToNext = () => {
                const newIndex = (currentIndex + 1) % slides.length;
                updateCarousel(newIndex);
            };

            const goToPrev = () => {
                const newIndex =
                    (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel(newIndex);
            };

            // Attach event listeners
            nextBtn.addEventListener("click", goToNext);
            prevBtn.addEventListener("click", goToPrev);

            // Indicator click handlers
            indicatorButtons.forEach((indicator, index) => {
                indicator.addEventListener("click", () => {
                    updateCarousel(index);
                });
            });

            // Keyboard navigation
            carousel.addEventListener("keydown", (e) => {
                if (e.key === "ArrowLeft") {
                    goToPrev();
                } else if (e.key === "ArrowRight") {
                    goToNext();
                }
            });

            // Touch/swipe support
            let touchStartX = 0;
            let touchEndX = 0;

            carousel.addEventListener("touchstart", (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });

            carousel.addEventListener("touchend", (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });

            const handleSwipe = () => {
                const swipeThreshold = 50;
                if (touchStartX - touchEndX > swipeThreshold) {
                    goToNext();
                } else if (touchEndX - touchStartX > swipeThreshold) {
                    goToPrev();
                }
            };

            // Handle window resize
            let resizeTimeout;
            const handleResize = () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    const slideWidth = slides[currentIndex].offsetWidth;
                    carouselTrack.style.transform = `translateX(-${
                        currentIndex * slideWidth
                    }px)`;
                }, 100);
            };

            window.addEventListener("resize", handleResize);

            // Clean up on unmount
            carousel.dataset.carouselId = `carousel-${carouselIndex}`;
        });

        // Cleanup function
        return () => {
            const carousels = contentRef.current?.querySelectorAll(".carousel");
            carousels?.forEach((carousel) => {
                const prevBtn = carousel.querySelector(".carousel-btn-prev");
                const nextBtn = carousel.querySelector(".carousel-btn-next");
                if (prevBtn) prevBtn.replaceWith(prevBtn.cloneNode(true));
                if (nextBtn) nextBtn.replaceWith(nextBtn.cloneNode(true));
            });
        };
    }, [htmlContent]);

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
