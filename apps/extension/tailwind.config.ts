import type { Config } from "tailwindcss"
import sharedConfig from "@repo/tailwind-config"

const config: Pick<Config, "content" | "presets" | "important"> = {
  content: [
    "./src/cs/**/*.tsx",
    "./src/entrypoints/**/*.tsx",
    "../../packages/ui/src/**/*.tsx"
  ],
  presets: [sharedConfig]
}

export default config
