import { resolve } from "path";
const cwd = process.cwd();
/**
 * Default options
 */
export default {
  cwd,
  debug: false,
  localOptionsFile: "vite.local.json",
  port: 5173,
  stylesOnly: false,
  minify: true,
  cssMinify: true,
  noChunks: true,
  host: "localhost",
  input: "src/main.js",
  origin: "http://site-url",
  publicDir: "src/public",
  outDir: "dist",
  themePath: "/server/absolute/theme",
  globalJquery: true,
  legacyOptions: {
    targets: ["> 2%", "last 2 versions", "Firefox ESR", "not dead"],
    modernTargets: ["chrome >= 100", "safari >= 16.4", "firefox >= 100", "edge >= 100"]
  },
  withLegacy: true,
  withVue: true,
  withWatchReload: true,
  withImageOptimizer: true,
  watchReloadOptions: [
    "**/*.(php|inc|theme|twig)",
    "../../../modules/custom/**/*.(php|inc|theme|twig)",
  ],
  imageOptimizerOptions: { 
    includePublic: true 
  },
  alias: {
    "@": resolve(cwd, "./src"),
  },
  preprocessorOptions: {
    scss: {
      loadPaths: [resolve(cwd, "./src/scss")],
      quietDeps: true,
      api: "modern-compiler"
    }
  },
  plugins: [],
  entryFileNames: "[name].js",
  chunkFileNames: "chunks/[name].[hash].js",
  assetFileNames: "[name].[ext]",
  assetsInlineLimit: 0
};