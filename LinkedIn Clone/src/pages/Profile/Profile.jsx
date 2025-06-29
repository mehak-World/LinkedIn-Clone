import React, { useState, useEffect, useRef } from "react";
import MainNav from "../../components/MainNav";
import ProfileCard from "../../components/ProfileCard";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import {
  handleConnection,
  handleProfilePicChange,
  handleFileChange,
} from "../../utils/profile";
import ProfileAbout from "./About/ProfileAbout";
import ProfileExperience from "./Experience/ProfileExperience";
import ProfileEducation from "./Education/ProfileEducation";
import ActivitySection from "./ActivitySection";
import { getUser } from "../../utils/user";

const Profile = () => {
  const [profile, setProfile] = useState("");
  const [username, setUsername] = useState("");
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const profilePicInputRef = useRef(null);
  const navigate = useNavigate();
  
  

  // Get the logged In user
  const user = JSON.parse(localStorage.getItem("user"));
  
const [profileUser, setProfileUser] = useState(null);

useEffect(() => {
  const getProfileUser = async () => {
    const data = await getUser(user._id);
    setProfileUser(data);
  };

  getProfileUser();
}, [user._id]);



  const handleBgPicClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePicClick = () => {
    profilePicInputRef.current.click();
  };

  const handleMessage = () => {
    navigate(`/messages?user=${id}`);
  };

  // Handle file selection
  useEffect(() => {
    const getProfile = async () => {
      const res = await axios.get("http://localhost:3000/users/" + id);
      console.log(res);
      if (res.data) {
        setUsername(res.data.username)
        setProfile(res.data.profile);
      }
    };

    getProfile();
  }, [id]);

  return (
    <div>
      <MainNav />
      <div className="flex gap-5 justify-center px-10 py-5">
        {/* Left */}
        <div className="w-[60%]">
          <div className="rounded-2xl bg-gray-50 relative">
            {/* Background image */}
            <div className="relative">
              <div className="h-64 w-full overflow-hidden rounded-2xl">
                {profile?.bgPic ? <img
                  src={profile?.bgPic}
                  alt="Background"
                  className="w-full h-full object-cover" // or object-contain
                />: ''}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e, setProfile, id)}
                accept="image/*"
                className="hidden"
              />

              {user._id == id && (
                <i
                  className="absolute right-10 top-10 fa-solid fa-pen cursor-pointer text-white bg-black bg-opacity-50 rounded p-2 hover:bg-opacity-75 transition"
                  onClick={handleBgPicClick}
                  title="Change background image"
                ></i>
              )}
            </div>
              {/*  Profile Picture */}
            <div className="bg-gray-200 absolute top-35 left-10 w-30 h-30 flex justify-center items-center rounded-full mx-auto ">
              {profile?.profilePic ? (
                <img
                  src={profile.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <i className="text-3xl fa-solid fa-user text-gray-600" />
              )}

              {user._id == id && (
                <>
                  <input
                    type="file"
                    ref={profilePicInputRef}
                    onChange={(e) => handleProfilePicChange(e, setProfile, id)}
                    accept="image/*"
                    className="hidden"
                  />

                  <i
                    className="absolute bottom-0 right-0 fa-solid fa-pen cursor-pointer text-white bg-black bg-opacity-50 rounded-full p-1 text-sm hover:bg-opacity-75 transition"
                    title="Change profile picture"
                    onClick={handleProfilePicClick}
                  ></i>
                </>
              )}
            </div>

            {/* Show Profile Information */}

            <div className="px-10 pt-20 flex justify-between">
              <div>
                 <h3 className="text-2xl ">{username}</h3>
                <h6 className=" text-gray-900">{profile?.profileTitle}</h6>
                <br />
                {profile?.city && profile?.country && <h3 className="text-md text-gray-600 ">
                  {profile?.city}, {profile?.country}
                </h3>}
                <h3 className="text-md text-blue-500 ">
                  {profile?.connections?.length > 0
                    ? profile?.connections?.length
                    : 0}{" "}
                  {profile?.connections?.length > 1 ? "Connections" : "Connection"}
                </h3>
              </div>

              {user._id == id && (
                <div>
                  <Link to={"/profile/" + id + "/bio"}>
                    <i class="fa-solid fa-pen"></i>
                  </Link>
                </div>
              )}
            </div>

            {user._id != id &&
              !profile?.connections?.includes(user._id) &&
              !profile?.pendingRequests?.includes(user._id) && (
                <button
                  className="bg-blue-600 text-white p-3 rounded-xl m-10"
                  onClick={() => handleConnection(setProfile, id, user._id)}
                >
                  Connect
                </button>
              )}
            {user._id != id && profile?.pendingRequests?.includes(user._id) && (
              <button className="bg-blue-400 text-white p-3 rounded-xl m-10">
                Pending
              </button>
            )}

            {user._id != id && profile?.connections?.includes(user._id) && (
              <button
                className="bg-blue-400 text-white p-3 rounded-xl m-10"
                onClick={handleMessage}
              >
                Message
              </button>
            )}
          </div>

          {/* About */}
          <ProfileAbout user_id={user._id} profile={profile} id={id} />
          {console.log(user._id)}
          <ActivitySection user_id={user._id} id={id} />

          {/* Experience section */}
          <ProfileExperience user_id={user._id} profile={profile} setProfile = {setProfile} id={id} />

          {/* Education */}
          <ProfileEducation user_id={user._id} profile={profile} setProfile = {setProfile} id={id} />
        </div>
        {/* right */}
        <div className="w-[30%]">
          {console.log(profileUser)}
          <ProfileCard user = {profileUser}/>
        </div>
      </div>
    </div>
  );
};

export default Profile;
