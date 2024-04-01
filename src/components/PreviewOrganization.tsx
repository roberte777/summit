import { EyeSlash, PinFilled, SchoolFilled } from "~/svgs";
import Image from "next/image";

export default function PreviewOrganization({
  name,
  username,
  university,
  city,
  state,
  description,
  isPrivate,
  logoUrl,
  backgroundUrl,
}: {
  name: string;
  username: string;
  university: string;
  city: string;
  state: string;
  description: string;
  isPrivate: boolean;
  logoUrl: string;
  backgroundUrl: string;
}) {
  return (
    <>
      <div className="relative flex w-full flex-col rounded-lg border border-gray-200">
        {backgroundUrl === "" ? (
          <div className="h-32 w-full rounded-t-lg bg-gray-200" />
        ) : (
          <div className="relative h-32 w-full rounded-t-lg bg-white">
            <Image
              src={backgroundUrl}
              alt="Uploaded background"
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
        {logoUrl === "" ? (
          <div className="absolute left-8 top-16 h-32 w-32 rounded-lg bg-gray-400" />
        ) : (
          <div className="absolute left-8 top-16 h-32 w-32 rounded-lg border-2 border-white bg-gray-100">
            <Image
              src={logoUrl}
              alt="Uploaded logo"
              fill
              className="object-contain"
            />
          </div>
        )}
        <div className="flex w-full flex-col gap-4 px-8 pb-4 pt-20">
          <div className="flex w-full flex-col gap-4 border-b border-gray-200 pb-4">
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-semibold">
                {name === "" ? "Organization Name" : name}
              </div>
              <div className="text-sm text-gray-500">
                @{username === "" ? "username" : username}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <SchoolFilled className="h-3 w-3" />
                <div>
                  {university === "" ? "Affiliated university" : university}
                </div>
              </div>
              <div className="h-0.5 w-0.5 rounded-full bg-gray-500" />
              <div className="flex items-center gap-1">
                <PinFilled className="h-3 w-3" />
                <div>
                  {city === "" ? "City" : city}, {state ? state : "State"}
                </div>
              </div>
              <div className="h-0.5 w-0.5 rounded-full bg-gray-500" />
              <div>1 member</div>
              <div className="h-0.5 w-0.5 rounded-full bg-gray-500" />
              <div>{isPrivate ? "Private" : "Public"} organization</div>
            </div>
          </div>
          {isPrivate ? (
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
                <div className="text-sm text-gray-500">
                  {description === ""
                    ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    : description}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
