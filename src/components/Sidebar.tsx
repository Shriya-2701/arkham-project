import React from "react";
import {
  Home,
  Users,
  Gamepad2,
  Network,
  FileText,
  Moon,
  Sun,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface SidebarProps {
  activeSection: number;
  onSectionChange: (index: number) => void;
  isExpanded: boolean;
  onLegalClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  isExpanded,
  onLegalClick,
}) => {
  const { theme, toggleTheme } = useTheme();

  const sections = [
    { icon: Home, label: "Home" },
    { icon: Users, label: "Social Media" },
    { icon: Gamepad2, label: "Arkham Experience" },
    { icon: Network, label: "K-Protocol" },
  ];

  return (
    <div
      className={`sidebar-glass fixed left-0 top-0 h-full flex flex-col py-8 z-50 transition-all duration-300 ${
        isExpanded ? "w-56" : "w-16"
      }`}
    >
      {/* Top Section - Theme Toggle */}
      <div className="flex flex-col items-center mb-8">
        <button
          onClick={toggleTheme}
          className={`nav-icon group relative ${
            isExpanded
              ? "w-full mx-4 justify-start"
              : "w-10 h-10 justify-center"
          } flex items-center`}
          aria-label="Toggle Theme"
        >
          {theme === "night" ? (
            <Sun className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
          ) : (
            <Moon className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
          )}
          {isExpanded && (
            <span className="ml-3 text-white font-medium text-sm">
              {theme === "night" ? "General Mode" : "Night Mode"}
            </span>
          )}
          {!isExpanded && <span className="tooltip">Toggle Theme</span>}
        </button>
      </div>

      {/* Middle Section - Main Navigation (3 items) */}
      <nav className="flex-1 flex flex-col justify-center">
        <div className="space-y-6 px-4">
          {sections.slice(0, 3).map((item, index) => (
            <button
              key={item.label}
              onClick={() => onSectionChange(index)}
              className={`nav-icon group relative ${
                isExpanded
                  ? "w-full justify-start"
                  : "w-10 h-10 justify-center mx-auto"
              } flex items-center ${activeSection === index ? "active" : ""}`}
              aria-label={item.label}
            >
              <item.icon className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
              {isExpanded && (
                <span className="ml-3 text-white font-medium text-sm">
                  {item.label}
                </span>
              )}
              {!isExpanded && <span className="tooltip">{item.label}</span>}
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom Section - K-Protocol & Legal */}
      <div className="space-y-6 px-4 mb-4">
        {/* K-Protocol */}
        <button
          onClick={() => onSectionChange(3)}
          className={`nav-icon group relative ${
            isExpanded
              ? "w-full justify-start"
              : "w-10 h-10 justify-center mx-auto"
          } flex items-center ${activeSection === 3 ? "active" : ""}`}
          aria-label="K-Protocol"
        >
          <Network className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
          {isExpanded && (
            <span className="ml-3 text-white font-medium text-sm">
              K-Protocol
            </span>
          )}
          {!isExpanded && <span className="tooltip">K-Protocol</span>}
        </button>

        {/* Legal & Contact */}
        <button
          onClick={onLegalClick}
          className={`nav-icon group relative ${
            isExpanded
              ? "w-full justify-between"
              : "w-10 h-10 justify-center mx-auto"
          } flex items-center`}
          aria-label="Legal & Contact"
        >
          <div
            className={`flex items-center ${
              isExpanded ? "" : "justify-center"
            }`}
          >
            <FileText className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
            {isExpanded && (
              <span className="ml-3 text-white font-medium text-sm">
                Legal & Contact
              </span>
            )}
          </div>
          {isExpanded && (
            <ChevronRight className="w-4 h-4 text-white/70 transition-colors" />
          )}
          {!isExpanded && <span className="tooltip">Legal & Contact</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
