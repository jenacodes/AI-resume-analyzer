import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  test: {
    environment: "node",
    globals: true, // Needed if you want to use describe/test without importing
    env: {
      GEMINI_API_KEY: "test-api-key",
    },
  },
});
