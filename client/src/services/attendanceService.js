import API from "./api";

export const toggleAttendance = async ({ eventId, member }) => {
  const payload = {
    service_id: eventId,
    member_id: member.member_id,
    is_guest: member.isGuest || false,
    guest_name: member.name,
    status: member.status === "present" ? "absent" : "present",
  };

  const { data } = await API.post("/attendance/toggle", payload);
  return data;
};

// bulk save attendance
export const saveAttendance = (data) => API.post("/attendance/bulk", data);

// attendanceService.js
export const getAttendanceByService = async (serviceId) => {
  if (!serviceId) throw new Error("Service ID required");

  return API.get(`/attendance?service_id=${serviceId}`).then((res) => res.data);
};
