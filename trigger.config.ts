import { defineConfig } from "@trigger.dev/sdk";
import { additionalPackages } from "@trigger.dev/build/extensions/core";
import { prismaExtension } from "@trigger.dev/build/extensions/prisma";

export default defineConfig({
  project: "proj_azvfbfsgvjwlclgxgihg", // project ID
  runtime: "node",
  logLevel: "log",
  maxDuration: 120, // 2 minutes max for any task
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 2,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
    },
  },
  build: {
    external: ["pdf-parse"],
    extensions: [
      prismaExtension({
        mode: "legacy",
        schema: "prisma/schema.prisma",
      }),
      additionalPackages({ packages: ["pdf-parse@1.1.1"] }),
    ],
  },
  dirs: ["./trigger"],
});
