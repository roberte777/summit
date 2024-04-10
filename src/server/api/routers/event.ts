import { createEventFormSchema } from "~/components/forms/CreateEventForm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const eventRouter = createTRPCRouter({
  createEvent: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        userId: z.string(),
        formData: createEventFormSchema,
        attendees: z.array(
          z.object({
            id: z.string(),
            required: z.boolean(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.$transaction(async (prisma) => {
        // Step 1: Create the location
        const location = await prisma.location.create({
          data: {
            online: input.formData.online,
            onlineUrl: input.formData.onlineUrl,
            location: input.formData.location,
          },
        });

        // Step 2: Create the event
        const event = await prisma.event.create({
          data: {
            name: input.formData.name,
            description: input.formData.description,
            startTime: input.formData.startTime,
            endTime: input.formData.endTime,
            startDate: input.formData.startDate,
            endDate: input.formData.endDate,
            open: input.formData.unlimitedSlots,
            slots: input.formData.slots,
            createdById: input.userId,
            locationId: location.id,
            organizationId: input.organizationId,
          },
        });

        // Step 3: Create or update the categories if there are any
        if (input.formData.categories) {
          const categories = await Promise.all(
            input.formData.categories.map(async (tag) => {
              return await prisma.eventCategory.upsert({
                where: {
                  name_organizationId: {
                    name: tag.text.toLowerCase(),
                    organizationId: input.organizationId,
                  },
                },
                update: {},
                create: {
                  name: tag.text.toLowerCase(),
                  organizationId: input.organizationId,
                },
              });
            }),
          );

          // Step 3.1: Connect the categories to the event
          await prisma.eventCategoryLink.createMany({
            data: categories.map((category) => ({
              categoryId: category.id,
              eventId: event.id,
            })),
          });
        }

        // Step 4: Create the attendees
        await prisma.eventAttendee.createMany({
          data: input.attendees.map((attendee) => ({
            userId: attendee.id,
            eventId: event.id,
            status: "PENDING",
            required: attendee.required,
          })),
        });

        return event;
      });
    }),

  getAllEvents: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.event.findMany({
        where: {
          organizationId: input.organizationId,
        },
        include: {
          location: true,
          attendees: {
            include: {
              user: true,
            },
          },
          categories: true,
        },
      });
    }),
});
