import { type Organization } from "@prisma/client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/shadcn/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function OrganizationCard({
  organization,
}: {
  organization: Organization;
}) {
  return (
    <>
      <Card className="transition-colors hover:bg-gray-50">
        <Link
          href={`/organization/${organization.id}/home`}
          className="flex h-48 w-48 rounded-lg sm:h-56 sm:w-56"
        >
          <CardHeader className="relative p-0">
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
            <div className="flex flex-col gap-1 px-4 pt-8">
              <CardTitle className="text-lg">{organization.name}</CardTitle>
              <CardDescription>{`@${organization.username}`}</CardDescription>
            </div>
          </CardHeader>
        </Link>
      </Card>
    </>
  );
}
