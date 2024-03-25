import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { cn } from "~/utils/shadcn";
import { CircleCheckFilled } from "~/svgs";

const CardCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    label: string;
    description: string;
  }
>(({ className, label, description, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "flex w-full flex-col gap-1 rounded-lg border border-gray-200 p-4 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-summit-700 data-[state=checked]:bg-white dark:border-gray-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300",
        className,
      )}
      {...props}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <div className="text-sm font-semibold text-black">{label}</div>
        <CheckboxPrimitive.Indicator>
          <CircleCheckFilled className="h-4 w-4 text-summit-700" />
        </CheckboxPrimitive.Indicator>
      </div>
      <div className="text-sm text-gray-500">{description}</div>
    </CheckboxPrimitive.Root>
  );
});
CardCheckbox.displayName = CheckboxPrimitive.Root.displayName;

export { CardCheckbox };
