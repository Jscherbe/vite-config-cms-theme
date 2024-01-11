/* eslint-env node */
module.exports = {
  root: true,
  env: {
    node: true
  },
  "extends": [
    "eslint:recommended"
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  rules: {
    "indent": ["warn", 2],
    "quotes": ["warn", "double"],
    "semi": ["warn", "always"],
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-unused-vars": "off",
  },
};

