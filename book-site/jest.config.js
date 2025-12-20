module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@docusaurus/(.*)$': '<rootDir>/node_modules/@docusaurus/core/lib/$1',
    '^@theme/(.*)$': '<rootDir>/src/theme/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
