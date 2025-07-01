import React, { useEffect, useState } from 'react';
import MainNav from '../../components/MainNav';
import axios from 'axios';
import ConnectionCard from './ConnectionCard';
import { ToastContainer, toast } from 'react-toastify';

const MyNetwork = () => {
  const [active, setActive] = useState("friends");
  const user = JSON.parse(localStorage.getItem("user"));
  const [connections, setConnections] = useState([]);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    const getConnections = async () => {
      const res = await axios.get("http://localhost:3000/connections/" + user?._id);
      if (res) {
        setConnections(res.data.connections);
        setPending(res.data.pendingRequests);
      }
    };

    if(user){
        getConnections();
    }
    
  }, [active]);

  const handleAccept = async (id) => {
    const res = await axios.post("http://localhost:3000/connections/accept" , {user_id: user?._id, connection_id: id });
      if (res) {
        setConnections(res.data.connections);
        setPending(res.data.pendingRequests);
        const notify = () => toast("Connection successfully added");
        notify()
      }
  }


  const handleReject = async (id) => {
    const res = await axios.post("http://localhost:3000/connections/reject" , {user_id: user?._id, connection_id: id });
      if (res) {
        setConnections(res.data.connections);
        setPending(res.data.pendingRequests);
      }
  }

  return (
    <>
      <MainNav />
      <ToastContainer />
      <div className="px-5 xl:px-48 py-10 w-full min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-100 p-6 rounded-2xl shadow-md">
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
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {active === "friends" &&
            connections?.map((connection) => (
             
                <ConnectionCard connection = {connection} key = {connection?._id} displayBtns={false} />
                
            ))}

          {active === "pending" &&
            pending?.map((connection) => (
             <ConnectionCard connection = {connection} key = {connection?._id} displayBtns={true} handleAccept = {handleAccept} handleReject={handleReject}/>
            ))}
        </div>
      </div>
    </>
  );
};

export default MyNetwork;
