import React, { useState, useEffect } from "react";
import MainNav from "../../../components/MainNav";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getExperience } from "../../../utils/profile";
import { backend_url } from "../../../utils/app";

const EditExperience = () => {
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const {user_id, exp_id} = useParams();

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    getExperience(user_id, exp_id , setPosition, setCountry, setCity, setDescription,  setCompany, setStartDate, setEndDate, setCurrentlyWorking)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backend_url}/profile/${user_id}/experience/${exp_id}`,
        {
          position,
          company,
          city,
          country,
          startDate,
          endDate,
          description,
          current: currentlyWorking
        }
      );
      console.log("Experience updated:", response.data);
      if(response){
        navigate("/profile/" + user_id);
      }
    } catch (error) {
      console.error("Failed to add experience:", error);
    }
  };

  return (
    <>
      <MainNav />
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Experience</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Position */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Position</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g., Software Engineer"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Google"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Start Date</label>
              <input
                type="month"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {!currentlyWorking && (
              <div>
                <label className="block text-gray-700 font-medium mb-1">End Date</label>
                <input
                  type="month"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Currently Working */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="currentlyWorking"
              checked={currentlyWorking}
              onChange={() => setCurrentlyWorking(!currentlyWorking)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="currentlyWorking" className="ml-2 text-gray-700">
              I currently work here
            </label>
          </div>

          {/* City and Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., New York"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g., USA"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Job Description / Responsibilities</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your role, achievements, tools used..."
              rows="5"
              className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Save Experience
          </button>
        </form>
      </div>
    </>
  );
};

export default EditExperience;
