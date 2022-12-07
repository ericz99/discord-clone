/* eslint-disable turbo/no-undeclared-env-vars */
import createApp from "./app";

(async () => {
  const { httpServer } = await createApp();

  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const IS_PROD = process.env.NODE_ENV === "production";
  const port = IS_PROD ? process.env.PORT : 4000;

  httpServer.listen({ port }, () => {
    console.log(`🚀 Server ready at http://localhost:4000/`);
  });
})();
