import React, {useState, useEffect} from "react";
import MainNav from "../../../components/MainNav";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { getAbout } from "../../../utils/profile";

const About = () => {

    // State for about section
    const [about, setAbout] = useState("");
    const user = JSON.parse(localStorage.getItem("user"))
    const navigate = useNavigate();

    useEffect(() => {
      getAbout(user._id, setAbout)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(user){
            const response =  await axios.post("http://localhost:3000/profile/" + user._id + "/about", {about});
           console.log(response);
            if(response.data){
                navigate("/profile/" + user._id);
           }
        
    }
}

  return (
    <>
    <MainNav />
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit About</h2>
      <form className="space-y-5">
       
        <div>
          <label className="block text-gray-700 font-medium mb-1">Summary</label>
          <textarea
  rows="6"
  value={about}
  onChange={(e) => setAbout(e.target.value)}
  placeholder="Write a brief summary about yourself..."
  className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
/>

        </div>

        <button
          type="submit"
          onClick = {(e) => handleSubmit(e)}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Save About Info
        </button>
      </form>
    </div>
    </>
    
  );
};

export default About;
