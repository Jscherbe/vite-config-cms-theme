/* eslint-env node */
import fs from "fs";
import path from "path";
import { hasRequiredProps } from "@ulu/utils/object.js";

import { defineConfig } from "vite";
import legacyPlugin from "@vitejs/plugin-legacy";
import fullReload from "vite-plugin-full-reload";
import externalGlobals from "rollup-plugin-external-globals";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import externalsDev from "vite-plugin-externalize-dependencies";
import defaults from "./defaults.js";

const libname = "@ulu/vite-config-cms-theme";
const requiredOptions = ["origin", "themePath"];
const hasRequiredOptions = hasRequiredProps(requiredOptions);

const errorMsg = (title, msg) => `\n\n${ libname } (${ title }): ${ msg }\n`;

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
    throw Error(errorMsg(
      "options", 
      `Missing required options: ${ requiredOptions.join() }`
    ));
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
    globalJquery,
    preprocessorOptions,
    alias,
    withLegacy,
    withVue,
    withImageOptimizer,
    withWatchReload,
    watchReloadOptions,
    imageOptimizerOptions,
    debug
  } = options;

  const debugLog = (title, msg) => {
    if (debug) {
      console.log(`${ libname } (${ title })`, msg);
    }
  };

  debugLog("CWD", defaults.cwd);
  debugLog("options", options);

  return defineConfig(({ command }) => {
    const isServe = command === "serve";
    const plugins = [];

    // Setup plugins
    if (!stylesOnly) {
      // Allow compilation of Vue components
      if (withVue) plugins.push(vue());
      // Render for legacy browsers, note renderModernChunks false has bug
      // so we will just have to leave those files in there
      if (withLegacy) plugins.push(legacyPlugin());
      if (globalJquery) {
        // Make external libraries that are exposed as global variables work 
        // like es modules (Drupal included, etc). In combination with rollup
        // settings for globals/externals
        plugins.push(externalGlobals({ jquery: "jQuery" }));
        // Working on possibly testing plugin for during devlopment
        // - https://github.com/vitejs/vite/issues/6582
        // - https://www.npmjs.com/package/vite-plugin-externalize-dependencies
        plugins.push(externalsDev({ externals: ["jquery"] }));
      }
    }
    // Plugins not related to JS
    if (withWatchReload) {
      // Reload dev server when watched files change
      plugins.push(fullReload(watchReloadOptions));
    }
    if (withImageOptimizer) {
      // Optimize images of all types, inccluding public assets in publicDir
      plugins.push(ViteImageOptimizer(imageOptimizerOptions));
    }

    return {
      publicDir: stylesOnly ? false : publicDir,
      // Base directory will change based on what command is running
      // - Built asset urls will point to the dist folder from site public root
      // - Serve will will point directly to the files, relative to project cwd
      //   this way loading /src/main from asset server will load "[cwd]/[asset]"
      base: isServe ? themePath : `${ themePath }/${ outDir }/`,
      plugins,
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
  const reason = "This file is required to set your local dev server origin. To disable this feature set localOptionsFile to false.";
  const example = `File example (${ localOptionsFile }): { "origin": "http://local-site-url" }`;
  const filepath = path.resolve(cwd, localOptionsFile);
  if (fs.existsSync(filepath)) {
    try {
      let result = JSON.parse(fs.readFileSync(filepath)?.toString());
      return result;
    } catch (error) {
      console.error(error);
      throw Error(errorMsg(
        "localOptionsFile", 
        `Reading JSON failed for: ${ filepath }\n${ example }\n${ reason }`
      ));
    }
  } else {
    throw Error(errorMsg(
      "localOptionsFile", 
      `File is missing. Looked for file at: ${ filepath }\nExample file: ${ example }\n${ reason }`
    ));
  }
}