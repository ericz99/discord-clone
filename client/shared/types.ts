import { NextPageContext } from "next";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";

export interface NextContextWithApollo extends NextPageContext {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  githubApolloClient: ApolloClient<NormalizedCacheObject>;
}

export type InputHookProps = {
  [k: string]: any;
};

export type CheckBoxProps = {
  [k: string]: boolean;
};

export type ErrorHookProps = {
  [k: string]: string;
};

export type CurrentUserProps = {
  id: string;
  email: string;
  username: string;
};

export type GuardProps = {
  children: JSX.Element | JSX.Element[];
  excludedRoutes?: string[];
  protectedRoutes?: string[];
};

export type JWTAccessTokenPayload = {
  id: string;
  username: string;
  iat: number;
  exp: number;
};

export enum PERMISSION_LIST {
  ADMIN_CRUD = "ADMIN_CRUD",
  CHANNEL_CREATION = "CHANNEL_CREATION",
  CHANNEL_DELETION = "CHANNEL_DELETION",
  CHANNEL_UPDATION = "CHANNEL_UPDATION",
  ROLE_CREATION = "ROLE_CREATION",
  ROLE_DELETION = "ROLE_DELETION",
  ROLE_UPDATION = "ROLE_UPDATION",
  ADD_PERMISSION = "ADD_PERMISSION",
  REMOVE_PERMISSION = "REMOVE_PERMISSION",
  ADD_MEMBER_TO_SERVER = "ADD_MEMBER_TO_SERVER",
  REMOVE_MEMBER_FROM_SERVER = "REMOVE_MEMBER_FROM_SERVER",
  DELETE_SERVER = "DELETE_SERVER",
  ADD_ROLE_TO_USER = "ADD_ROLE_TO_USER",
  REMOVE_ROLE_FROM_USER = "REMOVE_ROLE_FROM_USER",
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
