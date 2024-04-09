import { useParams } from "next/navigation";
import { useState } from "react";
import CreateEventDialog from "~/components/custom/ui/createEventDialog";
import EventListItem from "~/components/custom/ui/eventListItem";
import { Button } from "~/components/shadcn/ui/button";
import { api } from "~/utils/api";

export default function OrganizationEvents() {
  const params = useParams<{ id: string }>();
  const { data } = api.event.getAllEvents.useQuery({
    organizationId: params?.id ?? "",
  });
  const [createEventDialogOpen, setCreateEventDialogOpen] = useState(false);

  return (
    <>
      <div className="flex w-full flex-grow flex-col gap-4">
        <div className="flex flex-col justify-between gap-2 border-b border-gray-300 pb-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-summit-700">Events</h3>
            <div className="h-0.5 w-0.5 rounded-full bg-gray-500" />
            <p className="text-sm text-gray-500">{`${data?.length} events`}</p>
          </div>
          <Button onClick={() => setCreateEventDialogOpen(true)}>
            Create event
          </Button>
        </div>
        <div className="flex flex-col space-y-1">
          {data
            ?.sort(
              (a, b) =>
                a.startDate.getTime() - b.startDate.getTime() ||
                a.startTime.getTime() - b.startTime.getTime(),
            )
            .map((event) => <EventListItem key={event.id} event={event} />)}
        </div>
      </div>
      <CreateEventDialog
        open={createEventDialogOpen}
        setOpen={setCreateEventDialogOpen}
      />
    </>
  );
}
