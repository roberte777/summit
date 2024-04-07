import { type Dispatch, type SetStateAction } from "react";
import { CreateEventForm } from "~/components/forms/CreateEventForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/shadcn/ui/dialog";

export default function CreateEventDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="px-0 sm:max-w-md">
          <DialogHeader className="px-6">
            <DialogTitle>Create Event</DialogTitle>
            <DialogDescription>
              Fill out the form below to create an event.
            </DialogDescription>
          </DialogHeader>
          <CreateEventForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}
