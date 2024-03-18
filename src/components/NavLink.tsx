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
          "flex min-w-56 items-center gap-4 rounded-md px-4 py-2 font-semibold",
          isDisabled
            ? "pointer-events-none bg-white text-gray-300"
            : isActive
              ? "bg-summit-700/10 text-summit-700"
              : "bg-white text-gray-500 hover:bg-gray-100",
        )}
        onClick={() => {
          if (setMobileNavOpen) {
            setMobileNavOpen(false);
          }
        }}
      >
        {isActive ? navigationLink.filledIcon : navigationLink.icon}
        <div>{navigationLink.title}</div>
      </Link>
    </>
  );
}
