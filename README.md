# @ulu/vite-drupal-config

This module creates Vite config for developing a Drupal theme. It uses Vite for building production assets and uses the Vite dev server as an asset server while developing the site locally. 

Currently this is being used for Drupal projects but will probably work for other traditional site/CMS (ie. Wordpress). Note you need to configure/setup your CMS to work correctly (HMR, dev server) by switching the paths to assets when developing (see CMS Setup below).

## Usage 

**In your theme's root folder 'vite.config.js'**. See options below for more information.

```js
import { createConfig } from "@ulu/vite-drupal-config";

export default createConfig({
  origin: "http://inf-2301--website",
  themePath: "/themes/custom/is_2023"
});

```

## CMS Setup

By default Vite is designed for developing applications, this module changes defaults and adds plugins to make Vite features work on a traditional website (non-app).

In a Drupal site, what this is tested with. You need to change your theme's libraries when developing locally. We did this by:

1. Adding two libraries to our theme. One that points to the production assets (CSS/JS) and one that points to the local Vite dev server. This way when you are developing locally assets will be requested from the Vite dev server.
2. Adding special frontend_dev flag to our settings.php to be set locally by the developer to switch to Vite for local development
3. Last, we have a have a custom preprocess theme hook that checks for that 'frontend_dev' flag and conditionally loads the dev library vs the normal theme assets

**Example THEME.libraries.yml**

```yaml

css-js:
  version: 1.0
  css:
    theme:
      dist/style.css: {}
  js:
    dist/polyfills-legacy.js: {}
    dist/main-legacy.js: {}
  dependencies:
    - core/jquery

#Frontend Development
css-js-dev:
  version: 1.0
  js:
    http://localhost:5173/@vite/client: { attributes: { type: module }}
    http://localhost:5173/src/main.js: { attributes: { type: module }}
  dependencies:
    - core/jquery

```

## Options

The 'createConfig' function accepts the following options

## Required Options

- **themePath** | {String} | (required) Absolute path to your theme from the servers root (ie. www) 
- **origin** | {String} | (required) Your local CMS dev server URL

## Optional Options

- **input** | {String} | The entry file, defaults to "src/main.js"
- **outDir** | {String} | Where to build the production files to, default "dist"
- **cwd** | {String} | Path to cwd, defaults to process.cwd()
- **publicDir** | {String} | Location of Vite public dir (used for assets), default "src/public"
- **stylesOnly** | {Boolean} | When set to true will generate only css file for input (building editor styles, builder styles, etc)
- **globalJquery** | {String} | Add global/external jquery, so that you can import it like normal inside your ES modules, for CMS's where jQuery is accessible in the window (global)
- **withLegacy** | {Boolean} | Whether to output the legacy vite bundle
- **withVue** | {Boolean} | Include vue plugin
- **withImageOptimizer** | {Boolean} | Include image optimizer plugin
- **reloadWatch** | {Array} | Watch options to be passed to reloadWatch plugin, default to Drupal paths (any php|inc|theme|twig files in theme directory or custom modules)
- **preprocessorOptions** | {Array} | Options to be passed to vite css.preprocessorOptions, defaults to adding includePaths "src/scss/" to sass preprocessor
- **alias** | {Array} | Options to be passed to vite resolve.alias, defaults setup "@/ = src/"
- **host** | {String} | Host for Vite dev server
- **port** | {Number} | The port for Vite dev server, default (5173)
- **debug** | {Boolean} | Output debug logs (console)

