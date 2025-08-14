import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../../components/Card";
import { formatDate } from "../../../utils/profile";
import axios from "axios";
import { getProfile } from "../../../utils/profile";
import { backend_url } from "../../../utils/app";

const ProfileExperience = ({ user_id, id, profile, setProfile }) => {
  const [experiences, setExperiences] = useState([]);
  const [expandedDesc, setExpandedDesc] = useState({});

  useEffect(() => {
    setExperiences(profile?.experience || []);
  }, [profile]);

  const toggleDescription = (expId) => {
    setExpandedDesc((prev) => ({
      ...prev,
      [expId]: !prev[expId],
    }));
  };

  const handleDeleteExp = async (exp_id) => {
    const res = await axios.post(
      `${backend_url}/profile/${user_id}/experience/${exp_id}/delete`
    );
    if (res) {
      const response = await getProfile(user_id, setProfile);
      setExperiences(response.experience);
    }
  };

  return (
    <div className="mt-10 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Experience</h2>
        {user_id === id && (
          <Link
            to={`/profile/${id}/experience`}
            className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition"
            title="Add Experience"
          >
            <i className="fa-solid fa-plus"></i>
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {experiences?.map((exp) => (
          <Card padding={4} key={exp._id} className="hover:shadow-lg transition rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">
                  {exp.position}
                </h3>
                <p className="text-gray-700 mb-1">
                  {exp.company}
                  {exp.company && exp.city && ", "} {exp.city}
                  {exp.city && exp.country && ", "} {exp.country}
                </p>
                <p className="text-gray-600 mb-2">
                  {formatDate(exp.startDate)}{" "}
                  {exp.current ? "- Present" : `- ${formatDate(exp.endDate)}`}
                </p>
                {exp.description && (
                  <p className="text-gray-700 text-sm md:text-base">
                    {exp.description.length > 200 && !expandedDesc[exp._id]
                      ? `${exp.description.slice(0, 200)}...`
                      : exp.description}
                    {exp.description.length > 200 && (
                      <button
                        onClick={() => toggleDescription(exp._id)}
                        className="ml-2 text-blue-500 hover:underline"
                      >
                        {expandedDesc[exp._id] ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </p>
                )}
              </div>

              {user_id === id && (
                <div className="flex gap-4 mt-3 md:mt-0 items-center">
                  <Link
                    to={`/profile/${id}/experience/${exp._id}`}
                    className="text-gray-600 hover:text-gray-900 transition"
                    title="Edit Experience"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </Link>
                  <button
                    onClick={() => handleDeleteExp(exp._id)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Delete Experience"
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

export default ProfileExperience;
