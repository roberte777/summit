import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUploadThing } from "~/utils/uploadthing";
import { useToast } from "../shadcn/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/ui/form";
import { Input } from "../shadcn/ui/input";
import { Button } from "../shadcn/ui/button";
import { AtSign, Check, ChevronsUpDown } from "lucide-react";
import { CardCheckbox } from "../custom/ui/cardCheckbox";
import { StateOptions } from "~/constants/formValues";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/ui/popover";
import { cn } from "~/utils/shadcn";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../shadcn/ui/command";
import { AdvancedTextArea } from "../custom/ui/advancedTextarea";
import { Photo } from "~/svgs";
import PreviewOrganization from "../PreviewOrganization";
import { set } from "date-fns";

export const createOrganizationFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  organizationUsername: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .refine((value) => /^[a-zA-Z0-9._-]+$/.test(value), {
      message:
        "Invalid username, only letters, numbers, and some special characters (., -, _) are allowed.",
    }),
  public: z.boolean(),
  private: z.boolean(),
  university: z.string().min(1, { message: "Required field" }),
  addressLine1: z.string().min(1, { message: "Required field" }),
  addressLine2: z.string(),
  city: z.string().min(1, { message: "Required field" }),
  state: StateOptions,
  zip: z.string().refine((value) => /^\d{5}(?:[-\s]\d{4})?$/.test(value), {
    message: "Must be a valid zip code",
  }),
  description: z
    .string()
    .max(500, { message: "Description must be at most 500 characters long" }),
  joinCode: z
    .string()
    .min(8, {
      message: "Join code must be at least 8 characters long",
    })
    .max(16, {
      message: "Join code must be at most 16 characters long",
    })
    .refine((value) => /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/.test(value), {
      message: "Invalid join code",
    })
    .transform((value) => value.toUpperCase()),
});

export function CreateOrganizationForm({ userId }: { userId: string }) {
  const form = useForm<z.infer<typeof createOrganizationFormSchema>>({
    resolver: zodResolver(createOrganizationFormSchema),
    defaultValues: {
      name: "",
      organizationUsername: "",
      public: true,
      private: false,
      university: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      zip: "",
      description: "",
      joinCode: "",
    },
  });
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviewPaths, setFilePreviewPaths] = useState<string[]>([]);
  const { startUpload, permittedFileInfo } = useUploadThing(
    "profileOrgBannerImageUploader",
  );
  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];
  const { getInputProps, getRootProps } = useDropzone({
    onDrop: useCallback(
      (acceptedFiles) => {
        setFiles(acceptedFiles);
        setFilePreviewPaths(
          acceptedFiles.map((file) => URL.createObjectURL(file)),
        );
      },
      [setFilePreviewPaths],
    ),
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });
  const { toast } = useToast();

  const publicValue = form.watch("public");
  const privateValue = form.watch("private");

  useEffect(() => {
    if (publicValue) form.setValue("private", false);
  }, [form, publicValue]);

  useEffect(() => {
    if (privateValue) form.setValue("public", false);
  }, [form, privateValue]);

  const onSubmit = async (
    values: z.infer<typeof createOrganizationFormSchema>,
  ) => {
    console.log("CreateOrganizationForm values: ", values);

    if (files.length != 0) {
      const organizationProfilePictureRes = await startUpload(files);

      if (!organizationProfilePictureRes) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload organization profile picture.",
        });
        return;
      }
    }
  };

  console.log("Files: ", files);

  return (
    <>
      <div className="flex w-full items-start gap-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizationUsername"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div className="relative h-10 w-full">
                      <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        className="pl-10"
                        placeholder="organization.username"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="public"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <CardCheckbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        label="Public"
                        description="Anyone can join and see the organization's content."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="private"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <CardCheckbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        label="Private"
                        description="Only members can see the organization's content."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="university"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Affiliated university</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Address line 1</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Address line 2</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>State</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground font-normal",
                          )}
                        >
                          {field.value
                            ? StateOptions.options.find(
                                (state) => state === field.value,
                              )
                            : "Select state"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="popover-content-width-same-as-its-trigger pointer-events-auto p-0">
                      <Command>
                        <CommandInput placeholder="Search state..." />
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {StateOptions.options.map((state) => (
                              <CommandItem
                                value={state}
                                key={state}
                                onSelect={() => {
                                  form.setValue("state", state);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    state === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {state}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Zip</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <AdvancedTextArea
                      maxLength={500}
                      currentLength={field.value?.length ?? 0}
                      placeholder="Tell us a little bit about your organization"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="joinCode"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Join code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    A unique code that members will use to join your
                    organization.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormLabel>Logo</FormLabel>
            <div
              {...getRootProps()}
              className="flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-6 text-center"
            >
              {files.length > 0 ? <div>{files[0]?.name}</div> : null}
              <input className="sr-only" {...getInputProps()} />
              <Photo className="h-10 w-10 text-gray-400" />
              <div>
                <p className="text-sm">Upload a file or drag and drop</p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WEBP. Max 2MB.
                </p>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-summit-700 hover:bg-summit-700/95"
              // disabled={isLoading}
            >
              {/* {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving information
            </>
          ) : (
            "Continue"
          )} */}
              Continue
            </Button>
          </form>
        </Form>
        <div className="sticky top-8 flex w-full flex-col gap-3">
          <div className="text-sm font-semibold">Organization preview</div>
          <PreviewOrganization
            name={form.watch("name")}
            username={form.watch("organizationUsername")}
            university={form.watch("university")}
            city={form.watch("city")}
            state={form.watch("state")}
            description={form.watch("description")}
            isPrivate={form.watch("private")}
          />
        </div>
      </div>
    </>
  );
}
