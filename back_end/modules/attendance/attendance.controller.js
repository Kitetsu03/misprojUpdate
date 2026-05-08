import * as attendanceService from "./attendance.service.js";

// GET /api/attendance
export const getAttendanceHandler = async (req, res) => {
  try {
    const { service_id } = req.params;
    if (!service_id)
      return res.status(400).json({ message: "service_id is required" });

    const data = await attendanceService.getAttendanceByService(service_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/attendance/bulk
export const saveBulkAttendanceHandler = async (req, res) => {
  try {
    const records = req.body;
    const saved = await attendanceService.saveBulkAttendance(records);
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST /api/attendance/toggle
export const toggleAttendanceHandler = async (req, res) => {
  try {
    const record = await attendanceService.toggleAttendance(req.body);
    res.json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteGuestAttendanceHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await attendanceService.deleteGuestAttendance(id);

    res.json(result);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
