import pluginNext from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import eslintReactPlugin from "@eslint-react/eslint-plugin";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sonarjs from "eslint-plugin-sonarjs";
import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import prettierPlugin from "eslint-plugin-prettier";
import globals from "globals";
import { includeIgnoreFile } from "@eslint/compat";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default [
  includeIgnoreFile(gitignorePath),
  {
    name: "ESLint Config",
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        React: "writable",
      },
    },
    plugins: {
      "@next/next": pluginNext,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "simple-import-sort": simpleImportSort,
      sonarjs: sonarjs,
      prettier: prettierPlugin,
      "@eslint-react": eslintReactPlugin,
      "@typescript-eslint": typescriptPlugin,
    },
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
      ...typescriptPlugin.configs.recommended.rules,
      ...sonarjs.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      "sonarjs/no-duplicate-string": "warn",
      "sonarjs/no-small-switch": "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-array-index-key": "error",
      "sonarjs/cognitive-complexity": ["error", 40],
      "react/jsx-filename-extension": [
        1,
        { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      ],
      "import/no-extraneous-dependencies": "off",
      "@typescript-eslint/no-var-requires": "off",
      "react-hooks/rules-of-hooks": "error",

      // // Revisit this and turn it to an error

      // // Turn off SonarJS rules
      // "sonarjs/no-nested-conditional": "off",
      // "sonarjs/todo-tag": "off",
      // "sonarjs/no-unused-vars": "off",
      // "sonarjs/no-dead-store": "off",
      // "sonarjs/concise-regex": "off",
      // "sonarjs/no-nested-functions": "off",
      // "sonarjs/unused-import": "off",

      // Turn off eslint-react-hooks-extra rule
      "@eslint-react/hooks-extra/no-direct-set-state-in-use-effect": "off",

      // Turn off React-specific rules
      "react/prop-types": "off",
      "react/no-unknown-property": "off",
    },
  },
  // TypeScript-specific configuration
  {
    files: ["src/**/*.{ts,tsx}"],
    name: "TypeScript Configuration",
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
];
