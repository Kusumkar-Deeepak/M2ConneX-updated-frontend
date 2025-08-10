import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ApiConfig from "../utils/ApiConfig";
import DEPARTMENTS from "../utils/departments";

const PeopleRecommendation = ({ profileUserId, flex = "col" }) => {
  const [people, setPeople] = useState([]);
  const navigate = useNavigate();

  // Temporary raw data for people
  const tempPeopleData = {
    results: [
      {
        id: 1,
        firstName: "Sarah",
        lastName: "Johnson",
        profilePicture:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ46cUUkMFbahT7-v4_Re_i5JNTqI6j4ptdOQ&s",
        bio: "Software Engineer passionate about React and Node.js development",
        cityName: "Mumbai",
        department: "Computer Engineering",
        // mutualConnections: [{ id: 1 }, { id: 2 }],
        // isConnected: "not_connected",
      },
      {
        id: 2,
        firstName: "Michael",
        lastName: "Chen",
        profilePicture:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBvqzyx_zoi6q2c0Gd1XnE7wysD9PGOLe3-A&s",
        bio: "Data Scientist with expertise in Machine Learning and AI",
        cityName: "Pune",
        department: "Information Technology",
        // mutualConnections: [{ id: 3 }],
        // isConnected: "not_connected",
      },
      {
        id: 3,
        firstName: "Emily",
        lastName: "Rodriguez",
        profilePicture:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBvqzyx_zoi6q2c0Gd1XnE7wysD9PGOLe3-A&s",
        bio: "Product Manager focusing on user experience and digital transformation",
        cityName: "Bangalore",
        department: "Electronics and Communication",
        // mutualConnections: [],
        // isConnected: "not_connected",
      },
      {
        id: 4,
        firstName: "David",
        lastName: "Kumar",
        profilePicture:
          "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm0zMjgtMzY2LXRvbmctMDhfMS5qcGc.jpg",
        bio: "DevOps Engineer specializing in cloud infrastructure and automation",
        cityName: "Hyderabad",
        department: "Computer Engineering",
        // mutualConnections: [{ id: 1 }, { id: 2 }, { id: 3 }],
        // isConnected: "pending",
      },
      {
        id: 5,
        firstName: "Priya",
        lastName: "Sharma",
        profilePicture:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw6rKo4oAZitzIx6Y6LB5xPtHKNNuatMHTDw&s",
        bio: "UI/UX Designer creating beautiful and intuitive digital experiences",
        cityName: "Delhi",
        department: "Information Technology",
        // mutualConnections: [{ id: 1 }],
        // isConnected: "not_connected",
      },
      {
        id: 6,
        firstName: "Alex",
        lastName: "Thompson",
        profilePicture:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw6rKo4oAZitzIx6Y6LB5xPtHKNNuatMHTDw&s",
        bio: "Full Stack Developer with passion for modern web technologies",
        cityName: "Chennai",
        department: "Computer Engineering",
        // mutualConnections: [{ id: 2 }, { id: 3 }],
        // isConnected: "not_connected",
      },
    ],
    next: null,
    count: 6,
  };

  console.log("people", people);

  useEffect(() => {
    // Use temporary data instead of API call
    // setPeople(tempPeopleData);

    // Comment out the API call for now
    fetchPeople({ next: null });
  }, []);

  const fetchPeople = ({ next }) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/auth");
    }
    if (next == null) {
      axios
        .get(ApiConfig.recommendedConnection, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          // console.log(res.data.results);
          setPeople(res.data);
        })
        .catch((err) => {
          console.log(err);
          // Fallback to temp data if API fails
          setPeople(tempPeopleData);
        });
    } else {
      axios
        .get(next, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          // console.log(res.data.results);
          setPeople(res.data);
        })
        .catch((err) => {
          console.log(err);
          // Fallback to temp data if API fails
          setPeople(tempPeopleData);
        });
    }
  };

  const handleConnect = (e, person) => {
    e.preventDefault();
    console.log("Connect", person.firstName);

    // For demo purposes, update the local state
    setPeople((prevPeople) => ({
      ...prevPeople,
      results: prevPeople.results.map((p) =>
        p.id === person.id ? { ...p, isConnected: "pending" } : p
      ),
    }));

    // Comment out API call for now

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/auth");
    }

    axios
      .post(
        ApiConfig.connectionRequest,
        {
          userB: person.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        fetchPeople({ next: null });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="suggestions-and-more h-full flex flex-col max-md:w-full max-lg:pb-0 lg:w-full self-start">
      <div className="suggestions rounded-xl bg-white flex flex-col drop-shadow-sm shadow-sm border border-gray-200 p-6 gap-y-6 w-full h-full lg:w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            You may also know
          </h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            See all
          </button>
        </div>
        <div
          className={`flex flex-${flex} w-full h-full ${
            flex == "wrap" && "justify-start items-start"
          }`}
        >
          {people.results &&
            people.results
              .filter((person) => person.id != profileUserId)
              .slice(0, flex === "col" ? 4 : 6) // Limit display for better UX
              .map((person, index) => (
                <div
                  className={`flex flex-${flex} h-full ${
                    flex == "wrap"
                      ? "lg:w-[48%] md:w-[48%] sm:w-full max-sm:w-full p-2"
                      : "lg:w-full py-3"
                  }`}
                  key={person.id}
                >
                  <div
                    className={`flex flex-${
                      flex == "col" ? "row" : "col"
                    } gap-x-4 w-full ${
                      flex == "wrap" &&
                      "rounded-lg border border-gray-200 p-4 h-[18rem] justify-between items-center hover:shadow-md transition-shadow duration-200"
                    }`}
                  >
                    <div
                      className={`${
                        flex == "col"
                          ? "w-[50px] h-[50px]"
                          : "max-w-[80px] h-[80px] border border-gray-200"
                      } rounded-full cursor-pointer flex flex-row items-center justify-center overflow-hidden ${
                        flex == "wrap" && "justify-center items-center"
                      }`}
                      onClick={() => {
                        navigate("/users/" + person.id);
                        window.location.reload();
                      }}
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
                        flex == "wrap" && "justify-between items-center"
                      }`}
                    >
                      <div
                        className={`flex flex-col ${
                          flex == "wrap" &&
                          "justify-between items-center w-full mt-3"
                        }`}
                      >
                        <span
                          className={`font-semibold text-sm cursor-pointer hover:text-blue-600 transition-colors duration-200 ${
                            flex == "wrap" ? "text-center" : ""
                          }`}
                          onClick={() => {
                            navigate("/users/" + person.id);
                            window.location.reload();
                          }}
                        >
                          {person.firstName} {person.lastName}
                        </span>
                        <p
                          className={`text-gray-500 text-xs mt-1 cursor-pointer ${
                            flex == "wrap" &&
                            "flex justify-center items-center w-full text-center mt-2"
                          }`}
                          onClick={() => {
                            navigate("/users/" + person.id);
                            window.location.reload();
                          }}
                        >
                          {person.bio &&
                            person.bio.slice(0, flex === "col" ? 50 : 80) +
                              (person.bio.length > (flex === "col" ? 50 : 80)
                                ? "..."
                                : "")}
                          {!person.bio &&
                            person.department &&
                            "Department of " + DEPARTMENTS[person.department]}
                          {!person.bio &&
                            !person.department &&
                            "Alumni Portal User"}
                        </p>
                        {person.cityName && (
                          <p
                            className={`text-gray-400 text-xs mt-1 ${
                              flex == "wrap" ? "text-center" : ""
                            }`}
                          >
                            <i className="fas fa-map-marker-alt mr-1"></i>
                            {person.cityName}
                          </p>
                        )}
                      </div>
                      {/* <div
                        className={`flex mt-3 ${
                          flex == "wrap" ? "w-full justify-center" : ""
                        }`}
                      >
                        {person.isConnected == "not_connected" && (
                          <button
                            key={person.id}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                            onClick={(e) => {
                              handleConnect(e, person);
                            }}
                          >
                            <i className="fas fa-user-plus mr-2"></i>
                            Connect
                          </button>
                        )}
                        {person.isConnected == "pending" && (
                          <button
                            key={person.id}
                            className="bg-gray-200 text-gray-600 text-xs font-medium px-4 py-2 rounded-lg cursor-not-allowed flex items-center"
                            disabled
                          >
                            <i className="fas fa-check mr-2"></i>
                            Requested
                          </button>
                        )}
                        {person.isConnected == "connected" && (
                          <button
                            key={person.id}
                            className="bg-green-100 text-green-700 text-xs font-medium px-4 py-2 rounded-lg cursor-default flex items-center"
                            disabled
                          >
                            <i className="fas fa-check mr-2"></i>
                            Connected
                          </button>
                        )}
                      </div> */}
                    </div>
                  </div>
                  {index !=
                    people.results
                      .filter((p) => p.id != profileUserId)
                      .slice(0, flex === "col" ? 4 : 6).length -
                      1 &&
                    flex == "col" && (
                      <hr className="w-full h-[1px] border-gray-200 mx-auto mt-3" />
                    )}
                </div>
              ))}

          {/* Show more button for mobile/tablet */}
          {flex === "col" && people.results && people.results.length > 4 && (
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
    </div>
  );
};

export default PeopleRecommendation;
