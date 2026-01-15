import axios from "axios";

const axiosURL = axios.create({
  baseURL: "http://localhost:5000/",
});

const useAxiosURL = () => {
  return axiosURL;
};

export default useAxiosURL;
