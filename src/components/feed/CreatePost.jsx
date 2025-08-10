import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ApiConfig from "../../utils/ApiConfig";
import KeywordInput from "./keywordInput";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreatePost = ({ fetchFeed, onClose }) => {
  const [feedData, setFeedData] = useState({
    subject: "",
    body: "",
    images: "",
    connectionOnly: false,
    charCount: 0,
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if body is empty
    if (feedData.body.length === 0) {
      toast.error("Body cannot be empty", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    // Fix the keyword validation
    if (!feedData.subject || feedData.subject.trim().length === 0) {
      toast.error("Please add at least one keyword", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/auth");
      return;
    }

    const data = {
      subject: feedData.subject,
      body: feedData.body,
      images: feedData.images.split(";").filter((img) => img.trim() !== ""),
      isPublic: !feedData.connectionOnly,
    };

    console.log("Submitting data:", data);

    axios
      .post(ApiConfig.feed + "/", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        console.log(res);
        toast.success("Post created successfully!", {
          position: "bottom-center",
          autoClose: 3000,
          theme: "light",
        });

        handleClose();
        fetchFeed({ next: null });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to create post. Please try again.", {
          position: "bottom-center",
          autoClose: 5000,
          theme: "light",
        });
      });
  };

  const handleClose = () => {
    setFeedData({
      subject: "",
      body: "",
      images: "",
      connectionOnly: false,
      charCount: 0,
    });
    onClose();
  };

  return (
    <>
      {/* Modal Background */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        {/* Modal Content */}
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Create Post</h3>
            <button
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              onClick={handleClose}
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Post Content */}
              <div>
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="6"
                  placeholder="Share your thoughts..."
                  value={feedData.body}
                  onChange={(e) => {
                    if (e.target.value.length > 3600) return;
                    setFeedData({
                      ...feedData,
                      body: e.target.value,
                      charCount: e.target.value.length,
                    });
                  }}
                />
              </div>

              {/* Add Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Images
                </label>
                <KeywordInput
                  value={feedData.images}
                  setValue={(e) => {
                    setFeedData({
                      ...feedData,
                      images: e,
                    });
                  }}
                  flex={"col"}
                  itemsAlignment={"start"}
                  links={true}
                  placeholder={"Type and press Enter to add image links..."}
                />
              </div>

              {/* Add Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Keywords
                </label>
                <KeywordInput
                  value={feedData.subject}
                  setValue={(e) => {
                    setFeedData({ ...feedData, subject: e });
                  }}
                  flex={"wrap"}
                  itemsAlignment={"center"}
                  links={false}
                  placeholder={"Type and press Enter to add keywords..."}
                />
              </div>

              {/* Post Options */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="connectionOnly"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    checked={feedData.connectionOnly}
                    onChange={(e) => {
                      setFeedData({
                        ...feedData,
                        connectionOnly: e.target.checked,
                      });
                    }}
                  />
                  <label
                    htmlFor="connectionOnly"
                    className="text-sm text-gray-700"
                  >
                    Connection-Only
                  </label>
                </div>
                <span className="text-sm text-gray-500">
                  {feedData.charCount}/3600 Characters
                </span>
              </div>
            </form>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 text-gray-600 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
              onClick={handleSubmit}
            >
              Post
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default CreatePost;
