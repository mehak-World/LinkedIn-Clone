import React, { useState, useEffect, useRef } from "react";
import MainNav from "../../components/MainNav";
import ProfileCard from "../../components/ProfileCard";
import { useParams, Link, useNavigate } from "react-router-dom";
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
import { backend_url } from "../../utils/app";

const Profile = () => {
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const profilePicInputRef = useRef(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    const fetchProfileUser = async () => {
      const data = await getUser(id);
      setProfileUser(data);
    };
    if (id) fetchProfileUser();
  }, [id]);

  const handleBgPicClick = () => fileInputRef.current.click();
  const handleProfilePicClick = () => profilePicInputRef.current.click();
  const handleMessage = () => navigate(`/messages?user=${id}`);

  return (
    <div className="bg-gray-100 min-h-screen">
      <MainNav />

      <div className="px-4 md:px-10 lg:px-48 py-5 flex flex-col lg:flex-row gap-5">
        {/* Left Column */}
        <div className="flex-1 lg:flex-[2] flex flex-col gap-5">
          <div className="relative rounded-2xl bg-white shadow-md overflow-hidden">
            {/* Background Image */}
            <div className="relative h-48 md:h-64 w-full">
              {profileUser?.profile?.bgPic && (
                <img
                  src={
                    profileUser.profile.bgPic.startsWith("http") ||
                    profileUser.profile.bgPic.startsWith("data:")
                      ? profileUser.profile.bgPic
                      : `${backend_url}/${profileUser.profile.bgPic}`
                  }
                  alt="Background"
                  className="w-full h-full object-cover"
                />
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e, setProfileUser, id)}
                accept="image/*"
                className="hidden"
              />
              {user?._id === id && (
                <i
                  className="absolute right-4 top-4 fa-solid fa-pen cursor-pointer text-white bg-black bg-opacity-50 rounded p-2 hover:bg-opacity-75 transition"
                  onClick={handleBgPicClick}
                  title="Change background image"
                ></i>
              )}
            </div>

            {/* Profile Picture overlapping bg image */}
            <div className="absolute top-[37%] left-4 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
              {profileUser?.profile?.profilePic ? (
                <img
                  key={profileUser.profile.profilePic}
                  src={
                    profileUser.profile.profilePic.startsWith("http") ||
                    profileUser.profile.profilePic.startsWith("data:")
                      ? profileUser.profile.profilePic
                      : `${backend_url}/${profileUser.profile.profilePic}`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <i className="text-3xl md:text-4xl fa-solid fa-user text-gray-600" />
              )}
              {user?._id === id && (
                <>
                  <input
                    type="file"
                    ref={profilePicInputRef}
                    onChange={(e) =>
                      handleProfilePicChange(e, setProfileUser, id)
                    }
                    accept="image/*"
                    className="hidden"
                  />
                  <i
                    className="absolute bottom-0 right-0 fa-solid fa-pen cursor-pointer text-white bg-black bg-opacity-50 rounded-full p-1 text-xs md:text-sm hover:bg-opacity-75 transition"
                    title="Change profile picture"
                    onClick={handleProfilePicClick}
                  ></i>
                </>
              )}
            </div>

            {/* Padding to prevent overlap with content below */}
            <div className="h-20 md:h-24"></div>

            {/* Profile Info */}
            <div className="px-4 md:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
              <div>
                <h3 className="text-xl md:text-2xl font-semibold">{profileUser?.username}</h3>
                <h6 className="text-gray-900">{profileUser?.profile?.profileTitle}</h6>
                {profileUser?.profile?.city && profileUser?.profile?.country && (
                  <h3 className="text-sm md:text-md text-gray-600">
                    {profileUser.profile.city}, {profileUser.profile.country}
                  </h3>
                )}
                <h3 className="text-sm md:text-md text-blue-500 mt-1">
                  {profileUser?.profile?.connections?.length || 0}{" "}
                  {profileUser?.profile?.connections?.length > 1 ? "Connections" : "Connection"}
                </h3>
              </div>

              {user?._id === id && (
                <div>
                  <Link to={`/profile/${id}/bio`}>
                    <i className="fa-solid fa-pen text-gray-700 hover:text-gray-900" title="Edit bio"></i>
                  </Link>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 px-4 md:px-10 flex gap-3 flex-wrap">
              {user?._id !== id &&
                !profileUser?.profile?.connections?.includes(user?._id) &&
                !profileUser?.profile?.pendingRequests?.includes(user?._id) && (
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
                    onClick={() => handleConnection(setProfileUser, id, user?._id)}
                  >
                    Connect
                  </button>
                )}
              {user?._id !== id &&
                profileUser?.profile?.pendingRequests?.includes(user?._id) && (
                  <button className="bg-blue-400 text-white px-4 py-2 rounded-xl cursor-not-allowed">
                    Pending
                  </button>
                )}
              {user?._id !== id &&
                profileUser?.profile?.connections?.includes(user?._id) && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
                    onClick={handleMessage}
                  >
                    Message
                  </button>
                )}
            </div>
          </div>

          {/* Sections Stack */}
          <div className="flex flex-col gap-5 mt-5">
            <ProfileAbout user_id={user?._id} profile={profileUser?.profile} id={id} />
            <ActivitySection user_id={user?._id} id={id} />
            <ProfileExperience user_id={user?._id} profile={profileUser?.profile} setProfile={setProfileUser} id={id} />
            <ProfileEducation user_id={user?._id} profile={profileUser?.profile} setProfile={setProfileUser} id={id} />
          </div>
        </div>

        {/* Right Column */}
        <div className="hidden lg:block lg:flex-[1]">
          <ProfileCard user={profileUser} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
