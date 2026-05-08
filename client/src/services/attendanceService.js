import API from "./api";

// GET attendance by service/event
export const getAttendanceByService = async (serviceId) => {
  const res = await API.get(`/attendance/${serviceId}`);
  return res.data;
};

// SAVE attendance
export const saveAttendance = async (records) => {
  const res = await API.post("/attendance/bulk", records);
  return res.data;
};

// TOGGLE attendance
export const toggleAttendance = async (payload) => {
  const res = await API.post("/attendance/toggle", payload);
  return res.data;
};

export const deleteGuestAttendance = async (attendanceId) => {
  const res = await API.delete(`/attendance/guest/${attendanceId}`);
  return res.data;
};
