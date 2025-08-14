import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainNav from "../components/MainNav";
import { backend_url } from "../utils/app";

const CreatePost = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  if (!token) {
    window.location.href = "/sign-in/true";
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("userId", user._id);
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await fetch(`${backend_url}/posts/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) navigate("/feed");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <MainNav />
      <div className="flex justify-center mt-6 px-4">
        <div className="w-full max-w-2xl p-4 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-center mb-4">Create a Post</h1>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <textarea
              rows="6"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <label htmlFor="image" className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-800">
              <i className="fa-solid fa-image text-2xl"></i>
              <span>Add Images</span>
            </label>
            <input
              type="file"
              id="image"
              multiple
              accept="image/*"
              onChange={(e) => setImages([...e.target.files])}
              className="hidden"
            />

            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            >
              Create Post
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
