import React, { useEffect, useState } from "react";
import axios from "axios";

const ActivitySection = ({ id }) => {
  const [posts, setPosts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/posts/" + id);
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };

    fetchUserPosts();
  }, [id]);

  const handleDelete = async (postId) => {
    try {
      await axios.post(`http://localhost:3000/posts/${postId}/delete`);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  return (
    <div className="bg-white p-5 my-5 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Activity</h2>
      {posts.length > 0 ? (
        <div className="flex overflow-x-auto gap-4 pb-2">
          {posts.map((post) => (
            <div
              key={post._id}
              className="min-w-[300px] border p-4 rounded-lg shadow-sm relative bg-gray-50"
            >
              {user._id === id && (
                <button
                  className="absolute top-2 right-2 text-red-500"
                  onClick={() => handleDelete(post._id)}
                  title="Delete Post"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              )}
              <h3 className="font-bold text-lg">{post.title}</h3>
              <p className="text-gray-700 mt-1">{post.content}</p>

              {/* Images */}
              {post.images?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt="Post"
                      className="w-full h-40 object-cover rounded"
                    />
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-400 mt-2">
                {new Date(post.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No posts yet.</p>
      )}
    </div>
  );
};

export default ActivitySection;
