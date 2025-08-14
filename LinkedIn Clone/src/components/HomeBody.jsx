import React from "react";
import { Link } from "react-router-dom";
import GoogleAuth from "./GoogleAuth";

const HomeBody = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 py-10 md:py-20 md:px-6 bg-gray-50">
      <div className="flex flex-col justify-center items-center w-full max-w-md md:max-w-xl lg:max-w-2xl bg-white rounded-xl shadow-lg p-6 md:p-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-700 text-center mb-6">
          Welcome to the Professional Community
        </h1>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex justify-center">
            <GoogleAuth />
          </div>

          <Link to="/sign-in/false" className="w-full">
            <button className="w-full border border-gray-400 bg-gray-50 hover:bg-gray-100 p-3 rounded-xl font-medium transition-colors duration-200">
              Sign In With Email
            </button>
          </Link>
        </div>

        <p className="mt-8 text-center text-gray-600 text-sm sm:text-base md:text-base">
          New to LinkedIn?{" "}
          <Link to="/sign-in/true">
            <button className="text-blue-600 hover:underline font-semibold">
              Join Now
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default HomeBody;
