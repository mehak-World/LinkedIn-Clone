import React, { useState, useEffect } from "react";
import MainNav from "../../components/MainNav.jsx";
import ProfileCard from "../../components/ProfileCard.jsx";
import PostCard from "../../components/PostCard.jsx";
import CreatePost from "../../components/CreatePost.jsx";
import axios from "axios";
import { getUser } from "../../utils/user.js";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

 
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);
 

  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    const getProfileUser = async () => {
      const data = await getUser(user?._id);
      setProfileUser(data);
    };

    if(user){
         getProfileUser();
    }
   
  }, [user?._id]);

  const getAllPosts = async () => {
    const result = await axios.get("http://localhost:3000/posts/all");
    setPosts(shuffleArray(result.data));
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    if(user){
        getAllPosts();
    }
    
  }, []);

  return (
    <div>
      <div>
        <MainNav />
      </div>
      <div className="h-[100%] px-5 py-9 xl:px-50 flex gap-5 w-full mt-5 bg-gray-100">
        <ProfileCard user={profileUser} />

        <div>
          {/* Create Post */}
          <CreatePost />
          {/* Post Feed */}

          {posts.map((post, index) => (
            <PostCard key={index} post={post} />
          ))}
        </div>

        <div>
          {/* Right Feed */}
          <div className="hidden xl:block w-full">
            <h2 className="text-xl font-semibold mb-4">People You May Know</h2>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-600">
                Suggestions based on your network.
              </p>
              {/* Add more suggestions here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
