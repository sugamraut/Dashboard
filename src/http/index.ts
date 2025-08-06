import axios from "axios";
import { server_Url } from "../globals/config";

const API = axios.create({
  baseURL: server_Url,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  },
});

export default API