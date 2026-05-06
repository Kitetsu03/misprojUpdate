import API from "./api";

export const createService = (data) => API.post("/attendance/service", data);

export const recordAttendance = (data) => API.post("/attendance", data);

export const scanAttendance = (data) => API.post("/attendance/scan", data);

export const getAttendance = () => API.get("/attendance");
