import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://daft-a-peth.com",
  output: "static",
  publicDir: "assets",
  integrations: [sitemap()],
});
