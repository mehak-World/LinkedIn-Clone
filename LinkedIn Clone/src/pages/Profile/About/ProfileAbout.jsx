import React from 'react'
import { Link } from 'react-router-dom'

const ProfileAbout = ({user_id, id, profile}) => {
  return (
    <div>
      <div className="w-full bg-gray-50 mt-20 p-10">
            <div className="flex justify-between ">
              <h2 className="text-2xl font-semibold">About</h2>
              {user_id == id && (
                <Link to={"/profile/" + id + "/about"}>
                  <i class="fa-solid fa-pen"></i>
                </Link>
              )}
            </div>
            <div>{profile?.about}</div>
          </div>
    </div>
  )
}

export default ProfileAbout
