import React, { useState, useEffect } from "react";
import TextCapsule from "./text/TextCapsule";
import Notification from "./text/Notification";
import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import "./styles/Sidebar.css";

const Sidebar = () => {
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [sidebarData, setSidebarData] = useState(null);

    // Icon mapping
    const iconMap = {
        Github: <Github size={16} />,
        Linkedin: <Linkedin size={16} />,
        Mail: <Mail size={16} />,
        MessageCircle: <MessageCircle size={16} />,
    };

    // Load sidebar data from JSON
    useEffect(() => {
        fetch("/content/sidebar.json")
            .then((response) => response.json())
            .then((data) => setSidebarData(data))
            .catch((error) =>
                console.error("Error loading sidebar data:", error)
            );
    }, []);

    const handleCopyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setNotificationMessage(
                sidebarData.notifications.copySuccess
            );
            setShowNotification(true);
        } catch (err) {
            console.error("Failed to copy text: ", err);
            setNotificationMessage(
                sidebarData.notifications.copyFailure
            );
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

    // Show loading or empty state while data is being fetched
    if (!sidebarData) {
        return (
            <aside className="sidebar">
                <div className="sidebar-content">Loading...</div>
            </aside>
        );
    }

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
                        src={sidebarData.image.src}
                        alt={sidebarData.image.alt}
                        className="sidebar-image"
                    />
                    <div className="sidebar-info">
                        <p className="paragraph">
                            {sidebarData.info.text
                                .split("\n")
                                .map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        {index <
                                            sidebarData.info.text.split("\n")
                                                .length -
                                                1 && <br />}
                                    </React.Fragment>
                                ))}
                        </p>
                    </div>
                    <div className="sidebar-contacts">
                        {sidebarData.contacts.map((contact, index) => (
                            <TextCapsule
                                key={index}
                                name={contact.name}
                                link={contact.url || contact.name}
                                icon={iconMap[contact.icon]}
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
