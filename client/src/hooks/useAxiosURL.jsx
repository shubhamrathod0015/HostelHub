import axios from "axios";

const axiosURL = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const useAxiosURL = () => {
  return axiosURL;
};

export default useAxiosURL;
