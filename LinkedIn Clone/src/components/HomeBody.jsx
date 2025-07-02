import React from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuth from "./GoogleAuth";


const HomeBody = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 m-[6%]">
      <div className = "flex flex-col justify-center items-center mt-[5%]">
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
        </div>
        <p className="my-10">
          New to LinkedIn?{" "}
          <Link to="/sign-in/true">
            <button className="text-blue-700 cursor-pointer">Join Now</button>
          </Link>
        </p>
      </div>
      {/* <div>
        <img
          className="w-[500px] h-[400px]"
          src={linkifyIcon}
          alt=""
        />
      </div> */}
    </div>
  );
};

export default HomeBody;
