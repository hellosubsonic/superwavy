import { defineConfig } from "wxt"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"
import tsconfigPaths from "vite-tsconfig-paths"
import remToPx from "@thedutchcoder/postcss-rem-to-px"

export default defineConfig({
  manifest: {
    permissions: ["storage", "scripting", "aiLanguageModelOriginTrial"],
    web_accessible_resources: [
      {
        resources: ["twitter-main-world.js"],
        matches: ["*://*/*"]
      }
    ],
    name: "Superwavy",
    description: "Superwavy filters your Twitter feed in real-time with specific vibe-based filters using AI."
  },
  modules: ["@wxt-dev/module-react"],
  dev: {
    server: {
      hostname: "localhost",
      port: 3050
    }
  },

  outDir: "dist",

  runner: {
    // @ts-ignore
    binaries: ["/Applications/Google Chrome Canary.app"],
    chromiumArgs: ["--user-data-dir=../../chrome-data"]
  },

  vite: () => ({
    plugins: [tsconfigPaths()],

    optimizeDeps: {
      exclude: ["node_modules/.cache", "node_modules", "chrome-data"]
    },
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer, remToPx]
      }
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (warning.code === "SOURCEMAP_ERROR") {
            return
          }
          defaultHandler(warning)
        }
      }
    }
  })
})
