import Joi from "joi";

export const ServerCreationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
});

export const ServerDeletionSchema = Joi.object({
  id: Joi.string().alphanum().required(),
});

export const ServerMemberSchema = Joi.object({
  id: Joi.string().alphanum().required(),
  serverId: Joi.string().required(),
});

export const ServerRoleSchema = Joi.object({
  id: Joi.string().alphanum().required(),
  serverId: Joi.string().required(),
});
