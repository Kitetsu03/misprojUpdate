import { LifeGroup, LifeGroupMember } from "./lifegroup.model.js";

export const createLifeGroup = async (req, res) => {
  try {
    const group = await LifeGroup.create(req.body);
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addMemberToLifeGroup = async (req, res) => {
  try {
    const { lifegroup_id, member_id } = req.body;

    const record = await LifeGroupMember.create({
      lifegroup_id,
      member_id,
    });

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
