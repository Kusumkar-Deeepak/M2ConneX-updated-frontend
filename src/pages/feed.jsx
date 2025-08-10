import React from "react";
import Post from "../components/feed/post";
import CreatePost from "../components/feed/CreatePost";
import AddPeopleCard from "../components/feed/AddPeople";
import Arrow from "../assets/arrow.svg";
import RecommendationBlogs from "../components/feed/RecommendationBlogs";
import Modal from "../components/feed/PostModal";
import axios from "axios";
import ApiConfig from "../utils/ApiConfig";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PeopleRecommendation from "../components/PeopleRecommendation";

const Feed = () => {
  const [feed, setFeed] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeTab, setActiveTab] = useState("feed"); // For mobile tabs
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeed({ next: null });
    fetchPeople({ next: null });
    fetchUserProfile();
    document.title = "Feed | MMCOE Alumni Portal";
  }, []);

  const fetchUserProfile = () => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (accessToken && userId) {
      axios
        .get(`${ApiConfig.users}/${userId}/`, {
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
  };

  const fetchFeed = ({ next }) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/auth");
    }
    if (next == null) {
      axios
        .get(ApiConfig.recommendFeed + "/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setFeed(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .get(next, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setFeed((prevFeed) => {
            return {
              ...res.data,
              results: [...prevFeed.results, ...res.data.results],
            };
          });
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const fetchPeople = ({ next }) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/auth");
    }
    // ... existing fetchPeople logic
  };

  const handleCreatePostClick = () => {
    setShowCreatePost(true);
  };

  const handleBlogClick = () => {
    navigate("/write-blog");
  };

  // Mobile Tab Navigation Component
  const MobileTabNavigation = () => (
    <div className="lg:hidden bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="flex justify-around">
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
            activeTab === "feed"
              ? "text-blue-600 border-blue-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("feed")}
        >
          <i className="fas fa-home mr-2"></i>
          Feed
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
            activeTab === "blogs"
              ? "text-blue-600 border-blue-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("blogs")}
        >
          <i className="fas fa-blog mr-2"></i>
          Blogs
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
            activeTab === "people"
              ? "text-blue-600 border-blue-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("people")}
        >
          <i className="fas fa-users mr-2"></i>
          People
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Tab Navigation */}
      <MobileTabNavigation />

      <div className="w-full flex justify-center items-start bg-gray-50 min-h-screen">
        <div className="w-full max-w-7xl flex flex-row justify-center items-start gap-6 mx-4 my-6 lg:flex-row">
          {/* Desktop Left Sidebar - Blogs */}
          <div className={`w-80 sticky top-6 hidden lg:block`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center pb-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Blogs
                </h3>
              </div>
              <RecommendationBlogs />
              <div
                className="flex justify-center items-center mt-6 py-2 px-4 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                onClick={() => navigate("/blogs")}
              >
                <p className="text-blue-600 text-sm font-medium">
                  Read more blogs
                </p>
                <img src={Arrow} alt="" className="ml-2 w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 max-w-2xl w-full">
            {/* Feed Tab Content */}
            {(activeTab === "feed" || window.innerWidth >= 1024) && (
              <>
                {/* Create Post Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                  {/* What's happening header */}
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-3 sm:mr-4">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <i className="fas fa-user text-gray-600 text-sm sm:text-lg"></i>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleCreatePostClick}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 sm:py-3 text-left text-gray-600 transition-colors duration-200 text-sm sm:text-base"
                    >
                      Start a post...
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 gap-1 sm:gap-0">
                    <button
                      onClick={handleCreatePostClick}
                      className="flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-1"
                    >
                      <i className="fas fa-image text-blue-500 text-sm sm:text-lg"></i>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        Image
                      </span>
                    </button>

                    <button
                      onClick={handleCreatePostClick}
                      className="flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-1"
                    >
                      <i className="fas fa-video text-green-500 text-sm sm:text-lg"></i>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        Video
                      </span>
                    </button>

                    <button
                      onClick={handleBlogClick}
                      className="flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-1"
                    >
                      <i className="fas fa-pen text-orange-500 text-sm sm:text-lg"></i>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        Blog
                      </span>
                    </button>
                  </div>
                </div>

                {/* Posts Section */}
                <div className="space-y-4">
                  {!isLoading &&
                    feed.results &&
                    feed.results.map((post, index) => (
                      <div
                        key={post.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                      >
                        <Post
                          post={post}
                          fetchFeed={fetchFeed}
                          isSeparate={false}
                        />
                      </div>
                    ))}

                  {/* Load More Button */}
                  {feed.next && (
                    <div className="flex justify-center py-6">
                      <button
                        className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
                        onClick={(e) => {
                          e.preventDefault();
                          fetchFeed({ next: feed.next });
                        }}
                      >
                        <i className="fas fa-chevron-down"></i>
                        <span>Load More Posts</span>
                      </button>
                    </div>
                  )}

                  {/* Loading State */}
                  {isLoading && (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  )}

                  {/* Empty State */}
                  {!isLoading &&
                    (!feed.results || feed.results.length === 0) && (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                        <i className="fas fa-newspaper text-gray-300 text-4xl sm:text-6xl mb-4"></i>
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                          No posts yet
                        </h3>
                        <p className="text-gray-600 mb-6 text-sm sm:text-base">
                          Be the first to share something with your network!
                        </p>
                        <button
                          onClick={handleCreatePostClick}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                        >
                          Create Post
                        </button>
                      </div>
                    )}
                </div>
              </>
            )}

            {/* Mobile Blogs Tab Content */}
            {activeTab === "blogs" && window.innerWidth < 1024 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center pb-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Blogs
                  </h3>
                </div>
                <RecommendationBlogs />
                <div
                  className="flex justify-center items-center mt-6 py-3 px-4 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                  onClick={() => navigate("/blogs")}
                >
                  <p className="text-blue-600 text-sm font-medium">
                    Read more blogs
                  </p>
                  <img src={Arrow} alt="" className="ml-2 w-4 h-4" />
                </div>
              </div>
            )}

            {/* Mobile People Tab Content */}
            {activeTab === "people" && window.innerWidth < 1024 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <PeopleRecommendation />
              </div>
            )}
          </div>

          {/* Desktop Right Sidebar - People Recommendations */}
          <div className="w-80 sticky top-6 hidden lg:block">
            <PeopleRecommendation />
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePost
          fetchFeed={fetchFeed}
          onClose={() => setShowCreatePost(false)}
        />
      )}
    </>
  );
};

export default Feed;
