import { Context } from "./types";

export const hasOwnerShip = (
  { prisma }: Context,
  userId: string,
  serverId: string
) =>
  prisma.user.findFirst({
    where: {
      AND: [
        {
          id: {
            contains: userId,
          },
        },
        {
          servers: {
            some: {
              server: {
                AND: [
                  {
                    id: {
                      contains: serverId,
                    },
                  },
                  {
                    owner: {
                      id: {
                        contains: userId,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  });

export const isUserInServer = ({ prisma, user }: Context, serverId: string) =>
  prisma.server.findFirst({
    where: {
      AND: [
        {
          id: serverId,
        },
        {
          users: {
            some: {
              userId: {
                contains: user?.id,
              },
            },
          },
        },
      ],
    },
  });
