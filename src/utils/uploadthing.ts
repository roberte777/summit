import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import { type UploadthingRouter } from "~/server/api/routers/uploadthing";
import { generateReactHelpers } from "@uploadthing/react/hooks";

export const UploadButton = generateUploadButton<UploadthingRouter>();
export const UploadDropzone = generateUploadDropzone<UploadthingRouter>();
export const { useUploadThing } = generateReactHelpers<UploadthingRouter>();
