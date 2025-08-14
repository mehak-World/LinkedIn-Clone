import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import linkifyIcon from "../assets/linkify_icon.png";
import { backend_url } from "../utils/app";
import { FaBars, FaTimes } from "react-icons/fa";

const socket = io(`${backend_url}`);

const MainNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [active, setActive] = useState("Home");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  // Fetch notifications & messages
  useEffect(() => {
    if (!user) return;

    const getNotifications = async () => {
      const res = await axios.get(`${backend_url}/profile/${user._id}/notifications`);
      const unread = res.data.filter(n => !n.read);
      setUnreadNotifCount(unread.length);
    };
    const getMessages = async () => {
      const res = await axios.get(`${backend_url}/messages/${user._id}`);
      const unread = res.data.filter(m => !m.read);
      setUnreadMsgCount(unread.length);
    };

    getNotifications();
    getMessages();
  }, [user]);

  // Socket for real-time notifications
  useEffect(() => {
    if (user?._id) socket.emit("join", user._id);

    socket.on("notify", () => setUnreadNotifCount(prev => prev + 1));
    return () => socket.off("notify");
  }, [user?._id]);

  // Search users
  useEffect(() => {
    if (!query) return setSuggestions([]);
    const fetchUsers = async () => {
      const res = await axios.get(`${backend_url}/search-users?query=${query}`);
      setSuggestions(res.data);
    };
    fetchUsers();
  }, [query]);

  const handleSelect = (id) => {
    setQuery("");
    setSuggestions([]);
    navigate(`/profile/${id}`);
    setMobileMenuOpen(false);
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

  const navItems = [
    { name: "Home", path: "/feed", icon: "fa-solid fa-house" },
    { name: "My Network", path: "/my-network", icon: "fa-solid fa-address-book" },
    { name: "Messages", path: "/messages", icon: "fa-solid fa-message", badge: unreadMsgCount },
    { name: "Notification", path: "/notifications", icon: "fa-solid fa-bell", badge: unreadNotifCount },
    { name: "Explore AI", path: "/aiGenerate", icon: "fa-solid fa-hexagon-nodes-bolt" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={linkifyIcon} alt="site icon" className="h-10 w-10" />
          <div className="relative">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search"
              className="border rounded-2xl p-2 w-40 sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {suggestions.length > 0 && (
              <ul className="absolute top-10 left-0 w-full bg-white border rounded-lg shadow z-50 max-h-60 overflow-y-auto">
                {suggestions.map(u => (
                  <li
                    key={u._id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelect(u._id)}
                  >
                    {u.username}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 items-center text-gray-500 text-sm">
          {navItems.map(item => (
            <Link key={item.name} to={item.path}>
              <div
                className={`relative flex flex-col justify-center items-center gap-1 cursor-pointer ${
                  active === item.name ? "text-black border-b-2 border-black" : ""
                }`}
                onClick={() => setActive(item.name)}
              >
                <i className={`${item.icon} text-lg`}></i>
                <span>{item.name}</span>
                {item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}

          {/* User Dropdown */}
          <div className="relative">
            <div
              className={`flex flex-col justify-center items-center gap-1 cursor-pointer ${
                active === "Me" ? "text-black border-b-2 border-black" : ""
              }`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <i className="fa-solid fa-user text-lg"></i>
              <span>Me</span>
            </div>
            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg z-10 min-w-[120px]">
                <li>
                  <Link
                    to={`/profile/${user._id}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
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
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <ul className="md:hidden flex flex-col gap-2 bg-white border-t p-4 text-gray-700">
          {navItems.map(item => (
            <Link key={item.name} to={item.path}>
              <li
                className={`flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100 ${
                  active === item.name ? "bg-gray-200 font-semibold" : ""
                }`}
                onClick={() => setActive(item.name)}
              >
                <i className={`${item.icon}`}></i> {item.name}
                {item.badge > 0 && (
                  <span className="ml-auto bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </li>
            </Link>
          ))}

          <li className="border-t mt-2 pt-2">
            <Link
              to={`/profile/${user._id}`}
              className="block px-2 py-2 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              className="w-full text-left px-2 py-2 hover:bg-gray-100"
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                setMobileMenuOpen(false);
                navigate("/");
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default MainNav;
