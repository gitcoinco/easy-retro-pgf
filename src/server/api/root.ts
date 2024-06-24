import { ballotRouter } from "~/server/api/routers/ballot";
import { resultsRouter } from "~/server/api/routers/results";
import { roundsRouter } from "~/server/api/routers/rounds";
import { commentsRouter } from "~/server/api/routers/comments";
import { projectsRouter } from "~/server/api/routers/projects";
import { metricsRouter } from "~/server/api/routers/metrics";
import { metadataRouter } from "~/server/api/routers/metadata";
import { applicationsRouter } from "~/server/api/routers/applications";
import { profileRouter } from "~/server/api/routers/profile";
import { votersRouter } from "~/server/api/routers/voters";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  rounds: roundsRouter,
  comments: commentsRouter,
  results: resultsRouter,
  ballot: ballotRouter,
  voters: votersRouter,
  applications: applicationsRouter,
  profile: profileRouter,
  metadata: metadataRouter,
  projects: projectsRouter,
  metrics: metricsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
