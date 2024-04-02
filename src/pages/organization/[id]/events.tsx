import { CreateEventForm } from "~/components/forms/CreateEventForm";

export default function OrganizationEvents() {
  return (
    <>
      <div className="flex w-full flex-grow flex-col gap-4">
        <div className="flex flex-col justify-between gap-2 border-b border-gray-300 pb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-summit-700">Events</h3>
            <div className="h-0.5 w-0.5 rounded-full bg-gray-500" />
            <p className="text-sm text-gray-500">5 events</p>
          </div>
        </div>
        <CreateEventForm />
      </div>
    </>
  );
}
