import React from "react";
import { destroyCookie } from "nookies";
import { initializeApollo } from "../shared/client";

export default function logout() {
  return <div>logout</div>;
}

export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo();

  console.log(ctx.res);
  ctx.res.setHeader("Set-Cookie", ["sid=deleted; Max-Age=0"]);
  await apolloClient.resetStore();

  return {
    props: {},
  };
}
