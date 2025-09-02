import axios from "axios";
import { server_Url, token } from "../globals/config";
const API = axios.create({
  baseURL: `${server_Url}/api/v1`,
  headers: {
    // Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default API;

export const getAuthHeader = () => {
  const token = localStorage.getItem("jwt");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
