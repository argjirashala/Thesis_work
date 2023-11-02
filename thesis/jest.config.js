module.exports = {
    testEnvironment: 'jsdom',
    transform: {
      "^.+\\.jsx?$": "babel-jest"
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
      },
  };
  