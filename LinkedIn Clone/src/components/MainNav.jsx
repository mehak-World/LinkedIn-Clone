import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import linkifyIcon from "../assets/linkify_icon.png";
import { backend_url } from "../utils/app";

const socket = io(`${backend_url}`);

const MainNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [active, setActive] = useState("Home");
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  });

  // For search
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const getNotifications = async () => {
      const res = await axios.get(
        `${backend_url}/profile/` + user?._id + "/notifications"
      );
      if (res) {
        console.log(res.data);
        const unread_notif = res.data.filter((notif) => !notif?.read);
        setUnreadNotifCount(unread_notif.length);
      }
    };

    const getMessages = async () => {
      const res = await axios.get(
        `${backend_url}/messages/` + user?._id
      );
      if (res) {
        console.log(res.data);
        const unread_msg = res.data.filter((msg) => !msg?.read);
        console.log(unread_msg);
        setUnreadMsgCount(unread_msg.length);
      }
    };

    if (user) {
      getNotifications();
      getMessages();
    }
  }, []);

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
    }

    socket.on("notify", (data) => {
      console.log("New notification:", data);
      setUnreadNotifCount((prev) => prev + 1);
    });

    return () => {
      socket.off("notify");
    };
  }, [user?._id]);

  useEffect(() => {
    if (query.length > 0) {
      const fetchUsers = async () => {
        const res = await axios.get(
          `${backend_url}/search-users?query=${query}`
        );
        setSuggestions(res.data);
      };
      fetchUsers();
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSelect = (id) => {
    setQuery("");
    setSuggestions([]);
    navigate(`/profile/${id}`);
  };

  useEffect(() => {
    const pathMap = {
      "/feed": "Home",
      "/my-network": "My Network",
      "/resume": "Resume",
      "/messages": "Messages",
      "/notifications": "Notification",
      "/aiGenerate": "Explore AI",
      [`/profile/${user?._id}`]: "Me",
    };
    setActive(pathMap[location.pathname] || "");
  }, [location.pathname, user?._id]);

  return (
    <div className="flex justify-between mx-20 my-5 relative">
      <div className="flex gap-2 items-center relative">
        <img src = {linkifyIcon} alt = "site icon" className = "h-15 w-15" />
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="border rounded-2xl p-2 w-72"
          />
          {suggestions.length > 0 && (
            <ul className="absolute top-10 left-0 w-full bg-white border rounded-lg shadow z-50">
              {suggestions.map((user) => (
                <li
                  key={user?._id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(user?._id)}
                >
                  {user?.username}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <ul className="flex gap-6 items-center text-gray-500 text-[14px] cursor-pointer">
          <Link to="/feed">
            <div
              className={`flex flex-col justify-center items-center gap-2 ${
                active === "Home"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500"
              }`}
              onClick={() => setActive("Home")}
            >
              <i className="fa-solid fa-house"></i>
              <li>Home</li>
            </div>
          </Link>

          <Link to="/my-network">
            <div
              className={`flex flex-col justify-center items-center gap-2 ${
                active === "My Network"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500"
              }`}
              onClick={() => setActive("My Network")}
            >
              <i className="fa-solid fa-address-book"></i>
              <li>My Network</li>
            </div>
          </Link>

          <Link to="/messages">
            <div
              className={`relative flex flex-col justify-center items-center gap-2 ${
                active === "Messages"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500"
              }`}
              onClick={() => setActive("Messages")}
            >
              <i className="fa-solid fa-message">
                {unreadMsgCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {unreadMsgCount}
                  </span>
                )}
              </i>
              <li>Messages</li>
            </div>
          </Link>

          <Link to="/notifications">
            <div
              className={`relative flex flex-col justify-center items-center gap-2 ${
                active === "Notification"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500"
              }`}
              onClick={() => setActive("Notification")}
            >
              <i className="fa-solid fa-bell text-lg relative">
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {unreadNotifCount}
                  </span>
                )}
              </i>
              <li>Notification</li>
            </div>
          </Link>

          <div className="relative">
            <div
              className={`flex flex-col justify-center items-center gap-2 cursor-pointer ${
                active === "Me"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500"
              }`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <i className="fa-solid fa-user"></i>
              <li>Me</li>
            </div>

            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg z-10 min-w-[120px]">
                <li>
                  <Link
                    to={`/profile/${user?._id}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(false);
                      setActive("Me");
                    }}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      localStorage.removeItem("user");
                      localStorage.removeItem("token");
                      setDropdownOpen(false);
                      navigate("/");
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>

          <Link to="/aiGenerate">
            <div
              className={`flex flex-col justify-center items-center gap-2 ${
                active === "Explore AI"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500"
              }`}
              onClick={() => setActive("Explore AI")}
            >
              <i className="fa-solid fa-hexagon-nodes-bolt"></i>
              <li>Explore AI</li>
            </div>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default MainNav;
