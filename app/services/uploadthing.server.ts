import { createUploadthing, type FileRouter } from "uploadthing/remix";
import { UploadThingError } from "uploadthing/server";
import { getSession } from "~/sessions";

const f = createUploadthing();

export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  resumeUploader: f({
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    // @ts-ignore
    .middleware(async ({ event }) => {
      // The `event` argument contains the React Router/Remix Request object
      const request = event.request;

      const session = await getSession(request.headers.get("Cookie"));
      const userId = session.get("userId");

      // If you throw, the user will not be able to upload
      if (!userId) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);

      // We return the file URL so the client can use it
      return { url: file.ufsUrl, name: file.name, key: file.key };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
