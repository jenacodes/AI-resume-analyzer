import { createRouteHandler } from "uploadthing/remix";
import { uploadRouter } from "~/services/uploadthing.server";

// Export routes for Next.js App Router (not needed here but good practice in some setups)
// export const { GET, POST } = createRouteHandler({
//   router: uploadRouter,
// });

// For Remix:
export const { action, loader } = createRouteHandler({
  router: uploadRouter,
});
