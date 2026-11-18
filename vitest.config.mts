import path from "node:path";
import { defineConfig } from "vitest/config";

// Unit tests only: they must never touch a database.
export default defineConfig({
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  test: { include: ["src/**/*.test.ts"], environment: "node" },
});
