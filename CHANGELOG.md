# Change Log

## 0.0.10

- Update README's, fix issue with dev library asset path (ie 'http://localhost:5173/src/main.js' to 'http://localhost:5173/themes/custom/theme-name/src/main.js')
  - Reason: The asset server needs to have the theme's base path so that any files requested through still point to static location from the site's base (the theme directory), so the assets the libraries (client and main in the README) are served from that base path as well.

## 0.0.9

- Fix default Drupal path to custom modules (watcher)

## 0.0.4

- Add option to load local options from json file (for setting origin per user/local development machine)
- Add example scaffolding (files/folders structure)