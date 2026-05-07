import {
  createEventService,
  getEventsService,
} from "./worshipService.service.js";

export const createService = async (req, res) => {
  try {
    console.log("REQ USER:", req.user);
    const service = await createEventService({
      ...req.body,
      created_by: req.user.userId,
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getServices = async (req, res) => {
  try {
    const services = await getEventsService();

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
