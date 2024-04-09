import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useEffect, useState } from "react";
import { type Tag, TagInput } from "../shadcn/ui/tag-input";
import { TimePicker } from "../shadcn/ui/datetime-picker";
import {
  type Time,
  type CalendarDateTime,
  type ZonedDateTime,
  CalendarDate,
  toCalendarDateTime,
  getLocalTimeZone,
} from "@internationalized/date";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/ui/popover";
import { Button } from "../shadcn/ui/button";
import { cn } from "~/utils/shadcn";
import { CalendarIcon, MapPin, Video, X } from "lucide-react";
import { Calendar } from "../shadcn/ui/calendar";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shadcn/ui/tabs";
import { Clock, UsersGroup } from "~/svgs";
import { ScrollArea } from "../shadcn/ui/scroll-area";
import { Switch } from "../shadcn/ui/switch";
import { useParams } from "next/navigation";
import { api } from "~/utils/api";
import { AttendeeSearch } from "../custom/ui/attendee-search";
import Image from "next/image";
import { useToast } from "../shadcn/ui/use-toast";
import { useSession } from "next-auth/react";

export type EventAttendee = {
  id: string;
  name: string;
  username?: string;
  image?: string;
  required: boolean;
};

export const createEventFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z
    .string()
    .max(250, "Description must be at most 250 characters long"),
  categories: z
    .array(z.object({ id: z.string(), text: z.string() }))
    .optional(),
  startTime: z.date(),
  endTime: z.date(),
  startDate: z.date().min(new Date(), "Start date must be in the future"),
  endDate: z.date().min(new Date(), "End date must be in the future"),
  unlimitedSlots: z.boolean(),
  slots: z.number().int().optional(),
  online: z.boolean(),
  onlineUrl: z.string().optional(),
  location: z.string().optional(),
});

export function CreateEventForm({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof createEventFormSchema>>({
    resolver: zodResolver(createEventFormSchema),
    defaultValues: {
      name: "",
      description: "",
      online: false,
      onlineUrl: "",
      location: "",
      unlimitedSlots: true,
    },
  });
  const session = useSession();
  const { toast } = useToast();
  const createEvent = api.event.createEvent.useMutation();

  const onSubmit = (values: z.infer<typeof createEventFormSchema>) => {
    createEvent.mutate({
      organizationId: params.id,
      userId: session.data?.user.id ?? "",
      formData: values,
      attendees: attendees,
    });
  };

  const [tags, setTags] = useState<Tag[]>([]);
  const [startTime, setStartTime] = useState<
    Time | CalendarDateTime | ZonedDateTime
  >();
  const [endTime, setEndTime] = useState<
    Time | CalendarDateTime | ZonedDateTime
  >();
  const [endDate, setEndDate] = useState<Date>();
  const [slots, setSlots] = useState<number>(-1);
  const params = useParams<{ id: string }>();
  const { data, isLoading } =
    api.organization.getAllUsersInOrganization.useQuery({
      organizationId: params?.id ?? "",
    });
  const [attendees, setAttendees] = useState<EventAttendee[]>([]);

  useEffect(() => {
    if (createEvent.status === "success") {
      setOpen(false);
      toast({
        variant: "default",
        title: "Event created",
        description: "Event created successfully.",
      });
    }
    if (createEvent.status === "error") {
      setOpen(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: createEvent.error?.message ?? "Failed to create event.",
      });
    }
  }, [createEvent.error?.message, createEvent.status, setOpen, toast]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-2 pb-8"
        >
          <Tabs defaultValue="general" className="relative mr-auto w-full">
            <div className="flex items-center justify-between gap-4 pb-3">
              <TabsList className="ml-6 w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="general"
                  className="text-muted-foreground relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold shadow-none transition-none data-[state=active]:border-b-summit-700 data-[state=active]:text-summit-700 data-[state=active]:shadow-none"
                >
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="attendees"
                  className="text-muted-foreground relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold shadow-none transition-none data-[state=active]:border-b-summit-700 data-[state=active]:text-summit-700 data-[state=active]:shadow-none"
                >
                  Attendees
                </TabsTrigger>
              </TabsList>
              <Button
                type="submit"
                className="mr-6 hidden w-max sm:block"
                size="sm"
              >
                Create event
              </Button>
            </div>
            <TabsContent value="general">
              <ScrollArea className="h-[60vh] w-full px-6">
                <div className="flex w-full flex-col gap-4">
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
                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categories</FormLabel>
                        <FormControl>
                          <TagInput
                            {...field}
                            placeholder="Enter up to 5 categories"
                            tags={tags}
                            setTags={(newTags) => {
                              setTags(newTags);
                              form.setValue(
                                "categories",
                                newTags as [Tag, ...Tag[]],
                              );
                            }}
                            shape="rounded"
                            animation="fadeIn"
                            maxTags={5}
                            truncate={10}
                            inputFieldPostion="top"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormLabel>Time</FormLabel>
                  <div className="flex w-full gap-4">
                    <div className="flex grow flex-col items-center gap-2 pb-4 pt-2">
                      <Clock className="h-6 w-6 shrink-0 text-summit-700" />
                      <div className="w-px grow bg-gray-200" />
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-summit-700" />
                    </div>
                    <div className="flex w-full flex-col gap-4">
                      <div className="flex w-full items-center gap-4">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem className="flex w-full flex-col">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "P")
                                      ) : (
                                        <span>Start date</span>
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
                                    captionLayout="dropdown-buttons"
                                    selected={field.value}
                                    onSelect={(newDate) => {
                                      field.onChange(newDate);
                                      if (!endDate && newDate) {
                                        setEndDate(newDate);
                                        form.setValue("endDate", newDate);
                                      }
                                    }}
                                    fromYear={2024}
                                    toYear={2100}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({}) => (
                            <FormItem className="min-w-32">
                              <FormControl>
                                <TimePicker
                                  value={startTime}
                                  onChange={(newTime) => {
                                    setStartTime(newTime);
                                    form.setValue(
                                      "startTime",
                                      toCalendarDateTime(
                                        new CalendarDate(2024, 1, 1),
                                        newTime,
                                      ).toDate(getLocalTimeZone()),
                                    );
                                    if (!endTime) {
                                      const newTimePlusOne = newTime.add({
                                        hours: 1,
                                      });
                                      setEndTime(newTimePlusOne);
                                      form.setValue(
                                        "endTime",
                                        toCalendarDateTime(
                                          new CalendarDate(2024, 1, 1),
                                          newTimePlusOne,
                                        ).toDate(getLocalTimeZone()),
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex w-full items-center gap-4">
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem className="flex w-full flex-col">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal ",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "P")
                                      ) : (
                                        <span>End date</span>
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
                                    captionLayout="dropdown-buttons"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    fromYear={2024}
                                    toYear={2100}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="endTime"
                          render={({}) => (
                            <FormItem className="min-w-32">
                              <FormControl>
                                <TimePicker
                                  value={endTime}
                                  onChange={(newTime) => {
                                    setEndTime(newTime);
                                    form.setValue(
                                      "endTime",
                                      toCalendarDateTime(
                                        new CalendarDate(2024, 1, 1),
                                        newTime,
                                      ).toDate(getLocalTimeZone()),
                                    );
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <FormLabel>Location</FormLabel>
                  <Tabs
                    defaultValue="in-person"
                    className="w-full"
                    onValueChange={(value) => {
                      if (value === "in-person") {
                        form.setValue("online", false);
                        form.setValue("onlineUrl", "");
                      } else if (value === "online") {
                        form.setValue("online", true);
                        form.setValue("location", "");
                      }
                    }}
                  >
                    <TabsList className="w-full">
                      <TabsTrigger
                        value="in-person"
                        className="w-full rounded-md data-[state=active]:bg-summit-700 data-[state=active]:text-white"
                      >
                        In-Person Event
                      </TabsTrigger>
                      <TabsTrigger
                        value="online"
                        className="w-full rounded-md data-[state=active]:bg-summit-700 data-[state=active]:text-white"
                      >
                        Online Event
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="in-person">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center gap-4">
                                <MapPin className="h-6 w-6 text-summit-700" />
                                <Input
                                  {...field}
                                  placeholder="Enter location"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value="online">
                      <FormField
                        control={form.control}
                        name="onlineUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center gap-4">
                                <Video className="h-6 w-6 text-summit-700" />
                                <Input
                                  {...field}
                                  placeholder="Enter meeting URL"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="attendees">
              <ScrollArea className="h-[60vh] w-full">
                <div className="flex w-full flex-col gap-4 px-6 py-2">
                  <FormField
                    control={form.control}
                    name="unlimitedSlots"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex w-full items-center justify-between gap-4">
                          <FormLabel>
                            All members in the organization can attend
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slots"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex w-full items-center justify-between gap-4">
                          <FormLabel className="whitespace-nowrap">
                            Available sign up slots
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              className="w-28"
                              placeholder="Unlimited"
                              onChange={(e) => {
                                if (e.target.value === "") {
                                  form.setValue("slots", undefined);
                                  setSlots(-1);
                                  return;
                                }
                                form.setValue("slots", Number(e.target.value));
                                setSlots(Number(e.target.value));
                              }}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <AttendeeSearch
                      options={
                        data
                          ?.filter(
                            (user) =>
                              !attendees.find(
                                (attendee) => attendee.id === user.userId,
                              ),
                          )
                          ?.map((user) => ({
                            value: user.userId,
                            label: user.user.name ?? user.user.email ?? "",
                            description:
                              `@${user.user.credentials?.username}` ??
                              undefined,
                            image: user.user.image ?? "",
                          })) ?? []
                      }
                      emptyMessage="No users found."
                      placeholder="Add required attendees"
                      isLoading={isLoading}
                      onSelected={(selected) => {
                        setAttendees((attendees) => {
                          const newAttendees = [
                            ...attendees,
                            {
                              id: selected.value,
                              name: selected.label,
                              username: selected.description,
                              image: selected.image,
                              required: true,
                            },
                          ];
                          return newAttendees.sort((a, b) =>
                            a.name.localeCompare(b.name),
                          );
                        });
                      }}
                      onOptionalSelected={(selected) => {
                        setAttendees((attendees) => {
                          const newAttendees = [
                            ...attendees,
                            {
                              id: selected.value,
                              name: selected.label,
                              username: selected.description,
                              image: selected.image,
                              required: false,
                            },
                          ];
                          return newAttendees.sort((a, b) =>
                            a.name.localeCompare(b.name),
                          );
                        });
                      }}
                    />
                  </div>
                  <div className="flex w-full items-center justify-between gap-2">
                    <FormLabel>Event roster</FormLabel>
                    {form.getValues("slots") && (
                      <div
                        className={cn(
                          "text-sm",
                          attendees.length >= slots && "text-red-500",
                          attendees.length < slots && "text-gray-500",
                          attendees.length === slots && "text-green-500",
                        )}
                      >{`${attendees.length}/${slots} slots filled`}</div>
                    )}
                  </div>
                  {attendees.length === 0 && (
                    <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-md bg-gray-100">
                      <UsersGroup className="h-6 w-6 text-gray-500" />
                      {/* <div className="text-sm font-semibold">
                        Anyone in the organizatinon can join this event.
                      </div> */}
                      <div className="text-xs text-gray-500">
                        {form.getValues("unlimitedSlots")
                          ? "Anyone in the organizatinon can join this event."
                          : "No attendees added yet."}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col">
                    {attendees.map((attendee) => (
                      <div
                        key={attendee.id}
                        className="flex w-full items-center justify-between gap-4 rounded-lg px-4 py-2"
                      >
                        <div className="flex items-center gap-4">
                          {attendee.image ? (
                            <div className="relative h-8 w-8 rounded-full">
                              <Image
                                src={attendee.image}
                                alt={attendee.name}
                                fill
                                className="rounded-full object-fill"
                              />
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200" />
                          )}
                          <div className="flex flex-col">
                            <div className="text-sm font-semibold">
                              {attendee.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {attendee.username}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-gray-500">
                            {attendee.required ? "Required" : "Optional"}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setAttendees((attendees) =>
                                attendees.filter(
                                  (currentAttendee) =>
                                    currentAttendee.id !== attendee.id,
                                ),
                              )
                            }
                            className="transition-colors hover:bg-red-50 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
          <Button type="submit" className="w-full sm:hidden" size="sm">
            Create event
          </Button>
        </form>
      </Form>
    </>
  );
}
