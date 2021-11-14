module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      diagnostics: true
    }
  },
  testRegex: '/__tests__/.*.spec.ts$',
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/logger.ts', '!<rootDir>/src/main.ts'],
  coveragePathIgnorePatterns: ['node_modules', '<rootDir>/src/types', '<rootDir>/build'],
  verbose: true,
  coverageReporters: ['lcov', 'text'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageDirectory: 'src/__tests__/unit-test-coverage',
  modulePathIgnorePatterns: ['<rootDir>/build/']
};
