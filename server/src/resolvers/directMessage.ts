import { GraphQLError } from "graphql/error";
import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../utils/pubsub";
import {
  Context,
  DirectMessageCursorPayload,
  DirectMessagePayload,
} from "../utils/types";
import { DirectMessageSchema } from "../validators";

const NEW_DM_CHANNEL_MESSAGE = "NEW_DM_CHANNEL_MESSAGE";

export default {
  Query: {
    getDMMessages: (
      _parent,
      { cursor, senderId }: DirectMessageCursorPayload,
      { prisma, user }: Context
    ) => {
      const options: any = {
        where: {
          AND: [
            {
              sender: {
                id: {
                  in: [senderId, user?.id],
                },
              },
            },
            {
              receiver: {
                id: {
                  in: [senderId, user?.id],
                },
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 35,
        include: {
          sender: true,
          receiver: true,
        },
      };

      if (cursor) {
        options.cursor = {
          id: cursor,
        };

        options.skip = 1;
      }

      return prisma.directMessage.findMany(options);
    },
  },
  Mutation: {
    createDMMessage: async (
      _parent,
      args: DirectMessagePayload,
      context: Context
    ) => {
      const { body, receiverId } = args;
      const { prisma, user } = context;

      const { error } = DirectMessageSchema.validate(args);

      if (error)
        throw new GraphQLError("Validation Error Occured", {
          extensions: {
            code: "VALIDATION_ERROR",
            ...error,
          },
        });

      // # create dm message
      const directMessage = await prisma.directMessage.create({
        data: {
          body,
          sender: {
            connect: {
              id: user?.id,
            },
          },
          receiver: {
            connect: {
              id: receiverId,
            },
          },
        },
        include: {
          sender: true,
          receiver: true,
        },
      });

      pubsub.publish(NEW_DM_CHANNEL_MESSAGE, {
        senderId: user?.id,
        receiverId,
        messageDMCreated: {
          ...directMessage,
          user,
        },
      });

      return {
        ok: true,
      };
    },
  },
  Subscription: {
    messageDMCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_DM_CHANNEL_MESSAGE),
        (payload, args, { user }: Context) =>
          args.senderId === payload.senderId && user?.id === payload.receiverId
      ),
    },
  },
  DirectMessage: {
    sender: (message, _args, { prisma }: Context) =>
      prisma.user.findFirst({
        where: {
          id: message.senderId,
        },
      }),
    receiver: (message, _args, { prisma }: Context) =>
      prisma.user.findFirst({
        where: {
          id: message.receiverId,
        },
      }),
  },
};
