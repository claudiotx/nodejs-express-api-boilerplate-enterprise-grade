module.exports = {
	globals: {
		'ts-jest': {
			tsConfigFile: 'tsconfig.json'
		}
	},
	moduleFileExtensions: [
		'ts',
		'js'
	],
	transform: {
		'^.+\\.(ts|tsx)$': './node_modules/ts-jest/preprocessor.js'
	},
	testMatch: [
		'**/test/unit/**/*.test.(ts|js)'
	],
  testEnvironment: 'node',
  coverageThreshold: {
    "global": {
      "statements": 50,
      "branches": 50,
      "functions": 50,
      "lines": 50
    }
  }
};