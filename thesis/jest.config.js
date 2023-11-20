module.exports = {
  setupFilesAfterEnv: ["./condig.js"],
  verbose: false,
  bail: true,
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
  },
};
