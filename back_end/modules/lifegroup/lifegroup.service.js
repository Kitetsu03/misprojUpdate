import { LifeGroup } from "./lifegroup.model";

export const createLifeGroup = async (req, res) => {
  try {
    const {
      lifegroup_name,
      type,
      gender_profile,
      address,
      contact_number,
      host_name,
      schedule,
      opened_date,
      barangay,
      district,
    } = req.body;

    const existing = await LifeGroup.findOne({
      lifegroup_name,
      status: "active",
    });

    if (existing) {
      return res.status(400).json({
        message: "LifeGroup already exists",
      });
    }

    const lifeGroup = await LifeGroup.create({
      lifegroup_name,
      type,
      gender_profile,
      address,
      contact_number,
      host_name,
      schedule,
      opened_date,
      barangay,
      district,
    });

    res.status(201).json(lifeGroup);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getLifeGroups = async (req, res) => {
  try {
    const lifeGroups = await LifeGroup.find({
      status: "active",
    }).sort({
      createdAt: -1,
    });

    res.json(lifeGroups);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const archiveLifeGroup = async (req, res) => {
  try {
    await LifeGroup.findByIdAndUpdate(req.params.id, {
      status: "inactive",
    });

    res.json({
      message: "LifeGroup archived successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
