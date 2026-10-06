const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
  },
  // other sessions' checkouts of this repository live in .claude/
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/.claude/'],
  modulePathIgnorePatterns: ['<rootDir>/.claude/'],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/layout.tsx',
    '!app/**/page.tsx',
    '!app/**/loading.tsx',
    '!app/**/error.tsx',
    '!app/**/not-found.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};

// Packages published as ES modules only: Jest must transform them like our own code.
const esmPackages = ['nuqs'];

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async.
// next/jest sets its own transformIgnorePatterns after reading ours, so the list is corrected on the way out.
module.exports = async () => {
  const config = await createJestConfig(customJestConfig)();
  return {
    ...config,
    transformIgnorePatterns: [`/node_modules/(?!(${esmPackages.join('|')})/)`, '^.+\\.module\\.(css|sass|scss)$'],
  };
};
