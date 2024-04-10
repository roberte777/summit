import { Prisma } from "@prisma/client";
import { ChevronRight } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { AvatarStack } from "~/components/shadcn/ui/avatar-stack";

const eventWithConnections = Prisma.validator<Prisma.EventDefaultArgs>()({
  include: {
    location: true,
    attendees: { include: { user: true } },
    categories: true,
  },
});

type EventWithConnections = Prisma.EventGetPayload<typeof eventWithConnections>;

export default function EventListItem({
  event,
}: {
  event: EventWithConnections;
}) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <div className="flex h-24 w-full items-center justify-between gap-4 p-2 transition-colors hover:cursor-pointer hover:bg-gray-50 lg:p-4">
      <div className="flex h-full items-center gap-4">
        <div className="bg-summit-700-50 flex h-full min-w-28 flex-col items-center justify-center rounded-md p-2 lg:min-w-36 lg:p-4">
          <div className="text-sm font-medium">
            {caclulateDateString(event.startDate, event.endDate)}
          </div>
          <div className="font-semibold lg:text-lg">
            {event.startTime.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </div>
        <div className="flex h-full flex-col justify-center lg:gap-1">
          <div className="font-semibold lg:text-lg">{event.name}</div>
          {event.description && (
            <div className="text-sm text-gray-500">
              {event.description.length > 100
                ? isMobile
                  ? `${event.description.slice(0, 40)}...`
                  : `${event.description.slice(0, 100)}...`
                : event.description}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden flex-col items-end gap-1 lg:flex">
          <AvatarStack
            orientation="horizontal"
            avatars={event.attendees.map((attendee) => {
              return {
                avatarUrl: attendee.user.image ?? "",
                label: attendee.user.name ?? attendee.user.email ?? "",
              };
            })}
          />
          <div className="text-sm text-gray-500">
            {event.slots &&
              `${event.attendees.length}/${event.slots} slots filled`}
          </div>
        </div>
        <ChevronRight className="h-6 w-6 text-gray-500" />
      </div>
    </div>
  );
}

/**
 * This function calculates the date string to display for an event. It will return "Today" if the date is today, "Tomorrow" if the date is tomorrow, or the date range formatted as "MMM D - MMM D" if the date range spans multiple days.
 * @param startDate
 * @param endDate
 * @returns
 */
function caclulateDateString(startDate: Date, endDate: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date to midnight for accurate comparison

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0); // Normalize input dates to midnight

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  });

  if (start.getTime() === end.getTime()) {
    if (start.getTime() === today.getTime()) {
      return "Today";
    } else if (start.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else {
      return dateFormatter.format(start);
    }
  } else {
    const [startFormatMonth, startFormatDay] = dateFormatter
      .format(start)
      .toUpperCase()
      .split(" ");
    const [endFormatMonth, endFormatDay] = dateFormatter
      .format(end)
      .toUpperCase()
      .split(" ");
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()} - ${endFormatDay} ${endFormatMonth}`;
    } else {
      return `${startFormatDay} ${startFormatMonth} - ${endFormatDay} ${endFormatMonth}`;
    }
  }
}
