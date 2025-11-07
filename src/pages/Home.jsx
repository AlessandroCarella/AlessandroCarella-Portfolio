import React, { useState } from "react";
import TextPressure from "../components/text/TextPressure";
import ShinyText from "../components/text/ShinyText";
import TextCapsule from "../components/text/TextCapsule";
import Notification from "../components/text/Notification";
import GitHubCalendar from "react-github-calendar";
import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";

import "./styles/Home.css";

const Home = () => {
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");

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
        if (contact.type === "email" || contact.type == "number") {
            handleCopyToClipboard(contact.name);
        } else if (contact.url) {
            window.open(contact.url, "_blank", "noopener,noreferrer");
        }
    };

    const contacts = [
        // Social media - open in new tab
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

        // Contact methods
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

    return (
        <div className="home-container">
            {/* Copy Notification */}
            <Notification
                message={notificationMessage}
                isVisible={showNotification}
                onClose={() => setShowNotification(false)}
            />

            {/* Sidebar - 20% */}
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
                            <br />and<br />
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

            {/* Main Content - 80% */}
            <main className="main-content">
                <div className="intro-title-wrapper">
                    <TextPressure
                        text="Welcome to my portfolio!"
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
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <h1 className="heading-xl">About Me</h1>
                    <p className="paragraph">Hi, nice to see you here :)</p>
                    {/* <p className="paragraph">
                        On this page you will find a summary of my experiences
                        both through projects and .
                    </p> */}
                    <p className="paragraph">
                        I have worked on many projects over the years. I have
                        decided to showcase some of them in the Project
                        page[link to page]. The page will ask you to select
                        which kind of projects you are interested in seeing
                        before showing you anything :)
                    </p>
                    <p className="paragraph">
                        The about page allows you to get to know me a bit
                        better, I talk about my hobbies and some fun facts.
                    </p>
                    <div className="paragraph">
                        In the resume page, you can find a 1:1 copy of the info
                        I shared with many companies in a standardized way so
                        that they could <s>hire me</s>{" "}
                        <ShinyText text="suggest" speed={3} />{" "}
                        <ShinyText text="the" speed={3} />{" "}
                        <ShinyText text="best" speed={3} />{" "}
                        <ShinyText text="fitting" speed={3} />{" "}
                        <ShinyText text="ads" speed={3} />{" "}
                        <ShinyText text="on" speed={3} />{" "}
                        <ShinyText text="my" speed={3} />{" "}
                        <ShinyText text="social" speed={3} />{" "}
                        <ShinyText text="media" speed={3} />{" "}
                        <ShinyText text="feed." speed={3} />
                    </div>
                </div>
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <h1 className="heading-xl">What I am looking for</h1>
                    <p className="paragraph">
                        I am currently seeking a position as a data scientist in
                        a collaborative, fast-paced, and challenging
                        environment. I enjoy solving problems using a data
                        driven approach, and apply my coding skills on top of my
                        data intuition to find quick and adaptive solutions!
                    </p>
                    <p className="paragraph">
                        I am a data scientist with a passion for visual
                        storytelling. I believe that{" "}
                        <b>
                            words, data, and its contextual representation are
                            the most powerful tools to change the world
                        </b>
                        .
                    </p>
                </div>
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <h1 className="heading-xl">What I can do</h1>
                    <p className="paragraph">
                        My skills include{" "}
                        <b>both data analysis and programming-focused skills</b>
                        .{" "}
                        {/* I have developed a strong acumen for problem-solving,
                        and I enjoy an occasional challenge. */}
                        During my bachelor's degree, I learned most of the
                        programming skills and techniques I put to use on a
                        daily basis, for my data-related projects as well. Those
                        skills turned out to be very useful in the data
                        visualization field, my master's thesis [link to thesis
                        repo] is in fact on the topic.
                    </p>
                    {/* <p className="paragraph">
                        You can take a look at some of my projects in the
                        related page [link to page]. All my work is linked to
                        its GitHub repository, and occasionally the report
                        and/or slides that were made for the project
                        presentation; feel free to download my code and play
                        around with it :)
                    </p> */}
                    <p className="paragraph">
                        Most of my time is spent staring at a computer screen.
                        During the day, I am usually working on some university,
                        personal or side project, as proven by my contribution
                        chart on GitHub.
                    </p>
                    <div className="w-full overflow-x-auto">
                        <div className="github-calendar-home">
                            <GitHubCalendar
                                username="alessandrocarella"
                                colorScheme="dark"
                            />
                        </div>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <h1 className="heading-xl">
                        Previous work experience and new horizons
                    </h1>
                    <p className="paragraph">
                        As you can see in my resume page [link to resume page],
                        I worked as a full-stack developer for 14 months, mostly
                        on the frontend side of development. At work, i used
                        ReactJS and the Springboot framework, with the
                        occasional JSP page here and there.
                    </p>
                    <p className="paragraph">
                        I am now looking forward to a data-focused position
                        where I can combine both of my developed areas of
                        expertise.
                    </p>
                </div>
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <h1 className="heading-xl">Additional Info </h1>
                    <p className="paragraph">
                        I feel fortunate to be born in a setting that allowed me
                        to learn so much among extraordinarily talented teachers
                        and peers.
                    </p>
                    <p className="paragraph">
                        My native language is Italian, but since I was a
                        teenager, I have developed most of my interests online;
                        therefore, I do not really consider English as a second
                        language. Every class in my master's degree was held in
                        English and I both bonded and worked, mostly with
                        international students.
                        {/* and <b>always</b> in a setting
                        where not everyone's first language was Italian. */}
                    </p>
                    <p className="paragraph">
                        I'm excited to bring my skills to an exciting and
                        challenging setting for my first data-related job :)
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Home;
