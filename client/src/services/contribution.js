import API from "./api";

export const addContribution = (data) => API.post("/contributions", data);

export const getContributions = () => API.get("/contributions");
