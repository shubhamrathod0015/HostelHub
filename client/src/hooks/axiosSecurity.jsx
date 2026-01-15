import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import useAuth from "./useAuth";

const axiosSecurity = axios.create({
  baseURL: "http://localhost:5000/",
});

const useAxiosSecurity = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axiosSecurity.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      function (error) {
        // Do something with request error
        return Promise.reject(error);
      }
    );

    axiosSecurity.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          await logoutUser();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );
  }, [logoutUser, navigate]);

  return [axiosSecurity];
};

export default useAxiosSecurity;
