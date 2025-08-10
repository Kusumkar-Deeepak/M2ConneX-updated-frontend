import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ApiConfig from "../utils/ApiConfig";
import DEPARTMENTS from "../utils/departments";

const PeopleRecommendation = ({ profileUserId, flex = "col" }) => {
  const [people, setPeople] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/auth");
      return;
    }
    axios
      .get(ApiConfig.recommendedConnection, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        setPeople(res.data.results || []);
      })
      .catch(() => {
        setPeople([]);
      });
  };

  return (
    <div className="suggestions-and-more h-full flex flex-col max-md:w-full max-lg:pb-0 lg:w-full self-start">
      <div className="suggestions rounded-xl bg-white flex flex-col drop-shadow-sm shadow-sm border border-gray-200 p-6 gap-y-6 w-full h-full lg:w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            You may also know
          </h3>
          <button
            onClick={() => navigate("/people")}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            See all
          </button>
        </div>
        <div
          className={`flex flex-${flex} w-full h-full ${
            flex === "wrap" ? "justify-start items-start" : ""
          }`}
        >
          {people
            .filter((person) => person.id !== profileUserId)
            .slice(0, flex === "col" ? 4 : 6)
            .map((person, index) => (
              <div
                className={`flex flex-${flex} h-full ${
                  flex === "wrap"
                    ? "lg:w-[48%] md:w-[48%] sm:w-full max-sm:w-full p-2"
                    : "lg:w-full py-3"
                }`}
                key={person.id}
              >
                <div
                  className={`flex flex-${
                    flex === "col" ? "row" : "col"
                  } gap-x-4 w-full ${
                    flex === "wrap"
                      ? "rounded-lg border border-gray-200 p-4 h-[18rem] justify-between items-center hover:shadow-md transition-shadow duration-200"
                      : ""
                  }`}
                >
                  <div
                    className={`${
                      flex === "col"
                        ? "w-[50px] h-[50px]"
                        : "max-w-[80px] h-[80px] border border-gray-200"
                    } rounded-full cursor-pointer flex flex-row items-center justify-center overflow-hidden ${
                      flex === "wrap" ? "justify-center items-center" : ""
                    }`}
                    onClick={() => navigate("/users/" + person.id)}
                  >
                    {person.profilePicture ? (
                      <img
                        src={person.profilePicture}
                        alt={`${person.firstName} ${person.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <i className="fas fa-user text-gray-600 text-xl"></i>
                      </div>
                    )}
                  </div>
                  <div
                    className={`flex flex-col items-left w-full h-full ${
                      flex === "wrap" ? "justify-between items-center" : ""
                    }`}
                  >
                    <div
                      className={`flex flex-col ${
                        flex === "wrap"
                          ? "justify-between items-center w-full mt-3"
                          : ""
                      }`}
                    >
                      <span
                        className={`font-semibold text-sm cursor-pointer hover:text-blue-600 transition-colors duration-200 ${
                          flex === "wrap" ? "text-center" : ""
                        }`}
                        onClick={() => navigate("/users/" + person.id)}
                      >
                        {person.firstName} {person.lastName}
                      </span>
                      <p
                        className={`text-gray-500 text-xs mt-1 cursor-pointer ${
                          flex === "wrap"
                            ? "flex justify-center items-center w-full text-center mt-2"
                            : ""
                        }`}
                        onClick={() => navigate("/users/" + person.id)}
                      >
                        {person.bio
                          ? person.bio.slice(0, flex === "col" ? 50 : 80) +
                            (person.bio.length > (flex === "col" ? 50 : 80)
                              ? "..."
                              : "")
                          : person.department
                          ? "Department of " + DEPARTMENTS[person.department]
                          : "Alumni Portal User"}
                      </p>
                      {person.cityName && (
                        <p
                          className={`text-gray-400 text-xs mt-1 ${
                            flex === "wrap" ? "text-center" : ""
                          }`}
                        >
                          <i className="fas fa-map-marker-alt mr-1"></i>
                          {person.cityName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {index !==
                  people
                    .filter((p) => p.id !== profileUserId)
                    .slice(0, flex === "col" ? 4 : 6).length -
                    1 &&
                  flex === "col" && (
                    <hr className="w-full h-[1px] border-gray-200 mx-auto mt-3" />
                  )}
              </div>
            ))}
        </div>
        {flex === "col" && people.length > 4 && (
          <div className="w-full pt-4 border-t border-gray-200">
            <button
              className="w-full text-center py-2 text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 rounded-lg transition-colors duration-200"
              onClick={() => navigate("/people")}
            >
              Show more suggestions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeopleRecommendation;
