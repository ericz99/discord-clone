/* eslint-disable turbo/no-undeclared-env-vars */
import { PubSub } from "graphql-subscriptions";
import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";

const options = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) =>
    // reconnect after
    Math.min(times * 50, 2000),
} as any;

// eslint-disable-next-line import/prefer-default-export
export const pubsub =
  process.env.NODE_ENV === "production"
    ? new RedisPubSub({
        publisher: new Redis(options),
        subscriber: new Redis(options),
      })
    : new PubSub();
