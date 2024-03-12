import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  findEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.user.findFirst({
        select: { email: true },
        where: { email: { equals: input.email } },
      });
    }),

  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.user.findFirst({
        where: { id: input.id },
        include: { credentials: { select: { username: true } } },
      });
    }),
});
