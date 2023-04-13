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
      "prettier/prettier": [
        "error",
        {
          "endOfLine": "auto"
        }
      ],
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/default-param-last": "off",
      "import/prefer-default-export": "off",
      "consistent-return": "off",

    }
  }
  