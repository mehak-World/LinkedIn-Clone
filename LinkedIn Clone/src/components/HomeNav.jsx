import React from "react";
import { Link } from "react-router-dom";
import { signIn } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import linkifyIcon from "../assets/linkify_icon.png";
import { ToastContainer, toast } from "react-toastify";

const HomeNav = () => {
  const navigate = useNavigate();
  const handleGuestLogin = () => {
      signIn("guest@gmail.com", "guest", toast, navigate);
  }

  return (
    <div className="flex justify-between mx-10 my-5">
      
      <Link to="/">
        <div className="flex gap-2 items-center">
          {/* <h3 className="text-blue-700 text-3xl bolder"></h3> */}
          {/* <i className="fa-brands fa-linkedin text-blue-800 text-3xl"></i> */}
          <img src = {linkifyIcon} alt = "site icon" className = "h-15 w-15" />
        </div>
      </Link>

      <div>
        <ul className="flex gap-6 items-center">
           <li className="text-xl">
            <Link to = "/sign-in/true" ><button className="cursor-pointer" onClick = {handleGuestLogin}>Continue as Guest User</button></Link>
          </li>
          <li className="text-xl">
            <Link to = "/sign-in/true" ><button className="cursor-pointer">Register</button></Link>
          </li>
          <li>
            <Link to = "/sign-in/false">
            <button className="text-blue-700 font-bold border-2 cursor-pointer border-slate-600 p-2 rounded-2xl">
              Sign In
            </button>
            </Link>
            
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HomeNav;
