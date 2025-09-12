// eslint.config.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Legacy config adapter for eslint-config-next
const nextConfig = require('eslint-config-next');

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Convert legacy config to flat config
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    // Apply Next.js rules using the extends pattern for compatibility
    rules: {
      ...nextConfig.rules,
      // Override rules from Next.js config
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
];
