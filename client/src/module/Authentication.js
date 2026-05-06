import { User } from "../models/User.js";
// import { data } from "../../../../data/users_data.js";
import axios from "axios";

async function fetchUsers() {
  try {
    const res = await axios.get("http://localhost:3000/api/users");
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

const Authenticate = async ({ cleanUsername, cleanPassword }) => {
  const users = await fetchUsers();
  const authUser = { cleanUsername, cleanPassword };
  const role = users[0].role;
  if (!Array.isArray(users)) return { user: authUser, role: role };

  // users.forEach((user) => {
  //   if (user.email == cleanUsername && user.password == cleanPassword) {
  //     role = user.role;
  //     authUser = new User(user);
  //     return;
  //   }
  // });

  // return { user: authUser, role: role };
};

export { Authenticate };
