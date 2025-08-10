import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";

const navItems = [
  { item: "FEED", link: "/feed" },
  { item: "OPPORTUNITIES", link: "/opportunities" },
  { item: "CONNECTIONS", link: "/connections" },
  { item: "EVENTS", link: "/events" },
  { item: "BLOGS", link: "/blogs" },
  { item: "BATCHES", link: "/batches" },
  { item: "DIRECTORY", link: "/directory" },
  { item: "DONATIONS", link: "/donations" },
  { item: "FEEDBACK", link: "/feedback" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigate = () => {
    navigate("/auth");
    setIsOpen(false);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img src={logo} alt="M2ConneX" className="h-10 w-auto" />
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center space-x-4">
              {navItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.link}
                  className={({ isActive }) =>
                    `relative text-xs font-medium tracking-wide transition-all duration-300 py-4 px-2 ${
                      isActive
                        ? "text-gray-900"
                        : "text-gray-700 hover:text-gray-900"
                    } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:transition-all after:duration-300 ${
                      isActive
                        ? "after:bg-blue-500 after:scale-x-100"
                        : "after:bg-gray-300 after:scale-x-0 hover:after:scale-x-100"
                    }`
                  }
                >
                  {item.item}
                </NavLink>
              ))}
            </div>

            {/* Sign In Button - Desktop */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => navigate("/auth")}
                className="text-xs font-medium text-gray-700 hover:text-gray-900 tracking-wide transition-all duration-300 px-4 py-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200"
              >
                SIGN IN
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="xl:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {/* Menu icon */}
                <svg
                  className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`xl:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-4 pt-2 pb-6 space-y-1 bg-white border-t border-gray-200 shadow-lg">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.link}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 text-xs font-medium tracking-wide transition-all duration-200 rounded-lg ${
                    isActive
                      ? "text-blue-600 bg-blue-50 border-l-4 border-blue-500"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  }`
                }
              >
                {item.item}
              </NavLink>
            ))}

            {/* Mobile Sign In Button */}
            <div className="pt-3 mt-3 border-t border-gray-200">
              <button
                onClick={handleNavigate}
                className="w-full text-center px-3 py-2 text-xs font-medium text-black bg-blue-600 hover:bg-blue-700 tracking-wide transition-all duration-200 rounded-lg"
              >
                SIGN IN
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Navbar;
