import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiConfig from "../../utils/ApiConfig";
import PostCarousel from "./imageCarousel";
import KeywordInput from "./keywordInput";
import formatDate from "../../utils/date";
import { toast } from "react-toastify";

const Post = ({
  post,
  fetchFeed,
  commentsExpand = false,
  isSeparate = false,
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isCommentSectionExpanded, setIsCommentSectionExpanded] =
    useState(commentsExpand);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [body, setBody] = useState(post.body);
  const [charCount, setCharCount] = useState(post.body.length);
  const [images, setImages] = useState(
    post.images
      .map((item) => item.image)
      .filter((url) => url)
      .join(";")
  );
  const [subject, setSubject] = useState(post.subject);
  const [connectionOnly, setConnectionOnly] = useState(post.isPublic);
  const [postUserIsConnected, setPostUserIsConnected] = useState(
    post.isUserConnected
  );

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/auth");
    }
    if (commentsExpand) {
      fetchComments();
    }
  }, []);

  const handleLike = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/auth");
    }
    if (isLiked) {
      axios
        .post(
          ApiConfig.feedActionDislike + "/",
          { feed: post.id },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          setIsLiked(false);
          setLikesCount(likesCount - 1);
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    }
    axios
      .post(
        ApiConfig.feedAction + "/",
        {
          feed: post.id,
          action: "LIKE",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        setIsLiked(true);
        setLikesCount(likesCount + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchComments = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/auth");
    }
    axios
      .get(ApiConfig.feedActionComment + "/?feed=" + post.id, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setComments(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const handleCommentSectionExpand = () => {
    setIsCommentSectionExpanded(!isCommentSectionExpanded);
    if (isCommentSectionExpanded) {
      return;
    }
    fetchComments();
  };

  const handleComment = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/auth");
    }
    axios
      .post(
        ApiConfig.feedAction + "/",
        {
          feed: post.id,
          action: "COMMENT",
          comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setComment("");
        fetchComments();
        setIsCommentSectionExpanded(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/auth");
    }
    axios
      .put(
        ApiConfig.feed + "/" + post.id + "/",
        {
          subject: subject,
          body: body,
          images: images.split(";"),
          isPublic: !connectionOnly,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        fetchFeed({ next: null });
        setBody(post.body);
        setImages(post.images);
        setSubject(post.subject);
        setConnectionOnly(post.isPublic);
        setIsEditing(false);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const handleConnect = (e, person) => {
    e.preventDefault();
    console.log("Connect");

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/auth");
    }

    axios
      .post(
        ApiConfig.connectionRequest,
        {
          userB: person,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="w-full">
      {/* User Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
            {post.profilePicture ? (
              <img
                src={post.profilePicture}
                alt={post.userName}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => navigate("/users/" + post.user)}
              />
            ) : (
              <div
                className="w-full h-full bg-gray-300 flex items-center justify-center cursor-pointer"
                onClick={() => navigate("/users/" + post.user)}
              >
                <i className="fas fa-user text-gray-600"></i>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h4
              className="font-semibold text-gray-900 text-sm cursor-pointer hover:text-blue-600 transition-colors duration-200"
              onClick={() => navigate("/users/" + post.user)}
            >
              {post.userName}
            </h4>
            <p className="text-gray-500 text-xs">
              {post.userBio && post.userBio.slice(0, 70) + "..."}
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{formatDate(post.createdAt)}</span>
              <span>•</span>
              {post.isPublic ? (
                <i className="fas fa-globe-americas"></i>
              ) : (
                <i className="fas fa-lock"></i>
              )}
            </div>
          </div>
        </div>

        {/* Connect Button or Edit Button */}
        <div className="flex items-center space-x-2">
          {!post.isEditable && postUserIsConnected === "not_connected" && (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
              onClick={(e) => {
                handleConnect(e, post.user);
                setPostUserIsConnected("pending");
              }}
            >
              <i className="fas fa-user-plus mr-2"></i>
              Connect
            </button>
          )}

          {!post.isEditable && postUserIsConnected === "pending" && (
            <button
              className="bg-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg cursor-not-allowed"
              disabled
            >
              <i className="fas fa-check mr-2"></i>
              Requested
            </button>
          )}

          {post.isEditable && !isEditing && (
            <button
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsEditing(true)}
            >
              <i className="fas fa-edit"></i>
            </button>
          )}

          <button className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <i className="fas fa-ellipsis-h"></i>
          </button>
        </div>
      </div>

      {/* Post Content */}
      {!isEditing && (
        <div className="px-4 pb-3">
          <p className="text-gray-800 text-sm leading-relaxed">
            {isSeparate ? post.body : post.body.slice(0, 500) + "..."}
            {!isSeparate && (
              <span
                className="text-blue-600 cursor-pointer hover:underline ml-1"
                onClick={() => navigate("/feed/" + post.id)}
              >
                See More
              </span>
            )}
          </p>
        </div>
      )}

      {/* Editing Mode */}
      {isEditing && (
        <div className="px-4 pb-3">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="5"
            placeholder="Share your thoughts..."
            value={body}
            onChange={(e) => {
              if (e.target.value.length > 3600) return;
              setBody(e.target.value);
              setCharCount(e.target.value.length);
            }}
          />

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Add Images
              </p>
              <KeywordInput
                value={images}
                setValue={setImages}
                flex={"col"}
                itemsAlignment={"start"}
                links={true}
                placeholder={"Type and press Enter to add image links..."}
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Add Keywords
              </p>
              <KeywordInput
                value={subject}
                setValue={setSubject}
                flex={"wrap"}
                itemsAlignment={"center"}
                links={false}
                placeholder={"Type and press Enter to add keywords..."}
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="connectionOnly"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  checked={connectionOnly}
                  onChange={(e) => setConnectionOnly(e.target.checked)}
                />
                <label
                  htmlFor="connectionOnly"
                  className="text-sm text-gray-700"
                >
                  Connection-Only
                </label>
              </div>
              <span className="text-sm text-gray-500">
                {charCount}/3600 Characters
              </span>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-black bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                onClick={handleEditSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Images */}
      {post.images && post.images.length > 0 && !isEditing && (
        <div className="px-4 pb-3">
          <div className="rounded-lg overflow-hidden bg-gray-100">
            <PostCarousel post={post} />
          </div>
        </div>
      )}

      {/* Divider */}
      <hr className="border-gray-200 mx-4" />

      {/* Action Buttons */}
      {!isEditing && (
        <div className="flex items-center justify-between px-4 py-3">
          <button
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-1"
            onClick={handleLike}
          >
            <i
              className={`fas fa-arrow-up ${
                isLiked ? "text-red-500" : "text-gray-500"
              }`}
            ></i>
            <span className="text-sm text-gray-600 hidden sm:block">Like</span>
            <span className="text-sm text-gray-600">{likesCount}</span>
          </button>

          <button
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-1"
            onClick={handleCommentSectionExpand}
          >
            <i
              className={`far fa-comment ${
                isCommentSectionExpanded ? "text-blue-500" : "text-gray-500"
              }`}
            ></i>
            <span className="text-sm text-gray-600 hidden sm:block">
              Comment
            </span>
            <span className="text-sm text-gray-600">{post.commentsCount}</span>
          </button>

          <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-1">
            <i
              className="fas fa-retweet text-gray-500"
              style={{ transform: "rotate(90deg)" }}
            ></i>
            <span className="text-sm text-gray-600 hidden sm:block">Share</span>
            <span className="text-sm text-gray-600">{post.sharesCount}</span>
          </button>

          <button
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-1"
            onClick={() => {
              navigator.clipboard.writeText(
                window.location.href + "/" + post.id
              );
              toast.success("Link Copied to Clipboard");
            }}
          >
            <i className="fas fa-share text-gray-500"></i>
            <span className="text-sm text-gray-600 hidden sm:block">Copy</span>
          </button>
        </div>
      )}

      {/* Comments Section */}
      {isCommentSectionExpanded && (
        <div className="border-t border-gray-200 px-4 py-4">
          {/* Comment Input */}
          <div className="flex items-center space-x-3 mb-4">
            <input
              type="text"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
              onClick={handleComment}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Comments</h4>
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    {comment.profilePicture ? (
                      <img
                        src={comment.profilePicture}
                        alt={comment.userName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <i className="fas fa-user text-gray-600 text-xs"></i>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {comment.userName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">No comments yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;
