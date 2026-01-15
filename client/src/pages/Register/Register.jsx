import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import SocialLogin from "@/components/ui/socialLogin";
import useAxiosURL from "@/hooks/useAxiosURL";

const Register = () => {
  const navigate = useNavigate();
  const axios = useAxiosURL();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { theme, createUser, updateUserProfile } = useAuth();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = (data) => {
    createUser(data.email, data.password)
      .then(() => {
        updateUserProfile(data.name, data.photoURL)
          .then(() => {
            const userInfo = {
              name: data.name,
              email: data.email,
              photoURL: data.photoURL,
              subscription: "Bronze",
            };
            axios.post("/users", userInfo).then((res) => {
              if (res.data.insertedId) {
                toast.success("User created successfully.");
                navigate(from);
              }
            });
          })
          .catch((error) => {
            console.log(error);
            toast.error("Registration failed. Please try again.");
          });
      })
      .catch((error) => {
        console.log(error);
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
        className={`bg-white p-8 rounded-lg shadow-lg w-full max-w-md ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2
          className={`text-3xl font-semibold mb-6 text-center ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Register
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Name is required" })}
              className={`border ${
                theme === "dark" ? "border-gray-600" : "border-gray-300"
              } rounded-lg p-3 w-full`}
              placeholder="Your name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
              htmlFor="photoURL"
            >
              Photo URL
            </label>
            <input
              type="text"
              id="photoURL"
              {...register("photoURL", { required: "Photo URL is required" })}
              className={`border ${
                theme === "dark" ? "border-gray-600" : "border-gray-300"
              } rounded-lg p-3 w-full`}
              placeholder="Your photo URL"
            />
            {errors.photoURL && (
              <p className="text-red-500 text-xs mt-1">
                {errors.photoURL.message}
              </p>
            )}
          </div>

          <div>
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
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                  message: "Invalid email format",
                },
              })}
              className={`border ${
                theme === "dark" ? "border-gray-600" : "border-gray-300"
              } rounded-lg p-3 w-full`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
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
              {...register("password", { required: "Password is required" })}
              className={`border ${
                theme === "dark" ? "border-gray-600" : "border-gray-300"
              } rounded-lg p-3 w-full`}
              placeholder="********"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full ${
              theme === "dark" ? "bg-blue-600" : "bg-blue-600"
            } text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300`}
          >
            Register
          </button>
        </form>

        <SocialLogin />

        <div className="mt-4 text-center">
          <span
            className={`text-sm ${
              theme === "dark" ? "text-gray-300" : "text-black"
            }`}
          >
            Already have an account?
          </span>
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
