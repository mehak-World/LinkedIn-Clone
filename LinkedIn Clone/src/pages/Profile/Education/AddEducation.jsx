import React, { useState } from "react";
import MainNav from "../../../components/MainNav";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { backend_url } from "../../../utils/app";

const Education = () => {
  const [currentlyStudying, setCurrentlyStudying] = useState(false);
  const [school, setSchool] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"))

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(`${backend_url}/profile/` + user._id + "/education", {school, startDate, endDate, currentlyStudying, city, country, description, fieldOfStudy})
    if(response){
        navigate("/profile/"  + user._id)
    }
}

  return (
    <>
      <MainNav />
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add Education</h2>
        <form className="space-y-5">
          {/* School */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">School / University</label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="e.g., University of Toronto"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Field of Study */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Field of Study</label>
            <input
              type="text"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              placeholder="e.g., Computer Science"
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

            {!currentlyStudying && (
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

          {/* Currently Studying */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="currentlyStudying"
              checked={currentlyStudying}
              onChange={() => setCurrentlyStudying(!currentlyStudying)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="currentlyStudying" className="ml-2 text-gray-700">
              I currently study here
            </label>
          </div>

          {/* City & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., Toronto"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g., Canada"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Courses, achievements, projects, or other details"
              rows="5"
              className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            onClick = {(e) => handleSubmit(e)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Save Education
          </button>
        </form>
      </div>
    </>
  );
};

export default Education;
