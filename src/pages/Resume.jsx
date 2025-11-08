import React, { useState, useEffect } from "react";
import ExamCard from "../components/ExamCard";
import TextCapsule from "../components/text/TextCapsule";
import Notification from "../components/text/Notification";
import {
    Github,
    Linkedin,
    Mail,
    MessageCircle,
    Briefcase,
    GraduationCap,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import "./styles/Resume.css";

const Resume = () => {
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");

    // Collapsible sections state
    const [isMasterOpen, setIsMasterOpen] = useState(true);
    const [isBachelorOpen, setIsBachelorOpen] = useState(true);
    const [isExperienceOpen, setIsExperienceOpen] = useState(true);

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

    const handleCopyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setNotificationMessage("Copied to clipboard!");
            setShowNotification(true);
        } catch (err) {
            console.error("Failed to copy text: ", err);
            setNotificationMessage("Failed to copy");
            setShowNotification(true);
        }
    };

    const handleContactClick = (contact) => {
        if (contact.type === "email" || contact.type === "number") {
            handleCopyToClipboard(contact.name);
        } else if (contact.url) {
            window.open(contact.url, "_blank", "noopener,noreferrer");
        }
    };

    const contacts = [
        {
            name: "GitHub",
            url: "https://github.com/AlessandroCarella/",
            icon: <Github size={16} />,
            showPreview: false,
            type: "link",
        },
        {
            name: "LinkedIn",
            url: "https://www.linkedin.com/in/alessandrocarella",
            icon: <Linkedin size={16} />,
            showPreview: false,
            type: "link",
        },
        {
            name: "alessandro.carella.lavoro@gmail.com",
            icon: <Mail size={16} />,
            showPreview: false,
            type: "email",
        },
        {
            name: "+39 351 805 3605",
            icon: <MessageCircle size={16} />,
            showPreview: false,
            type: "number",
        },
    ];

    // Bachelor's Degree Exams
    const bachelorExams = [
        {
            exam: "Programming",
            ssd: "INF/01",
            credits: 12,
            link: "https://elearning.uniba.it/pluginfile.php/258577/course/summary/ProgrammazioneA_L_2024_25.pdf?time=1722593681798",
        },
        {
            exam: "Discrete Mathematics",
            ssd: "MAT/03",
            credits: 9,
            link: "https://elearning.uniba.it/pluginfile.php/258456/course/summary/Programma_MD_IACONO_INF_A_L_2024_25_it_en.pdf",
        },
        {
            exam: "Computer Science Laboratory",
            ssd: "INF/01",
            credits: 6,
            link: "https://elearning.uniba.it/pluginfile.php/259104/course/summary/Programma%20del%20corso%20di%20Laboratorio%20di%20informatica%20%28track%20AL%29%20-%20INF%20-%20AA%202024_25.pdf",
        },
        {
            exam: "Programming Languages",
            ssd: "INF/01",
            credits: 9,
            link: "https://elearning.uniba.it/pluginfile.php/258767/course/summary/2024-2025%20NEW%20Programma%20del%20corso%20di%20Linguaggi%20di%20Programmazione%20%28corso%20A%29%20-%20Informatica%20%28ITA-ENG%29%20con%20indicazioni%20per%20la%20compilazione%202023-24%20%281%29.pdf",
        },
        {
            exam: "English Language",
            ssd: "L-LIN/12",
            credits: 6,
            link: "https://elearning.uniba.it/pluginfile.php/259355/course/summary/Programma%20Lingua%20Inglese%202025%20INFO%20%28A-L%29.pdf",
        },
        {
            exam: "Computer Architecture and Operating Systems",
            ssd: "ING-INF/05",
            credits: 9,
            link: "https://elearning.uniba.it/pluginfile.php/258427/course/summary/AESO%2024-25%20A-L.pdf",
        },
        {
            exam: "Algorithms and Data Structures",
            ssd: "INF/01",
            credits: 9,
            link: "https://elearning.uniba.it/pluginfile.php/259574/course/summary/Di%20Mauro-Informatica-ASD%20%28A%29-I-2425.pdf",
        },
        {
            exam: "Databases",
            ssd: "INF/01",
            credits: 9,
            link: "https://elearning.uniba.it/pluginfile.php/259797/course/summary/Programma%20Basi%20di%20Dati%20A-L%20%28ITA-ENG%29%202024-25.pdf",
        },
        {
            exam: "Fundamentals of Physics",
            ssd: "FIS/07",
            credits: 6,
            link: "https://elearning.uniba.it/pluginfile.php/259991/course/summary/programma%202024-2025%20IT%2BEN.pdf?time=1732112568768",
        },
        {
            exam: "Software Engineering",
            ssd: "INF/01",
            credits: 9,
            link: "https://elearning.uniba.it/pluginfile.php/260114/course/summary/Lanubile-INF-Ingegneria%20del%20Software-IIsem-2024-2025.pdf",
        },
        {
            exam: "Conscious Orientation Seminar",
            ssd: "",
            credits: 3,
            link: "",
        },
        {
            exam: "Calculus",
            ssd: "MAT/05",
            credits: 9,
            link: "https://elearning.uniba.it/pluginfile.php/258719/course/summary/Cappelletti-Analisi%20MatematicaA_L2425.pdf?time=1722594091168",
        },
        {
            exam: "Advanced Programming Methods",
            ssd: "ING-INF/05",
            credits: 9,
            link: "https://elearning.uniba.it/pluginfile.php/260223/course/summary/MAP%202024-25.pdf?time=1722345323446",
        },
        {
            exam: "Computer Networks",
            ssd: "ING-INF/05",
            credits: 9,
            link: "https://elearning.uniba.it/pluginfile.php/260465/course/summary/Scalera-Informatica-RetiDiCalcolatori-Isem-2024-2025%20ITA.pdf",
        },
        {
            exam: "Information Retrieval",
            ssd: "ING-INF/05",
            credits: 9,
            link: "https://elearning.uniba.it/pluginfile.php/260700/course/summary/Programma%20del%20corso%20di%20Metodi%20per%20il%20Ritrovamento%20dellInf%20-%20Informatica%20-%20AA%202024_25.pdf",
        },
        {
            exam: "Computability and Complexity",
            ssd: "INF/01",
            credits: 6,
            link: "https://elearning.uniba.it/pluginfile.php/260441/course/summary/Covino-INF-Calcolabilita%20e%20Complessita%20AL-II-2024_25.doc.pdf?time=1722339719508",
        },
        {
            exam: "Numerical Calculus",
            ssd: "MAT/08",
            credits: 6,
            link: "https://elearning.uniba.it/pluginfile.php/260332/course/summary/Iavernaro-INF-Caloclo%20Numerico%20%28EN%29-AL-IIsem-2024-25.pdf",
        },
        {
            exam: "Human-Computer Interaction",
            ssd: "INF/01",
            credits: 6,
            link: "https://elearning.uniba.it/pluginfile.php/260573/course/summary/Programma%20IUM%2024%2025%20Italian_English.pdf",
        },
        {
            exam: "Multimedia Design and Production",
            ssd: "INF/01",
            credits: 9,
            link: "",
        },
        {
            exam: "Probability and Statistics",
            ssd: "MAT/06",
            credits: 6,
            link: "https://elearning.uniba.it/pluginfile.php/259936/course/summary/Probabilit%C3%A0eStatistica2425.pdf",
        },
        {
            exam: "Knowledge Engineering",
            ssd: "ING-INF/05",
            credits: 6,
            link: "https://elearning.uniba.it/pluginfile.php/260788/course/summary/Fanizzi-INF-IngegneriaDellaConoscenza-Isem-2024-25.pdf",
        },
        { exam: "Internships and Seminars", ssd: "", credits: 12, link: "" },
        { exam: "Final Examination", ssd: "", credits: 6, link: "" },
    ];

    // Master's Degree Exams
    const masterExams = [
        {
            exam: "Fundamentals of Business Management",
            ssd: "",
            credits: 9,
            link: "https://unipi.coursecatalogue.cineca.it/insegnamenti/2025/53385_703130_77396/2025/53385/11357",
        },
        {
            exam: "Strategic and Competitive Intelligence",
            ssd: "",
            credits: 6,
            link: "https://didawiki.cli.di.unipi.it/doku.php/mds/sci/start",
        },
        {
            exam: "Technologies for Web Marketing",
            ssd: "",
            credits: 6,
            link: "https://elearning.di.unipi.it/enrol/index.php?id=1036",
        },
        {
            exam: "Project Design & Management for Data Science",
            ssd: "",
            credits: 6,
            link: "https://didawiki.cli.di.unipi.it/doku.php/mds/d4ds/start",
        },
        {
            exam: "Legal Issues in Data Science",
            ssd: "",
            credits: 6,
            link: "https://esami.unipi.it/esami2/programma.php?noframe=1&c=61290&aa=2023&cid=361&did=13",
        },
        {
            exam: "Optimization for Data Science",
            ssd: "",
            credits: 9,
            link: "https://elearning.di.unipi.it/enrol/index.php?id=497",
        },
        {
            exam: "Statistics for Data Science",
            ssd: "",
            credits: 9,
            link: "https://didawiki.di.unipi.it/doku.php/mds/sds/start",
        },
        {
            exam: "Data Mining: Module I - Fundamentals",
            ssd: "",
            credits: 6,
            link: "https://didawiki.cli.di.unipi.it/doku.php/dm/dm_ds2024-25#exam_dm1",
        },
        {
            exam: "Data Mining: Module II - Advanced Topics and Applications",
            ssd: "",
            credits: 6,
            link: "https://didawiki.cli.di.unipi.it/doku.php/dm/dm_ds2024-25#exam_dm2",
        },
        {
            exam: "Business Process Modeling",
            ssd: "",
            credits: 6,
            link: "https://didawiki.di.unipi.it/doku.php/magistraleinformaticaeconomia/mpb/2021-22/start",
        },
        {
            exam: "Visual Analytics",
            ssd: "",
            credits: 6,
            link: "https://didawiki.cli.di.unipi.it/doku.php/magistraleinformaticaeconomia/va/start",
        },
        {
            exam: "Decision Support Systems: Module I - Decision Support Databases",
            ssd: "",
            credits: 6,
            link: "https://didawiki.cli.di.unipi.it/doku.php/mds/dsd/start",
        },
        {
            exam: "Decision Support Systems: Module II - Laboratory of Data Science",
            ssd: "",
            credits: 6,
            link: "https://didawiki.cli.di.unipi.it/doku.php/mds/lbi/start",
        },
        {
            exam: "Information Retrieval",
            ssd: "",
            credits: 6,
            link: "https://didawiki.cli.di.unipi.it/doku.php/magistraleinformatica/ir/ir23/start",
        },
        {
            exam: "Geospatial Analytics",
            ssd: "",
            credits: 6,
            link: "https://didawiki.cli.di.unipi.it/doku.php/geospatialanalytics/gsa/gsa2024",
        },
        { exam: "Master Thesis", ssd: "", credits: 27, link: "" },
    ];

    const skills = {
        aiMl: [
            "Machine & Deep Learning",
            "AI & GenAI",
            "Time Series Classification, Clustering & Approximation",
            "Classification & Clustering",
            "Imbalanced Learning",
            "Anomaly Detection",
            "Sequential Pattern Mining",
            "Explainable AI",
            "ML Libraries",
            "CUDA",
        ],
        programming: [
            "Python",
            "Java",
            "JavaScript",
            "TypeScript",
            "C",
            "C++",
            "C#",
            "R",
            "MATLAB",
            "SQL",
            "HTML",
            "CSS",
            "Sass",
        ],
        frameworks: [
            "React",
            "Node.js",
            "Flask",
            "Django",
            "Spring Boot",
            "Pandas",
            "Scikit-learn",
            "XGBoost",
            "SHAP",
            "LIME",
            "LORE_sa",
            "tslearn",
            "D3.js",
            "Shiny",
            "JSON",
        ],
        tools: [
            "Git",
            "Jupyter Notebook",
            "PowerBI",
            "Jira",
            "REST API",
            "OpenAPI",
            "LaTeX",
            "Linux",
            "PowerShell",
            "PowerPoint",
            "Word",
        ],
        databases: [
            "MySQL",
            "Microsoft SQL",
            "Relational Databases",
            "Data Warehouse",
            "OLAP",
            "MDX",
        ],
        technologies: [
            "Geospatial Technologies",
            "Data Visualization Tools",
            "DevOps",
            "Frontend Development",
        ],
        methodologies: ["CRISP-DM", "Agile", "Scrum", "Waterfall"],
        soft: [
            "Problem Solving",
            "Intercultural Communication",
            "Team Collaboration",
            "Technical Communication",
            "Stakeholder Awareness",
            "Analytical & Critical Thinking",
            "Creative Problem Solving",
            "Data Intuition",
            "Decision Making",
            "Self-Management",
            "Attention to Details",
            "Rapid Learning",
            "Visualization Literacy",
            "Explainability Advocacy",
        ],
    };

    return (
        <div className="resume-container">
            {/* Copy Notification */}
            <Notification
                message={notificationMessage}
                isVisible={showNotification}
                onClose={() => setShowNotification(false)}
            />

            {/* Sidebar - Same as Home */}
            <aside className="sidebar">
                <div className="sidebar-content">
                    <img
                        src="/propic.jpeg"
                        alt="Alessandro Carella"
                        className="sidebar-image"
                    />
                    <div className="sidebar-info">
                        <p className="paragraph">
                            Graduated in
                            <br />
                            Data Science
                            <br />
                            and
                            <br />
                            Business Informatics
                            <br />&<br />
                            Computer Science
                        </p>
                    </div>
                    <div className="sidebar-contacts">
                        {contacts.map((contact, index) => (
                            <TextCapsule
                                key={index}
                                name={contact.name}
                                link={contact.url || contact.name}
                                icon={contact.icon}
                                fontSize={23}
                                onClick={() => handleContactClick(contact)}
                            />
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Education Section */}
                <section className="resume-section">
                    <div className="section-header">
                        <GraduationCap size={32} className="section-icon" />
                        <h1 className="heading-xl">Education</h1>
                    </div>

                    {/* Master's Degree */}
                    <div className="degree-block">
                        <div
                            className="degree-header clickable"
                            onClick={() => setIsMasterOpen(!isMasterOpen)}
                        >
                            <div>
                                <h2 className="degree-title">
                                    MSc in Data Science and Business Informatics
                                </h2>
                                <p className="degree-info">
                                    University of Pisa • Expected December 2025
                                    • Final Mark: 103/110
                                </p>
                            </div>
                            <div className="degree-header-right">
                                {isMasterOpen ? (
                                    <ChevronUp
                                        size={24}
                                        className="collapse-icon"
                                    />
                                ) : (
                                    <ChevronDown
                                        size={24}
                                        className="collapse-icon"
                                    />
                                )}
                            </div>
                        </div>
                        <div
                            className={`collapsible-content ${
                                isMasterOpen ? "open" : ""
                            }`}
                        >
                            <div className="exams-grid">
                                {masterExams.map((exam, index) => (
                                    <ExamCard
                                        key={index}
                                        exam={exam.exam}
                                        ssd={exam.ssd}
                                        credits={exam.credits}
                                        link={exam.link}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bachelor's Degree */}
                    <div className="degree-block">
                        <div
                            className="degree-header clickable"
                            onClick={() => setIsBachelorOpen(!isBachelorOpen)}
                        >
                            <div>
                                <h2 className="degree-title">
                                    BSc in Computer Science
                                </h2>
                                <p className="degree-info">
                                    University of Bari Aldo Moro • Graduated
                                    July 2023 • Final Mark: 96/110
                                </p>
                            </div>
                            <div className="degree-header-right">
                                {isBachelorOpen ? (
                                    <ChevronUp
                                        size={24}
                                        className="collapse-icon"
                                    />
                                ) : (
                                    <ChevronDown
                                        size={24}
                                        className="collapse-icon"
                                    />
                                )}
                            </div>
                        </div>
                        <div
                            className={`collapsible-content ${
                                isBachelorOpen ? "open" : ""
                            }`}
                        >
                            <div className="exams-grid">
                                {bachelorExams.map((exam, index) => (
                                    <ExamCard
                                        key={index}
                                        exam={exam.exam}
                                        ssd={exam.ssd}
                                        credits={exam.credits}
                                        link={exam.link}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Work Experience Section */}
                <section className="resume-section">
                    <div className="section-header">
                        <Briefcase size={32} className="section-icon" />
                        <h1 className="heading-xl">Work Experience</h1>
                    </div>

                    <div className="experience-block">
                        <div
                            className="experience-header clickable"
                            onClick={() =>
                                setIsExperienceOpen(!isExperienceOpen)
                            }
                        >
                            <div>
                                <h2 className="experience-title">
                                    Full Stack Developer
                                </h2>
                                <a
                                    href="https://www.linkedin.com/company/dxctechnology/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="company-link"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    DXC Technology
                                </a>
                                <p className="experience-info">
                                    July 2022 - August 2023 • Bari, Italy
                                </p>
                            </div>
                            {isExperienceOpen ? (
                                <ChevronUp
                                    size={24}
                                    className="collapse-icon"
                                />
                            ) : (
                                <ChevronDown
                                    size={24}
                                    className="collapse-icon"
                                />
                            )}
                        </div>
                        <div
                            className={`collapsible-content ${
                                isExperienceOpen ? "open" : ""
                            }`}
                        >
                            <div className="experience-description">
                                <p className="paragraph">
                                    Worked as a full-stack developer with a
                                    strong focus on front-end for
                                    customer-facing portals commissioned by the
                                    Italian Department of Motor Vehicles and
                                    Civil Registry. Collaborated within an Agile
                                    team while balancing the role alongside the
                                    completion of my BSc Computer Science
                                    degree.
                                </p>
                                <ul className="experience-list">
                                    <li>
                                        Developed public service web pages using
                                        mainly React and Spring Boot
                                    </li>
                                    <li>
                                        Participated in pair programming and
                                        code reviews to ensure code quality and
                                        share best practices
                                    </li>
                                    <li>
                                        Contributed to regular stand-up meetings
                                        and retrospectives as part of the Agile
                                        workflow
                                    </li>
                                    <li>
                                        Supported the team in maintaining and
                                        troubleshooting the project's CI/CD
                                        pipeline
                                    </li>
                                    <li>
                                        Wrote internal documentation for
                                        long-term maintenance and team
                                        initiation
                                    </li>
                                    <li>
                                        Coordinated exam and thesis schedules
                                        with team timelines to maintain academic
                                        and professional commitments
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Skills Section */}
                <section className="resume-section">
                    <div className="section-header">
                        <h1 className="heading-xl">Skills</h1>
                    </div>

                    <div className="skills-container">
                        <div className="skill-category">
                            <h3 className="skill-category-title">
                                AI and Machine Learning
                            </h3>
                            <div className="skill-tags">
                                {skills.aiMl.map((skill, index) => (
                                    <span key={index} className="skill-tag">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="skill-category">
                            <h3 className="skill-category-title">
                                Programming Languages
                            </h3>
                            <div className="skill-tags">
                                {skills.programming.map((skill, index) => (
                                    <span key={index} className="skill-tag">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="skill-category">
                            <h3 className="skill-category-title">
                                Frameworks and Libraries
                            </h3>
                            <div className="skill-tags">
                                {skills.frameworks.map((skill, index) => (
                                    <span key={index} className="skill-tag">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="skill-category">
                            <h3 className="skill-category-title">
                                Tools and Platforms
                            </h3>
                            <div className="skill-tags">
                                {skills.tools.map((skill, index) => (
                                    <span key={index} className="skill-tag">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="skill-category">
                            <h3 className="skill-category-title">Databases</h3>
                            <div className="skill-tags">
                                {skills.databases.map((skill, index) => (
                                    <span key={index} className="skill-tag">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="skill-category">
                            <h3 className="skill-category-title">
                                Technologies
                            </h3>
                            <div className="skill-tags">
                                {skills.technologies.map((skill, index) => (
                                    <span key={index} className="skill-tag">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="skill-category">
                            <h3 className="skill-category-title">
                                Methodologies
                            </h3>
                            <div className="skill-tags">
                                {skills.methodologies.map((skill, index) => (
                                    <span key={index} className="skill-tag">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="skill-category">
                            <h3 className="skill-category-title">
                                Soft Skills
                            </h3>
                            <div className="skill-tags">
                                {skills.soft.map((skill, index) => (
                                    <span key={index} className="skill-tag">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Resume;
