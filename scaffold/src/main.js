if (import.meta.env.MODE !== "development") {
  import("vite/modulepreload-polyfill");
}
import "./scss/styles.scss";
import "./js/index.js";