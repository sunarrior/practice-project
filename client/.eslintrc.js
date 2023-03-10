module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    parserOptions: {
      project: "tsconfig.eslint.json",
      tsconfigRootDir: __dirname,
      ecmaVersion: "latest",
      sourceType: "module",
  
    },
    plugins: ["@typescript-eslint", "prettier", "react"],
    extends: [
      "airbnb-base",
      "airbnb-typescript/base",
      "plugin:@typescript-eslint/recommended",
      "next/core-web-vitals",
      "plugin:prettier/recommended",
    ],
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "import/no-anonymous-default-export": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/default-param-last": "off",
    }
  }
  