import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Root-level options (coverage, reporters) apply to all projects.
    // Per-project options (globals, include, setupFiles etc.) must be set inside each project.
    coverage: {
      include: [
        "./**/*.ts",
      ],
      exclude: ["node_modules/", "**/config.ts", "./**/tests/**/*.ts", "vitest.config.ts"],
      provider: "v8",
      reportsDirectory: "coverage",
    },
    reporters: [
      "default"
    ],
    testTimeout: 10000,
    clearMocks: true,
    projects: [
      {
        test: {
          name: "unit",
          globals: true,
          include: ["src/tests/unit/**/*.test.ts"],
          setupFiles: [
            "./vitest.setup.ts",
          ],
        },
      },
    ],
  },
});