import { useParams } from "next/navigation";
import { api } from "~/utils/api";
import Image from "next/image";
import { EyeSlash, PinFilled, SchoolFilled } from "~/svgs";
import { useSession } from "next-auth/react";

export default function OrganizationHome() {
  const params = useParams<{ id: string }>();
  const session = useSession();
  const { data, isLoading } = api.organization.getOrganization.useQuery({
    organizationId: params?.id ?? "",
  });
  const checkMembership = api.organization.isMember.useQuery({
    userId: session.data?.user.id ?? "",
    organizationId: params?.id ?? "",
  });

  if (isLoading || !data || checkMembership.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex flex-col rounded-t-lg">
      {data.bannerUrl ? (
        <div className="relative h-24 w-full rounded-t-lg sm:h-36">
          <Image
            src={data.bannerUrl}
            alt="Organization banner image."
            fill
            className="rounded-t-lg object-cover"
          />
        </div>
      ) : (
        <div className="h-36 w-full rounded-t-lg bg-gray-200" />
      )}
      {data.logoUrl ? (
        <div className="absolute left-8 top-12 h-24 w-24 rounded-lg border-2 border-white sm:top-16 sm:h-36 sm:w-36">
          <Image
            src={data.logoUrl}
            alt="Organization logo."
            fill
            className="rounded-lg object-cover"
          />
        </div>
      ) : (
        <div className="absolute left-8 top-16 h-32 w-32 rounded-lg bg-gray-400" />
      )}
      <div className="flex w-full flex-col gap-4 px-8 pb-4 pt-14 sm:pt-20">
        <div className="flex w-full flex-col gap-4 border-b border-gray-200 pb-4">
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-semibold">{data.name}</div>
            <div className="text-sm text-gray-500">@{data.username}</div>
          </div>
          <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center">
            <div className="flex items-center gap-1">
              <SchoolFilled className="h-3 w-3" />
              <div>{data.university}</div>
            </div>
            <div className="hidden h-0.5 w-0.5 rounded-full bg-gray-500 sm:block" />
            <div className="flex items-center gap-1">
              <PinFilled className="h-3 w-3" />
              <div>
                {data.city}, {data.state}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden h-0.5 w-0.5 rounded-full bg-gray-500 sm:block" />
              <div>
                {data._count.users > 1 ? (
                  <>{`${data._count.users} members`}</>
                ) : (
                  <>{`${data._count.users} member`}</>
                )}
              </div>
              <div className="h-0.5 w-0.5 rounded-full bg-gray-500" />
              <div>{data.private ? "Private" : "Public"} organization</div>
            </div>
          </div>
        </div>
        {data.private && !checkMembership.data?.isMember ? (
          <div className="flex h-32 flex-col items-center justify-center rounded-md bg-gray-100">
            <EyeSlash className="h-6 w-6 text-gray-500" />
            <div className="text-sm font-semibold">
              This organization is private
            </div>
            <div className="text-xs text-gray-500">
              Only members can see this organization
            </div>
          </div>
        ) : (
          <>
            <div className="flex w-full flex-col gap-2">
              <div className="font-semibold">About</div>
              <div className="text-sm text-gray-500">{data.description}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
