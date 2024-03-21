import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { onboardingFormSchema } from "~/components/forms/OnboardingForm";

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

  getUserOnboarding: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.user.findFirst({
        where: { id: input.id },
        select: { onboarded: true },
      });
    }),

  updateUserOnboarding: protectedProcedure
    .input(z.object({ id: z.string(), onboardingData: onboardingFormSchema }))
    .mutation(({ input, ctx }) => {
      return ctx.db.user.update({
        where: { id: input.id },
        data: {
          name:
            input.onboardingData.firstName +
            " " +
            input.onboardingData.lastName,
          academicYear: input.onboardingData.academicYear,
          academicMajor: input.onboardingData.academicMajor,
          academicUniversity: input.onboardingData.academicUniversity,
          graduationYear: input.onboardingData.academicGraduationYear,
          city: input.onboardingData.city,
          state: input.onboardingData.state,
          phone: input.onboardingData.phone,
          birthday: input.onboardingData.birthday,
          onboarded: true,
        },
      });
    }),
});
