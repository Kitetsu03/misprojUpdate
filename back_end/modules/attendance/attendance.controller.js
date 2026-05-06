import { Attendance, WorshipService } from "./attendance.model.js";

const createService = async (req, res) => {
  try {
    const service = await WorshipService.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const recordAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getAttendance = async (req, res) => {
  try {
    const data = await Attendance.find()
      .populate("member_id")
      .populate("service_id");

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { createService, recordAttendance, getAttendance };
