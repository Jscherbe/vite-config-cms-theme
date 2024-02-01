# Images

Images in this folder can be used in templates in the theme

NOTE: You need to build the theme 'npm run build' in order to use the images within templates, etc. This copyies them to their final destination, this does not work with HMR, so if you update an image you need to rebuild.

```html
<a class="logo" href="{{ path('<front>') }}">
  <img src="/{{ directory }}/dist/images/logo.svg" alt="Website Name">
</a>
```