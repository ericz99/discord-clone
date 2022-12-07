import { GraphQLError } from "graphql/error";
import { withFilter } from "graphql-subscriptions";
import { isUserInServer } from "../utils/permission";
import { pubsub } from "../utils/pubsub";
import { Context, MessageCursorPayload, MessagePayload } from "../utils/types";
import { MessageCreateSchema } from "../validators";

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";

export default {
  Query: {
    messages: async (
      _parent,
      { cursor, channelId }: MessageCursorPayload,
      { prisma }: Context
    ) => {
      const options: any = {
        where: {
          channel: {
            id: {
              contains: channelId,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 35,
        include: {
          channel: true,
        },
      };

      if (cursor) {
        options.cursor = {
          id: cursor,
        };

        options.skip = 1;
      }

      return prisma.message.findMany(options);
    },
  },
  Mutation: {
    createMessage: async (
      _parent,
      args: MessagePayload,
      context: Context,
      _info
    ) => {
      const { channelId, body } = args;
      const { prisma, user } = context;
      const { error } = MessageCreateSchema.validate(args);

      if (error)
        throw new GraphQLError("Validation Error Occured", {
          extensions: {
            code: "VALIDATION_ERROR",
            ...error,
          },
        });

      // # grab serverid
      const server = await prisma.server.findFirst({
        where: {
          channels: {
            some: {
              id: {
                contains: channelId,
              },
            },
          },
        },
      });

      // # check if user in server
      if (server && !(await isUserInServer(context, server.id)))
        throw new GraphQLError("User not in server!", {
          extensions: {
            code: "MESSAGE_CREATION_ERROR",
            msg: "Failed to create message",
          },
        });

      const message = await prisma.message.create({
        data: {
          channel: {
            connect: {
              id: channelId,
            },
          },
          user: {
            connect: {
              id: user?.id,
            },
          },
          body,
        },
      });

      pubsub.publish(NEW_CHANNEL_MESSAGE, {
        channelId,
        messageCreated: {
          ...message,
          user,
        },
      });

      return {
        ok: true,
      };
    },
  },
  Subscription: {
    messageCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
        (payload, args) => args.channelId === payload.channelId
      ),
    },
  },
  Message: {
    channel: (channel, _args, { prisma }: Context, _info) =>
      prisma.channel.findFirst({
        where: {
          id: channel.channelId,
        },
      }),
    user: (user, _args, { prisma }: Context, _info) =>
      prisma.user.findFirst({
        where: {
          id: user.userId,
        },
      }),
  },
};
