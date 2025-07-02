import axios from "axios";
import { backend_url } from "./app";

export const signUp = async (
  email,
  name,
  password,
  toast,
  navigate
) => {
  try {
    const response = await axios.post(`${backend_url}/auth/sign-up`, {
      email,
      name,
      password,
    });
    console.log(response);
    if (response && response.data.message) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.new_user)); // in signUp
      navigate("/feed");
    } else {
      toast.error("Could not register the user");
    }
  } catch (err) {
    toast.error("Could not register the user");
  }
};


export const signIn = async ( email,
  password,
  toast,
  navigate) => {
     try{
        const response = await axios.post(`${backend_url}/auth/sign-in`, {email, password});
        if(response && response.data.message){
          localStorage.setItem("token", response.data.token)
          localStorage.setItem("user", JSON.stringify(response.data.user));
          navigate("/feed")
        }
      }
      catch(err){
        toast.error("Could not sign-in the user");
      }
}

