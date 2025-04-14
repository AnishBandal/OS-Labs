import { useState } from "react";
import {
  Home,
  Disc,
  Book,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { NavItem } from "./Components/NavItem";
import { HomePage } from "./Components/HomePage";
import { DiskSchedulingPage } from "./pages/DiskSchedulingPage";
import { DocumentationPage } from "./pages/DocumentationPage";
// Main App Component
export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [navExpanded, setNavExpanded] = useState(true);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Sidebar Navigation */}
      <div
        className={`${
          navExpanded ? "w-64" : "w-20"
        } transition-all duration-300 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } border-r ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          <h1
            className={`font-bold text-xl ${navExpanded ? "block" : "hidden"}`}
          >
            OS Lab
          </h1>
          <button
            onClick={() => setNavExpanded(!navExpanded)}
            className={`p-2 rounded-lg ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            {navExpanded ? (
              <PanelLeftClose size={20} />
            ) : (
              <PanelLeftOpen size={20} />
            )}
          </button>
        </div>

        <div className="flex-1 py-6">
          <NavItem
            icon={<Home size={20} />}
            label="Home"
            active={currentPage === "home"}
            onClick={() => setCurrentPage("home")}
            expanded={navExpanded}
            darkMode={darkMode}
          />
          <NavItem
            icon={<Disc size={20} />}
            label="Disk Scheduling"
            active={currentPage === "disk"}
            onClick={() => setCurrentPage("disk")}
            expanded={navExpanded}
            darkMode={darkMode}
          />
          <NavItem
            icon={<Book size={20} />}
            label="Documentation"
            active={currentPage === "docs"}
            onClick={() => setCurrentPage("docs")}
            expanded={navExpanded}
            darkMode={darkMode}
          />
        </div>

        <div className="p-4 border-t flex items-center justify-between">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-400"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <span className={`${navExpanded ? "block" : "hidden"} text-sm`}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {currentPage === "home" && (
          <HomePage setCurrentPage={setCurrentPage} darkMode={darkMode} />
        )}
        {currentPage === "disk" && <DiskSchedulingPage darkMode={darkMode} />}
        {currentPage === "docs" && <DocumentationPage darkMode={darkMode} />}
      </div>
    </div>
  );
}

