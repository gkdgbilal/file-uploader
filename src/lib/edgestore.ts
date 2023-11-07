"use client";

import { createEdgeStoreProvider } from "@edgestore/react";
import { type EdgeStoreRouter } from "../pages/api/edgestore/[...edgestore]";

const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider<EdgeStoreRouter>({
    maxConcurrentUploads: 2,
  });

export { EdgeStoreProvider, useEdgeStore };
