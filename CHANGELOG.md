# Change Log

## 0.0.15

- Add option "assetsInlineLimit" to be passed as is to build.assetsInlineLimit. Our default is 0 (we don't want inlined assets [ie. svg, etc])
  
## 0.0.14

- Fix readme (alias option was array should be object)

## 0.0.13

- Add new options for: noChunks, minify, minifyCss, plugins, entryFileNames, chunkFileNames, assetFileNames
- Updated docs with new options
- noChunks is the default now since that was needed for AdvAgg use in Drupal where all JS in concatenated into a single file

## 0.0.10

- Update README's, fix issue with dev library asset path (ie 'http://localhost:5173/src/main.js' to 'http://localhost:5173/themes/custom/theme-name/src/main.js')
  - Reason: The asset server needs to have the theme's base path so that any files requested through still point to static location from the site's base (the theme directory), so the assets the libraries (client and main in the README) are served from that base path as well.

## 0.0.9

- Fix default Drupal path to custom modules (watcher)

## 0.0.4

- Add option to load local options from json file (for setting origin per user/local development machine)
- Add example scaffolding (files/folders structure)