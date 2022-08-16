import axios from "axios";
import jwtService from "./jwt.service";

const id = jwtService.getID();

export default axios.create({
  baseURL: process.env.VUE_APP_ROOT_API,
  headers: {
    "X-User-ID": `${id}`
  }
});