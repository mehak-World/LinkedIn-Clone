import React, {useEffect, useState} from "react";
import MainNav from "../../components/MainNav";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { getBio } from "../../utils/profile";
import { backend_url } from "../../utils/app";

const Bio = () => {
    const [title, setTitle] = useState("")
    const [city, setCity] = useState("")
    const [country, setCountry] = useState("")
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    

    useEffect(() => {
        getBio(user._id, setTitle, setCity, setCountry);
    }, [])

    const handleSubmit = async (e) => {
            e.preventDefault();
            const response =  await axios.post(`${backend_url}/profile/` + user._id +"/bio", {title, city, country});
            if(response.data){
                navigate("/profile/" + user._id);
            }
            else{
                alert("Error! Could not submit the form")
            }
    }
  
    return (
        <>
        <MainNav />
         <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Bio</h2>
      <form className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Profile Heading</label>
          <input
            type="text"
            value = {title}
            onChange= {(e) => setTitle(e.target.value)}
            placeholder="Enter your name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">City</label>
          <input
            type="text"
            value = {city}
            onChange = {(e) => setCity(e.target.value)}
            placeholder="Enter your city"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Country</label>
          <input
            type="text"
            value = {country}
            onChange = {(e) => setCountry(e.target.value)}
            placeholder="Enter your country"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          onClick = {(e) => handleSubmit(e)}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Save Changes
        </button>
      </form>
    </div>
        </>
   
  );
};

export default Bio;
