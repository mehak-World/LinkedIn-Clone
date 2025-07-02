import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import {  toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { backend_url } from "../utils/app";

const GoogleAuth = () => {
  const navigate = useNavigate();
  return (
    <div>
      <GoogleOAuthProvider clientId="640995036941-n4tp0khk8ippnkpd11kjscjgl87u6uhe.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const decoded = jwtDecode(credentialResponse.credential);
            console.log(decoded); // contains name, email, picture, sub (Google ID)

            const googleUser = {
              name: decoded.name,
              email: decoded.email,
              password: decoded.sub, // you can use `sub` as a unique password substitute
            };

            axios
              .post(`${backend_url}/auth/google-signin`, googleUser)
              .then((res) => {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                navigate("/feed");
              })
              .catch((err) => {
                console.error(err);
                toast.error("Google Sign-In failed");
              });
          }}
          onError={() => {
            console.log("Login Failed");
            toast.error("Google Sign-In failed");
          }}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleAuth;
