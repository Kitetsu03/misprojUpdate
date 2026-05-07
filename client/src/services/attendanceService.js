import API from "./api";

export const recordAttendance = (data) => API.post("/attendance", data);

export const scanAttendance = (data) => API.post("/attendance/scan", data);

export const getAttendance = () => API.get("/attendance");
