export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['src/**/*.ts*', '!src/**/*.cy.ts*'],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  preset: 'ts-jest',

  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>/src'],

  // Options that will be passed to the testEnvironment
  testEnvironmentOptions: {
    url: 'http://localhost',
  },

  testPathIgnorePatterns: ['/node_modules/', '/cypress/', '\\.cy\\.ts$'],
}
