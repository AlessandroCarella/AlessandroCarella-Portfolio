import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import TextPressure from "../components/text/TextPressure";
import ShinyText from "../components/text/ShinyText";
import Sidebar from "../components/Sidebar";
import GitHubCalendar from "react-github-calendar";
import Seo from "../components/Seo";

import "./styles/Home.css";

const Home = () => {
    const [content, setContent] = useState(null);

    useEffect(() => {
        fetch("/content/home.json")
            .then((response) => response.json())
            .then((data) => setContent(data))
            .catch((error) => console.error("Error loading content:", error));
    }, []);

    if (!content) {
        return <div>Loading...</div>;
    }

    const renderParagraph = (paragraph, index) => {
        if (typeof paragraph === "string") {
            return (
                <p key={index} className="paragraph">
                    {paragraph}
                </p>
            );
        }

        // Handle paragraphs with parts (text and links)
        if (paragraph.parts) {
            return (
                <p key={index} className="paragraph">
                    {paragraph.parts.map((part, partIndex) => {
                        if (part.type === "text") {
                            return (
                                <span key={partIndex} className="paragraph">
                                    {part.content}
                                </span>
                            );
                        }
                        if (part.type === "link") {
                            return (
                                <Link
                                    key={partIndex}
                                    to={part.url}
                                    className="text-link"
                                >
                                    {part.text}
                                </Link>
                            );
                        }
                        return null;
                    })}
                </p>
            );
        }

        // Handle paragraphs with bold text
        if (paragraph.bold) {
            return (
                <p key={index} className="paragraph">
                    {paragraph.text}
                    <b>{paragraph.bold}</b>
                    {paragraph.textAfter}
                </p>
            );
        }

        return null;
    };

    const renderSpecialContent = (specialContent) => {
        if (specialContent.type === "resume-joke") {
            return (
                <div className="paragraph">
                    {specialContent.text}
                    {specialContent.link && (
                        <Link
                            to={specialContent.link.url}
                            className="text-link"
                        >
                            {specialContent.link.text}
                        </Link>
                    )}
                    {specialContent.textAfter}{" "}
                    {/* <s>{specialContent.strikethrough}</s>{" "}
                    {specialContent.shinyWords.map((word, index) => (
                        <React.Fragment key={index}>
                            <ShinyText text={word} speed={3} />{" "}
                        </React.Fragment>
                    ))} */}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="home-container">
            <Seo
                title="Alessandro Carella — Data Scientist"
                description="Portfolio of a data scientist specializing in data visualization and explainable AI. 19 projects spanning ML, XAI, and visual analytics."
                path="/home"
            />
            {/* Preload the LCP hero font only here — TextPressure (its sole
                consumer) renders on home only. A global preload in index.html
                downloaded it on every route unused. */}
            <Helmet>
                <link
                    rel="preload"
                    href="/fonts/RobotoFlex.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
            </Helmet>
            <Sidebar />

            <main className="main-content">
                {/* Real page heading for SEO/a11y. The animated TextPressure
                    hero below renders as a <div> (as="div") so the page keeps
                    exactly one, keyword-bearing <h1>. */}
                <h1 className="visually-hidden">
                    Alessandro Carella — Data Scientist
                </h1>
                <div className="intro-title-wrapper">
                    <TextPressure
                        as="div"
                        text={content.title}
                        flex={true}
                        alpha={false}
                        stroke={false}
                        width={true}
                        weight={true}
                        italic={true}
                        textColor="#ffffff"
                        strokeColor="#ff0000"
                        minFontSize={30}
                        fontSize={100}
                    />
                </div>

                {content.sections.map((section) => (
                    <div
                        key={section.id}
                        className="max-w-6xl px-6 py-16"
                    >
                        <h2 className="heading-xl">{section.heading}</h2>

                        {section.paragraphs.map((paragraph, index) =>
                            renderParagraph(paragraph, index)
                        )}

                        {section.specialContent &&
                            renderSpecialContent(section.specialContent)}

                        {section.includeGitHub && (
                            <div className="w-full overflow-x-auto">
                                <div className="github-calendar-home">
                                    <GitHubCalendar
                                        username="alessandrocarella"
                                        colorScheme="dark"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </main>
        </div>
    );
};

export default Home;
