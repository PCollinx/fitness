module.exports = {
  extends: "next/core-web-vitals",
  rules: {
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
};
