import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Nav.css"; // Assuming styles are in this file

const Nav: React.FC = () => {
  const [activeLink, setActiveLink] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Set the active link based on the current path
    const currentPath = location.pathname.split("/")[1];
    setActiveLink(currentPath);
  }, [location.pathname]); // Add location.pathname as a dependency

  return (
    <nav>
      <ul className="container">
        <Link to="/">
          <li className={activeLink === "" ? "active" : ""}>Your images</li>
        </Link>
        <Link to="/calendar">
          <li className={activeLink === "calendar" ? "active" : ""}>
            Calendar
          </li>
        </Link>
        <Link to="/upload">
          <li className={activeLink === "upload" ? "active" : ""}>
            Upload image
          </li>
        </Link>
      </ul>
    </nav>
  );
};

export default Nav;
