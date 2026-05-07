import { WorshipService } from "./worshipService.model.js";

const createEventService = async (data) => {
  const service = await WorshipService.create(data);

  return service;
};

const getEventsService = async () => {
  const services = await WorshipService.find().sort({ service_date: -1 });

  return services;
};

export { createEventService, getEventsService };
