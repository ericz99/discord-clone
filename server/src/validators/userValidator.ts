import Joi from "joi";

export const RegisterSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .message("Username length must be at least 3 characters long")
    .required(),
  email: Joi.string().email({
    minDomainSegments: 2,
  }),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .message("Password need to be min 3 and max 30")
    .required(),
});

export const LoginSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
  }),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .message("Password need to be min 3 and max 30")
    .required(),
});
