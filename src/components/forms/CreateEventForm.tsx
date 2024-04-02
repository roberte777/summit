import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { StateOptions } from "~/constants/formValues";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/ui/form";
import { Input } from "../shadcn/ui/input";
import { AdvancedTextArea } from "../custom/ui/advancedTextarea";

export const createEventFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z
    .string()
    .max(250, "Description must be at most 250 characters long"),
  categoryId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  startDate: z.date().min(new Date(), "Start date must be in the future"),
  endDate: z.date().min(new Date(), "End date must be in the future"),
  repeatPattern: z.string(),
  slots: z.number().int(),
  online: z.boolean(),
  onlineUrl: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  city: z.string(),
  state: StateOptions,
  zipCode: z.string(),
  customLocation: z.string(),
});

export function CreateEventForm() {
  const form = useForm<z.infer<typeof createEventFormSchema>>({
    resolver: zodResolver(createEventFormSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      startTime: new Date(),
      endTime: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      repeatPattern: "",
      online: false,
      onlineUrl: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      zipCode: "",
      customLocation: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createEventFormSchema>) => {
    console.log(values);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <AdvancedTextArea
                    maxLength={250}
                    currentLength={field.value.length}
                    placeholder="Briefly describe your event"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
}
