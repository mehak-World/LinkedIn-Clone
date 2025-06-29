import axios from "axios";

export const getAllPosts = async () => {
    const result = await axios.get("http://localhost:300/posts/all");
    return result;
}


