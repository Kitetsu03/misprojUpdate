import { LifeGroup } from "./lifegroup.model.js";

/* CREATE */
export const createLifeGroupService = async (data) => {
  const existing = await LifeGroup.findOne({
    lifegroup_name: data.lifegroup_name,
    status: "active",
  });

  if (existing) {
    throw new Error("LifeGroup already exists");
  }

  const lifeGroup = await LifeGroup.create(data);

  return lifeGroup;
};

/* GET ALL */
export const getLifeGroupsService = async () => {
  return await LifeGroup.find({
    status: "active",
  }).sort({
    createdAt: -1,
  });
};

/* ARCHIVE */
export const archiveLifeGroupService = async (id) => {
  return await LifeGroup.findByIdAndUpdate(
    id,
    {
      status: "inactive",
    },
    { new: true },
  );
};
