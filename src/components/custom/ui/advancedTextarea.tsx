import * as React from "react";
import { useState } from "react";

import { cn } from "~/utils/shadcn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const AdvancedTextArea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps & { maxLength: number; currentLength: number }
>(({ className, maxLength, currentLength, ...props }, ref) => {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={cn(
        "flex w-full flex-col rounded-md border border-gray-200 bg-white disabled:cursor-not-allowed disabled:opacity-50",
        focused
          ? "border-summit-700"
          : "border-gray-200 hover:border-summit-300",
        className,
      )}
    >
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md  border-0  text-sm placeholder:text-gray-500 focus:border-0 focus:ring-0 dark:placeholder:text-gray-400",
        )}
        ref={ref}
        {...props}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <div className="flex w-full items-center justify-end p-1">
        <div className="text-xs text-gray-400">
          {currentLength}/{maxLength}
        </div>
      </div>
    </div>
  );
});
AdvancedTextArea.displayName = "Textarea";

export { AdvancedTextArea };
