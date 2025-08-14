import axios from "axios";
import { backend_url } from "./app";

// Fetch profile by user ID
export const getProfile = async (id, setProfileUser) => {
  const res = await axios.get(`${backend_url}/profile/` + id);
  setProfileUser(res.data);
  return res.data;
};

// Fetch bio info
export const getBio = async (id, setTitle, setCity, setCountry) => {
  const res = await axios.get(`${backend_url}/profile/` + id);
  const profile = res.data;
  setTitle(profile?.profileTitle || "");
  setCity(profile?.city || "");
  setCountry(profile?.country || "");
};

// Fetch profile image
export const getProfileImage = async (id, image, setImage) => {
  const res = await axios.get(`${backend_url}/profile/` + id);
  const profile = res.data;
  setImage(profile?.profilePic || image);
};

// Fetch about info
export const getAbout = async (id, setAbout) => {
  const res = await axios.get(`${backend_url}/profile/` + id);
  setAbout(res.data?.about);
};

// Handle connection requests
export const handleConnection = async (setProfileUser, id, user_id) => {
  try {
    const res = await axios.post(`${backend_url}/connections/pending`, {
      user_id: id,
      connection_id: user_id,
    });
    console.log(res);

    setProfileUser((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        pendingRequests: [...(prev.profile.pendingRequests || []), user_id],
      },
    }));
  } catch (err) {
    console.error("Failed to send connection request:", err);
  }
};

// Fetch experience by ID
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
  const exp = profile.experience.find((e) => e._id === exp_id);
  if (!exp) return;

  setPosition(exp.position);
  setCountry(exp.country);
  setCity(exp.city);
  setDescription(exp.description);
  setCompany(exp.company);
  setStartDate(exp.startDate ? exp.startDate.slice(0, 7) : "");
  setEndDate(exp.endDate ? exp.endDate.slice(0, 7) : "");
  setCurrentlyWorking(exp.current);
};

// Handle profile picture change
export const handleProfilePicChange = async (e, setProfileUser, id) => {
  const file = e.target.files[0];
  if (!file) return;

  // Preview using base64
  const reader = new FileReader();
  reader.onloadend = () => {
    setProfileUser((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        profilePic: reader.result, // temporarily preview
      },
    }));
  };
  reader.readAsDataURL(file);

  // Upload to backend
  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post(`${backend_url}/profile/${id}/profilePic`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // After upload, update profileUser with server-returned URL
  if (res.data?.profilePic) {
    setProfileUser((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        profilePic: `${backend_url}/${res.data.profilePic}`,
      },
    }));
  }
};


// Handle background picture change
export const handleFileChange = async (e, setProfileUser, id) => {
  const file = e.target.files[0];
  if (!file) return;

  // Preview
  const reader = new FileReader();
  reader.onloadend = () => {
    setProfileUser((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        bgPic: reader.result,
      },
    }));
  };
  reader.readAsDataURL(file);

  // Upload to backend
  const formData = new FormData();
  formData.append("image", file);

  await axios.post(`${backend_url}/profile/${id}/bgImage`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Format date
export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}
