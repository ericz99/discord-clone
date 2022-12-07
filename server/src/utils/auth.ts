/* eslint-disable import/prefer-default-export */
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cuid from 'cuid';
import { AuthenticationError } from 'apollo-server';
import { Request, Response } from 'express';
import { GraphQLError } from 'graphql/error';
import { PrismaClient } from '@prisma/client';

import { Context, JWTAccessToken, JWTAccessTokenPayload, JWTRefreshTokenPayload, UserLoginPayload, UserRegisterPayload } from './types';
import { SECRET_KEY, JWT_ACCESS_TOKEN_EXPIRATION, JWT_REFRESH_TOKEN_EXPIRATION, REFERESH_SECRET_KEY } from './constants';

export const createRefreshToken = (user: JWTRefreshTokenPayload) =>
  jwt.sign(user, REFERESH_SECRET_KEY, {
    expiresIn: JWT_REFRESH_TOKEN_EXPIRATION
  });

export const sendRefreshTokenToClient = (res: Response, token: string) => {
  res.cookie('sid', token, {
    httpOnly: true
  });
};

export const genAccessToken = async (user: UserLoginPayload, { prisma, res }: Context): Promise<JWTAccessToken> => {
  const { email, password } = user;

  // # find user first
  const userFound = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!userFound)
    throw new GraphQLError('Invalid email', {
      extensions: {
        code: 'INVALID_EMAIL',
        details: [
          {
            path: 'email',
            message: 'Invalid email!'
          }
        ]
      }
    });

  // # check if password does not match
  if (!(await bcryptjs.compare(password, userFound.password)))
    throw new GraphQLError('Invalid password!', {
      extensions: {
        code: 'INVALID_PASSWORD',
        details: [
          {
            path: 'password',
            message: 'Invalid password!'
          }
        ]
      }
    });

  // # create payload
  const payload: JWTAccessTokenPayload = {
    id: userFound.id,
    username: userFound.username
  };

  // # send refresh token to client
  if (res)
    sendRefreshTokenToClient(
      res,
      createRefreshToken({
        id: userFound.id,
        username: userFound.username
      })
    );

  return {
    access_token: jwt.sign(payload, SECRET_KEY, {
      expiresIn: JWT_ACCESS_TOKEN_EXPIRATION
    })
  };
};

export const createNewAccessToken = (user: JWTRefreshTokenPayload) =>
  jwt.sign(user, SECRET_KEY, {
    expiresIn: JWT_ACCESS_TOKEN_EXPIRATION
  });

export const verifyAccessToken = async (accessToken: string, { prisma }: Context): Promise<JWTAccessTokenPayload | null> => {
  const decoded = jwt.decode(accessToken) as JWTAccessTokenPayload;

  if (!decoded) {
    return null;
  }

  await prisma.user.findUniqueOrThrow({
    where: {
      id: decoded.id
    }
  });

  return decoded;
};

export const verifyRefreshToken = async (accessToken: string, prisma: PrismaClient): Promise<JWTRefreshTokenPayload | null> => {
  const decoded = jwt.decode(accessToken) as JWTRefreshTokenPayload;

  if (!decoded) {
    return null;
  }

  await prisma.user.findUniqueOrThrow({
    where: {
      id: decoded.id
    }
  });

  return decoded;
};

export const createNewUser = async (user: UserRegisterPayload, { prisma }: Context) => {
  const { username, email, password } = user;

  // # find user
  const userFound = await prisma.user.findUnique({
    where: {
      email
    }
  });

  // # if already exist just throw error
  if (userFound)
    throw new GraphQLError('User already exist!', {
      extensions: {
        code: 'USER_ALREADY_EXISTED',
        details: [
          {
            path: 'email',
            message: 'User already exist!'
          }
        ]
      }
    });

  const salt = await bcryptjs.genSalt(10);
  const hash = await bcryptjs.hash(password, salt);

  // # create new user
  const createdUser = await prisma.user.create({
    data: {
      id: cuid(),
      username,
      password: hash,
      email,
      discriminator: `#${String(Math.floor(Math.random() * 9000 + 1000))}`
    },
    select: {
      id: true,
      username: true,
      email: true,
      discriminator: true
    }
  });

  return createdUser;
};

const isSignedIn = (req: Request) => req.headers.authorization;

// # Ensure user has token in header in order to proceed with stuff
export const ensureSignedIn = (req: Request) => {
  if (!isSignedIn(req)) {
    throw new AuthenticationError('No token, authorization denied!');
  }
};

export const ensureSignedOut = async (req: Request) => {
  if (isSignedIn(req)) {
    throw new AuthenticationError('Already signed in!');
  }
};
