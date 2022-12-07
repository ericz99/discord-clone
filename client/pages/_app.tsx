import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { ApolloProvider } from "@apollo/client";

import { SEO } from "../components";
import { useApollo } from "../shared/client";
import { NextPageWithLayout } from "../shared/types";

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const apolloClient = useApollo(pageProps);
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <ApolloProvider client={apolloClient}>
      <SEO description="Lorem" title="Discord" siteTitle="Discord Clone" />
      {getLayout(<Component {...pageProps} />)}
      <ToastContainer />
    </ApolloProvider>
  );
}

export default MyApp;
