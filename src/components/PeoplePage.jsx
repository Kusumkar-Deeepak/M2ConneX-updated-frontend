import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaMapMarkerAlt } from "react-icons/fa";
import DEPARTMENTS from "../utils/departments";
import ApiConfig from "../utils/ApiConfig";

const PeoplePage = () => {
  const [allPeople, setAllPeople] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
        setAllPeople(res.data.results || []);
      })
      .catch((err) => {
        setAllPeople([]);
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f2ee] to-[#e9e7ef] flex justify-center items-start py-6 px-2">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-8 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 text-center tracking-tight">
          People You May Know
        </h1>
        <p className="text-center text-gray-500 mb-8 text-base">
          Expand your network by connecting with alumni and professionals.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {allPeople.map((person) => (
            <div
              key={person.id}
              className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col items-center hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => navigate(`/users/${person.id}`)}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-3">
                {person.profilePicture ? (
                  <img
                    src={person.profilePicture}
                    alt={`${person.firstName} ${person.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-gray-400 text-3xl" />
                )}
              </div>
              <div className="text-center">
                <h2 className="font-semibold text-lg text-gray-900">
                  {person.firstName} {person.lastName}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {person.bio
                    ? person.bio.slice(0, 60) +
                      (person.bio.length > 60 ? "..." : "")
                    : "Alumni Portal User"}
                </p>
                {person.department && (
                  <p className="text-blue-500 text-xs mt-2">
                    {DEPARTMENTS[person.department] || person.department}
                  </p>
                )}
                {person.cityName && (
                  <p className="text-gray-400 text-xs mt-2 flex items-center justify-center">
                    <FaMapMarkerAlt className="mr-1" />
                    {person.cityName}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeoplePage;
