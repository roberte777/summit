import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/shadcn/ui/avatar";
import { Skeleton } from "~/components/shadcn/ui/skeleton";
import { api } from "~/utils/api";
import { formatPhoneNumber } from "~/utils/formats";

export default function Profile() {
  const router = useRouter();

  // Checks if the user is authenticated, if not, redirects to the signin page
  const { status, data } = useSession({
    required: true,
    onUnauthenticated() {
      void router.push("/api/auth/signin");
    },
  });

  const [enhancedImage, setEnhancedImage] = useState("");
  const userData = api.user.getUser.useQuery({
    id: data?.user?.id ?? "",
  });

  useEffect(() => {
    if (data?.user?.image)
      setEnhancedImage(data.user.image.replace("=s96-c", "=s256-c"));
  }, [data?.user.image, data?.user]);

  // If the session is loading, we display a loading message
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (userData.data) {
    return (
      <>
        <div className="flex flex-grow flex-col gap-4 rounded-md border border-gray-300 bg-white px-8 py-4">
          <div className="flex flex-col items-center gap-4 border-b border-gray-300 pb-4">
            <Avatar className="h-36 w-36">
              <AvatarImage
                src={
                  enhancedImage === "" ? data.user.image ?? "" : enhancedImage
                }
              />
              <AvatarFallback>
                {data?.user?.name
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-xl font-semibold">{data?.user?.name}</h1>
              <h2 className="text-gray-500">{`@${userData.data.credentials?.username.toLowerCase()}`}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div>{userData.data.academicYear}</div>
                <div className="h-0.5 w-0.5 rounded-full bg-gray-500" />
                <div>{userData.data.academicMajor}</div>
                <div className="h-0.5 w-0.5 rounded-full bg-gray-500" />
                <div>{userData.data.academicUniversity}</div>
                <div className="h-0.5 w-0.5 rounded-full bg-gray-500" />
                <div>{userData.data?.city + "," + userData.data?.state}</div>
              </div>
            </div>
            <button className="filled-button text-sm">Edit profile</button>
          </div>
          <div className="flex items-center justify-center gap-8 py-4 text-sm">
            <div className="flex items-center gap-2">
              <div>Email:</div>
              <div className="text-gray-500">{userData.data.email}</div>
            </div>
            <div className="flex items-center gap-2">
              <div>Phone:</div>
              <div className="text-gray-500">
                {formatPhoneNumber(
                  userData.data.phone ? userData.data.phone : "",
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div>Birthday:</div>
              <div className="text-gray-500">
                {userData.data.birthday?.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div>Graduation Year:</div>
              <div className="text-gray-500">
                {userData.data.graduationYear}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-grow flex-col gap-4 rounded-md border border-gray-300 bg-white px-8 py-4">
        <div className="flex flex-col items-center gap-4 border-b border-gray-300 pb-4">
          <Avatar className="h-36 w-36">
            <AvatarImage
              src={enhancedImage === "" ? data.user.image ?? "" : enhancedImage}
            />
            <AvatarFallback>
              {data?.user?.name
                ?.split(" ")
                .map((name) => name[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-xl font-semibold">{data?.user?.name}</h1>
            <Skeleton className="h-4 w-56" />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Skeleton className="h-4 w-32" />
              <div className="h-0.5 w-0.5 rounded-full bg-gray-500" />
              <Skeleton className="h-4 w-32" />
              <div className="h-0.5 w-0.5 rounded-full bg-gray-500" />
              <Skeleton className="h-4 w-32" />
              <div className="h-0.5 w-0.5 rounded-full bg-gray-500" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <button className="filled-button text-sm">Edit profile</button>
        </div>
        <div className="flex items-center justify-center gap-8 py-4 text-sm">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
    </>
  );
}
