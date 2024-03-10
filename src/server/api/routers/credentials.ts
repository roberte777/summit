import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const credentialsRouter = createTRPCRouter({
  findUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.credentials.findFirst({
        select: { username: true },
        where: { username: { equals: input.username } },
      });
    }),
});
