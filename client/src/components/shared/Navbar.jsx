/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router";
import useAuth from "@/hooks/useAuth";
import {
  FaHome,
  FaUtensils,
  FaCalendarAlt,
  FaBell,
  FaUserPlus,
} from "react-icons/fa";
import { useState, useRef, useEffect, useCallback } from "react";
import DarkModeToggle from "react-dark-mode-toggle";
import { FiMenu, FiX } from "react-icons/fi";
import clsx from "clsx";
import useAdmin from "@/hooks/useAdmin";

const Navbar = () => {
  const { user, toggleTheme, theme, logoutUser } = useAuth();
  const location = useLocation();
  const [isAdmin] = useAdmin();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Check if the route is active
  const isActive = (path) => location.pathname === path;

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Toggle dropdown state
  const toggleDropdown = useCallback(
    () => setDropdownOpen((prev) => !prev),
    []
  );

  // Close menu on mobile after link click
  const handleLinkClick = () => setMenuOpen(false);

  // Get current theme for convenience
  const isDarkTheme = theme === "dark";

  // Render NavLink component for clean and reusable code
  const NavLink = ({ to, isActive, children }) => (
    <Link
      to={to}
      className={clsx("flex items-center space-x-2", {
        "text-blue-500 font-semibold": isActive,
        "text-gray-500": !isActive,
        [isDarkTheme ? "hover:text-gray-300" : "hover:text-gray-700"]: true,
      })}
      onClick={handleLinkClick}
    >
      {children}
    </Link>
  );

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-200",
        isDarkTheme
          ? "bg-gray-800 border-b border-gray-700"
          : "bg-white border-b border-gray-200"
      )}
    >
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo and Desktop Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={clsx("text-xl font-bold", {
                "text-white": isDarkTheme,
                "text-black": !isDarkTheme,
              })}
            >
              Hostel Harmony
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" isActive={isActive("/")}>
              <FaHome />
              <span>Home</span>
            </NavLink>
            <NavLink to="/meals" isActive={isActive("/meals")}>
              <FaUtensils />
              <span>Meals</span>
            </NavLink>
            <NavLink
              to="/upcoming-meals"
              isActive={isActive("/upcoming-meals")}
            >
              <FaCalendarAlt />
              <span>Upcoming Meals</span>
            </NavLink>
            <FaBell
              className={clsx("cursor-pointer", {
                "text-gray-300": isDarkTheme,
                "text-gray-700": !isDarkTheme,
              })}
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center justify-center gap-2">
            {user ? (
              <div ref={dropdownRef} className="relative">
                {/* Profile Image */}
                <img
                  src={
                    user?.photoURL ||
                    "https://e7.pngegg.com/pngimages/926/34/png-clipart-computer-icons-user-profile-avatar-avatar-face-heroes.png"
                  }
                  alt="Profile"
                  title={user?.displayName}
                  className="w-10 h-10 border-2 border-gray-500 rounded-full cursor-pointer"
                  onClick={toggleDropdown}
                />

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                    <Link
                      to={
                        isAdmin
                          ? "/dashboard/admin-profile"
                          : "/dashboard/my-profile"
                      }
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={logoutUser}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:block">
                <NavLink to="/register" isActive={isActive("/register")}>
                  <FaUserPlus />
                  <span>Join Us</span>
                </NavLink>
              </div>
            )}
            <button
              className="text-gray-500 md:hidden"
              onClick={() => setMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <FiX className="text-2xl" />
              ) : (
                <FiMenu className="text-2xl" />
              )}
            </button>
            {/* Dark Mode Toggle */}
            <div className="hidden md:block">
              <DarkModeToggle
                onChange={toggleTheme}
                checked={isDarkTheme}
                size={80}
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <NavLink to="/" isActive={isActive("/")}>
              <FaHome />
              <span>Home</span>
            </NavLink>
            <NavLink to="/meals" isActive={isActive("/meals")}>
              <FaUtensils />
              <span>Meals</span>
            </NavLink>
            <NavLink
              to="/upcoming-meals"
              isActive={isActive("/upcoming-meals")}
            >
              <FaCalendarAlt />
              <span>Upcoming Meals</span>
            </NavLink>
            <NavLink to="/register" isActive={isActive("/register")}>
              <FaUserPlus />
              <span>Join Us</span>
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
