import axios from "axios";
import { backend_url } from "./app";

export const getAllPosts = async () => {
    const result = await axios.get(`${backend_url}/posts/all`);
    return result;
}


