import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import SocialLogin from "@/components/ui/socialLogin";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { theme, loginUser } = useAuth();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = (data) => {
    loginUser(data.email, data.password)
      .then((user) => {
        console.log(user);
        toast.success("Login successful!");
        navigate(from);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Login failed. Please try again.");
      });
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-b ${
        theme === "dark"
          ? "from-gray-900 to-gray-800"
          : "from-gray-50 to-gray-100"
      }`}
    >
      <div
        className={`bg-white p-8 rounded-lg shadow-lg w-full max-w-sm ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-6 text-center ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: true })}
              className={`border ${
                theme === "dark" ? "border-gray-600" : "border-gray-300"
              } rounded-lg p-2 w-full`}
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-2">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: true })}
              className={`border ${
                theme === "dark" ? "border-gray-600" : "border-gray-300"
              } rounded-lg p-2 w-full`}
              placeholder="********"
            />
          </div>
          <div className="mb-2">
            <a
              href="#"
              className={`text-sm ${
                theme === "dark" ? "text-gray-300" : "text-blue-600"
              } hover:underline`}
            >
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className={`w-full ${
              theme === "dark" ? "bg-blue-600" : "bg-blue-600"
            } text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300`}
          >
            Login
          </button>
        </form>
        <SocialLogin />

        <div className="mt-4 text-center">
          <span
            className={`text-sm ${
              theme === "dark" ? "text-gray-300" : "text-black"
            }`}
          >
            Don&lsquo;t have an account?
          </span>
          <Link to="/register" className={`text-blue-600 hover:underline`}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
