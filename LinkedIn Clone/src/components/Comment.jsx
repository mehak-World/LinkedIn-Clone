import React, {useContext, useState} from 'react'
import { UserContext } from '../utils/UserContext'
import axios from "axios"
import { getProfileImage } from '../utils/profile'

const Comment = ({comment}) => {

  const [image, setImage] = useState("https://www.w3schools.com/howto/img_avatar.png")
  getProfileImage(comment.author._id, image, setImage);

  return (
    <div className = "flex justify-between items-center p-2 bg-gray-100 rounded-lg shadow-md mb-4">
      <div className="flex items-center gap-2 mb-2">
        <img
          src={image}
          alt="Avatar"
          className="w-10 h-10 rounded-full"/>
        <div>
          <strong>{comment.author.username}</strong>
          <p className="text-gray-700">{comment.content}</p>
        </div>
      </div>
      {/* {user._id == comment.author._id && <button className = "bg-black p-2 text-white rounded-lg" onClick = {handleDeleteComment}>Delete</button>} */}
    </div>
  )
}

export default Comment
