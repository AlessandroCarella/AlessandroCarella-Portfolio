// src/App.jsx
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";
import { Home as HomeIcon, User, Briefcase, FileText } from "lucide-react";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
// import About from "./pages/About";
import Resume from "./pages/Resume";
import { PROJECT_TAGS, tagToSlug } from "./components/utils/projectUtils.js";
import "./styles/App.css";
import "./styles/text.css";

const WIPpage = "/home";

function ProjectSlugRouter() {
    const { projectSlug } = useParams();
    const isCategory = Object.keys(PROJECT_TAGS).some(
        (t) => tagToSlug(t) === projectSlug
    );
    if (isCategory) return <Projects />;
    return <ProjectDetail />;
}

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
                brandFontSize="1.6rem"
                linkFontSize="1rem"
                iconSize={24}
                navItems={[
                    { path: "/home", label: "Home", icon: HomeIcon },
                    // { path: "/about", label: "About", icon: User },
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

                    {/* Handles both category filters (/projects/master) and project detail pages */}
                    <Route
                        path="/projects/:projectSlug"
                        element={<ProjectSlugRouter />}
                    />

                    {/* Other pages */}
                    {/* <Route path="/about" element={<About />} /> */}
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
