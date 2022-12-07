/* eslint-disable no-shadow */
import { PrismaClient } from '@prisma/client';
import express from 'express';

export type JWTAccessToken = {
  access_token: string;
};

export type JWTAccessTokenPayload = {
  id: string;
  username: string;
};

export type JWTRefreshTokenPayload = {
  id: string;
  username: string;
};

export type UserRegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export type UserLoginPayload = {
  email: string;
  password: string;
};

export type Context = {
  prisma: PrismaClient;
  user: JWTAccessTokenPayload | null;
  res?: express.Response<any, Record<string, any>>;
};

export type ServerCreationPayload = {
  name: string;
};

export type ChannelCreationPayload = {
  name: string;
  serverId: string;
};

export type ChannelDeletionPayload = {
  id: string;
  serverId: string;
};

export type ServerDeletionPayload = {
  id: string;
};

export type ServerMemberPayload = {
  id: string;
  serverId: string;
};

export type MessagePayload = {
  channelId: string;
  body: string;
};

export type MessageCursorPayload = {
  cursor: string;
  channelId: string;
};

export type DirectMessageCursorPayload = {
  cursor: string;
  senderId: string;
};

export type DirectMessagePayload = {
  receiverId: string;
  body: string;
};

export enum EVENT_TYPE {
  CHANNEL_CREATED = 'CHANNEL_CREATED',
  CHANNEL_DELETED = 'CHANNEL_DELETED',
  SERVER_DELETED = 'SERVER_DELETED',
  USER_JOINED = 'USER_JOINED',
  USER_REMOVED = 'USER_REMOVED'
}
