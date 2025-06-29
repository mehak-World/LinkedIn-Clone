import axios from "axios";

export const signUp = async (
  email,
  name,
  password,
  toast,
  navigate,
  setUser
) => {
  try {
    const response = await axios.post("http://localhost:3000/auth/sign-up", {
      email,
      name,
      password,
    });
    console.log(response);
    if (response && response.data.message) {
      localStorage.setItem("token", response.data.token)
      console.log(response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.new_user)); // in signUp

      setUser(response.data.new_user);
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
  navigate,
  setUser) => {
     try{
        const response = await axios.post("http://localhost:3000/auth/sign-in", {email, password});
        console.log(response);
        if(response && response.data.message){
          console.log(response.data);
          localStorage.setItem("token", response.data.token)
          localStorage.setItem("user", JSON.stringify(response.data.user));

          setUser(response.data.user)
          navigate("/feed")
        }
      }
      catch(err){
        toast.error("Could not sign-in the user");
      }
}

