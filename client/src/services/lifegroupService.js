import API from "./api";

export const createLifeGroup = (data) => API.post("/lifegroups", data);

export const addMemberToLifeGroup = (data) =>
  API.post("/lifegroups/add-member", data);
