import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../../components/Card";
import { formatDate, getProfile } from "../../../utils/profile";
import axios from "axios";
import { backend_url } from "../../../utils/app";

const ProfileEducation = ({ user_id, id, profile, setProfile }) => {
  const [education, setEducation] = useState([]);
  const [expandedDesc, setExpandedDesc] = useState({});

  useEffect(() => {
    setEducation(profile?.education || []);
  }, [profile]);

  const toggleDescription = (eduId) => {
    setExpandedDesc((prev) => ({
      ...prev,
      [eduId]: !prev[eduId],
    }));
  };

  const handleDeleteEdu = async (edu_id) => {
    const res = await axios.post(
      `${backend_url}/profile/${user_id}/education/${edu_id}/delete`
    );

    if (res) {
      const response = await getProfile(user_id, setProfile);
      setEducation(response.education);
    }
  };

  return (
    <div className="mt-10 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Education</h2>
        {user_id === id && (
          <Link
            to={`/profile/${id}/education`}
            className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition"
            title="Add Education"
          >
            <i className="fa-solid fa-plus"></i>
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {education?.map((edu) => (
          <Card padding={4} key={edu._id} className="hover:shadow-lg transition rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">
                  {edu.school}
                </h3>
                <p className="text-gray-700 mb-1">{edu.fieldOfStudy}</p>
                <p className="text-gray-700 mb-1">
                  {edu.city}{edu.city && edu.country && ", "} {edu.country}
                </p>
                <p className="text-gray-600 mb-2">
                  {formatDate(edu.startDate)} {edu.current ? "- Present" : `- ${formatDate(edu.endDate)}`}
                </p>
                {edu.description && (
                  <p className="text-gray-700 text-sm md:text-base">
                    {edu.description.length > 200 && !expandedDesc[edu._id]
                      ? `${edu.description.slice(0, 200)}...`
                      : edu.description}
                    {edu.description.length > 200 && (
                      <button
                        onClick={() => toggleDescription(edu._id)}
                        className="ml-2 text-blue-500 hover:underline"
                      >
                        {expandedDesc[edu._id] ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </p>
                )}
              </div>

              {user_id === id && (
                <div className="flex gap-4 mt-3 md:mt-0 items-center">
                  <Link
                    to={`/profile/${id}/education/${edu._id}`}
                    className="text-gray-600 hover:text-gray-900 transition"
                    title="Edit Education"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </Link>
                  <button
                    onClick={() => handleDeleteEdu(edu._id)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Delete Education"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfileEducation;
