import { type Organization } from "@prisma/client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/shadcn/ui/card";
import Image from "next/image";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/shadcn/ui/tooltip";
import { Lock } from "lucide-react";

export default function OrganizationCard({
  organization,
}: {
  organization: Organization;
}) {
  return (
    <>
      <Card className="w-56 transition-colors hover:bg-gray-50">
        <Link
          href={`/organization/${organization.id}/home`}
          className="flex h-56 w-56 rounded-lg sm:h-56 sm:w-56"
        >
          <CardHeader className="relative w-56 p-0">
            <div className="relative h-12 w-full rounded-t-lg sm:h-16">
              <Image
                src={organization.bannerUrl}
                alt="Organization banner image."
                fill
                className="rounded-t-lg object-cover"
              />
            </div>
            <div className="absolute left-4 top-4 h-12 w-12 rounded-lg border-2 border-white sm:top-6 sm:h-16 sm:w-16">
              <Image
                src={organization.logoUrl}
                alt="Organization logo."
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex h-48 flex-col justify-between gap-1 px-4 pb-4 pt-10">
              <div className="flex flex-col gap-1">
                <CardTitle className="flex gap-2 text-lg">
                  <div>{organization.name}</div>
                </CardTitle>
                <CardDescription>{`@${organization.username}`}</CardDescription>
              </div>
              {organization.private && (
                <div className="flex w-full justify-end">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Lock className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        This organization is private.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          </CardHeader>
        </Link>
      </Card>
    </>
  );
}
