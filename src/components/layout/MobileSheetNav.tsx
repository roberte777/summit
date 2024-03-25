import { useEffect, type Dispatch, type SetStateAction } from "react";
import { Sheet, SheetContent } from "../shadcn/ui/sheet";
import navigationConfig from "~/constants/navigationConfig";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../shadcn/ui/button";
import { LogOut, SquareUser } from "lucide-react";
import OrganizationCombobox from "../custom/ui/organizationCombobox";
import { type OrginizationComboboxItem } from "~/server/api/routers/user";

export default function MobileSheetNav({
  mobileNavOpen,
  setMobileNavOpen,
  selectedOrganizationId,
  setSelectedOrganizationId,
  organizations,
}: {
  mobileNavOpen: boolean;
  setMobileNavOpen: Dispatch<SetStateAction<boolean>>;
  selectedOrganizationId: string;
  setSelectedOrganizationId: Dispatch<SetStateAction<string>>;
  organizations: OrginizationComboboxItem[];
}) {
  const { data } = useSession();

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileNavOpen]);

  return (
    <Sheet open={mobileNavOpen} modal={false}>
      <SheetContent
        side="left"
        hideCloseButton
        className="mt-16 flex w-screen flex-col gap-2"
      >
        {navigationConfig
          .filter((link) => !link.organizational)
          .map((link) => (
            <Link
              href={`/${link.link}`}
              key={link.link}
              className="flex items-center gap-2 rounded px-1 py-2 text-base font-medium transition-colors hover:text-summit-700/90"
              onClick={() => setMobileNavOpen(false)}
            >
              {link.icon}
              <span>{link.title}</span>
            </Link>
          ))}
        <Link
          href="/"
          className="h-10 w-full rounded-md bg-summit-700 px-2 py-1.5 text-center font-semibold text-white hover:bg-summit-700/95"
        >
          Create Organization
        </Link>

        <div className="mt-4 flex flex-col gap-4 border-t border-gray-200 pt-4">
          <OrganizationCombobox
            value={selectedOrganizationId}
            setValue={setSelectedOrganizationId}
            organizations={organizations}
          />
          <div className="h-px w-full bg-gray-200" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={data?.user.image ?? ""} />
                <AvatarFallback>
                  {data?.user?.name
                    ?.split(" ")
                    .map((name) => name[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800">
                  {data?.user.name}
                </span>
                <span className="text-xs text-gray-500">
                  {data?.user.email}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMobileNavOpen(false)}
              >
                <Link href="/profile">
                  <SquareUser className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
