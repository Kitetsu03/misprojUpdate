import API from "./api";

export const createService = (data) => API.post("/service", data);

export const getServices = () => API.get("/service");
