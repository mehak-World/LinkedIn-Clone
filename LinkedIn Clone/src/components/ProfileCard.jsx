import React from 'react';

const ProfileCard = ({ user }) => {
  console.log(user)
  return (
    <div>
      <div className="relative w-60 bg-white rounded-lg shadow-md flex flex-col gap-4 pb-6">
        {user?.profile?.bgPic && <img
          className="h-20 w-full object-cover rounded-t-lg"
          src={user?.profile?.bgPic}
          alt="Cover"
        />}
        <div className="bg-gray-200 absolute top-10 left-10 w-16 h-16 flex justify-center items-center rounded-full">
          {user?.profile?.profilePic ? <img className="w-full h-full object-cover rounded-full" src = {user.profile.profilePic} />: <i className="text-3xl fa-solid fa-user text-gray-600"></i>}
        </div>

        <h2 className="text-center text-xl font-bold mt-4">{user?.username}</h2>
        <h2 className="text-center text-md">{user?.profile?.profileTitle}</h2>
      </div>
    </div>
  );
};

export default ProfileCard;
