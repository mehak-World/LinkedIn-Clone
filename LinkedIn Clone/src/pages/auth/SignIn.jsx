import { useState, useEffect } from "react";
import HomeNav from "../../components/HomeNav";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { signUp, signIn } from "../../utils/auth";
import GoogleAuth from "../../components/GoogleAuth";

const SignIn = () => {
  const { initial } = useParams();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(initial === "true");

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
    setIsSignUp(initial === "true");
  }, [initial]);

  return (
    <>
      <HomeNav />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-10">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 sm:p-10 pt-15">
          <ToastContainer />
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
            {isSignUp ? "Sign Up" : "Sign In"}
          </h2>
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">
                  Full Name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="w-full border-2 rounded-lg p-2 focus:outline-blue-500"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 rounded-lg p-2 focus:outline-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 rounded-lg p-2 focus:outline-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-blue-700 text-white rounded-lg font-medium mt-4 hover:bg-blue-800 transition"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-4 text-sm">
            {!isSignUp ? (
              <p>
                New to LinkedIn?{" "}
                <span
                  className="text-blue-700 cursor-pointer font-semibold"
                  onClick={() => setIsSignUp(true)}
                >
                  Join Now
                </span>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <span
                  className="text-blue-700 cursor-pointer font-semibold"
                  onClick={() => setIsSignUp(false)}
                >
                  Sign In
                </span>
              </p>
            )}
          </div>

          <hr className="my-4" />
          <p className="text-center text-gray-500 mb-4">or</p>
          <div className="flex justify-center">
            <GoogleAuth />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
