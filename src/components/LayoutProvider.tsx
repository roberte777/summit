import { useRouter } from "next/router";
import { useState, type ReactNode, useEffect } from "react";
import Image from "next/image";
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
import { LogOut, Menu, User, X } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { api } from "~/utils/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./shadcn/ui/dialog";
import { OnboardingForm } from "./forms/OnboardingForm";
import { Button } from "./shadcn/ui/button";
import { Sheet, SheetContent } from "./shadcn/ui/sheet";

const FakeOrganizations: ComboboxItem[] = [
  { value: "1", label: "Organization 1" },
  { value: "2", label: "Organization 2" },
  { value: "3", label: "Organization 3" },
];

//non layout pages
const nonLayoutPages = ["/", "/signin"];

export default function LayoutProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, status } = useSession();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [onboarded, setOnboarded] = useLocalStorage<boolean>(
    "onboarded",
    false,
  );
  const [onboardDialogOpen, setOnboardDialogOpen] = useState(false);
  const userOnboarded = api.user.getUserOnboarding.useQuery(
    {
      id: data?.user?.id ?? "",
    },
    { enabled: onboarded === false && !!data?.user?.id },
  );

  const [selectedOrganizationId, setSelectedOrganizationId] =
    useState<string>("");

  useEffect(() => {
    if (status === "authenticated" && !onboarded) {
      if (userOnboarded.data) {
        setOnboarded(userOnboarded.data.onboarded);
      }
    }
  }, [onboarded, setOnboarded, status, userOnboarded.data]);

  useEffect(() => {
    if (!onboarded) {
      setOnboardDialogOpen(true);
    } else {
      setOnboardDialogOpen(false);
    }
  }, [onboarded]);

  // if route is not in nonLayoutPages return children, else return layout
  if (nonLayoutPages.includes(router.pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gray-100">
        <div className="flex w-full items-center justify-between bg-white px-8 py-4">
          <div className="flex flex-1 justify-start sm:hidden">
            <Button
              size="icon"
              className="bg-white hover:bg-gray-100"
              onClick={() => setMobileNavOpen((s) => !s)}
            >
              {mobileNavOpen ? (
                <X className="h-6 w-6 text-summit-700" />
              ) : (
                <Menu className="h-6 w-6 text-summit-700" />
              )}
            </Button>
          </div>
          <div className="flex flex-1 justify-center sm:justify-start">
            <Link href="/">
              <Image
                src="/logos/SimpleTeal.svg"
                alt="Summit Logo"
                height={48}
                width={48}
                priority
              />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
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
                  <Link href="/profile" onClick={() => setMobileNavOpen(false)}>
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4 text-summit-700" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    onClick={() =>
                      signOut({ redirect: true, callbackUrl: "/" })
                    }
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-summit-700" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex h-full flex-grow p-4 sm:gap-4">
          <nav className="hidden basis-0 flex-col gap-4 rounded-md border border-gray-300 bg-white p-4 sm:flex">
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
      <Sheet open={mobileNavOpen} modal={false}>
        <SheetContent side="left" hideCloseButton className="mt-20 w-screen">
          <nav className="flex basis-0 flex-col gap-4 bg-white p-4">
            <div className="flex flex-col gap-4 border-b border-gray-300 pb-4">
              {navigationConfig
                .filter((link) => !link.organizational)
                .map((link) => (
                  <NavLink
                    key={link.link}
                    navigationLink={link}
                    setMobileNavOpen={setMobileNavOpen}
                  />
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
                    setMobileNavOpen={setMobileNavOpen}
                  />
                ))}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
      <Dialog open={onboardDialogOpen}>
        <DialogContent
          hideCloseButton
          className="max-h-screen overflow-auto sm:max-h-[90vh]"
        >
          <DialogHeader>
            <DialogTitle>Welcome to Summit!</DialogTitle>
            <DialogDescription>
              Please take a moment to fill out your profile.
            </DialogDescription>
          </DialogHeader>
          <div>
            <OnboardingForm
              userId={data?.user.id ?? ""}
              setOnboarded={setOnboarded}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
