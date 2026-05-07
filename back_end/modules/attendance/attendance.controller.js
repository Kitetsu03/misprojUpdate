import { Attendance } from "./attendance.model.js";

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

export { recordAttendance, getAttendance };
