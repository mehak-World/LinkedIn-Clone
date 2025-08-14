import { Link } from "react-router-dom";

const CreatePost = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center mb-4 p-4 bg-white rounded-lg shadow-md w-full">
      <i className="text-3xl fa-solid fa-user text-gray-600"></i>
      <Link to="/create-post" className="w-full">
        <button className="w-full p-2 text-left hover:bg-gray-100 border border-gray-300 rounded-lg transition">
          Start a Post
        </button>
      </Link>
    </div>
  );
};

export default CreatePost;
