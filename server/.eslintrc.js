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
      "import/prefer-default-export": "off",
      "no-restricted-syntax": "off",
      "no-console": "off",
      "@typescript-eslint/ban-types": "off",
      "object-shorthand": "off",
      "import/no-extraneous-dependencies": "off",
      "import/no-cycle": "off",
      "consistent-return": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  }