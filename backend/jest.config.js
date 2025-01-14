module.exports = {
    roots: ["<rootDir>/backend"],
    testEnvironment: "node",
    moduleFileExtensions: ["js", "jsx", "json", "node"],
    transform: {
      "^.+\\.jsx?$": "babel-jest"
    }
  };