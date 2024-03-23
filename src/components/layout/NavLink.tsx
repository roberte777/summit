import Link from "next/link";
import { useRouter } from "next/router";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import type { navigationLink } from "~/constants/navigationConfig";
import classNames from "~/utils/classNames";

function checkIsActive(path: string, asPath: string) {
  const basePath = asPath.split(/[?#]/)[0] ?? "/";
  return basePath === "/" + path || basePath.startsWith(`/${path}/`);
}

export default function NavLink({
  navigationLink,
  organizationId,
  setMobileNavOpen,
}: {
  navigationLink: navigationLink;
  organizationId?: string;
  setMobileNavOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const { asPath } = useRouter();
  const [isActive, setIsActive] = useState(
    checkIsActive(navigationLink.link, asPath),
  );
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsActive(checkIsActive(navigationLink.link, asPath));
  }, [asPath, navigationLink.link]);

  useEffect(() => {
    if (navigationLink.organizational && organizationId === "") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [organizationId, navigationLink.organizational]);

  return (
    <>
      <Link
        href={`/${navigationLink.link}`}
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : undefined}
        className={classNames(
          "flex h-max flex-col items-center justify-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:text-summit-700/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300 disabled:pointer-events-none disabled:opacity-50 sm:h-10 sm:flex-row sm:justify-start sm:px-4 sm:text-sm",
          isActive
            ? "bg-summit-700/10 text-summit-700"
            : "text-gray-500 hover:bg-gray-100",
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
