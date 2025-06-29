import React from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuth from "./GoogleAuth";

const HomeBody = () => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 grid-flow-col gap-4 m-[6%]">
      <div>
        <h1 className="text-4xl text-gray-500">
          Welcome to the Professional Community
        </h1>
        <div>
          <div className = "p-2 m-5">
              <GoogleAuth />
          </div>
          
          <Link to="/sign-in/false">
            <button className="w-100 border-2 border-black p-2 rounded-2xl mx-4 my-1 cursor-pointer">
              {" "}
              Sign In With Email{" "}
            </button>
          </Link>
          <br />
          <small className="w-100 mx-10 my-4">
            By clicking Lorem ipsum dolor sit amet.
          </small>
        </div>
        <p className="my-10">
          New to LinkedIn?{" "}
          <Link to="/sign-in/true">
            <button className="text-blue-700 cursor-pointer">Join Now</button>
          </Link>
        </p>
      </div>
      <div>
        <img
          className="w-[600px] h-[300px]"
          src="https://static1.anpoimages.com/wordpress/wp-content/uploads/2023/09/linkedin-ap-hero-3-1.jpg"
          alt=""
        />
      </div>
    </div>
  );
};

export default HomeBody;
