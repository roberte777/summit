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
});
