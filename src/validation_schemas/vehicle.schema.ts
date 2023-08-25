import Joi from "joi";
import { VehicleType } from "@prisma/client";
const VehiclePostschema = Joi.object({
  name: Joi.string().required(),
  img: Joi.string().required(),
  description: Joi.string().required(),
  passengerSize: Joi.number().required().min(0),
  userId: Joi.string().required(),
  pricePerDay: Joi.number().required().min(0),
  type: Joi.string()
    .required()
    .allow(...Object.values(VehicleType)),
});
const VehicleUpdateschema = Joi.object({
  name: Joi.string(),
  img: Joi.string(),
  description: Joi.string(),
  passengerSize: Joi.number().min(0),
  pricePerDay: Joi.number().min(0),
  userId: Joi.string(),
  type: Joi.string().allow(...Object.values(VehicleType)),
});

export { VehiclePostschema, VehicleUpdateschema };
