import React, { useState, useEffect } from "react";
import ExamCard from "../components/ExamCard";
import Sidebar from "../components/Sidebar";
import { Briefcase, GraduationCap, ChevronDown, ChevronUp } from "lucide-react";
import "./styles/Resume.css";

const Resume = () => {
    // Collapsible sections state
    const [isMasterOpen, setIsMasterOpen] = useState(true);
    const [isBachelorOpen, setIsBachelorOpen] = useState(true);
    const [isExperienceOpen, setIsExperienceOpen] = useState(true);

    // Data state
    const [pageText, setPageText] = useState({});
    const [bachelor, setBachelor] = useState({ exams: [] });
    const [master, setMaster] = useState({ exams: [] });
    const [experience, setExperience] = useState({ responsibilities: [] });
    const [skills, setSkills] = useState([]);

    // Fetch resume data from JSON file
    useEffect(() => {
        fetch("/resume-data.json")
            .then((response) => response.json())
            .then((data) => {
                setPageText(data.pageText);
                setBachelor(data.bachelor);
                setMaster(data.master);
                setExperience(data.experience);
                setSkills(data.skills);
            })
            .catch((error) =>
                console.error("Error loading resume data:", error)
            );
    }, []);

    // Set default open state based on screen size
    useEffect(() => {
        const handleResize = () => {
            const shouldBeOpen = window.innerWidth > 1400;
            setIsMasterOpen(shouldBeOpen);
            setIsBachelorOpen(shouldBeOpen);
            setIsExperienceOpen(shouldBeOpen);
        };

        // Set initial state
        handleResize();

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="resume-container">
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Content - 80% */}
            <main className="main-content">
                {/* Education Section */}
                <section className="resume-section">
                    <div className="section-header">
                        <GraduationCap size={32} className="section-icon" />
                        <h1 className="heading-xl">{pageText.education}</h1>
                    </div>

                    {/* Master's Degree */}
                    <div className="degree-block">
                        <div
                            className={`degree-header ${
                                window.innerWidth <= 1400 ? "clickable" : ""
                            }`}
                            onClick={() =>
                                window.innerWidth <= 1400 &&
                                setIsMasterOpen(!isMasterOpen)
                            }
                        >
                            <div>
                                <h2 className="degree-title">{master.title}</h2>
                                <p className="degree-info">{master.info}</p>
                                <a
                                    href={master.uniLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="university-link"
                                >
                                    {master.uni}
                                </a>
                                <p className="degree-info">
                                    {master.period} • {master.location}
                                </p>
                                {window.innerWidth <= 1400 &&
                                    (isMasterOpen ? (
                                        <ChevronUp
                                            size={24}
                                            className="collapse-icon"
                                        />
                                    ) : (
                                        <ChevronDown
                                            size={24}
                                            className="collapse-icon"
                                        />
                                    ))}
                            </div>
                        </div>
                        <div
                            className={`collapsible-content ${
                                isMasterOpen ? "open" : ""
                            }`}
                        >
                            <div className="exams-grid">
                                {master.exams.map((exam, index) => (
                                    <ExamCard key={index} {...exam} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bachelor's Degree */}
                    <div className="degree-block">
                        <div
                            className={`degree-header ${
                                window.innerWidth <= 1400 ? "clickable" : ""
                            }`}
                            onClick={() =>
                                window.innerWidth <= 1400 &&
                                setIsBachelorOpen(!isBachelorOpen)
                            }
                        >
                            <div>
                                <h2 className="degree-title">
                                    {bachelor.title}
                                </h2>
                                <p className="degree-info">{bachelor.info}</p>
                                <a
                                    href={bachelor.uniLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="university-link"
                                >
                                    {bachelor.uni}
                                </a>
                                <p className="degree-info">
                                    {bachelor.period} • {bachelor.location}
                                </p>
                                {window.innerWidth <= 1400 &&
                                    (isBachelorOpen ? (
                                        <ChevronUp
                                            size={24}
                                            className="collapse-icon"
                                        />
                                    ) : (
                                        <ChevronDown
                                            size={24}
                                            className="collapse-icon"
                                        />
                                    ))}
                            </div>
                        </div>
                        <div
                            className={`collapsible-content ${
                                isBachelorOpen ? "open" : ""
                            }`}
                        >
                            <div className="exams-grid">
                                {bachelor.exams.map((exam, index) => (
                                    <ExamCard key={index} {...exam} />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Experience Section */}
                <section className="resume-section">
                    <div className="section-header">
                        <Briefcase size={32} className="section-icon" />
                        <h1 className="heading-xl">
                            {pageText.experience}
                        </h1>
                    </div>

                    <div className="experience-block">
                        <div
                            className={`experience-header ${
                                window.innerWidth <= 1400 ? "clickable" : ""
                            }`}
                            onClick={() =>
                                window.innerWidth <= 1400 &&
                                setIsExperienceOpen(!isExperienceOpen)
                            }
                        >
                            <div>
                                <h2 className="experience-title">
                                    {experience.position}
                                </h2>
                                <a
                                    href={experience.companyLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="company-link"
                                >
                                    {experience.company}
                                </a>
                                <p className="experience-info">
                                    {experience.period} • {experience.location}
                                </p>
                                {window.innerWidth <= 1400 &&
                                    (isExperienceOpen ? (
                                        <ChevronUp
                                            size={24}
                                            className="collapse-icon"
                                        />
                                    ) : (
                                        <ChevronDown
                                            size={24}
                                            className="collapse-icon"
                                        />
                                    ))}
                            </div>
                        </div>
                        <div
                            className={`collapsible-content ${
                                isExperienceOpen ? "open" : ""
                            }`}
                        >
                            <div className="experience-description">
                                <p className="paragraph">
                                    {experience.description}
                                </p>
                                <ul className="experience-list">
                                    {experience.responsibilities.map(
                                        (responsibility, index) => (
                                            <li key={index}>
                                                {responsibility}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Skills Section */}
                <section className="resume-section">
                    <div className="section-header">
                        <h1 className="heading-xl">{pageText.skill}</h1>
                    </div>

                    <div className="skills-container">
                        {skills.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="skill-category">
                                <h3 className="skill-category-title">
                                    {category.title}
                                </h3>
                                <div className="skill-tags">
                                    {category.skillList.map(
                                        (skill, skillIndex) => (
                                            <span
                                                key={skillIndex}
                                                className="skill-tag"
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Resume;
