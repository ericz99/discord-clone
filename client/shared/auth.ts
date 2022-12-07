/* eslint-disable turbo/no-undeclared-env-vars */
import { makeVar } from "@apollo/client";
import cookie from "cookie";
import jwtDecode from "jwt-decode";
import fetch from "isomorphic-unfetch";
import { initializeApollo, addApolloState } from "./client";
import { JWTAccessTokenPayload } from "./types";

export const authVar = makeVar(false);
export const authToken = makeVar(null);

let accessToken = "";

export const setAccessToken = (s: string) => {
  accessToken = s;
};

export const getAccessToken = () => {
  return accessToken;
};

export const checkUserAuth = async (req) => {
  let apolloClient: any;

  console.log("node-env", process.env.NODE_ENV);
  // console.log(process.env.NEXT_PUBLIC_API_URL);
  // console.log(process.env.API_URL);
  // console.log(process.env);

  if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie);
    const response = await fetch(
      process.env.NODE_ENV == "production"
        ? `${process.env.API_URL}/refresh_token`
        : "http://localhost:4000/refresh_token",
      {
        method: "POST",
        credentials:
          process.env.NODE_ENV == "production" ? "same-origin" : "include",
        headers: {
          cookie: "sid=" + cookies.sid,
        },
      }
    );
    const data = await response.json();
    setAccessToken(data.access_token);
    apolloClient = initializeApollo({}, data.access_token);

    // # decode client side
    const decoded = jwtDecode(data.access_token) as JWTAccessTokenPayload;

    return addApolloState(apolloClient, {
      props: {
        access_token: data.access_token,
        loggedInUser: {
          ...decoded,
        },
      },
    });
  }

  return {
    redirect: {
      permanent: false,
      destination: "/login",
    },
  };
};

export const ensureSignIn = async (req) => {
  if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie);
    if (cookies.sid) {
      return {
        redirect: {
          permanent: false,
          destination: "/channels",
        },
      };
    }
  }

  return {
    props: {},
  };
};
