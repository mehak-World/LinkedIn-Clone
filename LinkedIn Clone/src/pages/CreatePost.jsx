import React, { useContext, useState } from "react";
import { UserContext } from "../utils/UserContext";
import { useNavigate } from "react-router-dom";
import MainNav from "../components/MainNav";

const CreatePost = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"))
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  if (!token) {
    window.location.href = "/sign-in/true";
    return null;
  }

  const handleSubmit = async (e) => {
    if(!token){
      return;
    }
    e.preventDefault(); 
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("userId", user._id);
    images.forEach((img) => formData.append("images", img)); 

    const res = await fetch("http://localhost:3000/posts/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if(res){
      navigate("/feed")
    }
  };

  return (
    <>
    <MainNav />
      <div className="relative mx-auto my-[5%] w-200 p-4 bg-white rounded-lg shadow-md">
      
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h1 className="text-2xl font-bold mb-4">Create a Post</h1>

        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter post title"
        />

        <label>Content</label>
        <textarea
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label for = "image"><i className="fa-solid fa-image text-3xl p-2 "></i></label>
        <input
          type="file"
          id = "image"
          multiple
          accept="image/*"
          onChange={(e) => setImages([...e.target.files])}
          className="mb-4 bg-gray-100 p-2 rounded-lg cursor-pointer hover:bg-gray-200"
          
        />
        

        <button
          type="submit"
          className="w-full p-2 mb-4 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600"
          onClick = {(e) => handleSubmit(e)}
        >
          Create Post
        </button>
      </form>
    </div>
    </>
  
  );
};

export default CreatePost;
