import { useRouter } from "next/router";
import { useState, type ReactNode } from "react";
import Image from "next/image";
import { Bell } from "~/svgs";
import Link from "next/link";
import navigationConfig from "~/constants/navigationConfig";
import NavLink from "./NavLink";
import Combobox, { type ComboboxItem } from "./shadcn/ui/combobox";
import { Avatar, AvatarFallback, AvatarImage } from "./shadcn/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./shadcn/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

const FakeOrganizations: ComboboxItem[] = [
  { value: "1", label: "Organization 1" },
  { value: "2", label: "Organization 2" },
  { value: "3", label: "Organization 3" },
];

//non layout pages
const nonLayoutPages = ["/", "/signin"];

export default function LayoutProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data } = useSession();
  const [avatarOpen, setAvatarOpen] = useState(false);

  const [selectedOrganizationId, setSelectedOrganizationId] =
    useState<string>("");

  // if route is not in nonLayoutPages return children, else return layout
  if (nonLayoutPages.includes(router.pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <div className="flex w-full items-center justify-between bg-white px-8 py-4">
        <Link href="/">
          <Image
            src="/logos/SimpleTeal.svg"
            alt="Summit Logo"
            height={48}
            width={48}
            priority
          />
        </Link>
        <div className="flex items-center gap-4">
          <button className="rounded-full p-2 hover:bg-summit-700/5">
            <Bell className=" h-6 w-6 text-summit-700" />
          </button>
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
              <DropdownMenuGroup>
                <Link href="/profile">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4 text-summit-700" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
                >
                  <LogOut className="mr-2 h-4 w-4 text-summit-700" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex h-full flex-grow gap-4 p-4">
        <nav className="flex basis-0 flex-col gap-4 rounded-md border border-gray-300 bg-white p-4">
          <div className="flex flex-col gap-4 border-b border-gray-300 pb-4">
            {navigationConfig
              .filter((link) => !link.organizational)
              .map((link) => (
                <NavLink key={link.link} navigationLink={link} />
              ))}
            <Link
              href="/"
              className="min-w-56 rounded-md bg-summit-700 px-4 py-2 text-center font-semibold text-white hover:bg-summit-700/95"
            >
              Create Organization
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <Combobox
              itemName="organization"
              value={selectedOrganizationId}
              setValue={setSelectedOrganizationId}
              items={FakeOrganizations}
            />
            {navigationConfig
              .filter((link) => link.organizational)
              .map((link) => (
                <NavLink
                  key={link.link}
                  navigationLink={link}
                  organizationId={selectedOrganizationId}
                />
              ))}
          </div>
        </nav>
        {children}
      </div>
    </div>
  );
}
