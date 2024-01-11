/* eslint-env node */
import fs from "fs";
import path from "path";
import { hasRequiredProps } from "@ulu/utils/object.js";
import { resolve } from "path";
import { defineConfig } from "vite";
import legacyPlugin from "@vitejs/plugin-legacy";
import fullReload from "vite-plugin-full-reload";
import externalGlobals from "rollup-plugin-external-globals";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import externalsDev from "vite-plugin-externalize-dependencies";

const libname = "@ulu/vite-config-cms-theme";
const cwd = process.cwd();
const requiredOptions = ["origin", "themePath"];
const hasRequiredOptions = hasRequiredProps(requiredOptions);

/**
 * Mixin Default options
 */
export const defaults = {
  debug: false,
  localOptionsFile: "vite.local.json",
  cwd,
  port: 5173,
  stylesOnly: false,
  host: "localhost",
  input: "src/main.js",
  origin: "http://site-url",
  publicDir: "src/public",
  outDir: "dist",
  themePath: "/server/absolute/theme",
  globalJquery: true,
  withLegacy: true,
  withVue: true,
  withImageOptimizer: true,
  reloadWatch: [
    "**/*.(php|inc|theme|twig)",
    "../../modules/custom/**/*.(php|inc|theme|twig)",
  ],
  alias: {
    "@": resolve(cwd, "./src"),
  },
  preprocessorOptions: {
    scss: {
      includePaths: [resolve(cwd, "./src/scss")],
    }
  },
};

/**
 * Mixin that returns a vite configuration for use in 'vite.config.js'
 * @param {Object} userOptions Options to pass (see defaults, or README.md)
 * @returns 
 */
export function createConfig(userOptions) {

  const options = Object.assign({}, defaults, userOptions);
  const localOptions = loadLocalOptions(options);

  Object.assign(options, localOptions);

  if (!hasRequiredOptions(options)) {
    throw Error(`${ libname }: Missing required options: ${ reqUserProps.join() }`);
  }

  const { 
    input,
    port,
    origin,
    host,
    stylesOnly, 
    publicDir,
    themePath,
    outDir,
    reloadWatch,
    globalJquery,
    preprocessorOptions,
    alias,
    withLegacy,
    withVue,
    withImageOptimizer,
    debug
  } = options;

  const debugLog = (title, msg) => {
    if (debug) {
      console.log(`${ libname } (${ title })`, msg);
    }
  }

  debugLog("CWD", defaults.cwd);
  debugLog("options", options);

  return defineConfig(({ command }) => {
    const isServe = command === "serve";
    return {
      publicDir: stylesOnly ? false : publicDir,
      /**
       * Base directory will change based on what command is running
       * - Built asset urls will point to the dist folder from site public root
       * - Serve will will point directly to the files, relative to project cwd
       *   this way loading /src/main from asset server will load "[cwd]/[asset]"
       */
      base: isServe ? themePath : `${ themePath }/${ outDir }/`,
      plugins: stylesOnly ? [] : [
        /**
         * Allow compilation of Vue components
         */
        ...(withVue ? [ vue() ] : []),
        /**
         * Reload dev server when watched files change
         */
        fullReload(reloadWatch),
        /**
         * Render for legacy browsers, note renderModernChunks false has bug
         * so we will just have to leave those files in there
         */
        ...(withLegacy ? [ legacyPlugin() ] : []),
        /**
         * Optimize images of all types, inccluding public assets in publicDir
         */
        ...(withImageOptimizer ? [ ViteImageOptimizer({ includePublic: true }) ] : []),
        ,
        ...(globalJquery ? [
          /**
           * Make external libraries that are exposed as global variables work 
           * like es modules (Drupal included, etc). In combination with rollup
           * settings for globals/externals
           */
          externalGlobals({ jquery: "jQuery" }),
          /**
           * Working on possibly testing plugin for during devlopment
           * - https://github.com/vitejs/vite/issues/6582
           * - https://www.npmjs.com/package/vite-plugin-externalize-dependencies
           */
          externalsDev({ externals: ["jquery"] })
        ] : [])
      ],
      build: {
        minify: false,
        cssMinify: false,
        cssCodeSplit: stylesOnly ? true : false,
        outDir: outDir,
        rollupOptions: {
          input,
          ...(globalJquery ? { external: ["jquery"] } : {}),
          output: {
            entryFileNames: "[name].js",
            chunkFileNames: "chunks/[name].[hash].js",
            assetFileNames: "[name].[ext]",
            ...(globalJquery ? { globals: { jquery: "jQuery" }} : {}),
          },
        },
      },
      server: {
        port,
        origin,
        strictPort: true,
        hmr: { host },
      },
      css: {
        postcss: {
          plugins: [autoprefixer()],
        },
        preprocessorOptions
      },
      resolve: {
        alias
      },
    };
  });
} 


function loadLocalOptions(options) {
  const { cwd, localOptionsFile } = options;
  if (!localOptionsFile) return null;
  const filepath = path.resolve(cwd, localOptionsFile);
  if (fs.existsSync(filepath)) {
    try {
      let result = JSON.parse(fs.readFileSync(filepath)?.toString());
      return result;
    } catch (error) {
      console.error(`${ libname }: Loading localOptionsFile as JSON failed`);
      console.error(error);
      return null;
    }
  } else {
    console.warn(`${ libname } (localOptionsFile): Local vite options file is missing (ie. origin, themePath).`);
    return null;
  }
}