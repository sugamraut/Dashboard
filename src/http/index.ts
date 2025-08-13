import axios from "axios";
import { server_Url, token } from "../globals/config";

const API = axios.create({
  baseURL: server_Url,
  headers: {
    // Authorization: `Bearer ${localStorage.getItem("jwt")}`,
       Authorization: `Bearer ${token}`,
    'Accept':'applicaton/json',
    'Content-Type':'application/json'
  },
});

export default API