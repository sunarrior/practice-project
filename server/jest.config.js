/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.ts",
  ],

  // All imported modules in your tests should be mocked automatically
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // A list of paths to directories that Jest should use to search for files in
  roots: [
    "<rootDir>/src"
  ],

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).*(ts|tsx|js)"
  ],

  // A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
};