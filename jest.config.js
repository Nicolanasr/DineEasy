const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/**/layout.tsx',
    '!src/app/**/page.tsx',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  testPathIgnorePatterns: [
    '<rootDir>/.next/', 
    '<rootDir>/node_modules/',
    '<rootDir>/e2e/',
    '<rootDir>/src/app/api/sessions/__tests_disabled__/',
    '<rootDir>/src/app/api/sessions/__tests__/',
    '<rootDir>/src/__tests__/integration/',
    '<rootDir>/src/hooks/__tests__/use-shared-cart.integration.test.ts',
    '<rootDir>/src/hooks/__tests__/use-real-time.integration.test.ts'
  ],
}

module.exports = createJestConfig(customJestConfig)