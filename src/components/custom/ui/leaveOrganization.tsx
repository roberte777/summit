import { useRouter } from "next/router";
import { type Dispatch, type SetStateAction } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "~/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "~/components/shadcn/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/shadcn/ui/drawer";
import { api } from "~/utils/api";

export default function LeaveOrganization({
  open,
  setOpen,
  userId,
  organizationId,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  userId: string;
  organizationId: string;
}) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const leaveOrganization = api.organization.leaveOrganization.useMutation();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>
                Are you sure you want to leave this organization?
              </DrawerTitle>
              <DrawerDescription>
                You will have to re-join again if you change your mind.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button
                size="sm"
                className="bg-red-500 hover:bg-red-600"
                onClick={() => {
                  leaveOrganization.mutate({
                    userId: userId,
                    organizationId: organizationId,
                  });

                  router.reload();
                }}
                disabled={leaveOrganization.isLoading}
              >
                Leave organization
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="text-lg font-semibold">
          Are you sure you want to leave this organization?
        </DialogHeader>
        <div className="text-sm text-gray-500">
          You will have to re-join again if you change your mind.
        </div>
        <DialogFooter>
          <div className="flex gap-4">
            <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                leaveOrganization.mutate({
                  userId: userId,
                  organizationId: organizationId,
                });

                router.reload();
              }}
              disabled={leaveOrganization.isLoading}
            >
              Leave organization
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
