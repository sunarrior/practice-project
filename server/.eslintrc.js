module.exports = {
    env: {
      node: true,
      es2021: true,
    },
    extends: [
      "airbnb-base",
      "airbnb-typescript/base",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
    ],
    overrides: [],
    parserOptions: {
      project: ["tsconfig.eslint.json"],
      tsconfigRootDir: __dirname,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: ["@typescript-eslint", "prettier"],
    rules: {
      "prettier/prettier": [
        "error",
        {
          "endOfLine": "auto"
        }
      ],
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "import/prefer-default-export": "off",
      "no-console": "off",
      "prefer-destructuring": "off",
      "consistent-return": "off",
      "import/no-cycle": "off",
    },
  }