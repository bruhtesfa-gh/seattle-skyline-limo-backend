import Joi from "joi";

const userUpdateschema = Joi.object({
  firstName: Joi.string().max(500),
  lastName: Joi.string().max(500),
  img: Joi.string().max(500),
  email: Joi.string().email(),
});
const userChangePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmPassword: Joi.string().required().equal(Joi.ref("newPassword")),
});

export { userUpdateschema, userChangePasswordSchema };
