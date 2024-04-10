import { type Dispatch, type SetStateAction } from "react";
import { useMediaQuery } from "usehooks-ts";
import { CreateEventForm } from "~/components/forms/CreateEventForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/shadcn/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "~/components/shadcn/ui/drawer";

export default function CreateEventDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Create event</DrawerTitle>
              <DrawerDescription>
                Fill out the form below to create an event.
              </DrawerDescription>
            </DrawerHeader>
            <CreateEventForm setOpen={setOpen} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

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
