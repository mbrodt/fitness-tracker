import { createTRPCRouter } from "./trpc";
import { mainRouter } from "./routers/main";
import { setRouter } from "./routers/set";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  main: mainRouter,
  set: setRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
