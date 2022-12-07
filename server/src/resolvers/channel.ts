import { withFilter } from "graphql-subscriptions";
import { GraphQLError } from "graphql/error";
import { isUserInServer } from "../utils/permission";
import { pubsub } from "../utils/pubsub";

import {
  ChannelCreationPayload,
  ChannelDeletionPayload,
  Context,
  EVENT_TYPE,
} from "../utils/types";
import { ChannelCreationSchema, ChannelDeletionSchema } from "../validators";

export default {
  Query: {
    getChannels: (_parent, args, { prisma }: Context, _info) =>
      prisma.channel.findMany({
        where: {
          server: {
            id: {
              contains: args.serverId,
            },
          },
        },
        include: {
          server: true,
        },
      }),
  },
  Mutation: {
    createChannel: async (
      _parent,
      args: ChannelCreationPayload,
      context: Context,
      _info
    ) => {
      const { serverId, name } = args;
      const { prisma } = context;
      const { error } = ChannelCreationSchema.validate(args);

      if (error)
        throw new GraphQLError("Validation Error Occured", {
          extensions: {
            code: "VALIDATION_ERROR",
            ...error,
          },
        });

      if (!(await isUserInServer(context, serverId)))
        throw new GraphQLError("User not in server!", {
          extensions: {
            code: "CHANNEL_CREATION_ERROR",
            msg: "User is not in the server!",
          },
        });

      const channel = await prisma.channel.create({
        data: {
          name,
          server: {
            connect: {
              id: serverId,
            },
          },
        },
      });

      // # subscribe for channel creation
      pubsub.publish(EVENT_TYPE.CHANNEL_CREATED, {
        serverId,
        channelCreated: {
          ...channel,
        },
      });

      return {
        ok: true,
        channel,
      };
    },
    deleteChannel: async (
      _parent,
      args: ChannelDeletionPayload,
      context: Context,
      _info
    ) => {
      const { id } = args;
      const { prisma } = context;
      const { error } = ChannelDeletionSchema.validate(args);

      if (error)
        throw new GraphQLError("Validation Error Occured", {
          extensions: {
            code: "VALIDATION_ERROR",
            ...error,
          },
        });

      // # remove channel
      const res = await Promise.all([
        await prisma.channel.update({
          where: {
            id,
          },
          data: {
            messages: {
              deleteMany: {},
            },
          },
        }),
        await prisma.channel.delete({
          where: {
            id,
          },
        }),
      ]);

      // # subscribe for channel creation
      pubsub.publish(EVENT_TYPE.CHANNEL_DELETED, {
        serverId: res[1].serverId,
        channelDeleted: {
          ...res[1],
        },
      });

      return {
        ok: true,
      };
    },
  },
  Subscription: {
    channelCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(EVENT_TYPE.CHANNEL_CREATED),
        (payload, args) => args.serverId === payload.serverId
      ),
    },
    channelDeleted: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(EVENT_TYPE.CHANNEL_DELETED),
        (payload, args) => args.serverId === payload.serverId
      ),
    },
  },
  Channel: {
    server: async (channel, _args, { prisma }: Context, _info) =>
      prisma.server.findFirst({
        where: {
          channels: {
            every: {
              id: {
                contains: channel.id,
              },
            },
          },
        },
      }),
  },
};
