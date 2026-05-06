import API from "./api";

// CREATE USER
export const createUser = async (data) => {
  const res = await API.post("/users", data);
  return res.data;
};

// GET USERS
export const getUsers = async () => {
  const res = await API.get("/users");
  return res.data;
};

// UPDATE USER
export const updateUser = async (id, data) => {
  const res = await API.put(`/users/${id}`, data);
  return res.data;
};

// UPDATE USER ROLE
export const updateUserRole = async (id, role) => {
  const res = await API.put(`/users/${id}`, { role });
  return res.data;
};

//TODO Append do not delete
export const deleteUser = async (id) => {
  const res = await API.delete(`/users/${id}`);
  return res.data;
};
