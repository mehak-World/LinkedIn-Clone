import { useState } from "react";
import axios from "axios";
import Comment from "./Comment.jsx";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import { backend_url } from "../utils/app.js";

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [increaseLike, setIncreaseLike] = useState(false);
  const [comment, setComment] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const [peopleLiked, setPeopleLiked] = useState(post.peopleLiked || []);
  const [comments, setComments] = useState(post.comments || []);

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    setComments([...comments, { content: comment, author: user }]);
    setComment("");

    try {
      await axios.post(`${backend_url}/posts/comment`, {
        postId: post._id,
        content: comment,
        author: user._id,
      });
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleLikes = async () => {
    let new_peopleLiked = peopleLiked;

    if (peopleLiked.includes(user._id)) {
      setIncreaseLike(false);
      new_peopleLiked = new_peopleLiked.filter((id) => id !== user._id);
      setPeopleLiked(new_peopleLiked);
    } else {
      setIncreaseLike(true);
      new_peopleLiked = [...peopleLiked, user._id];
      setPeopleLiked(new_peopleLiked);
    }

    try {
      await axios.post(`${backend_url}/posts/like`, {
        postId: post._id,
        new_peopleLiked,
      });
    } catch (err) {
      console.error("Failed to update likes:", err);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
      {/* Author Info */}
      <Link to={`/profile/${post.author._id}`} className="block mb-2">
        <h4 className="font-semibold text-gray-800">{post.author.username}</h4>
        <h5 className="text-gray-500 text-sm">{post.author.profile?.profileTitle}</h5>
      </Link>

      {/* Post Content */}
      <p className="text-gray-700 mt-2">{post.title}</p>
      <div className="text-gray-500 mt-1">{parse(post.content)}</div>

      {/* Post Image */}
      {post.images && post.images.length > 0 && (
        <div className="my-3 w-full">
          <div className="w-full aspect-video overflow-hidden rounded-lg">
            <img
              src={post.images[0].url}
              alt="post"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Like & Comment Buttons */}
      <div className="flex justify-between items-center mt-3">
        <div className="flex gap-2 items-center">
          <i
            className="cursor-pointer fa-solid fa-thumbs-up text-xl"
            style={{ color: increaseLike ? "gray" : "" }}
            onClick={handleLikes}
          ></i>
          {peopleLiked.length > 0 && (
            <span className="text-gray-600">{peopleLiked.length}</span>
          )}
        </div>
        <i
          className="cursor-pointer fa-solid fa-comment text-xl"
          onClick={() => setShowComments(!showComments)}
        ></i>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-3">
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mt-2"
          />
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Post
          </button>

          {comments.length > 0 && (
            <div className="mt-4 space-y-2">
              {comments.map((cmt, index) => (
                <Comment key={index} comment={cmt} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
