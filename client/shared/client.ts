/* eslint-disable turbo/no-undeclared-env-vars */
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { useMemo } from "react";
import merge from "deepmerge";
import isEqual from "lodash/isEqual";
import fetch from "isomorphic-unfetch";

import { authToken, getAccessToken, setAccessToken } from "../shared/auth";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from "jwt-decode";

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

let apolloClient;

const isServer = () => typeof window === "undefined";

function createApolloClient(serverAccessToken?: string) {
  const wsLink =
    typeof window !== "undefined"
      ? new GraphQLWsLink(
          createClient({
            url:
              process.env.NODE_ENV == "production"
                ? `ws://${process.env.WS_URL}/graphql`
                : "ws://localhost:4000/graphql",
            connectionParams: () => ({
              authorization: isServer() ? serverAccessToken : getAccessToken(),
            }),
          })
        )
      : null;

  const httpLink = createHttpLink({
    uri:
      process.env.NODE_ENV == "production"
        ? `${process.env.API_URL}/graphql`
        : "http://localhost:4000/graphql",
    credentials:
      process.env.NODE_ENV == "production" ? "same-origin" : "include",
    fetch,
  });

  const refreshLink = new TokenRefreshLink({
    accessTokenField: "access_token",
    isTokenValidOrUndefined: () => {
      const token = getAccessToken();

      if (!token) {
        return true;
      }

      try {
        const { exp }: any = jwtDecode(token);
        if (Date.now() >= exp * 1000) {
          return false;
        } else {
          return true;
        }
      } catch {
        return false;
      }
    },
    fetchAccessToken: () => {
      return fetch(
        process.env.NODE_ENV == "production"
          ? `${process.env.API_URL}/refresh_token`
          : "http://localhost:4000/refresh_token",
        {
          method: "POST",
          credentials:
            process.env.NODE_ENV == "production" ? "same-origin" : "include",
        }
      );
    },
    handleFetch: (accessToken) => {
      console.log("asfasf", accessToken);
      setAccessToken(accessToken);
    },
    handleError: (err) => {
      console.warn("Your refresh token is invalid. Try to relogin");
      console.error(err);
    },
  });

  const authLink = setContext((_, { headers }) => {
    const token = isServer() ? serverAccessToken : getAccessToken();
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ?? "",
      },
    };
  });

  const splitLink =
    typeof window !== "undefined" && wsLink != null
      ? split(
          ({ query }) => {
            const def = getMainDefinition(query);
            return (
              def.kind === "OperationDefinition" &&
              def.operation === "subscription"
            );
          },
          wsLink,
          httpLink
        )
      : httpLink;

  return new ApolloClient({
    // uri: "http://localhost:4000/graphql",
    ssrMode: typeof window === "undefined",
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            channels: {
              merge: true,
            },
          },
        },
      },
    }),
    link: from([refreshLink, authLink, splitLink]),
  });
}

export function initializeApollo(
  initialState = null,
  serverAccessToken?: string
) {
  if (serverAccessToken) {
    setAccessToken(serverAccessToken);
  }

  const _apolloClient = apolloClient ?? createApolloClient(serverAccessToken);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
    const data = merge(existingCache, initialState, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

export function useApollo(pageProps) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state), [state]);
  return store;
}
