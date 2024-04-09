import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/shadcn/ui/avatar";
import { cn } from "~/utils/shadcn";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export type AvatarStackItem = {
  avatarUrl: string;
  label: string;
};

const avatarStackVariants = cva("flex", {
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
    spacing: {
      sm: "-space-x-5 -space-y-5",
      md: "-space-x-4 -space-y-4",
      lg: "-space-x-3 -space-y-3",
      xl: "-space-x-2 -space-y-2",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    spacing: "md",
  },
});

export interface AvatarStackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarStackVariants> {
  avatars: AvatarStackItem[];
  avatarsOffset?: number;
  maxAvatarsAmount?: number;
}

function AvatarStack({
  className,
  orientation,
  avatars,
  spacing,
  maxAvatarsAmount = 4,
  ...props
}: AvatarStackProps) {
  const filteredAvatars = avatars.filter(
    (avatar) => avatar.avatarUrl.trim() !== "",
  );
  const limitedAvatars = filteredAvatars.slice(0, maxAvatarsAmount);
  const avatarsNotShownCount = avatars.length - limitedAvatars.length;

  return (
    <div
      className={cn(
        avatarStackVariants({ orientation, spacing }),
        className,
        orientation === "vertical" ? "-space-x-0" : "-space-y-0",
      )}
      {...props}
    >
      {limitedAvatars.map((avatar, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="transition duration-200 ease-linear">
                <Avatar
                  className={cn(
                    avatarStackVariants(),
                    "cursor-pointer transition-transform hover:z-10 hover:scale-110",
                  )}
                >
                  <AvatarImage src={avatar.avatarUrl} />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-center">{avatar.label}</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}

      {avatarsNotShownCount > 0 ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="transition duration-200 ease-linear">
                <Avatar
                  key={"Excesive avatars"}
                  className="cursor-pointer transition-transform hover:z-10 hover:scale-110"
                >
                  <AvatarFallback className="bg-gray-300 text-gray-500">
                    +{avatars.length - limitedAvatars.length}
                  </AvatarFallback>
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-center">{`+${avatarsNotShownCount} others`}</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
    </div>
  );
}

export { AvatarStack, avatarStackVariants };
