import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ApiConfig from "../utils/ApiConfig";
import DEPARTMENTS from "../utils/departments";
import formatDate from "../utils/date";
import { EXPERIENCE } from "../utils/skills";
import PeopleRecommendation from "../components/PeopleRecommendation";
import { ToastContainer, toast } from "react-toastify";

export default function UserProfile() {
  const [user, setUser] = useState({});
  const [updateUser, setUpdateUser] = useState({});
  const [showContactModal, setShowContactModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showExperienceEditModal, setShowExperienceEditModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showSkillEditModal, setShowSkillEditModal] = useState(false);

  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [citySearch, setCitySearch] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [isSkillDropDownOpen, setIsSkillDropDownOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({});
  const [newSkillEdit, setNewSkillEdit] = useState({});
  const [newExperience, setNewExperience] = useState({});
  const [newExperienceEdit, setNewExperienceEdit] = useState({});

  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState({
    total: {},
    weekly: {},
    monthly: {},
  });
  const [userActivity, setUserActivity] = useState({});
  const [userExperience, setUserExperience] = useState({});
  const [userSkills, setUserSkills] = useState({});

  const navigate = useNavigate();

  const getDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.ceil(diffDays / 30);
    return diffMonths;
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    if (!accessToken) {
      navigate("/auth");
    }

    axios
      .get(ApiConfig.users + "/" + userId + "/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
        setUpdateUser(res.data);
        document.title = res.data.firstName
          ? res.data.firstName + " " + res.data.lastName + " | " + "Profile"
          : "Profile";
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(ApiConfig.profileAnalytics, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setAnalytics(res.data);
        var feedRelated = 0;
        for (let key in res.data.total) {
          if (key.startsWith("feed")) {
            feedRelated += res.data.total[key];
          }
        }
        setAnalytics({
          ...res.data,
          total: {
            ...res.data.total,
            feedImpressions: feedRelated,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });

    fetchUserActivity({ next: null });
    fetchUserExperience({ next: null });
    fetchUserSkills({ next: null });
  }, []);

  const fetchUserActivity = ({ next }) => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    if (!accessToken) {
      navigate("/auth");
    }
    if (next == null) {
      axios
        .get(ApiConfig.userActivity + "/" + userId + "/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setUserActivity(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    }
    axios
      .get(next, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        // console.log(res.data);
        setUserActivity((prevActivity) => {
          return {
            ...res.data,
            results: [...prevActivity.results, ...res.data.results],
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUserExperience = ({ next }) => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    if (!accessToken) {
      navigate("/auth");
    }

    if (next == null) {
      axios
        .get(ApiConfig.userExperience + "/" + userId + "/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setUserExperience(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    }
    axios
      .get(next, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setUserExperience((prevExperience) => {
          return {
            ...res.data,
            results: [...prevExperience.results, ...res.data.results],
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUserSkills = ({ next }) => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    if (!accessToken) {
      navigate("/auth");
    }

    if (next == null) {
      axios
        .get(ApiConfig.userSkillsByUser + "/" + userId + "/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setUserSkills(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    }
    axios
      .get(next, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setUserSkills((prevSkills) => {
          return {
            ...res.data,
            results: [...prevSkills.results, ...res.data.results],
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const fetchCities = async ({ search = "" }) => {
  //   const accessToken = localStorage.getItem("accessToken");
  //   if (accessToken === null) {
  //     navigate("/login");
  //   }
  //   if (search != "") {
  //     axios
  //       .get(ApiConfig.cities + "?search=" + search, {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       })
  //       .then((res) => {
  //         setCities(res.data);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //     return;
  //   }
  //   axios
  //     .get(ApiConfig.cities, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     })
  //     .then((res) => {
  //       setCities(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const fetchCities = async ({ search = "" }) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken === null) {
      navigate("/login");
    }

    try {
      let url = ApiConfig.cities;
      if (search !== "") {
        url = `${ApiConfig.cities}?search=${search}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("city response + ", response.data);
      setCities(response.data.results || response.data);
    } catch (err) {
      console.log(err);
      setCities([]);
    }
  };

  const fetchSkills = async ({ search = "" }) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken === null) {
      navigate("/login");
    }
    if (search != "") {
      axios
        .get(ApiConfig.skills + "?search=" + search, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setSkills(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    }
    axios
      .get(ApiConfig.skills, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setSkills(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    if (!accessToken) {
      navigate("/auth");
    }
  };

  const handleEditProfile = () => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    if (!accessToken) {
      navigate("/auth");
    }
    axios
      .patch(ApiConfig.users + "/" + userId + "/", updateUser, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setUser(res.data);
        setShowProfileModal(false);
        toast.success("Profile Updated Successfully", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditExperience = ({ id = null }) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/auth");
    }
    if (id != null) {
      axios
        .patch(ApiConfig.experience + "/" + id + "/", newExperienceEdit, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          fetchUserExperience({ next: null });
          setShowExperienceEditModal(false);
          toast.success("Experience Updated Successfully", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    }
    axios
      .post(ApiConfig.experience + "/", newExperience, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        fetchUserExperience({ next: null });
        setShowExperienceModal(false);
        toast.success("Experience Added Successfully", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditSkill = ({ id = null }) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/auth");
    }
    if (id != null) {
      axios
        .patch(ApiConfig.userSkills + "/" + id + "/", newSkillEdit, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          fetchUserSkills({ next: null });
          setShowSkillEditModal(false);
          toast.success("Skill Updated Successfully", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    }
    axios
      .post(ApiConfig.userSkills + "/", newSkill, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        fetchUserSkills({ next: null });
        setShowSkillsModal(false);
        toast.success("Skill Added Successfully", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.detail == "Skill already exists") {
          toast.error("Skill Already Exists", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="flex bg-[#f4f2ee] justify-center flex-col md:items-start items-center md:flex-row md:gap-x-4 lg:w-full lg:gap-x-4">
        <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header Card */}
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden mt-6 mb-6">
            {/* Cover Photo Section */}
            <div className="h-32 sm:h-40 lg:h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <button
                className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-300 group"
                onClick={() => {
                  document.title = "Edit Profile | MMCOE Alumni Portal";
                  setShowProfileModal(true);
                }}
              >
                <i className="fas fa-edit text-gray-700 group-hover:text-blue-600 transition-colors duration-300"></i>
              </button>
            </div>

            {/* Profile Content */}
            <div className="relative px-6 sm:px-8 pb-8">
              {/* Profile Picture */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 mb-6">
                <div className="relative group">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <i className="fas fa-user text-4xl sm:text-5xl lg:text-6xl text-gray-500"></i>
                      </div>
                    )}
                  </div>

                  {/* Profile Picture Edit Overlay */}
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                    onClick={() => setShowProfileModal(true)}
                  >
                    <i className="fas fa-camera text-white text-xl"></i>
                  </div>
                </div>

                {/* Action Buttons - Mobile and Desktop */}
                <div className="flex flex-wrap gap-3 mt-4 sm:mt-0 sm:ml-auto">
                  {/* <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-gray-500 border border-black px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <i className="fas fa-plus text-sm"></i>
                    <span className="hidden sm:inline">Connect</span>
                  </button>
                  <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <i className="fas fa-envelope text-sm"></i>
                    <span className="hidden sm:inline">Message</span>
                  </button> */}
                  <button
                    onClick={() => {
                      document.title = "Edit Profile | MMCOE Alumni Portal";
                      setShowProfileModal(true);
                    }}
                    className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <i className="fas fa-ellipsis-h text-sm"></i>
                  </button>
                </div>
              </div>

              {/* User Information */}
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {user.firstName} {user.lastName}
                </h1>

                {user.bio && (
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-3 max-w-2xl">
                    {user.bio}
                  </p>
                )}

                {/* Professional Info */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 mb-4">
                  {user.department && (
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <i className="fas fa-graduation-cap text-blue-500"></i>
                      <span className="font-medium">
                        {DEPARTMENTS[user.department]}
                      </span>
                    </div>
                  )}

                  {user.cityName && (
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <i className="fas fa-map-marker-alt text-red-500"></i>
                      <span>{user.cityName}</span>
                    </div>
                  )}
                </div>

                {/* Contact Info and Connections */}
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 text-sm">
                  <button
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-300"
                    onClick={() => setShowContactModal(true)}
                  >
                    <i className="fas fa-info-circle mr-1"></i>
                    Contact info
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">•</span>
                    <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-300">
                      <i className="fas fa-users mr-1"></i>
                      {user.connections || 0} connections
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Analytics
              </h2>
              <div className="flex items-center gap-2 text-gray-500">
                <i className="fas fa-eye text-sm"></i>
                <span className="text-sm">Private to you</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Profile Views */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-eye text-white text-lg"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Profile Views
                    </h3>
                    <p className="text-xs text-gray-600">Last 90 days</p>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {analytics?.total?.["profile visit"] || 0}
                </p>
              </div>

              {/* Post Impressions */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-md transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-chart-line text-white text-lg"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Post Impressions
                    </h3>
                    <p className="text-xs text-gray-600">Last 90 days</p>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  {analytics?.total?.feedImpressions || 0}
                </p>
              </div>

              {/* Search Appearances */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 hover:shadow-md transition-all duration-300 transform hover:scale-105 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-search text-white text-lg"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Search Appearances
                    </h3>
                    <p className="text-xs text-gray-600">Last 90 days</p>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                  {analytics?.total?.search || 0}
                </p>
              </div>
            </div>

            <button className="w-full mt-6 py-3 text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition-colors duration-300 border border-blue-200 hover:border-blue-300">
              Show all analytics
              <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                About
              </h2>
              <button
                className="text-gray-500 hover:text-blue-600 transition-colors duration-300"
                onClick={() => setShowProfileModal(true)}
              >
                <i className="fas fa-edit text-lg"></i>
              </button>
            </div>

            <div className="prose max-w-none">
              {user.bio ? (
                <p className="text-gray-700 leading-relaxed">{user.bio}</p>
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-user-edit text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500 mb-4">
                    Share something about yourself
                  </p>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
                    onClick={() => setShowProfileModal(true)}
                  >
                    Add Bio
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Resume Section */}
          {user.resume && (
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Resume
                </h2>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-file-pdf text-white text-lg"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Resume.pdf</h3>
                  <p className="text-sm text-gray-600">
                    Click to view or download
                  </p>
                </div>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                  onClick={() => window.open(user.resume, "_blank")}
                >
                  <i className="fas fa-external-link-alt mr-2"></i>
                  View
                </button>
              </div>
            </div>
          )}

          {/* Activity Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Recent Activity
              </h2>
              <span className="text-sm text-gray-500">
                {userActivity?.results?.length || 0} activities
              </span>
            </div>

            <div className="space-y-4">
              {userActivity.results && userActivity.results.length > 0 ? (
                userActivity.results.slice(0, 3).map((act, index) => (
                  <div
                    key={act.id}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-300 group"
                    onClick={() =>
                      navigate(
                        act.type === "feed"
                          ? `/feed/${act.data.id}`
                          : `/feed/${act.data.feed}`
                      )
                    }
                  >
                    <div className="flex-shrink-0">
                      {act.type === "feed" ? (
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                          <i className="fas fa-pen text-white"></i>
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                          <i
                            className={`fas ${
                              act.data.action === "LIKE"
                                ? "fa-thumbs-up"
                                : act.data.action === "COMMENT"
                                ? "fa-comment"
                                : "fa-share"
                            } text-white`}
                          ></i>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <span className="text-sm text-gray-500">
                          {act.type === "feed"
                            ? "posted"
                            : act.data.action === "LIKE"
                            ? "liked"
                            : act.data.action === "COMMENT"
                            ? "commented on"
                            : "shared"}
                        </span>
                        <span className="text-sm text-gray-400">
                          •{" "}
                          {formatDate(
                            act.type === "feed"
                              ? act.data.createdAt
                              : act.data.createdAt
                          )}
                        </span>
                      </div>

                      <h3 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                        #
                        {act.type === "feed"
                          ? act.data.subject.split(";").slice(0, 3).join(", #")
                          : act.data.feedName
                              .split(";")
                              .slice(0, 3)
                              .join(", #")}
                      </h3>

                      <p className="text-gray-600 text-sm line-clamp-2">
                        {act.type === "feed"
                          ? act.data.body.slice(0, 100) +
                            (act.data.body.length > 100 ? "..." : "")
                          : act.data.feedBody.slice(0, 100) +
                            (act.data.feedBody.length > 100 ? "..." : "")}
                      </p>

                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <i className="fas fa-thumbs-up"></i>
                          {act.type === "feed"
                            ? act.data.likesCount
                            : act.data.feedLikesCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="fas fa-comment"></i>
                          {act.type === "feed"
                            ? act.data.commentsCount
                            : act.data.feedCommentsCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="fas fa-share"></i>
                          {act.type === "feed" ? act.data.sharesCount : 0}
                        </span>
                      </div>
                    </div>

                    {act.type === "feed" && act.data.images?.[0]?.image && (
                      <div className="flex-shrink-0">
                        <img
                          src={act.data.images[0].image}
                          alt="Post"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <i className="fas fa-chart-line text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500 mb-4">No recent activity</p>
                  <p className="text-sm text-gray-400">
                    Start posting to see your activity here
                  </p>
                </div>
              )}
            </div>

            {userActivity.next && (
              <button
                className="w-full mt-6 py-3 text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition-colors duration-300 border border-blue-200 hover:border-blue-300"
                onClick={() => fetchUserActivity({ next: userActivity.next })}
              >
                Load more activity
                <i className="fas fa-arrow-down ml-2"></i>
              </button>
            )}
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Experience
              </h2>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                onClick={() => {
                  document.title = "Add Experience | MMCOE Alumni Portal";
                  setShowExperienceModal(true);
                }}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>

            <div className="space-y-6">
              {userExperience.results && userExperience.results.length > 0 ? (
                userExperience.results.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-300 group"
                    onClick={() => {
                      setShowExperienceEditModal(true);
                      setNewExperienceEdit(exp);
                    }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                        <i className="fas fa-briefcase text-white"></i>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                            {exp.designation}
                          </h3>
                          <p className="text-gray-700 font-medium">
                            {exp.company}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {exp.startDate} -{" "}
                            {exp.isCurrent ? "Present" : exp.endDate}
                            <span className="mx-2">•</span>
                            {exp.isCurrent
                              ? getDuration(exp.startDate, Date.now())
                              : getDuration(exp.startDate, exp.endDate)}{" "}
                            months
                          </p>
                          {exp.description && (
                            <p className="text-gray-600 mt-2 line-clamp-2">
                              {exp.description.slice(0, 150)}
                              {exp.description.length > 150 && "..."}
                            </p>
                          )}
                        </div>
                        <button className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <i className="fas fa-edit"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <i className="fas fa-briefcase text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500 mb-4">No experience added yet</p>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-gray-500 border border-black px-6 py-2 rounded-lg font-medium transition-colors duration-300"
                    onClick={() => setShowExperienceModal(true)}
                  >
                    Add Experience
                  </button>
                </div>
              )}
            </div>

            {userExperience.next && (
              <button
                className="w-full mt-6 py-3 text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition-colors duration-300 border border-blue-200 hover:border-blue-300"
                onClick={() =>
                  fetchUserExperience({ next: userExperience.next })
                }
              >
                Load more experiences
                <i className="fas fa-arrow-down ml-2"></i>
              </button>
            )}
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Skills
              </h2>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                onClick={() => {
                  document.title = "Add Skill | MMCOE Alumni Portal";
                  setShowSkillsModal(true);
                }}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userSkills.results && userSkills.results.length > 0 ? (
                userSkills.results.map((skill, index) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-300 group"
                    onClick={() => {
                      setShowSkillEditModal(true);
                      setNewSkillEdit(skill);
                      setSkillSearch(skill.skillName);
                    }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-star text-white text-sm"></i>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {skill.skillName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {EXPERIENCE[skill.experience]}
                      </p>
                    </div>

                    <button className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <i className="fas fa-edit text-sm"></i>
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <i className="fas fa-star text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500 mb-4">No skills added yet</p>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-gray-500 border border-black px-6 py-2 rounded-lg font-medium transition-colors duration-300"
                    onClick={() => setShowSkillsModal(true)}
                  >
                    Add Skills
                  </button>
                </div>
              )}
            </div>

            {userSkills.next && (
              <button
                className="w-full mt-6 py-3 text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition-colors duration-300 border border-blue-200 hover:border-blue-300"
                onClick={() => fetchUserSkills({ next: userSkills.next })}
              >
                Load more skills
                <i className="fas fa-arrow-down ml-2"></i>
              </button>
            )}
          </div>
        </div>

        {/* Contact Info Modal */}
        {showContactModal && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center z-50"
            onClick={() => setShowContactModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Contact Information
                </h3>
                <button
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
                  onClick={() => setShowContactModal(false)}
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <div className="space-y-6">
                {/* Name */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-user text-blue-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-envelope text-green-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-semibold text-gray-900">
                      {user.email || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-phone text-purple-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-semibold text-gray-900">
                      {user.phoneNumber || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Location */}
                {user.cityName && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-map-marker-alt text-red-600"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold text-gray-900">
                        {user.cityName}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-300"
                  onClick={() => setShowContactModal(false)}
                >
                  Close
                </button>
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors duration-300"
                  onClick={() => {
                    setShowContactModal(false);
                    setShowProfileModal(true);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col w-1/4 max-w-1/4 md:w-1/4 md:mt-8 md:mr-8">
          {window.innerWidth > 768 && <PeopleRecommendation />}
        </div>
      </div>

      {showModal ? (
        <>
          <div
            className="fixed inset-0 bg-black opacity-60 z-40"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative mx-auto w-1/2">
              <div className="border-0 mt-64 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-center justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-2xl font=semibold">Update Data</h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => {
                      setShowModal(false);
                      setUpdateUser({ ...user });
                    }}
                  >
                    <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                      <i className="fa-solid fa-xmark"></i>
                    </span>
                  </button>
                </div>
                <div className="">
                  <form className="rounded w-full" onSubmit={handleSubmit}>
                    <div className="flex flex-col justify-between pt-4 px-4">
                      <label htmlFor="firstName" className="text-sm">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        className="border-2 border-gray-300 rounded-md p-2"
                        value={updateUser.firstName}
                        onChange={(e) => {
                          setUpdateUser({
                            ...updateUser,
                            firstName: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="flex flex-col justify-between pt-4 px-4">
                      <label htmlFor="lastName" className="text-sm">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        className="border-2 border-gray-300 rounded-md p-2"
                        value={updateUser.lastName}
                        onChange={(e) => {
                          setUpdateUser({
                            ...updateUser,
                            lastName: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="flex flex-col justify-between pt-4 px-4">
                      <label htmlFor="email" className="text-sm">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="border-2 border-gray-300 rounded-md p-2"
                        value={updateUser.email}
                        onChange={(e) => {
                          setUpdateUser({
                            ...updateUser,
                            email: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="flex flex-col justify-between pt-4 px-4">
                      <label htmlFor="department" className="text-sm">
                        Department
                      </label>
                      <input
                        type="text"
                        name="department"
                        id="department"
                        className="border-2 border-gray-300 rounded-md p-2"
                        value={updateUser.department}
                        onChange={(e) => {
                          setUpdateUser({
                            ...updateUser,
                            department: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="flex flex-col justify-between pt-4 px-4">
                      <label htmlFor="bio" className="text-sm">
                        Bio
                      </label>
                      <input
                        type="text"
                        name="bio"
                        id="bio"
                        className="border-2 border-gray-300 rounded-md p-2"
                        value={updateUser.bio}
                        onChange={(e) => {
                          setUpdateUser({ ...updateUser, bio: e.target.value });
                        }}
                      />
                    </div>
                    <div className="flex flex-col justify-between pt-4 px-4">
                      <label htmlFor="resume" className="text-sm">
                        Resume
                      </label>
                      <input
                        type="text"
                        name="resume"
                        id="resume"
                        className="border-2 border-gray-300 rounded-md p-2"
                        value={updateUser.resume}
                        onChange={(e) => {
                          setUpdateUser({
                            ...updateUser,
                            resume: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="flex flex-col justify-between pt-4 px-4">
                      <label htmlFor="profilePicture" className="text-sm">
                        Profile Picture
                      </label>
                      <input
                        type="text"
                        name="profilePicture"
                        id="profilePicture"
                        className="border-2 border-gray-300 rounded-md p-2"
                        value={updateUser.profilePicture}
                        onChange={(e) => {
                          setUpdateUser({
                            ...updateUser,
                            profilePicture: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="flex flex-col justify-between pt-4 px-4">
                      <label htmlFor="city" className="text-sm">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        className="border-2 border-gray-300 rounded-md p-2"
                        value={updateUser.city}
                        onChange={(e) => {
                          setUpdateUser({
                            ...updateUser,
                            city: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="flex flex-col justify-between p-4">
                      <label htmlFor="phoneNumber" className="text-sm">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        className="border-2 border-gray-300 rounded-md p-2"
                        value={updateUser.phoneNumber}
                        onChange={(e) => {
                          setUpdateUser({
                            ...updateUser,
                            phoneNumber: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </form>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <p className="text-red font-bold self-start">{error}</p>
                  <button
                    className="background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setUpdateUser({ ...user });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-primary  w-[5rem] h-[2rem] uppercase text-sm font-bold rounded"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {showProfileModal ? (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center z-50"
          onClick={() => {
            setShowProfileModal(false);
          }}
        >
          <div
            className="flex flex-col items-start justify-start w-[65%] h-[95%] bg-white border border-gray rounded-lg shadow-sm drop-shadow-sm z-60"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="flex flex-row items-center justify-between w-full p-5 border-b border-solid border-gray-300 rounded-t">
              <h3 className="text-2xl font=semibold">Edit Profile</h3>
              <button
                className="bg-transparent border-0 text-black float-right"
                onClick={() => setShowProfileModal(false)}
              >
                <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                  <i className="fa-solid fa-xmark"></i>
                </span>
              </button>
            </div>
            <div className="flex flex-col px-4 gap-y-4 w-full h-full overflow-y-scroll">
              <p className="mt-4 text-xl font-semibold">Basic Info</p>
              <div className="flex flex-row justify-center w-full max-sm:flex-wrap sm:max-lg:flex-wrap gap-y-2 gap-x-8 lg:flex-row">
                <div
                  className="flex flex-col items-center gap-y-2"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {updateUser.profilePicture ? (
                    <img
                      src={updateUser.profilePicture}
                      alt=""
                      className="w-48 h-48 rounded-full border-4 border-black max-sm:w-24 max-sm:h-24 sm:max-lg:w-48 sm:max-lg:h-48 lg:w-48 lg:h-48"
                    />
                  ) : (
                    <i className="fas fa-user-circle text-9xl w-48 h-48 rounded-full border-4 border-black flex flex-col justify-center items-center max-sm:w-24 max-sm:h-24 max-sm:text-7xl sm:max-lg:w-48 sm:max-lg:h-48 sm:max-lg:text-9xl lg:w-48 lg:h-48 lg:text-9xl"></i>
                  )}
                </div>
                <div className="flex flex-col items-start gap-y-2 w-[75%]">
                  <p className="text-sm">Profile Picture</p>
                  <input
                    type="url"
                    name="profilePicture"
                    id="profilePicture"
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                    value={updateUser.profilePicture}
                    onChange={(e) => {
                      setUpdateUser({
                        ...updateUser,
                        profilePicture: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-row gap-x-8 mt-4 max-sm:flex-wrap sm:max-lg:flex-wrap gap-y-2 lg:flex-row">
                <div className="flex flex-col items-start gap-y-2">
                  <label htmlFor="firstName" className="text-sm">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="border-2 border-gray-300 rounded-lg p-2"
                    value={updateUser.firstName}
                    onChange={(e) => {
                      setUpdateUser({
                        ...updateUser,
                        firstName: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="flex flex-col items-start gap-y-2">
                  <label htmlFor="lastName" className="text-sm">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className="border-2 border-gray-300 rounded-md p-2"
                    value={updateUser.lastName}
                    onChange={(e) => {
                      setUpdateUser({
                        ...updateUser,
                        lastName: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-start gap-y-2 mt-4 md:max-lg:flex-wrap lg:flex-col">
                <p className="text-md">Bio</p>
                <textarea
                  type="text"
                  name="bio"
                  id="bio"
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                  value={updateUser.bio}
                  onChange={(e) => {
                    setUpdateUser({
                      ...updateUser,
                      bio: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex flex-row gap-x-4 mt-4 max-sm:flex-wrap sm:max-lg:flex-wrap gap-y-2 lg:flex-row">
                <div className="flex flex-col items-start gap-y-2 w-full">
                  <label htmlFor="city" className="text-sm">
                    City
                  </label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="border-2 border-gray-300 rounded-md p-2 w-full"
                      placeholder="Search for cities (min 3 characters)"
                      value={citySearch}
                      onChange={(e) => {
                        setCitySearch(e.target.value);
                        if (e.target.value.length >= 3) {
                          setIsCityDropdownOpen(true);
                          fetchCities({ search: e.target.value });
                        } else {
                          setIsCityDropdownOpen(false);
                          setCities([]);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          fetchCities({ search: citySearch });
                        }
                        if (e.key === "Escape") {
                          setIsCityDropdownOpen(false);
                        }
                      }}
                    />
                    {isCityDropdownOpen && (
                      <div className="absolute flex flex-col w-full max-h-[20rem] items-center justify-center z-30 rounded-b-lg bg-white border border-gray border-t-white overflow-y-scroll">
                        {cities && cities.length > 0 ? (
                          cities.map((city) => (
                            <button
                              className="w-full h-8 text-sm outline-none z-30 hover:bg-gray px-2 py-1 text-left"
                              key={city.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCitySearch(city.cityName || city.name);
                                setUpdateUser({
                                  ...updateUser,
                                  city: city.id,
                                });
                                setIsCityDropdownOpen(false);
                              }}
                            >
                              {city.cityName || city.name}
                            </button>
                          ))
                        ) : (
                          <div className="w-full p-2 text-sm text-gray-500">
                            No cities found. Try a different search term.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-y-2 mt-4 md:max-lg:flex-wrap lg:flex-col">
                <p className="text-md">Phone Number</p>
                <input
                  type="phone"
                  name="phoneNumber"
                  id="phoneNumber"
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                  value={updateUser.phoneNumber}
                  onChange={(e) => {
                    setUpdateUser({
                      ...updateUser,
                      phoneNumber: e.target.value,
                    });
                  }}
                  onBlur={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!e.target.value.startsWith("+")) {
                      e.target.style.border = "2px solid primary";
                      toast.error("Please include country code", {
                        position: "bottom-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      });
                    }
                    if (e.target.value.length != 13) {
                      e.target.style.border = "2px solid primary";
                      toast.error("Please enter a valid phone number", {
                        position: "bottom-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      });
                    } else {
                      e.target.style.border = "2px solid black";
                    }
                  }}
                />
              </div>
              <div className="flex flex-col items-start mb-8 gap-y-2 mt-4 md:max-lg:flex-wrap lg:flex-col">
                <p className="text-sm">Resume</p>
                <input
                  type="url"
                  name="resume"
                  id="resume"
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                  value={updateUser.resume}
                  onChange={(e) => {
                    setUpdateUser({
                      ...updateUser,
                      resume: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-end w-full border border-gray p-6 rounded-b">
              <button
                className="bg-primary text-white px-6 py-2 uppercase text-lg rounded border border-gray shadow-sm mr-1 hover:shadow-lg hover:bg-[#f4f2ee] hover:text-primary transition-all duration-300 ease-in-out"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleEditProfile();
                }}
              >
                Edit
              </button>
              <button
                className="background-transparent uppercase px-6 py-2 text-lg outline-none focus:outline-none mb-1 hover:bg-[#f4f2ee] transition-all duration-300 ease-in-out"
                type="button"
                onClick={() => {
                  document.title =
                    updateUser.firstName +
                    " " +
                    updateUser.lastName +
                    " | MMCOE Alumni Portal";
                  setShowProfileModal(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showExperienceModal ? (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center z-50"
          onClick={() => {
            setShowExperienceModal(false);
          }}
        >
          <div
            className="flex flex-col items-center justify-center w-[65%] h-[95%] bg-white border border-gray rounded-lg shadow-sm drop-shadow-sm z-60"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="flex items-center justify-between w-full p-5 border-b border-solid border-gray-300 rounded-t ">
              <h3 className="text-2xl font=semibold">Add Experience</h3>
              <button
                className="bg-transparent border-0 text-black float-right"
                onClick={() => {
                  setNewExperience({});
                  setShowExperienceModal(false);
                }}
              >
                <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                  <i className="fa-solid fa-xmark"></i>
                </span>
              </button>
            </div>
            <div className="flex flex-col px-4 w-full h-full overflow-y-scroll">
              <div className="flex flex-col items-start gap-y-2 mt-4 md:max-lg:flex-wrap lg:flex-col">
                <p className="text-sm">Company</p>
                <input
                  type="text"
                  name="company"
                  id="company"
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                  value={newExperience.company}
                  onChange={(e) => {
                    setNewExperience({
                      ...newExperience,
                      company: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex flex-col items-start gap-y-2 mt-4 md:max-lg:flex-wrap lg:flex-col">
                <p className="text-sm">Designation</p>
                <input
                  type="text"
                  name="designation"
                  id="designation"
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                  value={newExperience.designation}
                  onChange={(e) => {
                    setNewExperience({
                      ...newExperience,
                      designation: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex flex-row gap-x-8 mt-4 max-sm:flex-wrap sm:max-lg:flex-wrap gap-y-2 lg:flex-row">
                <div className="flex flex-col items-start gap-y-2">
                  <label htmlFor="startDate" className="text-sm">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    className="border-2 border-gray-300 rounded-lg p-2"
                    value={newExperience.startDate}
                    onChange={(e) => {
                      setNewExperience({
                        ...newExperience,
                        startDate: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="flex flex-col items-start gap-y-2">
                  <label htmlFor="endDate" className="text-sm">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    className="border-2 border-gray-300 rounded-md p-2"
                    value={newExperience.endDate}
                    onChange={(e) => {
                      setNewExperience({
                        ...newExperience,
                        endDate: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-start gap-y-2 mt-4 md:max-lg:flex-wrap lg:flex-col">
                <p className="text-sm">Description</p>
                <textarea
                  type="text"
                  rows={5}
                  name="description"
                  id="description"
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                  value={newExperience.desctription}
                  onChange={(e) => {
                    setNewExperience({
                      ...newExperience,
                      description: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex flex-row items-center gap-x-2 mt-4 mb-8 md:max-lg:flex-row lg:flex-row">
                <input
                  type="checkbox"
                  name="isCurrent"
                  id="isCurrent"
                  className="border-2 border-gray-300 rounded-md"
                  checked={newExperience.isCurrent}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNewExperience({
                        ...newExperience,
                        endDate: null,
                      });
                    }
                    setNewExperience({
                      ...newExperience,
                      isCurrent: e.target.checked,
                    });
                  }}
                />
                <p className="text-sm">Is Current</p>
              </div>
            </div>
            <div className="flex items-center justify-end w-full border border-gray p-6 rounded-b">
              <button
                className="background-transparent uppercase px-6 py-2 text-lg outline-none focus:outline-none mr-1 mb-1 hover:bg-[#f4f2ee] transition-all duration-300 ease-in-out"
                type="button"
                onClick={() => {
                  document.title =
                    updateUser.firstName +
                    " " +
                    updateUser.lastName +
                    " | MMCOE Alumni Portal";
                  setShowExperienceModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-primary text-white px-6 py-2 uppercase text-lg rounded border border-gray shadow-sm hover:shadow-lg hover:bg-[#f4f2ee] hover:text-primary transition-all duration-300 ease-in-out"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleEditExperience({ id: null });
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showExperienceEditModal ? (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center z-50"
          onClick={() => {
            setShowExperienceEditModal(false);
          }}
        >
          <div
            className="flex flex-col items-center justify-center w-[65%] h-[95%] bg-white border border-gray rounded-lg shadow-sm drop-shadow-sm z-60"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="flex items-center justify-between w-full p-5 border-b border-solid border-gray-300 rounded-t ">
              <h3 className="text-2xl font=semibold">Edit Experience</h3>
              <button
                className="bg-transparent border-0 text-black float-right"
                onClick={() => {
                  setNewExperienceEdit({});
                  setShowExperienceEditModal(false);
                }}
              >
                <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                  <i className="fa-solid fa-xmark"></i>
                </span>
              </button>
            </div>
            <div className="flex flex-col px-4 w-full h-full overflow-y-scroll">
              <div className="flex flex-col items-start gap-y-2 mt-4 md:max-lg:flex-wrap lg:flex-col">
                <p className="text-sm">Company</p>
                <input
                  type="text"
                  name="company"
                  id="company"
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                  value={newExperienceEdit.company}
                  onChange={(e) => {
                    setNewExperienceEdit({
                      ...newExperienceEdit,
                      company: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex flex-col items-start gap-y-2 mt-4 md:max-lg:flex-wrap lg:flex-col">
                <p className="text-sm">Designation</p>
                <input
                  type="text"
                  name="designation"
                  id="designation"
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                  value={newExperienceEdit.designation}
                  onChange={(e) => {
                    setNewExperienceEdit({
                      ...newExperienceEdit,
                      designation: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex flex-row gap-x-8 mt-4 max-sm:flex-wrap sm:max-lg:flex-wrap gap-y-2 lg:flex-row">
                <div className="flex flex-col items-start gap-y-2">
                  <label htmlFor="startDate" className="text-sm">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    className="border-2 border-gray-300 rounded-lg p-2"
                    value={newExperienceEdit.startDate}
                    onChange={(e) => {
                      setNewExperienceEdit({
                        ...newExperienceEdit,
                        startDate: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="flex flex-col items-start gap-y-2">
                  <label htmlFor="endDate" className="text-sm">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    className="border-2 border-gray-300 rounded-md p-2"
                    value={newExperienceEdit.endDate}
                    onChange={(e) => {
                      setNewExperienceEdit({
                        ...newExperienceEdit,
                        endDate: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-start gap-y-2 mt-4 md:max-lg:flex-wrap lg:flex-col">
                <p className="text-sm">Description</p>
                <textarea
                  type="text"
                  rows={5}
                  name="description"
                  id="description"
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                  value={newExperienceEdit.desctription}
                  onChange={(e) => {
                    setNewExperienceEdit({
                      ...newExperienceEdit,
                      description: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex flex-row items-center gap-x-2 mt-4 mb-8 md:max-lg:flex-row lg:flex-row">
                <input
                  type="checkbox"
                  name="isCurrent"
                  id="isCurrent"
                  className="border-2 border-gray-300 rounded-md"
                  checked={newExperienceEdit.isCurrent}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNewExperienceEdit({
                        ...newExperienceEdit,
                        endDate: null,
                      });
                    }
                    setNewExperienceEdit({
                      ...newExperienceEdit,
                      isCurrent: e.target.checked,
                    });
                  }}
                />
                <p className="text-sm">Is Current</p>
              </div>
            </div>
            <div className="flex items-center justify-end w-full border border-gray p-6 rounded-b">
              <button
                className="background-transparent uppercase px-6 py-2 text-lg outline-none focus:outline-none mr-1 mb-1 hover:bg-[#f4f2ee] transition-all duration-300 ease-in-out"
                type="button"
                onClick={() => {
                  document.title =
                    updateUser.firstName +
                    " " +
                    updateUser.lastName +
                    " | MMCOE Alumni Portal";
                  setShowExperienceEditModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-primary text-white px-6 py-2 uppercase text-lg rounded border border-gray shadow-sm hover:shadow-lg hover:bg-[#f4f2ee] hover:text-primary transition-all duration-300 ease-in-out"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleEditExperience({ id: newExperienceEdit.id });
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showSkillsModal ? (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center z-50"
          onClick={() => {
            document.title = "Feed | MMCOE Alumni Portal";
            setShowSkillsModal(false);
          }}
        >
          <div
            className="flex flex-col items-center justify-center gap-y-4 w-[65%] h-[95%] bg-white border border-gray rounded-lg shadow-sm drop-shadow-sm z-60"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="flex items-center justify-between w-full p-5 border-b border-solid border-gray-300 rounded-t ">
              <h3 className="text-2xl font=semibold text-black">Add Skills</h3>

              <button
                className="bg-transparent border-0 text-black float-right"
                onClick={() => setShowSkillsModal(false)}
              >
                <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                  <i className="fa-solid fa-xmark"></i>
                </span>
              </button>
            </div>
            <div className="flex flex-col px-4 w-full h-full overflow-y-scroll">
              <div className="flex flex-col items-start gap-y-2 mt-4 w-full md:max-lg:flex-wrap lg:flex-col">
                <div className="flex flex-row gap-x-4 mt-4 w-full max-sm:flex-wrap sm:max-lg:flex-wrap gap-y-2 lg:flex-row">
                  <div className="flex flex-col items-start gap-y-2 w-full">
                    <p className="text-sm">Skill Name</p>
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="border-2 border-gray-300 rounded-md p-2 w-full"
                        placeholder="Search for skills"
                        value={skillSearch}
                        onChange={(e) => {
                          setSkillSearch(e.target.value);
                          setIsSkillDropDownOpen(true);
                          fetchSkills({ search: e.target.value });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            fetchSkills({
                              search: `?search=${skillSearch}`,
                            });
                            setIsSkillDropDownOpen(false);
                          }
                          if (e.key === "Escape") {
                            setIsSkillDropDownOpen(false);
                          }
                        }}
                      />
                      {isSkillDropDownOpen && (
                        <div
                          className={`absolute flex flex-col w-full max-h-[20rem] items-center justify-center z-30 rounded-b-lg bg-white border border-gray border-t-white overflow-y-scroll`}
                        >
                          {skills.length > 0 ? (
                            skills.map((skill) => {
                              return (
                                <button
                                  className="w-full h-8 text-sm outline-none z-30 hover:bg-gray"
                                  key={skill.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSkillSearch(skill.name);
                                    setNewSkill({
                                      ...newSkill,
                                      skill: skill.id,
                                    });
                                    setIsSkillDropDownOpen(false);
                                  }}
                                >
                                  {skill.name}
                                </button>
                              );
                            })
                          ) : (
                            <>No such skill.</>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center gap-x-2 mt-4 mb-8 md:max-lg:flex-row lg:flex-row"></div>
              <div className="flex flex-row items-center gap-x-2 mt-4 mb-8 md:max-lg:flex-row lg:flex-row">
                <p className="text-sm">Experience</p>
                <select
                  className="text-lg"
                  name="experience"
                  id="experience"
                  value={newSkill.experience}
                  onChange={(e) => {
                    setNewSkill({
                      ...newSkill,
                      experience: e.target.value,
                    });
                  }}
                >
                  <option value="0">Select Experience</option>
                  <option value="1">Interested</option>
                  <option value="2">Beginner</option>
                  <option value="3">Intermediate</option>
                  <option value="4">Expert</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end w-full border border-gray p-6 rounded-b">
              <button
                className="background-transparent uppercase px-6 py-2 text-lg outline-none focus:outline-none mr-1 mb-1 hover:bg-[#f4f2ee] transition-all duration-300 ease-in-out"
                type="button"
                onClick={() => {
                  document.title =
                    updateUser.firstName +
                    " " +
                    updateUser.lastName +
                    " | MMCOE Alumni Portal";
                  setShowSkillEditModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-primary text-white px-6 py-2 uppercase text-lg rounded border border-gray shadow-sm hover:shadow-lg hover:bg-[#f4f2ee] hover:text-primary transition-all duration-300 ease-in-out"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleEditSkill({ id: null });
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showSkillEditModal ? (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center z-50"
          onClick={() => {
            document.title = "Feed | MMCOE Alumni Portal";
            setShowSkillEditModal(false);
          }}
        >
          <div
            className="flex flex-col items-center justify-center gap-y-4 w-[65%] h-[95%] bg-white border border-gray rounded-lg shadow-sm drop-shadow-sm z-60"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="flex items-center justify-between w-full p-5 border-b border-solid border-gray-300 rounded-t ">
              <h3 className="text-2xl font=semibold">Edit Skill</h3>
              <button
                className="bg-transparent border-0 text-black float-right"
                onClick={() => setShowSkillEditModal(false)}
              >
                <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                  <i className="fa-solid fa-xmark"></i>
                </span>
              </button>
            </div>
            <div className="flex flex-col px-4 w-full h-full overflow-y-scroll">
              <div className="flex flex-col items-start gap-y-2 mt-4 w-full md:max-lg:flex-wrap lg:flex-col">
                <div className="flex flex-row gap-x-4 mt-4 w-full max-sm:flex-wrap sm:max-lg:flex-wrap gap-y-2 lg:flex-row">
                  <div className="flex flex-col items-start gap-y-2 w-full">
                    <p className="text-sm">Skill Name</p>
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="border-2 border-gray-300 rounded-md p-2 w-full"
                        placeholder="Search for skills"
                        value={newSkillEdit.skillName}
                        onChange={(e) => {
                          setSkillSearch(e.target.value);
                          setIsSkillDropDownOpen(true);
                          fetchSkills({ search: e.target.value });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            fetchSkills({
                              search: `?search=${skillSearch}`,
                            });
                            setIsSkillDropDownOpen(false);
                          }
                          if (e.key === "Escape") {
                            setIsSkillDropDownOpen(false);
                          }
                        }}
                      />
                      {isSkillDropDownOpen && (
                        <div
                          className={`absolute flex flex-col w-full max-h-[20rem] items-center justify-center z-30 rounded-b-lg bg-white border border-gray border-t-white overflow-y-scroll`}
                        >
                          {skills.length > 0 ? (
                            skills.map((skill) => {
                              return (
                                <button
                                  className="w-full h-8 text-sm outline-none z-30 hover:bg-gray"
                                  key={skill.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSkillSearch(skill.name);
                                    setNewSkillEdit({
                                      ...newSkillEdit,
                                      skill: skill.id,
                                    });
                                    setIsSkillDropDownOpen(false);
                                  }}
                                >
                                  {skill.name}
                                </button>
                              );
                            })
                          ) : (
                            <>No such skill.</>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center gap-x-2 mt-4 mb-8 md:max-lg:flex-row lg:flex-row"></div>
              <div className="flex flex-row items-center gap-x-2 mt-4 mb-8 md:max-lg:flex-row lg:flex-row">
                <p className="text-sm">Experience</p>
                <select
                  className="text-lg"
                  name="experience"
                  id="experience"
                  value={newSkillEdit.experience}
                  onChange={(e) => {
                    setNewSkillEdit({
                      ...newSkillEdit,
                      experience: e.target.value,
                    });
                  }}
                >
                  <option value="0">Select Experience</option>
                  <option value="1">Interested</option>
                  <option value="2">Beginner</option>
                  <option value="3">Intermediate</option>
                  <option value="4">Expert</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end w-full border border-gray p-6 rounded-b">
              <button
                className="background-transparent uppercase px-6 py-2 text-lg outline-none focus:outline-none mr-1 mb-1 hover:bg-[#f4f2ee] transition-all duration-300 ease-in-out"
                type="button"
                onClick={() => {
                  document.title =
                    updateUser.firstName +
                    " " +
                    updateUser.lastName +
                    " | MMCOE Alumni Portal";
                  setShowSkillEditModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-primary text-white px-6 py-2 uppercase text-lg rounded border border-gray shadow-sm hover:shadow-lg hover:bg-[#f4f2ee] hover:text-primary transition-all duration-300 ease-in-out"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleEditSkill({ id: newSkillEdit.id });
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
