import { AuthenticationError } from "apollo-server";
import { withFilter } from "graphql-subscriptions";
import { GraphQLError } from "graphql/error";
import { hasOwnerShip, isUserInServer } from "../utils/permission";
import { pubsub } from "../utils/pubsub";

import {
  Context,
  ServerCreationPayload,
  ServerDeletionPayload,
  ServerMemberPayload,
  EVENT_TYPE,
} from "../utils/types";
import {
  ServerMemberSchema,
  ServerCreationSchema,
  ServerDeletionSchema,
} from "../validators";

export default {
  Query: {
    allServers: (_parent, _args, { prisma, user }: Context, _info) =>
      prisma.server.findMany({
        where: {
          users: {
            some: {
              userId: user?.id,
            },
          },
        },
        include: {
          users: {
            where: {
              userId: user?.id,
            },
          },
        },
      }),
    getServer: async (_parent, { id }, context: Context, _info) => {
      const { prisma } = context;

      const server = await prisma.server.findFirst({
        where: {
          id,
        },
        include: {
          channels: true,
          users: true,
        },
      });

      if (!server)
        throw new GraphQLError("No server found!", {
          extensions: {
            code: "INVALID_SERVER",
            msg: "No server found!",
          },
        });

      if (!(await isUserInServer(context, id)))
        throw new GraphQLError("User is not in server", {
          extensions: {
            code: "FAILED_TO_FETCH_SERVER",
            msg: "User is not in server",
          },
        });

      return server;
    },
    getMembers: (_parent, { id }, { prisma }: Context, _info) =>
      prisma.user.findMany({
        where: {
          servers: {
            some: {
              serverId: id,
            },
          },
        },
        select: {
          id: true,
          username: true,
          email: true,
          discriminator: true,
        },
      }),
  },
  Mutation: {
    createServer: async (
      _parent,
      args: ServerCreationPayload,
      context: Context,
      _info
    ) => {
      const { name } = args;
      const { user, prisma } = context;
      const { error } = ServerCreationSchema.validate(args);

      if (error)
        throw new GraphQLError("Validation Error Occured", {
          extensions: {
            code: "VALIDATION_ERROR",
            ...error,
          },
        });

      if (!user)
        throw new AuthenticationError("Not Authorized to view resource!");

      // # create server
      const server = await prisma.server.create({
        data: {
          ownerId: user.id,
          name,
          users: {
            create: [
              {
                user: {
                  connect: {
                    id: user.id,
                  },
                },
              },
            ],
          },
        },
      });

      return {
        ok: true,
        server,
      };
    },
    addMember: async (
      _parent,
      args: ServerMemberPayload,
      context: Context,
      _info
    ) => {
      const { id, serverId } = args;
      const { user, prisma } = context;
      const { error } = ServerMemberSchema.validate(args);

      if (error)
        throw new GraphQLError("Validation Error Occured", {
          extensions: {
            code: "VALIDATION_ERROR",
            ...error,
          },
        });

      if (!user)
        throw new AuthenticationError("Not Authorized to view resource!");

      // # find if user already exist in server
      const userExist = await prisma.usersOnServers.findFirst({
        where: {
          AND: [
            {
              user: {
                id: {
                  contains: id,
                },
              },
            },
            {
              serverId: {
                contains: serverId,
              },
            },
          ],
        },
      });

      if (userExist)
        return {
          ok: false,
        };

      // # update server
      const server = await prisma.server.update({
        where: {
          id: serverId,
        },
        data: {
          users: {
            create: [
              {
                user: {
                  connect: {
                    id,
                  },
                },
              },
            ],
          },
        },
      });

      pubsub.publish(EVENT_TYPE.USER_JOINED, {
        userId: id,
        userJoined: {
          ...server,
        },
      });

      return {
        ok: true,
      };
    },
    deleteServer: async (
      _parent,
      args: ServerDeletionPayload,
      context: Context,
      _info
    ) => {
      const { id } = args;
      const { prisma, user } = context;
      const { error } = ServerDeletionSchema.validate(args);

      if (error)
        throw new GraphQLError("Validation Error Occured", {
          extensions: {
            code: "VALIDATION_ERROR",
            ...error,
          },
        });

      if (!user)
        throw new AuthenticationError("Not Authorized to view resource!");

      // # user with admin_crud cannot remove "OWNER"
      if (!(await hasOwnerShip(context, user.id, id)))
        throw new GraphQLError("Invalid permissions", {
          extensions: {
            code: "INVALID_PERMISSIONS",
            msg: "User cannot delete server",
          },
        });

      // # delete server & disconnect all relation
      const res = await Promise.all([
        await prisma.server.update({
          where: {
            id,
          },
          data: {
            users: {
              deleteMany: {},
            },
            channels: {
              deleteMany: {},
            },
          },
        }),
        await prisma.server.delete({
          where: {
            id,
          },
        }),
      ]);

      pubsub.publish(EVENT_TYPE.SERVER_DELETED, {
        serverId: id,
        serverDeleted: {
          ...res[1],
        },
      });

      return {
        ok: true,
      };
    },
    removeMember: async (
      _parent,
      args: ServerMemberPayload,
      context: Context,
      _info
    ) => {
      const { id, serverId } = args;
      const { prisma } = context;
      const { error } = ServerMemberSchema.validate(args);

      if (error)
        throw new GraphQLError("Validation Error Occured", {
          extensions: {
            code: "VALIDATION_ERROR",
            ...error,
          },
        });

      // # user with admin_crud cannot remove "OWNER"
      if (await hasOwnerShip(context, id, serverId))
        throw new GraphQLError("Invalid permissions", {
          extensions: {
            code: "INVALID_PERMISSIONS",
            msg: "User have invalid permissions!",
          },
        });

      if (!(await isUserInServer(context, serverId)))
        throw new GraphQLError("User is not in server", {
          extensions: {
            code: "FAILED_TO_FETCH_SERVER",
            msg: "User is not in server",
          },
        });

      // disconnect server from user
      const server = await prisma.server.update({
        where: {
          id: serverId,
        },
        data: {
          users: {
            delete: {
              userId_serverId: {
                userId: id,
                serverId,
              },
            },
          },
        },
      });

      pubsub.publish(EVENT_TYPE.USER_REMOVED, {
        userId: id,
        userRemoved: {
          ...server,
        },
      });

      return {
        ok: true,
      };
    },
  },
  Subscription: {
    serverDeleted: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(EVENT_TYPE.SERVER_DELETED),
        (payload, args) => args.serverId === payload.serverId
      ),
    },
    userJoined: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(EVENT_TYPE.USER_JOINED),
        (payload, _args, { user }: Context) => user?.id === payload.userId
      ),
    },
    userRemoved: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(EVENT_TYPE.USER_REMOVED),
        (payload, _args, { user }: Context) => user?.id === payload.userId
      ),
    },
  },
  Server: {
    owner: (server, _args, { prisma }: Context, _info) =>
      prisma.server
        .findFirst({
          where: {
            id: server.id,
          },
          select: {
            owner: {
              select: {
                id: true,
                username: true,
                email: true,
                discriminator: true,
              },
            },
          },
        })
        .owner(),

    users: (server, _args, { prisma }: Context, _info) =>
      prisma.user.findMany({
        where: {
          servers: {
            some: {
              server: {
                id: {
                  contains: server.id,
                },
              },
            },
          },
        },
        select: {
          id: true,
          username: true,
          email: true,
          discriminator: true,
        },
      }),
    channels: (server, _args, { prisma }: Context, _info) =>
      prisma.channel.findMany({
        where: {
          serverId: server.id,
        },
        select: {
          id: true,
          name: true,
          server: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
  },
};
