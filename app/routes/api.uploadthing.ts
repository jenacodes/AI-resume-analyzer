import { createRouteHandler } from "uploadthing/remix";
import { uploadRouter } from "~/services/uploadthing.server";

// Create the handler
const handlers = createRouteHandler({
  router: uploadRouter,
});

export const action = handlers.action;
export const loader = handlers.loader;
