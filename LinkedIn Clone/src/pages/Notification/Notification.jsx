import React, { useEffect, useState } from "react";
import MainNav from "../../components/MainNav.jsx";
import Card from "../../components/Card.jsx";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Notification = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [notifications, setNotifications] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const readAllNotifs = async () => {
      await axios.post("http://localhost:3000/connections/readNotif", {user_id: user?._id})
    }
    if(user){
          readAllNotifs();
    }
  
  })

  useEffect(() => {
    const getNotifications = async () => {
      const res = await axios.get(
        "http://localhost:3000/profile/" + user?._id + "/notifications"
      );
      if (res) {
        console.log(res.data);
        setNotifications(res.data);
      }
    };

    if(user){
      getNotifications();
    }
   
  }, [refresh]);

  const handleAccept = async (notif) => {
    const res = await axios.post("http://localhost:3000/connections/accept" , {user_id: user?._id, connection_id: notif.from });
    console.log(res)  
    if (res) {
        const notify = () => toast("Connection successfully added");
        notify()
        setRefresh(!refresh);
      }
  }

    const handleReject = async (id) => {
    const res = await axios.post("http://localhost:3000/connections/reject" , {user_id: user?._id, connection_id: id });
      if (res) {
        const notify = () => toast("Connection ignored");
        notify()
        setRefresh(!refresh);
      }
  }


  const handleNotifDelete = async (notif_id) => {
      const res = await axios.post("http://localhost:3000/connections/notif/delete", {user_id: user?._id, notif_id})
      if(res){
        setRefresh(!refresh)
      }
  }

  return (
    <>
      <MainNav />
      <ToastContainer />
      <div className="px-10 xl:px-50 py-9 w-full bg-gray-100 mt-5 ">
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="text-xl font-semibold border-b border-gray-200 p-3 mb-5">
              Notifications
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {[...notifications].reverse().map((notif) => (
                <div
                  key={notif.id}
                  className="flex justify-between items-center p-4 bg-white shadow-sm rounded-md border border-gray-200 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-blue-500 text-lg mt-1">
                      {notif.notifType === "accepted" && (
                        <i className="fa-solid fa-user-plus"></i>
                      )}
                      {notif.notifType === "like" && (
                        <i className="fa-solid fa-heart"></i>
                      )}
                      {notif.notifType === "message" && (
                        <i className="fa-solid fa-envelope"></i>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{notif.message}</p>
                      <p className="text-xs text-gray-500">{notif.time}</p>
                    </div>
                  </div>

 {notif.notifType === "pending" && (
                    <div className="flex gap-2">
                      <button className="text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick = {() => handleAccept(notif)}>
                        Accept
                      </button>
                      <button onClick = {handleReject} className="text-sm px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-100">
                        Ignore
                      </button>
                    </div>
                  )}
                   <div>
                      <i className="fa-solid fa-xmark cursor-pointer" onClick = {() => handleNotifDelete(notif._id)} />
                    </div>

                
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Notification;
