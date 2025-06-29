import axios from "axios";

export const getUser = async (user_id) => {
        const user = await axios.get("http://localhost:3000/users/" + user_id);
        return user.data;
}