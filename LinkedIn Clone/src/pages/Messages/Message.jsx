import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import ProfileCard from "../../components/ProfileCard.jsx";
import MainNav from "../../components/MainNav.jsx";
import Card from "../../components/Card.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { getUser } from "../../utils/user.js";


const socket = io("http://localhost:3000");

const Message = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [message, setMessage] = useState("");
  const [connections, setConnections] = useState([]);
  const location = useLocation();
  const [messages, setMessages] = useState([]);

  const [receiverId, setReceiverId] = useState(null);

   const [profileUser, setProfileUser] = useState(null);
  useEffect(() => {
      const getProfileUser = async () => {
        const data = await getUser(user?._id);
        setProfileUser(data);
      };
  
      getProfileUser();
    }, [user?._id]);

useEffect(() => {
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("user");
  setReceiverId(id);
}, [location]);


  useEffect(() => {
    socket.emit("join", user._id); // Join room on connect
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;

    const senderId = user._id;

    // Emit to socket for real-time
    socket.emit("send-msg", {
      sender: senderId,
      receiver: receiverId,
      msg: message,
    });

    // Send to backend to store in DB
    await fetch("http://localhost:3000/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_id: senderId,
        receiver_id: receiverId,
        msg: message,
      }),
    });

    setMessages((prev) => [
      ...prev,
      {
        sender: senderId,
        receiver: receiverId,
        msg: message,
      },
    ]);

    setMessage("");
  };

  useEffect(() => {
    const fetchConnections = async () => {
      const res = await fetch(
        `http://localhost:3000/messages/connections/${user._id}`
      );
      const data = await res.json();
      setConnections(data);
    };

    fetchConnections();
  }, []);

  useEffect(() => {
  const fetchReceiver = async () => {
    try {
      if (!receiverId || connections.find((c) => c._id === receiverId)) return;

      const res = await fetch(`http://localhost:3000/users/${receiverId}`);
      const data = await res.json();
      setConnections((prev) => [...prev, data]);
    } catch (err) {
      console.error("Failed to fetch receiver user:", err);
    }
  };

  fetchReceiver();
}, [receiverId, connections]);



  useEffect(() => {
  socket.on("chat message", (data) => {
    if (
      (data.sender === user._id && data.receiver === receiverId) ||
      (data.sender === receiverId && data.receiver === user._id)
    ) {
      setMessages((prev) => [...prev, data]);
    }
  });

  return () => socket.off("chat message");
}, [receiverId]);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(
        `http://localhost:3000/messages?sender_id=${user._id}&receiver_id=${receiverId}`
      );
      const data = await res.json();
      console.log(messages);
      setMessages(data);
    };

    if (receiverId) {
      fetchMessages();
    }
  }, [receiverId]);

  return (
    <>
      <MainNav />
      <div className="px-5 xl:px-50 py-9 w-full bg-gray-100 mt-5">
        <div className="flex gap-5 w-full justify-between">
          <div className="w-full md:w-[70%] pt-5">
            <Card padding={0}>
              <div className="border-b border-gray-300 px-5 py-2 font-semibold text-lg">
                Messaging
              </div>
              <div className="flex h-[590px] overflow-hidden">
                <div className="w-[35%] border-r border-gray-300 overflow-y-auto bg-white">
                  {console.log(connections)}
                  {connections?.map((conn) => (
                    <div
                      key={conn?._id}
                      className={`flex items-center cursor-pointer border-b border-gray-200 gap-3 p-4 hover:bg-gray-100 ${
                        conn?._id === receiverId ? "bg-gray-200" : ""
                      }`}
                      onClick={() => navigate(`/messages?user=${conn._id}`)}
                    >
                      <i className="fa-solid fa-user shrink-0 text-xl"></i>
                      <div>
                        <div className="font-semibold">{conn?.username}</div>
                       
                      </div>
                    </div>
                  ))}
                </div>

                <div className="w-[65%] flex flex-col justify-between">
                  <div className="overflow-y-auto p-4 space-y-3">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`max-w-[70%] px-4 py-2 rounded-lg ${
                          msg.sender === user._id
                            ? "bg-blue-500 text-white ml-auto"
                            : "bg-gray-200 text-black"
                        }`}
                      >
                        {msg.msg}
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-gray-300 flex gap-3 align-center">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="w-full border rounded-full px-4 py-2 focus:outline-none focus:ring"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                      className=" p-2 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-300"
                      onClick={handleSend}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="hidden md:block w-[30%]">
            <ProfileCard user={profileUser} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
