import API from "./api";

/* GET ALL */
export const getLifeGroups = async () => {
  const response = await API.get("/lifegroups");

  return response.data;
};

/* CREATE */
export const createLifeGroup = async (data) => {
  const response = await API.post("/lifegroups", data);

  return response.data;
};

/* ARCHIVE */
export const archiveLifeGroup = async (id) => {
  const response = await API.put(`/lifegroups/archive/${id}`);

  return response.data;
};
