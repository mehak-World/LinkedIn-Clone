import React, { useState, useEffect } from "react";
import Card from "../../components/Card";
import { getUser } from "../../utils/user";
import { Link, useNavigate } from "react-router-dom";
import ProfileCard from "../../components/ProfileCard";

const ConnectionCard = ({
  connection,
  displayBtns,
  handleAccept,
  handleReject,
}) => {
  const [profileUser, setProfileUser] = useState(null);
  const navigate = useNavigate();

  const handleMessage = () => {
    navigate(`/messages?user=${connection._id}`);
  };

  useEffect(() => {
    const getProfileUser = async () => {
      const data = await getUser(connection?._id);
      setProfileUser(data);
    };

    getProfileUser();
  }, [connection]);

  return (
    <div>
      <Card padding={3} key={connection._id}>
        <div className="flex flex-col gap-3 justify-center items-center">
          <Link to={"/profile/" + connection._id} key={connection._id}>
            <ProfileCard user={profileUser} />
          </Link>

          {displayBtns && (
            <div className="flex gap-3 mt-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-xl transition cursor-pointer"
                onClick={() => handleAccept(connection._id)}
              >
                Accept
              </button>
              <button
                className="bg-gray-700  text-white px-4 py-2 rounded-xl transition cursor-pointer"
                onClick={() => handleReject(connection._id)}
              >
                Reject
              </button>
            </div>
          )}
          {!displayBtns && (
            <div className="flex gap-3 mt-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-xl transition cursor-pointer"
                onClick={() => handleMessage()}
              >
                Message
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ConnectionCard;
