import API from "./api";

// GET ALL
export const getMembers = async () => {
  const res = await API.get("/members");
  return res.data;
};

// CREATE NEW MEMBER
export const createMember = async (data) => {
  const res = await API.post("/members", data);
  return res.data;
};

// COMPLETE PROFILE (existing user)
export const completeMemberProfile = async (userId, data) => {
  if (!userId) throw new Error("User ID is required");

  const res = await API.post(`/members/user/${userId}`, data);
  return res.data;
};

// SMART SAVE
export const saveMember = async (userId, data) => {
  if (!userId) throw new Error("User ID is required");

  const res = await API.put(`/members/profile/${userId}`, data);
  return res.data;
};

// DELETE MEMBER
export const deleteMember = async (id) => {
  const res = await API.delete(`/members/${id}`);
  return res.data;
};

// IMPORT MEMBERS IN BULK
export const importMembers = async (members) => {
  const response = await axios.post("/api/members/import", { members });
  return response.data;
};
