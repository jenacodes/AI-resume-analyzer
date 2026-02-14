import { defineConfig } from "@trigger.dev/sdk";

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
  dirs: ["./trigger"],
});
