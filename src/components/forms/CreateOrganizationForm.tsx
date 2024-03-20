import { z } from "zod";

export const createOrganizationFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  organizationUsername: z.string().min(3),
  private: z.boolean(),
  university: z.string().min(1),
  addressLine1: z.string().min(1),
  addressLine2: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  description: z.string().max(1000),
});
