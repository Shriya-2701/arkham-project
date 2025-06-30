import React from "react";
import { Outlet } from "react-router-dom";
import "./SocialLayout.css"; // Assuming you have a CSS file for styles

const SocialLayout: React.FC = () => {
  return (
    <div className="social-container">
      <div className="social-content">
        <Outlet />
      </div>
    </div>
  );
};

export default SocialLayout;
