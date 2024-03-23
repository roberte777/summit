import navigationConfig from "~/constants/navigationConfig";
import NavLink from "./NavLink";
import Link from "next/link";
import { cn } from "~/utils/shadcn";

export default function WebSideNav({
  selectedOrganizationId,
}: {
  selectedOrganizationId: string;
}) {
  return (
    <div className="flex w-screen shrink-0 flex-col sm:w-[230px]">
      <div
        className={cn(
          "flex-row justify-between gap-x-4 gap-y-2 p-4 text-center sm:flex-col sm:p-6 sm:text-left",
          selectedOrganizationId ? "hidden sm:flex" : "flex",
        )}
      >
        {navigationConfig
          .filter((link) => !link.organizational)
          .map((link) => (
            <NavLink key={link.link} navigationLink={link} />
          ))}
        <Link
          href="/organization/create"
          className="w-full rounded-md bg-summit-700 px-2 py-1.5 text-center text-sm font-semibold text-white hover:bg-summit-700/95"
        >
          Create Organization
        </Link>
      </div>
      {selectedOrganizationId && (
        <>
          <div className="hidden h-px w-full bg-gray-200 sm:block" />
          <div className="flex flex-row justify-between gap-x-4 gap-y-2 p-4 text-center sm:flex-col sm:p-6 sm:text-left">
            {navigationConfig
              .filter((link) => link.organizational)
              .map((link) => (
                <NavLink key={link.link} navigationLink={link} />
              ))}
          </div>
        </>
      )}
    </div>
  );
}
