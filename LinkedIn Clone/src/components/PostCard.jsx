import { useState } from "react";
import axios from "axios";
import Comment from "./Comment.jsx";
import { Link } from "react-router-dom";
import parse from 'html-react-parser';

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [increaseLike, setIncreaseLike] = useState(false);
  const [comment, setComment] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  const [peopleLiked, setPeopleLiked] = useState(post.peopleLiked || []);
  const [comments, setComments] = useState(post.comments || []);

  const handleSubmit = async () => {
    setComments([...comments, { content: comment, author: user }]);
    setComment("");

    await axios.post("http://localhost:3000/posts/comment", {
      postId: post._id,
      content: comment,
      author: user._id,
    });
  };

  const handleLikes = async () => {
    let new_peopleLiked = peopleLiked;

    if (peopleLiked.includes(user._id)) {
      // User has already liked the post, so we remove their like
      setIncreaseLike(false);
      setPeopleLiked(peopleLiked.filter((id) => id !== user._id));
      new_peopleLiked = new_peopleLiked.filter((id) => id !== user._id);
    } else {
      // User has not liked the post, so we add their like
      setIncreaseLike(true);
      setPeopleLiked([...peopleLiked, user._id]);
      new_peopleLiked = [...peopleLiked, user._id];
    }

    // Send update to backend
    try {
      await axios.post("http://localhost:3000/posts/like", {
        postId: post._id,
        new_peopleLiked,
      });
    } catch (error) {
      console.error("Failed to update likes", error);
    }
  };

  return (
    <div className="p-2 w-130 bg-white rounded-lg shadow-md mb-4">
      <Link to={`/profile/${post.author._id}`}>
        <h4>{post?.author?.username}</h4>
         <h5>{post?.author?.profile?.profileTitle}</h5>
      </Link>
      <p className="text-gray-700">{post.title}</p>
      <p className="text-gray-500">{parse(post.content)}</p>
      {post.images && post.images.length > 0 && (
        <div className="my-2 flex justify-center">
          <div className="w-full aspect-video overflow-hidden rounded-lg">
            <img
              src={post?.images[0]?.url}
              alt="post"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mt-2 mx-5">
        <div className="flex gap-1 items-center justify-center">
          <i
            className=" cursor-pointer text-2xl fa-solid fa-thumbs-up "
            style={{ color: increaseLike ? "gray" : "" }}
            onClick={handleLikes}
          ></i>
          {peopleLiked.length > 0 && (
            <span className="text-gray-600">{peopleLiked.length}</span>
          )}
        </div>

        <i
          className=" cursor-pointer text-2xl fa-solid fa-comment"
          onClick={() => setShowComments(!showComments)}
        ></i>
      </div>
      {/* Comments Section */}
      {showComments && (
        <div>
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
            <div className="mt-4">
              {comments.map((comment, index) => (
                <Comment key={index} comment={comment} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
