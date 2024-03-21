import { createRouteHandler } from "uploadthing/next-legacy";
import { uploadthingRouter } from "~/server/api/routers/uploadthing";

/**
 * This is the file router for uploadthing.
 */
export default createRouteHandler({
  router: uploadthingRouter,
});
