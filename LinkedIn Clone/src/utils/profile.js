import axios from "axios"
import { backend_url } from "./app";

export const getProfile = async (id, setProfile) => {
  const res = await axios.get(`${backend_url}/profile/` + id);
   const profile = res.data;
  setProfile(profile);
  return res.data;
}

export const getBio = async (id, setTitle, setCity, setCountry) => {
   const res = await axios.get(`${backend_url}/profile/` + id);
   const profile = res.data;
   console.log(profile);

   setTitle(profile?.profileTitle || "")
   setCity(profile?.city || "")
   setCountry(profile?.country || "")

}

export const getProfileImage = async (id, image, setImage) => {
 const res = await axios.get(`${backend_url}/profile/` + id);
   const profile = res.data;
   console.log(profile);

   setImage(profile?.profilePic || image)
}

export const getAbout = async (id, setAbout) => {
    const res = await axios.get(`${backend_url}/profile/` + id);
    const profile = res.data;
    console.log(profile)
    setAbout(profile?.about);
}


  export const handleConnection = async (setProfile, id, user_id) => {
  try {
    const res = await axios.post(`${backend_url}/connections/pending`, {
      user_id: id,
      connection_id: user_id
    });
    console.log(res);

    // Immediately update the state to show "Pending"
    setProfile((prevProfile) => ({
      ...prevProfile,
      pendingRequests: [...(prevProfile.pendingRequests || []), user_id]
    }));
  } catch (err) {
    console.error("Failed to send connection request:", err);
  }
};



export const getExperience = async (
  id,
  exp_id,
  setPosition,
  setCountry,
  setCity,
  setDescription,
  setCompany,
  setStartDate,
  setEndDate,
  setCurrentlyWorking
) => {
  const res = await axios.get(`${backend_url}/profile/` + id);
  const profile = res.data;
  console.log(profile);

  const experiences = profile.experience.filter((exp) => exp._id == exp_id);
  console.log(experiences);

  const exp = experiences[0];
  console.log(exp);

  setPosition(exp.position);
  setCountry(exp.country);
  setCity(exp.city);
  setDescription(exp.description);
  setCompany(exp.company);
  setStartDate(exp.startDate ? exp.startDate.slice(0, 7) : "");
  setEndDate(exp.endDate ? exp.endDate.slice(0, 7) : "");
  setCurrentlyWorking(exp.current);
};

export const handleProfilePicChange = async (e, setProfile, id) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        profilePic: reader.result, 
      }));
    };
    reader.readAsDataURL(file);

    // Upload to backend
    const formData = new FormData();
    formData.append("image", file);

    await axios.post(
      `${backend_url}/profile/${id}/profilePic`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };

  export  const handleFileChange = async (e, setProfile, id) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        bgPic: reader.result,
      }));
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image", file); 

    await axios.post(`${backend_url}/${id}/bgImage`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  export function formatDate(dateString) {
    if (!dateString) return "";
    console.log(dateString);
    const date = new Date(dateString);
    console.log(date);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      timeZone: "UTC",
    }); 
  }

 
