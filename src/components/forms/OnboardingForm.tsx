import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AcademicYearOptions,
  GraduationYearOptions,
  StateOptions,
} from "~/constants/formValues";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/ui/form";
import { Input } from "../shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn/ui/select";
import { PhoneInput } from "../shadcn/ui/phone-input";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/ui/popover";
import { Button } from "../shadcn/ui/button";
import { cn } from "~/utils/shadcn";
import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../shadcn/ui/command";
import { Calendar } from "../shadcn/ui/calendar";
import { format } from "date-fns";
import { api } from "~/utils/api";
import { useToast } from "../shadcn/ui/use-toast";
import { useEffect, type Dispatch, type SetStateAction } from "react";

export const onboardingFormSchema = z.object({
  academicYear: AcademicYearOptions,
  academicMajor: z.string().min(1),
  academicUniversity: z.string().min(1),
  academicGraduationYear: GraduationYearOptions,
  city: z.string().min(1),
  state: StateOptions,
  phone: z.string().min(1).max(15),
  birthday: z.date().max(new Date()), // Max date is today
});

export function OnboardingForm({
  userId,
  setOnboarded,
}: {
  userId: string;
  setOnboarded: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof onboardingFormSchema>>({
    resolver: zodResolver(onboardingFormSchema),
  });

  const { mutate, error, isLoading, status } =
    api.user.updateUserOnboarding.useMutation();
  const { toast } = useToast();

  function onSubmit(values: z.infer<typeof onboardingFormSchema>) {
    mutate({ id: userId, onboardingData: values });
  }

  useEffect(() => {
    if (status === "success") {
      console.log("Onboarding form submitted successfully");
      setOnboarded(true);
    }
    if (status === "error") {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message ?? "An error occurred",
      });
    }
  }, [status, error, setOnboarded, toast]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="z-[100] flex w-full flex-col gap-8 divide-y divide-gray-200"
      >
        <div className="flex w-full flex-col gap-4">
          <FormLabel className="text-base">Personal Information</FormLabel>
          <FormField
            disabled={isLoading}
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <PhoneInput {...field} defaultCountry="US" />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex w-full items-center gap-4">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>State</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground font-normal",
                          )}
                        >
                          {field.value
                            ? StateOptions.options.find(
                                (state) => state === field.value,
                              )
                            : "Select state"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="pointer-events-auto w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search state..." />
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {StateOptions.options.map((state) => (
                              <CommandItem
                                value={state}
                                key={state}
                                onSelect={() => {
                                  form.setValue("state", state);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    state === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {state}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>
          <FormField
            disabled={isLoading}
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="pointer-events-auto w-auto p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-4 pt-8">
          <FormLabel className="text-base">Education Information</FormLabel>
          <FormField
            disabled={isLoading}
            control={form.control}
            name="academicUniversity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            disabled={isLoading}
            control={form.control}
            name="academicMajor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Major</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex w-full items-center gap-4">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="academicGraduationYear"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Graduation year</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a year..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GraduationYearOptions.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="academicYear"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Academic year</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a year..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AcademicYearOptions.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-summit-700 hover:bg-summit-700/95"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving information
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </form>
    </Form>
  );
}
