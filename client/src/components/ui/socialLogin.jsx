import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router";
import useAxiosURL from "@/hooks/useAxiosURL";

const SocialLogin = () => {
  const { theme, googleLogin } = useAuth();
  const axios = useAxiosURL();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const handleGoogleLogin = () => {
    googleLogin()
      .then((users) => {
        const user = users.user;
        const userInfo = {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          subscription: "Bronze",
        };
        axios.post("/users", userInfo).then((res) => {
          console.log(res.data);
          if (res.data.insertedId) {
            toast.success("User created successfully.");
            navigate(from);
          } else {
            toast.success("Login successful!");
            navigate(from);
          }
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Google login failed. Please try again.");
      });
  };
  return (
    <>
      <div className="mt-4 text-center">
        <button
          onClick={handleGoogleLogin}
          className={`w-full ${
            theme === "dark" ? "bg-red-600" : "bg-red-600"
          } text-white py-2 rounded-lg hover:bg-red-700 transition duration-300`}
        >
          <FaGoogle className="inline-block mr-2" />
          Login with Google
        </button>
      </div>
    </>
  );
};

export default SocialLogin;
