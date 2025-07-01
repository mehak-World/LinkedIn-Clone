import { useState, useEffect, useContext } from "react";
import HomeNav from "../../components/HomeNav";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { signUp, signIn } from "../../utils/auth";
import GoogleAuth from "../../components/GoogleAuth";

const SignIn = () => {
  const { initial } = useParams();
  const navigate = useNavigate();
  // Create state variable to manage the sign in/sign up status
  const [isSignUp, setIsSignUp] = useState(initial == "true");

  // State variables for email, name, and password
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      signUp(email, name, password, toast, navigate);
    } else {
      signIn(email, password, toast, navigate);
    }
  };

  useEffect(() => {
    setIsSignUp(initial == "true");
  }, [initial]);

  return (
    <>
      <HomeNav />
      <div className="w-[350px]  bg-gray-100 shadow-2xl relative mx-auto my-[8%] p-10">
        <ToastContainer />
        <h2 className="text-3xl">{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <form>
          {isSignUp && (
            <div className="my-4">
              <label for="name">Full Name</label> <br />
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="w-[100%] border-2 rounded-lg p-2"
              ></input>
            </div>
          )}
          <div className="my-4">
            <label for="email">Email</label> <br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-[100%] border-2 rounded-lg p-2"
            ></input>
          </div>
          <div>
            <label for="password">Password</label> <br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-[100%] border-2 rounded-lg p-2"
            ></input>
          </div>
          <button
            className="p-3 my-5 bg-blue-700 text-white text-center rounded-lg w-full "
            type="submit"
            onClick={(e) => handleSignUp(e)}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        {!isSignUp && (
          <p>
            New to LinkedIn?{" "}
            <span
              className="text-blue-700 cursor-pointer"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              Join Now
            </span>
          </p>
        )}
        {isSignUp && (
          <p>
            Already have an account,{" "}
            <span
              className="text-blue-700 cursor-pointer"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              Sign In
            </span>
          </p>
        )}
        <hr></hr>
        <br />

        <p className="p-2 text-center">or</p>
        <GoogleAuth />
      </div>
    </>
  );
};

export default SignIn;
