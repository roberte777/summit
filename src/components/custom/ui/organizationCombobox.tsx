import { Check, ChevronsUpDown } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";
import { cn } from "~/utils/shadcn";
import { Button } from "~/components/shadcn/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/shadcn/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/shadcn/ui/command";
import { type OrginizationComboboxItem } from "~/server/api/routers/user";
import Image from "next/image";
import { useRouter } from "next/router";

export default function OrganizationCombobox({
  value,
  setValue,
  organizations,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  organizations: OrginizationComboboxItem[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between pr-4 sm:w-max"
        >
          {value ? (
            <div className="flex items-center gap-2">
              <Image
                src={
                  organizations.find(
                    (organization) => organization.id === value,
                  )?.logoUrl ?? ""
                }
                alt="Organization Logo"
                width={24}
                height={24}
                className="rounded"
              />
              <div>
                {
                  organizations.find(
                    (organization) => organization.id === value,
                  )?.name
                }
              </div>
            </div>
          ) : (
            `Select organization...`
          )}
          <ChevronsUpDown className="ml-8 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search organization...`} />
          <CommandEmpty>{`No organization found.`}</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {organizations.map((organization) => (
                <CommandItem
                  key={organization.id}
                  value={organization.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    void router.push(`/organization/${currentValue}/home`);
                  }}
                >
                  {value != "" && value != organization.id && (
                    <div className="mr-2 h-4 w-4" />
                  )}
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === organization.id ? "block" : "hidden",
                    )}
                  />
                  <Image
                    src={organization.logoUrl}
                    alt="Organization Logo"
                    width={24}
                    height={24}
                    className="mr-2 rounded"
                  />
                  {organization.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
