import Joi from "joi";
const BookPostschema = Joi.object({
  firstName: Joi.string().min(3).max(500).required(),
  lastName: Joi.string().min(3).max(500).required(),
  fromAddress: Joi.string().min(1).required(),
  toAddress: Joi.string().min(1).required(),
  email: Joi.string().required().email(),
  phoneNumber: Joi.string().required(),
  luggageCount: Joi.number().required().min(0).integer(),
  personCount: Joi.number().required().min(0).integer(),
  journeyDate: Joi.date().required(),
  description: Joi.string().required(),
  vehicleId: Joi.string().required(),
});

const BookUpdateschema = Joi.object({
  firstName: Joi.string().min(3).max(500),
  lastName: Joi.string().min(3).max(500),
  fromAddress: Joi.string().min(1),
  toAddress: Joi.string().min(1),
  email: Joi.string().email(),
  status: Joi.string().allow(...["PENDING", "COMPLETED", "REJECTED"]),
  phoneNumber: Joi.string().min(8).max(15),
  luggageCount: Joi.number().min(0).integer(),
  personCount: Joi.number().min(0).integer(),
  journeyDate: Joi.date(),
  description: Joi.string(),
  vehicleId: Joi.string(),
});

export { BookPostschema, BookUpdateschema };
