import Link from "next/link";
import Image from "next/image";
import { Button } from "../shadcn/ui/button";
import { type Dispatch, type SetStateAction } from "react";
import { Menu, X } from "lucide-react";

export default function MobileTopNav({
  mobileNavOpen,
  setMobileNavOpen,
}: {
  mobileNavOpen: boolean;
  setMobileNavOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="mx-auto flex h-16 w-full items-center justify-between bg-white p-4 sm:hidden">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="w-full">
          <h1 className="flex w-full flex-row items-center gap-2 text-2xl font-bold text-summit-700">
            <Image
              src="/logos/SimpleTeal.svg"
              alt="Summit Logo"
              height={32}
              width={32}
              priority
            />
            <span className="sr-only">Summit</span>
            <span>Summit</span>
          </h1>
        </Link>
      </div>
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
  );
}
