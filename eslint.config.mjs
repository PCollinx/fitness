// eslint.config.mjs
import nextPlugin from 'eslint-config-next';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  ...nextPlugin,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // You can add or override rules here
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }]
    }
  }
];