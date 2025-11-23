import { useEffect } from "react";

/**
 * Custom hook to initialize and manage image carousels in HTML content
 * @param {React.RefObject} contentRef - Reference to the container element with carousel elements
 * @param {string} htmlContent - HTML content that may contain carousel elements
 */
const useCarousel = (contentRef, htmlContent) => {
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

                // Clone the image
                const clonedImg = img.cloneNode(true);
                slide.appendChild(clonedImg);

                // Add caption if image has alt text
                const altText = img.getAttribute("alt");
                if (altText && altText.trim()) {
                    const caption = document.createElement("div");
                    caption.className = "carousel-caption";
                    caption.textContent = altText;
                    slide.appendChild(caption);
                }

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
            prevBtn.type = "button";
            prevBtn.setAttribute("aria-label", "Previous image");

            const prevIcon = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );
            prevIcon.setAttribute("width", "24");
            prevIcon.setAttribute("height", "24");
            prevIcon.setAttribute("viewBox", "0 0 24 24");
            prevIcon.setAttribute("fill", "none");
            prevIcon.setAttribute("stroke", "currentColor");
            prevIcon.setAttribute("stroke-width", "2");
            prevIcon.style.pointerEvents = "none";
            const prevPolyline = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "polyline"
            );
            prevPolyline.setAttribute("points", "15 18 9 12 15 6");
            prevIcon.appendChild(prevPolyline);
            prevBtn.appendChild(prevIcon);

            const nextBtn = document.createElement("button");
            nextBtn.className = "carousel-btn carousel-btn-next";
            nextBtn.type = "button";
            nextBtn.setAttribute("aria-label", "Next image");

            const nextIcon = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );
            nextIcon.setAttribute("width", "24");
            nextIcon.setAttribute("height", "24");
            nextIcon.setAttribute("viewBox", "0 0 24 24");
            nextIcon.setAttribute("fill", "none");
            nextIcon.setAttribute("stroke", "currentColor");
            nextIcon.setAttribute("stroke-width", "2");
            nextIcon.style.pointerEvents = "none";
            const nextPolyline = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "polyline"
            );
            nextPolyline.setAttribute("points", "9 18 15 12 9 6");
            nextIcon.appendChild(nextPolyline);
            nextBtn.appendChild(nextIcon);

            controls.appendChild(prevBtn);
            controls.appendChild(nextBtn);
            carousel.appendChild(controls);

            // Add indicators
            const indicators = document.createElement("div");
            indicators.className = "carousel-indicators";

            const slides = carouselTrack.querySelectorAll(".carousel-slide");
            const indicatorButtons = [];

            slides.forEach((slide, index) => {
                const indicator = document.createElement("button");
                indicator.className = "carousel-indicator";
                indicator.type = "button";
                indicator.setAttribute(
                    "aria-label",
                    `Go to image ${index + 1}`
                );
                if (index === 0) indicator.classList.add("active");
                indicators.appendChild(indicator);
                indicatorButtons.push(indicator);
            });

            carousel.appendChild(indicators);

            // Carousel state
            let currentIndex = 0;

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

                // Smooth scroll to the active slide - use percentage for consistency
                const transformValue = `translateX(-${currentIndex * 100}%)`;
                carouselTrack.style.transform = transformValue;
            };

            // Navigation handlers - simplified
            const goToNext = () => {
                const newIndex = (currentIndex + 1) % slides.length;
                updateCarousel(newIndex);
            };

            const goToPrev = () => {
                const newIndex =
                    (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel(newIndex);
            };

            // Attach event listeners - use addEventListener for reliable click handling
            prevBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                goToPrev();
            });
            nextBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                goToNext();
            });

            prevBtn.addEventListener("mousedown", (e) => {
                e.preventDefault();
                e.stopPropagation();
            });

            nextBtn.addEventListener("mousedown", (e) => {
                e.preventDefault();
                e.stopPropagation();
            });

            prevBtn.addEventListener("touchstart", (e) => {
                e.stopPropagation();
            });

            prevBtn.addEventListener("touchend", (e) => {
                e.preventDefault();
                e.stopPropagation();
                goToPrev();
            });

            nextBtn.addEventListener("touchstart", (e) => {
                e.stopPropagation();
            });

            nextBtn.addEventListener("touchend", (e) => {
                e.preventDefault();
                e.stopPropagation();
                goToNext();
            });

            // Indicator click handlers
            indicatorButtons.forEach((indicator, index) => {
                indicator.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateCarousel(index);
                });
                indicator.addEventListener("mousedown", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
                indicator.addEventListener("touchstart", (e) => {
                    e.stopPropagation();
                });
                indicator.addEventListener("touchend", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
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

            // Store carousel ID for cleanup
            carousel.dataset.carouselId = `carousel-${carouselIndex}`;
        });

        // Cleanup function
        return () => {
            const carousels = contentRef.current?.querySelectorAll(".carousel");
            carousels?.forEach((carousel) => {
                // Remove initialized class so carousel can be re-initialized
                carousel.classList.remove("carousel-initialized");
                const prevBtn = carousel.querySelector(".carousel-btn-prev");
                const nextBtn = carousel.querySelector(".carousel-btn-next");
                if (prevBtn) prevBtn.replaceWith(prevBtn.cloneNode(true));
                if (nextBtn) nextBtn.replaceWith(nextBtn.cloneNode(true));
            });
        };
    }, [contentRef, htmlContent]);
};

export default useCarousel;
