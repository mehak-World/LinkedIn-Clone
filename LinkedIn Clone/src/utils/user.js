import axios from "axios";
import { backend_url } from "./app";

export const getUser = async (user_id) => {
        const user = await axios.get(`${backend_url}/users/` + user_id);
        return user.data;
}