
import {Link} from "react-router-dom";

const CreatePost = () => {

  return (
    <div className = "flex gap-4 items-center mb-3 p-4 bg-white rounded-lg shadow-md">
       <i className="text-3xl fa-solid fa-user text-gray-600"></i>
      <Link to = "/create-post">
      <button
        className="w-full p-2 text-left hover:bg-gray-100 border border-gray-300 rounded-lg mb-4">Start a Post</button></Link>
    </div>
  )
}

export default CreatePost
