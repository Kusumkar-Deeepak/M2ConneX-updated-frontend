import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ApiConfig from "../utils/ApiConfig";
import DEPARTMENTS from "../utils/departments";

const PeopleRecommendation = ({ onPeopleLoaded, profileUserId, flex = "col" }) => {
  const [people, setPeople] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
          setPeople(res.data);
          if (onPeopleLoaded) onPeopleLoaded(res.data.results); // <-- Send all people up
        })
        .catch((err) => {
          setPeople(tempPeopleData);
          if (onPeopleLoaded) onPeopleLoaded(tempPeopleData.results);
        });
    } else {
      axios
        .get(next, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setPeople(res.data);
          if (onPeopleLoaded) onPeopleLoaded(res.data.results); // <-- Send all people up
        })
        .catch((err) => {
          setPeople(tempPeopleData);
          if (onPeopleLoaded) onPeopleLoaded(tempPeopleData.results);
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

  // Don't render anything here for /people page
  return null;
};

export default PeopleRecommendation;
