import {
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/shadcn/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useState, useRef, useCallback, type KeyboardEvent } from "react";

import { Skeleton } from "~/components/shadcn/ui/skeleton";
import Image from "next/image";
import { Plus, Search } from "lucide-react";
import { Button } from "~/components/shadcn/ui/button";

export type Option = {
  value: string;
  label: string;
  image?: string;
  description?: string;
};

type AutoCompleteProps = {
  options: Option[];
  emptyMessage: string;
  onSelected?: (value: Option) => void;
  onOptionalSelected?: (value: Option) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

export const AttendeeSearch = ({
  options,
  placeholder,
  emptyMessage,
  onSelected,
  onOptionalSelected,
  disabled,
  isLoading = false,
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const optionalInputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [optionalInputValue, setOptionalInputValue] = useState<string>("");
  const [optionalOpen, setOptionalOpen] = useState(false);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true);
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === "Enter" && input.value !== "") {
        const optionToSelect = options.find(
          (option) => option.label === input.value,
        );
        if (optionToSelect) {
          onSelected?.(optionToSelect);
        }
      }

      if (event.key === "Escape") {
        input.blur();
      }
    },
    [isOpen, options, onSelected],
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      // if optional is focused, use optionalSelected
      if (
        optionalOpen &&
        optionalInputRef?.current === document.activeElement
      ) {
        setOptionalInputValue("");
        onOptionalSelected?.(selectedOption);
      } else {
        setInputValue("");
        onSelected?.(selectedOption);
      }

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur();
        optionalInputRef?.current?.blur();
      }, 0);
    },
    [onOptionalSelected, onSelected, optionalOpen],
  );

  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div className="flex flex-col gap-1">
        <div
          className="flex items-center rounded-md border px-3"
          cmdk-input-wrapper=""
        >
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandPrimitive.Input
            ref={inputRef}
            className="flex h-11 w-full rounded-md border-none bg-transparent py-3 text-sm outline-none placeholder:text-sm placeholder:text-gray-500 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-gray-400"
            value={inputValue}
            onValueChange={isLoading ? undefined : setInputValue}
            onBlur={handleBlur}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
          />
          {!optionalOpen && (
            <Button
              size="sm"
              variant="link"
              className="gap-1 text-summit-700"
              onClick={() => setOptionalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Optional
            </Button>
          )}
        </div>
        {optionalOpen && (
          <div
            className="flex items-center rounded-md border px-3"
            cmdk-input-wrapper=""
          >
            <div className="text-sm font-semibold text-gray-500">Optional:</div>
            <CommandPrimitive.Input
              ref={optionalInputRef}
              className="flex h-11 w-full rounded-md border-none bg-transparent py-3 text-sm outline-none placeholder:text-sm placeholder:text-gray-500 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-gray-400"
              value={optionalInputValue}
              onValueChange={isLoading ? undefined : setOptionalInputValue}
              onBlur={handleBlur}
              onFocus={() => setOpen(true)}
              placeholder={"Add optional attendees"}
              disabled={disabled}
            />
          </div>
        )}
      </div>
      <div className="relative mt-1">
        {isOpen ? (
          <div className="absolute top-0 z-10 w-full rounded-xl bg-stone-50 outline-none animate-in fade-in-0 zoom-in-95">
            <CommandList className="rounded-lg ring-1 ring-gray-200">
              {isLoading ? (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              ) : null}
              {options.length > 0 && !isLoading ? (
                <CommandGroup>
                  {options.map((option) => {
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                        onSelect={() => handleSelectOption(option)}
                        className="flex w-full items-center gap-2 px-10"
                      >
                        {option.image ? (
                          <div className="relative h-8 w-8 rounded-full">
                            <Image
                              src={option.image}
                              alt={option.label}
                              fill
                              className="rounded-full object-fill"
                            />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200" />
                        )}
                        <div className="flex flex-col">
                          <div className="text-sm font-semibold">
                            {option.label}
                          </div>
                          {option.description && (
                            <div className="text-xs text-gray-500">
                              {option.description}
                            </div>
                          )}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ) : null}
              {!isLoading ? (
                <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                  {emptyMessage}
                </CommandPrimitive.Empty>
              ) : null}
            </CommandList>
          </div>
        ) : null}
      </div>
    </CommandPrimitive>
  );
};
