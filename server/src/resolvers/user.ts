import { AuthenticationError } from "apollo-server";
import { GraphQLError } from "graphql/error";
import { createNewUser, genAccessToken } from "../utils/auth";
import { Context, UserLoginPayload, UserRegisterPayload } from "../utils/types";
import { LoginSchema, RegisterSchema } from "../validators";

export default {
  Query: {
    me: async (_parent, _args, context: Context, _info) => {
      const { user, prisma } = context;

      if (!user) throw new AuthenticationError("Not Authenticated!");

      const myUser = await prisma.user.findUnique({
        where: {
          id: user?.id,
        },
        select: {
          id: true,
          email: true,
          username: true,
          discriminator: true,
          servers: true,
        },
      });

      return myUser;
    },
    getUsers: (_parent, _args, { prisma, user }: Context, _info) =>
      prisma.user.findMany({
        where: {
          NOT: {
            id: {
              contains: user?.id,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
  },
  Mutation: {
    registerUser: async (
      _parent,
      args: UserRegisterPayload,
      context: Context,
      _info
    ) => {
      const { error } = RegisterSchema.validate(args);

      if (error)
        throw new GraphQLError("Validation Error Occured", {
          extensions: {
            code: "VALIDATION_ERROR",
            ...error,
          },
        });

      return {
        ok: true,
        user: await createNewUser(args, context),
      };
    },
    loginUser: async (
      _parent,
      args: UserLoginPayload,
      context: Context,
      _info
    ) => {
      const { error } = LoginSchema.validate(args);

      if (error)
        throw new GraphQLError("Validation Error Occured", {
          extensions: {
            code: "VALIDATION_ERROR",
            ...error,
          },
        });

      return genAccessToken(args, context);
    },
  },
  User: {
    servers: (user, _args, { prisma }: Context) =>
      prisma.server.findMany({
        where: {
          users: {
            some: {
              userId: {
                contains: user.id,
              },
            },
          },
        },
      }),
  },
};
