import React, { useEffect, useState } from 'react';
import MainNav from '../../components/MainNav';
import axios from 'axios';
import ConnectionCard from './ConnectionCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { backend_url } from '../../utils/app';

const MyNetwork = () => {
  const [active, setActive] = useState("friends");
  const user = JSON.parse(localStorage.getItem("user"));
  const [connections, setConnections] = useState([]);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    const getConnections = async () => {
      try {
        const res = await axios.get(`${backend_url}/connections/${user?._id}`);
        if (res) {
          setConnections(res.data.connections);
          setPending(res.data.pendingRequests);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (user) getConnections();
  }, [active, user]);

  const handleAccept = async (id) => {
    try {
      const res = await axios.post(`${backend_url}/connections/accept`, {
        user_id: user?._id,
        connection_id: id,
      });
      if (res) {
        setConnections(res.data.connections);
        setPending(res.data.pendingRequests);
        toast.success("Connection successfully added");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to accept connection");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await axios.post(`${backend_url}/connections/reject`, {
        user_id: user?._id,
        connection_id: id,
      });
      if (res) {
        setConnections(res.data.connections);
        setPending(res.data.pendingRequests);
        toast.info("Connection rejected");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject connection");
    }
  };

  return (
    <>
      <MainNav />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="px-4 sm:px-6 lg:px-16 xl:px-48 py-10 w-full min-h-screen bg-gray-50">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-100 p-6 rounded-2xl shadow-md gap-4 md:gap-0">
          <h1 className="text-2xl font-semibold text-gray-800">
            {active === "friends" ? "Catch Up with Friends" : "Pending Requests"}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setActive("friends")}
              className={`px-5 py-2 rounded-xl text-white font-medium transition duration-200 ${
                active === "friends" ? "bg-blue-600" : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              Friends
            </button>
            <button
              onClick={() => setActive("pending")}
              className={`px-5 py-2 rounded-xl text-white font-medium transition duration-200 ${
                active === "pending" ? "bg-blue-600" : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              Pending Requests
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {active === "friends" &&
            connections?.length > 0 ? (
            connections.map((connection) => (
              <ConnectionCard
                connection={connection}
                key={connection?._id}
                displayBtns={false}
              />
            ))
          ) : active === "friends" ? (
            <p className="text-gray-500 col-span-full text-center">No friends found</p>
          ) : null}

          {active === "pending" &&
            pending?.length > 0 ? (
            pending.map((connection) => (
              <ConnectionCard
                connection={connection}
                key={connection?._id}
                displayBtns={true}
                handleAccept={handleAccept}
                handleReject={handleReject}
              />
            ))
          ) : active === "pending" ? (
            <p className="text-gray-500 col-span-full text-center">No pending requests</p>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default MyNetwork;
