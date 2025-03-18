import { auth } from "@/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
      contentDisposition: "inline",
    },
  })
    .middleware(async ({req}) => {
      const session = await auth();
      if (!session) throw new UploadThingError("Unauthorized access. Please log in.");
      console.log(req)
      return { userId: session.user.id };
    }).onUploadError(({error}) => {
      console.log("Upload error",  error);
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for:", file.name);
      console.log("Uploaded by user ID:", metadata.userId);
      
      return { 
        uploadedBy: metadata.userId,
        fileName: file.name,
        fileUrl: file.url
      };
    }),
  
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;