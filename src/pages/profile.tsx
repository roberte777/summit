import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { formatPhoneNumber } from "react-phone-number-input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/shadcn/ui/avatar";
import { Skeleton } from "~/components/shadcn/ui/skeleton";
import { api } from "~/utils/api";

export default function Profile() {
  const router = useRouter();

  // Checks if the user is authenticated, if not, redirects to the signin page
  const { status, data } = useSession({
    required: true,
    onUnauthenticated() {
      void router.push("/api/auth/signin");
    },
  });
  console.log(data?.user);

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
        <div className="flex w-full flex-grow flex-col gap-4 p-4 sm:p-0">
          <div className="flex flex-col items-center gap-4 border-b border-gray-300 pb-4">
            <Avatar className="h-24 w-24 sm:h-36 sm:w-36">
              <AvatarImage
                src={
                  enhancedImage === "" ? data.user.image ?? "" : enhancedImage
                }
              />
              <AvatarFallback>
                {userData.data.name
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center">
              <h1 className="text-xl font-semibold">{userData.data.name}</h1>
              <h2 className="text-gray-500">{`@${userData.data.credentials?.username.toLowerCase()}`}</h2>
            </div>
            <button className="filled-button w-full text-sm sm:w-max">
              Edit profile
            </button>
          </div>
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex w-full flex-col gap-4">
              <h3 className="font-semibold">Personal Information</h3>
              <div className="flex flex-col justify-between mobile-md:flex-row mobile-md:items-center">
                <div className="text-gray-500">Email</div>
                <div>{userData.data.email}</div>
              </div>
              <div className="flex flex-col justify-between mobile-md:flex-row mobile-md:items-center">
                <div className="text-gray-500">Phone number</div>
                <div>
                  {formatPhoneNumber(
                    userData.data.phone ? userData.data.phone : "",
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-between mobile-md:flex-row mobile-md:items-center">
                <div className="text-gray-500">Birthday</div>
                <div>
                  {userData.data.birthday?.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div className="flex flex-col justify-between mobile-md:flex-row mobile-md:items-center">
                <div className="text-gray-500">Location</div>
                <div>{userData.data?.city + ", " + userData.data?.state}</div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4">
              <h3 className="font-semibold">Education Information</h3>
              <div className="flex flex-col justify-between mobile-md:flex-row mobile-md:items-center">
                <div className="text-gray-500">University</div>
                <div>{userData.data.academicUniversity}</div>
              </div>
              <div className="flex flex-col justify-between mobile-md:flex-row mobile-md:items-center">
                <div className="text-gray-500">Major</div>
                <div>{userData.data.academicMajor}</div>
              </div>
              <div className="flex flex-col justify-between mobile-md:flex-row mobile-md:items-center">
                <div className="text-gray-500">Year</div>
                <div>{userData.data.academicYear}</div>
              </div>
              <div className="flex flex-col justify-between mobile-md:flex-row mobile-md:items-center">
                <div className="text-gray-500">Graduation year</div>
                <div>{userData.data.graduationYear}</div>
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
          <Avatar className="h-24 w-24 sm:h-36 sm:w-36">
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
          </div>
          <button className="filled-button text-sm">Edit profile</button>
        </div>
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex w-full flex-col gap-4">
            <h3 className="font-semibold">Personal Information</h3>
            <div className="flex flex-col justify-between mobile-md:flex-row mobile-md:items-center">
              <div className="text-gray-500">Email</div>
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="flex flex-col justify-between mobile-md:flex-row mobile-md:items-center">
              <div className="text-gray-500">Phone number</div>
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="flex flex-col justify-between mobile-md:flex-row mobile-md:items-center">
              <div className="text-gray-500">Birthday</div>
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="flex flex-col justify-between mobile-md:flex-row mobile-md:items-center">
              <div className="text-gray-500">Location</div>
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <div className="flex w-full flex-col gap-4">
            <h3 className="font-semibold">Education Information</h3>
            <div className="flex flex-col justify-between mobile-md:flex-row mobile-md:items-center">
              <div className="text-gray-500">University</div>
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="flex flex-col justify-between mobile-md:flex-row mobile-md:items-center">
              <div className="text-gray-500">Major</div>
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="flex flex-col justify-between mobile-md:flex-row mobile-md:items-center">
              <div className="text-gray-500">Year</div>
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="flex flex-col justify-between mobile-md:flex-row mobile-md:items-center">
              <div className="text-gray-500">Graduation year</div>
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
