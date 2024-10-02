import { fixupPluginRules } from "@eslint/compat"
import eslint from "@eslint/js"
import tanstackQuery from "@tanstack/eslint-plugin-query"
import immutable from "eslint-plugin-immutable"
import reactPlugin from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import tseslint from "typescript-eslint"

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  { ignores: ["eslint.config.js", "tailwind.config.js", "dist", "vite.config.ts", "**/*.md"] },
  {
    files: ["src/**/*.ts", "src/**/*.tsx", "src/**/*.{js, mjs}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        project: true,
        sourceType: "module",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      immutable: fixupPluginRules(immutable),
      "@tanstack/query": fixupPluginRules(tanstackQuery),
      react: fixupPluginRules(reactPlugin),
      "react-hooks": fixupPluginRules(reactHooks), // see: https://github.com/facebook/react/issues/28313#issuecomment-2119166334
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules, // see: https://github.com/facebook/react/issues/28313#issuecomment-2119166334
      ...tanstackQuery.configs.recommended.rules,
      "prefer-const": "error",
      "immutable/no-this": "error",
      "immutable/no-mutation": "error",
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  }
)
