import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createOrganizationFormSchema } from "~/components/forms/CreateOrganizationForm";

export const organizationRouter = createTRPCRouter({
  createOrganization: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        organizationData: createOrganizationFormSchema,
        fileData: z.object({
          logoUrl: z.string(),
          logoKey: z.string(),
          bannerUrl: z.string(),
          bannerKey: z.string(),
        }),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db.organization.create({
        data: {
          name: input.organizationData.name,
          username: input.organizationData.organizationUsername,
          private: input.organizationData.private,
          university: input.organizationData.university,
          addressLine1: input.organizationData.addressLine1,
          addressLine2: input.organizationData.addressLine2,
          city: input.organizationData.city,
          state: input.organizationData.state,
          zip: input.organizationData.zip,
          description: input.organizationData.description,
          joinCode: input.organizationData.joinCode,
          logoUrl: input.fileData.logoUrl,
          logoKey: input.fileData.logoKey,
          bannerUrl: input.fileData.bannerUrl,
          bannerKey: input.fileData.bannerKey,
          users: {
            create: {
              user: {
                connect: {
                  id: input.userId,
                },
              },
            },
          },
        },
      });
    }),

  getOrganization: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.organization.findUnique({
        where: {
          id: input.organizationId,
        },
        include: {
          _count: {
            select: {
              users: true,
            },
          },
        },
      });
    }),

  isMember: protectedProcedure
    .input(z.object({ organizationId: z.string(), userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const userOrg = await ctx.db.userOrganization.findFirst({
        where: {
          organizationId: input.organizationId,
          userId: input.userId,
        },
      });

      if (userOrg) {
        return true;
      } else {
        return false;
      }
    }),

  exploreOrganizations: protectedProcedure
    .input(z.object({ searchQuery: z.string() }))
    .query(async ({ input, ctx }) => {
      if (input.searchQuery.length < 3) return [];
      return ctx.db.organization.findMany({
        where: {
          OR: [
            {
              name: {
                contains: input.searchQuery,
              },
            },
            {
              username: {
                contains: input.searchQuery,
              },
            },
            {
              joinCode: {
                contains: input.searchQuery,
              },
            },
          ],
        },
      });
    }),

  getAllUsersInOrganization: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.userOrganization.findMany({
        where: {
          organizationId: input.organizationId,
        },
        include: {
          user: {
            include: {
              credentials: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });
    }),
});
