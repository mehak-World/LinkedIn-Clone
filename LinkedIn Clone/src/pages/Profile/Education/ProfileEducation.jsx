import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../../components/Card";
import { formatDate } from "../../../utils/profile";
import { getProfile } from "../../../utils/profile";
import axios from "axios"
import { backend_url } from "../../../utils/app";


const ProfileEducation = ({ user_id, id, profile, setProfile }) => {
  const [education, setEducation] = useState([]);

   const [showMore, setShowMore] = useState(true)
  

  useEffect(() => {
    setEducation(profile?.education || []);
  }, [profile]);

  const handleShowDesc = () => {
      setShowMore(!showMore)
  }

  const handleDeleteEdu = async (edu_id) => {
    const res = await axios.post(
      `${backend_url}/profile/${user_id}/education/${edu_id}/delete`
    );

    if (res) {
      const response = await getProfile(user_id, setProfile);
      setExperiences(response.education);
    }
  };

  return (
    <div>
      <div className="w-full bg-gray-50 mt-20 p-10">
        <div className="flex justify-between ">
          <h2 className="text-2xl font-semibold mb-4">Education</h2>

          {user_id == id && (
            <div>
              <Link to={"/profile/" + id + "/education"}>
                <i class="fa-solid fa-plus"></i>
              </Link>
            </div>
          )}
        </div>
        <div>
          {education.map((edu) => {
            return (
              <Card padding={3}>
                <div className="flex justify-between">
                  <div className="p-3">
                    <h2 className="text-2xl mb-1">{edu.school}</h2>
                    <p className="mb-1 text-md  text-gray-700">
                      {edu.fieldOfStudy}
                    </p>
                    <p className="mb-1 text-md  text-gray-700">
                      {edu.city} {edu.city && ","} {edu.country}
                    </p>

                    {edu.current ? (
                      <p className="text-md text-gray-600">
                        {formatDate(edu.startDate)} {edu.startDate && "-"} Present
                      </p>
                    ) : (
                      <p className="text-md text-gray-600">
                        {formatDate(edu.startDate)} {edu.startDate && "-"} {formatDate(edu.endDate)}
                      </p>
                    )}
                      <div className = "mt-4">
                        {edu.description.length > 200 ? (
                      <>
                        {showMore && edu.description.slice(0, 200)}
                        {!showMore && edu.description}
                        <button className="text-blue-500 cursor-pointer ml-3" onClick = {handleShowDesc }>
                          {showMore ?  "Show more" : "Show Less"}
                        </button>
                      </>
                    ) : (
                      edu.description
                    )}
                    </div>
                  </div>
                
                  {user_id == id && (
                    <div className="flex justify-center align-middle">
                      <Link to={"/profile/" + id + "/education/" + edu._id}>
                        <i class="fa-solid fa-pen"></i>
                      </Link>
                      <i
                        className="fa-solid fa-trash ml-7 cursor-pointer"
                        onClick={() => {
                          handleDeleteEdu(edu._id);
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

export default ProfileEducation;
