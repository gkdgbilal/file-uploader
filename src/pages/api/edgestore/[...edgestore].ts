import { initEdgeStore } from "@edgestore/server";
import {
  CreateContextOptions,
  createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/pages";
import { z } from "zod";

type Context = {
  userId: string;
  userRole: "admin" | "user";
};

function createContext({ req }: CreateContextOptions): Context {
  // const userId = req.headers["x-user-id"] as string;
  // const userRole = req.headers["x-user-role"] as "admin" | "user";
  return {
    userId: "12344",
    userRole: "user",
  };
}

const es = initEdgeStore.context<Context>().create();

const edgeStoreRouter = es.router({
  myPublicImages: es
    .imageBucket({
      maxSize: 1024 * 1024 * 1, // 1MB
    })
    .input(
      z.object({
        type: z.enum(["post", "profile"]),
      })
    )
    // e.g. /post/my-file.jpg
    .path(({ input }) => [{ type: input.type }]),
  myProtectedFiles: es
    .fileBucket()
    // e.g. /123/my-file.pdf
    .path(({ ctx }) => [{ owner: ctx.userId }])
    .accessControl({
      OR: [
        {
          userId: { path: "owner" },
        },
        {
          userRole: { eq: "admin" },
        },
      ],
    }),
});

export default createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});

export type EdgeStoreRouter = typeof edgeStoreRouter;
