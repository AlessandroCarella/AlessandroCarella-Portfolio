import React, { useState } from "react";
import TextCapsule from "./text/TextCapsule";
import Notification from "./text/Notification";
import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import "./styles/Sidebar.css";

const Sidebar = () => {
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

    return (
        <>
            {/* Copy Notification */}
            <Notification
                message={notificationMessage}
                isVisible={showNotification}
                onClose={() => setShowNotification(false)}
            />

            {/* Sidebar */}
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
                            <br />
                            &
                            <br />
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
        </>
    );
};

export default Sidebar;
