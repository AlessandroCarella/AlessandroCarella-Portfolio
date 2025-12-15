import { useState, useEffect, useRef } from "react";
import { Home, User, Briefcase, FileText } from "lucide-react";
import "./styles/Navigation.css";

function Navigation({
    brandName = "Navigation component",
    navItems = [
        { path: "/", label: "Home", icon: Home },
        // { path: "/about", label: "About", icon: User },
        { path: "/projects", label: "Projects", icon: Briefcase },
        { path: "/resume", label: "Resume", icon: FileText },
    ],
    backgroundColor = "#000000",
    textColor = "white",
    brandFontSize = "3rem",
    linkFontSize = "2rem",
    iconSize = 28,
    currentPath = "/",
    onNavigate = () => {},
}) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navRef = useRef(null);
    const menuRef = useRef(null);
    const toggleRef = useRef(null);

    // Measure and set navbar height
    useEffect(() => {
        const updateNavbarHeight = () => {
            if (navRef.current) {
                const height = navRef.current.offsetHeight;
                document.documentElement.style.setProperty('--navbar-height', `${height}px`);
            }
        };

        updateNavbarHeight();
        window.addEventListener('resize', updateNavbarHeight);
        return () => window.removeEventListener('resize', updateNavbarHeight);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [currentPath]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isMobileMenuOpen &&
                menuRef.current &&
                toggleRef.current &&
                !menuRef.current.contains(event.target) &&
                !toggleRef.current.contains(event.target)
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobileMenuOpen]);

    const handleNavClick = (path, e) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        onNavigate(path);
    };

    return (
        <nav
            ref={navRef}
            className={`navbar ${isScrolled ? "scrolled" : ""}`}
            style={{
                "--nav-bg-color": backgroundColor,
                "--nav-text-color": textColor,
                "--brand-font-size": brandFontSize,
                "--link-font-size": linkFontSize,
            }}
        >
            <div className="nav-container">
                <div className="nav-brand-wrapper">
                    <a
                        href="/"
                        className="nav-brand"
                        onClick={(e) => handleNavClick("/", e)}
                    >
                        <span className="brand-first">{brandName}</span>
                    </a>
                </div>

                <div
                    ref={menuRef}
                    className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`}
                >
                    {navItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <a
                                key={item.path}
                                href={item.path}
                                className={`nav-link ${
                                    currentPath === item.path ? "active" : ""
                                }`}
                                style={{ "--item-index": index }}
                                onClick={(e) => handleNavClick(item.path, e)}
                            >
                                <Icon size={iconSize} />
                                <span>{item.label}</span>
                                <span className="link-underline"></span>
                            </a>
                        );
                    })}
                </div>

                <button
                    ref={toggleRef}
                    className={`mobile-toggle ${
                        isMobileMenuOpen ? "open" : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle navigation"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
}

export default Navigation;