import { Link } from "react-router-dom";

const HomeNav = () => {
  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 text-2xl font-bold text-blue-700">
            Linkify
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              to="/sign-in/false"
              className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 transition"
            >
              Sign In
            </Link>
            <Link
              to="/sign-in/true"
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
            >
              Join Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="text-gray-700 focus:outline-none"
              onClick={() =>
                document.getElementById("mobile-menu").classList.toggle("hidden")
              }
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden hidden px-4 pt-2 pb-4 space-y-2" id="mobile-menu">
        <Link
          to="/sign-in/false"
          className="block px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 transition"
        >
          Sign In
        </Link>
        <Link
          to="/sign-in/true"
          className="block px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
        >
          Join Now
        </Link>
      </div>
    </nav>
  );
};

export default HomeNav;
