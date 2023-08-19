import Joi from "joi";
const CommentPostschema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  comment: Joi.string().required(),
  vehicleId: Joi.string(),
});
export { CommentPostschema };
