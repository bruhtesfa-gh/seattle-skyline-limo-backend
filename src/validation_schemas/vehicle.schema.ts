import Joi from "joi";
// import { VehicleType } from "@prisma/client";

enum VehicleType {
  SUV,
  BUS,
  VAN,
  SEDAN
}

const VehiclePostschema = Joi.object({
  name: Joi.string().required(),
  img: Joi.string().required(),
  description: Joi.string().required(),
  passengerSize: Joi.number().required().min(0),
  userId: Joi.number().required(),
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
  userId: Joi.number(),
  type: Joi.string().allow(...Object.values(VehicleType)),
});

export { VehiclePostschema, VehicleUpdateschema };
