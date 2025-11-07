// src/App.jsx
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { Home as HomeIcon, User, Briefcase, FileText } from "lucide-react";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import Resume from "./pages/Resume";
import "./styles/App.css";
import "./styles/text.css";

const WIPpage = "/home";

function AppContent() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <>
            <Navigation
                brandName="Alessandro Carella"
                currentPath={location.pathname}
                onNavigate={handleNavigate}
                backgroundColor="#010409"
                textColor="#f0f6fc"
                brandFontSize="2.3rem"
                linkFontSize="1.3rem"
                iconSize={35}
                navItems={[
                    { path: "/home", label: "Home", icon: HomeIcon },
                    { path: "/about", label: "About", icon: User },
                    { path: "/projects", label: "Projects", icon: Briefcase },
                    { path: "/resume", label: "Resume", icon: FileText },
                ]}
            />
            <div className="app-container mt-4">
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to={WIPpage} replace />}
                    />
                    {/* Home page */}
                    <Route path="/home" element={<Home />} />

                    {/* Projects list page - shows all project cards */}
                    <Route path="/projects" element={<Projects />} />

                    {/* Individual project page - dynamic route */}
                    {/* This matches URLs like:
                            /projects/data-mining-1
                            /projects/decision-support-system
                            /projects/bachelor-thesis
                            etc.
                        */}
                    <Route
                        path="/projects/:projectSlug"
                        element={<ProjectDetail />} // ✅ CHANGED: Updated component
                    />

                    {/* Other pages */}
                    <Route path="/about" element={<About />} />
                    <Route path="/resume" element={<Resume />} />

                    {/* 404 Not Found - Optional */}
                    <Route
                        path="*"
                        element={
                            <div className="not-found">
                                <h1>404 - Page Not Found</h1>
                                <p>
                                    The page you're looking for doesn't exist.
                                </p>
                            </div>
                        }
                    />
                </Routes>
            </div>
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
