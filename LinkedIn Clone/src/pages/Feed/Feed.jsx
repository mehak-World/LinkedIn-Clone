import React, { useState, useEffect } from "react";
import MainNav from "../../components/MainNav.jsx";
import ProfileCard from "../../components/ProfileCard.jsx";
import PostCard from "../../components/PostCard.jsx";
import CreatePost from "../../components/CreatePost.jsx";
import axios from "axios";
import { getUser } from "../../utils/user.js";
import { useNavigate } from "react-router-dom";
import { backend_url } from "../../utils/app.js";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      // Fetch user profile
      const fetchProfile = async () => {
        const data = await getUser(user._id);
        setProfileUser(data);
      };
      fetchProfile();
      fetchPosts();
    }
  }, []);

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${backend_url}/posts/all`);
      setPosts(shuffleArray(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  // Shuffle posts
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <MainNav />

      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 py-6">
        
        {/* Left Sidebar: Profile */}
        <div className="hidden lg:block w-full lg:w-1/4 sticky top-20">
          <ProfileCard user={profileUser} />
        </div>

        {/* Main Feed */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Create Post */}
          <CreatePost />

          {/* Posts */}
          {posts.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              No posts to show
            </p>
          ) : (
            posts.map((post, index) => (
              <PostCard key={index} post={post} />
            ))
          )}
        </div>

        {/* Right Sidebar: Suggestions */}
        <div className="hidden xl:block w-1/4 sticky top-20 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold mb-2">People You May Know</h2>
            <p className="text-gray-600 text-sm">
              Suggestions based on your network.
            </p>
          </div>
          {/* Add more suggestion cards here if needed */}
        </div>
      </div>
    </div>
  );
};

export default Feed;
