import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../../components/Card";
import { formatDate } from "../../../utils/profile";
import axios from "axios";
import { getProfile } from "../../../utils/profile";

const ProfileExperience = ({ user_id, id, profile, setProfile }) => {
  const [experiences, setExperiences] = useState([]);
  const [showMore, setShowMore] = useState(true)
  

  useEffect(() => {
    setExperiences(profile?.experience || []);
  }, [profile]);

  const handleShowDesc = () => {
      setShowMore(!showMore)
  }

  const handleDeleteExp = async (exp_id) => {
    const res = await axios.post(
      `http://localhost:3000/profile/${user_id}/experience/${exp_id}/delete`
    );

    if (res) {
      const response = await getProfile(user_id, setProfile);
      setExperiences(response.experience);
    }
  };

  return (
    <div>
      <div className="w-full bg-gray-50 mt-20 p-10">
        <div className="flex justify-between ">
          <h2 className="text-2xl font-semibold mb-4">Experience</h2>

          {user_id == id && (
            <div>
              <Link to={"/profile/" + id + "/experience"}>
                <i class="fa-solid fa-plus"></i>
              </Link>
            </div>
          )}
        </div>
        <div>
          {experiences?.map((exp) => {
            return (
              <Card padding={3} key={exp._id}>
                <div className="flex justify-between">
                  <div className="p-3">
                    <h2 className="text-2xl mb-1">{exp.position}</h2>
                    <p className="mb-1 text-md  text-gray-700">
                      {exp.company} {exp.company && ","} {exp.city}{" "}
                      {exp.city && ","} {exp.country}
                    </p>
                    {exp.current ? (
                      <p className="text-md text-gray-600">
                        {formatDate(exp.startDate)} {exp.startDate && "-"}{" "}
                        Present
                      </p>
                    ) : (
                      <p className="text-md text-gray-600">
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      </p>
                    )}
                    <div className = "mt-4">
                        {exp.description.length > 200 ? (
                      <>
                        {showMore && exp.description.slice(0, 200)}
                        {!showMore && exp.description}
                        <button className="text-blue-500 cursor-pointer ml-3" onClick = {handleShowDesc }>
                          {showMore ?  "Show more" : "Show Less"}
                        </button>
                      </>
                    ) : (
                      exp.description
                    )}
                    </div>
                    
                  </div>
                  {console.log(exp)}
                  {user_id == id && (
                    <div className = "flex justify-center align-middle">
                      <Link to={"/profile/" + id + "/experience/" + exp._id}>
                        <i class="fa-solid fa-pen"></i>
                      </Link>
                      <i
                        className="fa-solid fa-trash ml-7 cursor-pointer"
                        onClick={() => {
                          handleDeleteExp(exp._id);
                        }}
                      ></i>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileExperience;
