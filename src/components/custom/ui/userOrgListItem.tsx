import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type Dispatch, type SetStateAction } from "react";
import { cn } from "~/utils/shadcn";

export default function UserOrgListItem({
  id,
  imageUrl,
  squareImage = false,
  title,
  description,
  linkUrl,
  actionTitle,
  actionDescription,
  setClickedId,
}: {
  id: string;
  imageUrl: string;
  squareImage?: boolean;
  title: string;
  description: string;
  linkUrl?: string;
  actionTitle: string;
  actionDescription: string;
  setClickedId?: Dispatch<SetStateAction<string>>;
}) {
  if (linkUrl) {
    return (
      <Link
        href={linkUrl}
        className="w-full transition-colors hover:bg-gray-50"
      >
        <UserOrgListContent
          imageUrl={imageUrl}
          squareImage={squareImage}
          title={title}
          description={description}
          actionTitle={actionTitle}
          actionDescription={actionDescription}
        />
      </Link>
    );
  }
  return (
    <div
      className="w-full transition-colors hover:bg-gray-50"
      onClick={() => {
        if (setClickedId) {
          setClickedId(id);
        }
      }}
    >
      <UserOrgListContent
        imageUrl={imageUrl}
        squareImage={squareImage}
        title={title}
        description={description}
        actionTitle={actionTitle}
        actionDescription={actionDescription}
      />
    </div>
  );
}

function UserOrgListContent({
  imageUrl,
  squareImage = false,
  title,
  description,
  actionTitle,
  actionDescription,
}: {
  imageUrl: string;
  squareImage?: boolean;
  title: string;
  description: string;
  actionTitle: string;
  actionDescription: string;
  setClicked?: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "relative h-12 w-12 bg-white",
            squareImage ? "rounded-md" : "rounded-full",
          )}
        >
          {imageUrl === "" ? (
            <div
              className={cn(
                "h-full w-full bg-gray-300",
                squareImage ? "rounded-md" : "rounded-full",
              )}
            >
              <div className="flex h-full w-full items-center justify-center font-semibold text-gray-500">
                {title
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase()}
              </div>
            </div>
          ) : (
            <Image
              src={imageUrl}
              alt="List item image."
              fill
              className={cn(
                "object-contain",
                squareImage ? "rounded-md" : "rounded-full",
              )}
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden flex-col gap-1 sm:flex">
          <div className="font-semibold">{actionTitle}</div>
          <div className="text-sm text-gray-500">{actionDescription}</div>
        </div>
        <ChevronRight className="h-6 w-6 text-gray-500" />
      </div>
    </div>
  );
}
