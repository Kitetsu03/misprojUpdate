import API from "./api";

export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

export const getProfile = async () => {
  const res = await API.get("/auth/profile");
  return res.data;
};

// CHANGE PASSWORD SERVICE
export const changePassword = async (data) => {
  const res = await API.put("/auth/change-password", data);
  return res.data;
};
