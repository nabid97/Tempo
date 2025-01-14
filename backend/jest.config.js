module.exports = {
    roots: ["<rootDir>/backend/tests"],
    testEnvironment: "node",
    moduleFileExtensions: ["js", "jsx", "json", "node"],
    transform: {
      "^.+\\.jsx?$": "babel-jest"
    },
    testMatch: [
      "**/*.test.js"
    ]
  };