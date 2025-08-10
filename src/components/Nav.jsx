import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import homeIcon from "../assets/home.svg";
import { useLockBodyScroll } from "@uidotdev/usehooks";
import AuthContext from "../authContext";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import axios from "axios";
import ApiConfig from "../utils/ApiConfig";
import logo from "../assets/logo.svg";
import ReactJoyride from "react-joyride";

const navItems = [
  { item: "FEED", link: "/feed" },
  { item: "OPPORTUNITIES", link: "/opportunities" },
  { item: "CONNECTIONS", link: "/connections" },
  { item: "EVENTS", link: "/events" },
  { item: "BLOGS", link: "/blogs" },
  { item: "BATCHES", link: "/batches" },
];

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [state, setState] = useState({
    run: false,
    steps: [
      {
        target: ".nav",
        content: "Welcome to the M2ConneX, MMCOE's Alumni Portal!",
      },
      {
        target: window.innerWidth > 1024 ? "#desktop-item-list" : "#menutoggle",
        content: "Here are the various features of the portal!",
      },
      {
        target: ".userprofile",
        content: "Click here to view your profile and logout!",
      },
    ],
  });

  useEffect(() => {
    if (
      localStorage.getItem("visited") === "false" ||
      localStorage.getItem("visited") === null
    ) {
      setState((state) => ({ ...state, run: true }));
      localStorage.setItem("visited", "true");
    }
  }, []);

  const [user, setUser] = useState({});
  const dropdownRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  const handleLogout = () => {
    setAuth({ login: false, uid: "", uname: "" });
    localStorage.clear();
    navigate("/");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (!accessToken) {
      navigate("/auth");
    }

    if (accessToken && userId) {
      axios
        .get(ApiConfig.users + "/" + userId + "/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <nav className="nav bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
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
            <div
              id="desktop-item-list"
              className="hidden xl:flex items-center space-x-4"
            >
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

            {/* Profile and Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Profile Section */}
              <Profile
                dropdownRef={dropdownRef}
                user={user}
                toggleVisibility={toggleVisibility}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                handleLogout={handleLogout}
                navigate={navigate}
              />

              {/* Mobile menu button */}
              <div className="xl:hidden" id="menutoggle">
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
        </div>

        {/* Mobile Navigation Menu */}
        <div
          id="mobile-item-list"
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

      <ReactJoyride
        continuous
        hideCloseButton
        run={state.run}
        scrollToFirstStep
        showProgress
        showSkipButton
        steps={state.steps}
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      />
    </>
  );
}

function Profile({
  dropdownRef,
  user,
  toggleVisibility,
  isVisible,
  setIsVisible,
  handleLogout,
  navigate,
}) {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      handleClickOutside(event);
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  return (
    <div className="userprofile relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={toggleVisibility}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        <span className="hidden md:block text-sm font-medium">
          {user.firstName || "User"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isVisible ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isVisible && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                navigate("/profile");
                setIsVisible(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Your Profile
            </button>

            <button
              onClick={() => {
                navigate("/notifications");
                setIsVisible(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM9 3H4a1 1 0 00-1 1v6a1 1 0 001 1h1m0 0h4a1 1 0 001-1V4a1 1 0 00-1-1H9m0 0V3z"
                />
              </svg>
              Notifications
            </button>

            {/* <button
              onClick={() => {
                navigate("/settings");
                setIsVisible(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </button> */}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Nav;
