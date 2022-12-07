import Joi from "joi";

export const ChannelCreationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  serverId: Joi.string().alphanum().required(),
});

export const ChannelDeletionSchema = Joi.object({
  id: Joi.string().alphanum().required(),
  serverId: Joi.string().alphanum().required(),
});
