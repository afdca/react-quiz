/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import viteTsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load the .env file based on the current mode (development or production)
  // const env = loadEnv(mode, process.cwd())
  // const proxyTarget = env["VITE_APP_AWS_DOMAIN"]
  return {
    base: "./",
    plugins: [react(), viteTsconfigPaths()],
    test: { environment: "jsdom" },
    server: {
      headers: {
        // Trigger CSP erors in dev mode in order to detect them before prod
        "Content-Security-Policy": "style-src 'self';",
      },
      // proxy: {
      //   "/api": {
      //     target: proxyTarget,
      //     changeOrigin: true,
      //     secure: false,
      //   },
      // },
    },
  }
})
