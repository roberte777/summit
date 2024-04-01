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
    .mutation(async ({ input, ctx }) => {
      // Start a transaction
      return await ctx.db.$transaction(async (prisma) => {
        // Step 1: Create the organization
        const organization = await prisma.organization.create({
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
          },
        });

        // Step 2: Create the roles including the "Owner" role
        const ownerRole = await prisma.role.create({
          data: {
            name: "Owner",
            description: "Organization owner.",
            organizationId: organization.id,
          },
        });

        await prisma.role.createMany({
          data: [
            {
              name: "Admin",
              description: "Organization admin.",
              organizationId: organization.id,
            },
            {
              name: "General",
              description: "General organization member.",
              organizationId: organization.id,
            },
          ],
        });

        // Step 3: Connect the user to the organization with the "Owner" role
        await prisma.userOrganization.create({
          data: {
            userId: input.userId,
            organizationId: organization.id,
            roleId: ownerRole.id,
          },
        });

        return organization;
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
        include: {
          role: true,
        },
      });

      if (userOrg) {
        return {
          isMember: true,
          userOrg: userOrg,
        };
      } else {
        return {
          isMember: false,
          userOrg: null,
        };
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

  getAllOrganizations: protectedProcedure.query(({ ctx }) => {
    return ctx.db.organization.findMany();
  }),

  joinOrganization: protectedProcedure
    .input(z.object({ organizationId: z.string(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const generalRoleId = await ctx.db.role.findFirst({
        where: {
          AND: [{ name: "General" }, { organizationId: input.organizationId }],
        },
        select: {
          id: true,
        },
      });

      if (generalRoleId?.id) {
        return ctx.db.userOrganization.create({
          data: {
            organizationId: input.organizationId,
            userId: input.userId,
            roleId: generalRoleId.id,
          },
        });
      } else {
        throw new Error("Error joining organization.");
      }
    }),

  leaveOrganization: protectedProcedure
    .input(z.object({ organizationId: z.string(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.userOrganization.deleteMany({
        where: {
          organizationId: input.organizationId,
          userId: input.userId,
        },
      });
    }),
});
