/* eslint-disable turbo/no-undeclared-env-vars */
/* eslint-disable no-restricted-syntax */
import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql/error';
import cookieParser from 'cookie-parser';

import typeDefs from './typeDefs';
import resolvers from './resolvers';
import { verifyAccessToken, verifyRefreshToken, sendRefreshTokenToClient, createRefreshToken, createNewAccessToken } from './utils/auth';
import { Context, JWTRefreshTokenPayload } from './utils/types';

export default async () => {
  const app = express();
  const httpServer = http.createServer(app);
  const prisma = new PrismaClient();

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/graphql'
  });

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer(
    {
      schema,
      onConnect: async ({ connectionParams }) => {
        const contextObj: Context = {
          prisma,
          user: null
        };

        if (connectionParams !== undefined) {
          const { authorization } = connectionParams as any;

          if (!authorization || !(await verifyAccessToken(authorization, contextObj)))
            throw new GraphQLError('UNAUTHORIZED', {
              extensions: {
                code: 'NOT_AUTHENTICATED',
                message: 'User cannot be subscribed!'
              }
            });
        }

        console.log('connected');
      },
      onDisconnect() {
        console.log('user Disconnected!');
      },
      context: async ({ connectionParams }) => {
        let contextObj: Context = {
          prisma,
          user: null
        };

        if (connectionParams !== undefined) {
          const { authorization } = connectionParams as any;

          if (authorization) {
            const decoded = await verifyAccessToken(authorization, contextObj);

            contextObj = {
              ...contextObj,
              user: decoded
            };
          }
        }

        return contextObj;
      }
    },
    wsServer
  );

  const server = new ApolloServer<Context>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            }
          };
        }
      }
    ],
    formatError: (err) => {
      let error = {
        code: err.extensions?.code,
        msg: err.message
      } as any;

      if (err.extensions?.details) {
        const formattedErrors = [] as any[];
        const { details } = err.extensions as any;

        for (const detail of details) {
          const { path, message } = detail as any;

          formattedErrors.push({
            path: Array.isArray(path) ? path[0] : path,
            message
          });
        }

        error = {
          ...error,
          formattedErrors
        };
      }

      return {
        error,
        ...err
      };
    }
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: process.env.NODE_ENV === 'production' ? process.env.API_URL : 'http://localhost:3000',
      credentials: true
    }),
    cookieParser(),
    express.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        let contextObj: Context = {
          prisma,
          user: null,
          res
        };

        const { authorization } = req.headers;

        if (authorization) {
          const decoded = await verifyAccessToken(authorization, contextObj);

          contextObj = {
            ...contextObj,
            user: decoded
          };
        }

        return contextObj;
      }
    })
  );

  app.use(cookieParser());
  app.get('/', (_req, res) => res.send('hello'));

  // # post request for refresh token
  app.post('/refresh_token', async (req: express.Request, res: express.Response) => {
    const { sid } = req.cookies;

    if (!sid) {
      return res.json({ ok: false, access_token: '' });
    }

    const payload: JWTRefreshTokenPayload | null = await verifyRefreshToken(sid, prisma);

    if (payload) {
      const { id, username } = payload;
      sendRefreshTokenToClient(
        res,
        createRefreshToken({
          id,
          username
        })
      );
      return res.json({
        ok: true,
        access_token: createNewAccessToken({
          id,
          username
        })
      });
    }

    return res.json({ ok: false, access_token: '' });
  });

  return {
    app,
    httpServer
  };
};
