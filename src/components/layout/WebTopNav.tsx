import Link from "next/link";
import Image from "next/image";
import Combobox, { type ComboboxItem } from "../shadcn/ui/combobox";
import { type Dispatch, type SetStateAction, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/ui/avatar";
import { LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const FakeOrganizations: ComboboxItem[] = [
  { value: "1", label: "Organization 1" },
  { value: "2", label: "Organization 2" },
  { value: "3", label: "Organization 3" },
];

export default function WebTopNav({
  selectedOrganizationId,
  setSelectedOrganizationId,
}: {
  selectedOrganizationId: string;
  setSelectedOrganizationId: Dispatch<SetStateAction<string>>;
}) {
  const { data } = useSession();
  const [avatarOpen, setAvatarOpen] = useState(false);

  return (
    <div className="hidden h-20 w-full bg-white sm:flex">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="w-full">
            <h1 className="flex w-full flex-row items-center gap-2 text-2xl font-bold text-summit-700">
              <Image
                src="/logos/SimpleTeal.svg"
                alt="Summit Logo"
                height={36}
                width={36}
                priority
              />
              <span className="sr-only">Summit</span>
              <span>Summit</span>
            </h1>
          </Link>
          <Combobox
            itemName="organization"
            value={selectedOrganizationId}
            setValue={setSelectedOrganizationId}
            items={FakeOrganizations}
          />
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu open={avatarOpen} onOpenChange={setAvatarOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="rounded-full"
                onMouseOver={() => setAvatarOpen(true)}
              >
                <Avatar>
                  <AvatarImage src={data?.user.image ?? ""} />
                  <AvatarFallback>
                    {data?.user?.name
                      ?.split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56"
              onMouseOver={() => setAvatarOpen(true)}
              onMouseLeave={() => setAvatarOpen(false)}
            >
              <DropdownMenuLabel>
                <p className="text-sm font-medium leading-none">
                  {data?.user.name}
                </p>
                <p className="text-xs font-normal leading-none text-gray-500">
                  {data?.user.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4 text-summit-700" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4 text-summit-700" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
