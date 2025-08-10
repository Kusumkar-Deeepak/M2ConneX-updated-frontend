import React, { useContext, useState, useRef } from "react";
import aPlusPlus from "../assets/naac.png";
import NBA from "../assets/nba.png";
import homeIcon from "../assets/home.svg";
import { NavLink, Link } from "react-router-dom";
import CollegeInfo from "./CollegeInfo";
import Navbar from "./Navbar";
import AuthContext from "../authContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import ApiConfig from "../utils/ApiConfig";
import Nav from "./Nav";

const Head = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const dropdownRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (!accessToken) {
      navigate("/");
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
      {auth.login ? (
        <Nav />
      ) : (
        <Navbar />
      )}
    </>
  );
};

export default Head;