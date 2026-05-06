import { LifeGroupAttendance } from "./lifegroupattendance.model.js";
import { LifeGroupSession } from "./lifegroupSession.model.js";

const createSession = async (req, res) => {
  try {
    const session = await LifeGroupSession.create(req.body);
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const recordLifeGroupAttendance = async (req, res) => {
  try {
    const record = await LifeGroupAttendance.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export { createSession, recordLifeGroupAttendance };
