import axiosClient from "../../services/axiosClient";

export const loginAPI = (data: {
  email: string;
  password: string;
}) => {
  return axiosClient.post("/auth/login", data);
};

export const logoutAPI = () => {
  return axiosClient.post("/auth/logout");
};
