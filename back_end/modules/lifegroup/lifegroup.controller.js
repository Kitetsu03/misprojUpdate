import {
  createLifeGroupService,
  getLifeGroupsService,
  archiveLifeGroupService,
} from "./lifegroup.service.js";

/* CREATE */
export const createLifeGroup = async (req, res) => {
  try {
    const lifeGroup = await createLifeGroupService(req.body);

    res.status(201).json(lifeGroup);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* GET ALL */
export const getLifeGroups = async (req, res) => {
  try {
    const lifeGroups = await getLifeGroupsService();

    res.json(lifeGroups);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ARCHIVE */
export const archiveLifeGroup = async (req, res) => {
  try {
    await archiveLifeGroupService(req.params.id);

    res.json({
      message: "LifeGroup archived successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
