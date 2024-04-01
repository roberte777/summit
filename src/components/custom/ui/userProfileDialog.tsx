import { type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "~/components/shadcn/ui/dialog";
import Image from "next/image";
import { useMediaQuery } from "usehooks-ts";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import { formatPhoneNumber } from "react-phone-number-input";
import { type User } from "@prisma/client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
} from "~/components/shadcn/ui/drawer";

export default function UserProfileDialog({
  open,
  setOpen,
  user,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  user: { credentials: { username: string } | null } & User;
}) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader className="flex items-center justify-between gap-4 border-b border-gray-200 py-4">
            <div className="flex items-center gap-4">
              {!user.image || user.image === "" ? (
                <div className="h-16 w-16 rounded-full bg-gray-300" />
              ) : (
                <div className="relative h-16 w-16">
                  <Image
                    src={user.image}
                    alt="List item image."
                    fill
                    className="rounded-full object-fill"
                  />
                </div>
              )}
              <div className="flex flex-col">
                <div className="text-xl font-semibold">{user.name}</div>
                <div className="text-gray-500">{`@${user.credentials?.username.toLowerCase()}`}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`mailto:${user.email}`}
                className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-summit-700 px-3 text-sm font-medium text-white ring-offset-white transition-colors hover:bg-summit-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-summit-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                <Mail className="h-4 w-4" />
              </Link>
              <Link
                href={`tel:${user.phone}`}
                className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-summit-700 px-3 text-sm font-medium text-white ring-offset-white transition-colors hover:bg-summit-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-summit-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                <Phone className="h-4 w-4" />
              </Link>
            </div>
          </DrawerHeader>
          <UserContent user={user} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between gap-4 border-b border-gray-200 py-4">
          <div className="flex items-center gap-4">
            {!user.image || user.image === "" ? (
              <div className="h-16 w-16 rounded-full bg-gray-300">
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-gray-500">
                  {user.name
                    ? user.name
                        ?.split(" ")
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()
                    : ""}
                </div>
              </div>
            ) : (
              <div className="relative h-16 w-16">
                <Image
                  src={user.image}
                  alt="List item image."
                  fill
                  className="rounded-full object-fill"
                />
              </div>
            )}
            <div className="flex flex-col">
              <div className="text-xl font-semibold">{user.name}</div>
              <div className="text-gray-500">{`@${user.credentials?.username.toLowerCase()}`}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`mailto:${user.email}`}
              className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-summit-700 px-3 text-sm font-medium text-white ring-offset-white transition-colors hover:bg-summit-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-summit-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <Mail className="h-4 w-4" />
            </Link>
            <Link
              href={`tel:${user.phone}`}
              className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-summit-700 px-3 text-sm font-medium text-white ring-offset-white transition-colors hover:bg-summit-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-summit-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <Phone className="h-4 w-4" />
            </Link>
          </div>
        </DialogHeader>
        <UserContent user={user} />
      </DialogContent>
    </Dialog>
  );
}

function UserContent({
  user,
}: {
  user: { credentials: { username: string } | null } & User;
}) {
  return (
    <>
      <div className="flex flex-col gap-1 space-y-2 border-b border-gray-200 px-4 py-4 text-sm sm:px-0 sm:pt-0">
        <div className="text-base font-semibold">Personal Information</div>
        <div className="flex items-center justify-between gap-2">
          <div>Email</div>
          <div className="text-gray-500">{user.email}</div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div>Phone number</div>
          <div className="text-gray-500">
            {formatPhoneNumber(user.phone ?? "")}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div>Birthday</div>
          <div className="text-gray-500">
            {user.birthday?.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div>Location</div>
          <div className="text-gray-500">{user.city + ", " + user.state}</div>
        </div>
      </div>
      <div className="flex flex-col gap-1 space-y-2 px-4 pb-8 pt-4 text-sm sm:px-0 sm:pb-4 sm:pt-0">
        <div className="text-base font-semibold">Education Information</div>
        <div className="flex items-center justify-between gap-2">
          <div>University</div>
          <div className="text-gray-500">{user.academicUniversity}</div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div>Major</div>
          <div className="text-gray-500">{user.academicMajor}</div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div>Year</div>
          <div className="text-gray-500">{user.academicYear}</div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div>Graduation year</div>
          <div className="text-gray-500">{user.graduationYear}</div>
        </div>
      </div>
    </>
  );
}
