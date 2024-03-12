import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/shadcn/ui/avatar";
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
            <h2 className="text-gray-500">{`@${userData.data?.credentials?.username.toLowerCase()}`}</h2>
            <button className="filled-button text-sm">Edit profile</button>
          </div>
        </div>

        {JSON.stringify(data?.user, null, 2)}
      </div>
    </>
  );
}
