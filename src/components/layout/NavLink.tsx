import Link from "next/link";
import { useRouter } from "next/router";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import type { navigationLink } from "~/constants/navigationConfig";
import { cn } from "~/utils/shadcn";

function checkIsActive(path: string, asPath: string, organizational: boolean) {
  if (organizational) {
    return asPath.endsWith(path);
  }
  const basePath = asPath.split(/[?#]/)[0] ?? "/";
  return basePath === "/" + path || basePath.startsWith(`/${path}/`);
}

export default function NavLink({
  navigationLink,
  organizationId,
  setMobileNavOpen,
  disabled,
}: {
  navigationLink: navigationLink;
  organizationId?: string;
  setMobileNavOpen?: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
}) {
  const { asPath } = useRouter();
  const [isActive, setIsActive] = useState(
    checkIsActive(navigationLink.link, asPath, navigationLink.organizational),
  );
  const [isDisabled, setIsDisabled] = useState(disabled ?? false);

  useEffect(() => {
    setIsActive(
      checkIsActive(navigationLink.link, asPath, navigationLink.organizational),
    );
  }, [asPath, navigationLink.link, navigationLink.organizational]);

  useEffect(() => {
    if (disabled) {
      return setIsDisabled(true);
    } else if (navigationLink.organizational && organizationId === "") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [organizationId, navigationLink.organizational, disabled]);

  return (
    <>
      <Link
        href={
          navigationLink.organizational
            ? `/organization/${organizationId}/${navigationLink.link}`
            : `/${navigationLink.link}`
        }
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : undefined}
        className={cn(
          "flex h-max flex-col items-center justify-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:text-summit-700/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300 disabled:pointer-events-none disabled:opacity-50 sm:h-10 sm:flex-row sm:justify-start sm:px-4 sm:text-sm",
          isActive
            ? "bg-summit-700/10 text-summit-700"
            : "text-gray-500 hover:bg-gray-100",
          isDisabled && "pointer-events-none cursor-not-allowed opacity-50",
        )}
        onClick={() => {
          if (setMobileNavOpen) {
            setMobileNavOpen(false);
          }
        }}
      >
        {isActive ? navigationLink.filledIcon : navigationLink.icon}
        <div className="sr-only line-clamp-2 sm:not-sr-only">
          {navigationLink.title}
        </div>
      </Link>
    </>
  );
}
