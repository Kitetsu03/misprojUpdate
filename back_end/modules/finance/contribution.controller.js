import Contribution from "./contribution.model.js";

const addContribution = async (req, res) => {
  try {
    const data = await Contribution.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getContributions = async (req, res) => {
  try {
    const data = await Contribution.find().populate("member_id");
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export { addContribution, getContributions };
