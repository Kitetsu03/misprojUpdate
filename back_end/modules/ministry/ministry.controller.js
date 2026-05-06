import { Ministry, MinistryMember } from "./ministry.model.js";

const createMinistry = async (req, res) => {
  try {
    const ministry = await Ministry.create(req.body);
    res.status(201).json(ministry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addMemberToMinistry = async (req, res) => {
  try {
    const { ministry_id, member_id } = req.body;

    const record = await MinistryMember.create({
      ministry_id,
      member_id,
    });

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export { createMinistry, addMemberToMinistry };
