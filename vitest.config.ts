import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: [
      // "./core/schemas/saavn/requests/get-details/**/*.spec.ts",
      // "./core/schemas/saavn/requests/get-reco/**/*.spec.ts",
      // "./core/schemas/saavn/requests/get-trending/**/*.spec.ts",
      // "./core/schemas/saavn/requests/search-results/**/*.spec.ts",
      // "./core/schemas/saavn/requests/web-api/**/*.spec.ts",
      // "./core/schemas/saavn/requests/web-radio/**/*.spec.ts",
      "**/*.spec.ts",
    ],
  },
});
