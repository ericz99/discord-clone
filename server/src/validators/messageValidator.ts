/* eslint-disable import/prefer-default-export */
import Joi from "joi";

export const MessageCreateSchema = Joi.object({
  channelId: Joi.string().alphanum().required(),
  body: Joi.string().min(1).max(250),
});

export const DirectMessageSchema = Joi.object({
  receiverId: Joi.string().alphanum().required(),
  body: Joi.string().min(1).max(250),
});
