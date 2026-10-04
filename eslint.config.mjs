import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    // Pre-redesign code, rewritten or deleted in phases A2-A8 (see PROGRESS.md).
    // React Compiler rules stay warnings here; drop this block in A8.
    files: ['app/(pages)/**', 'app/components/**', 'app/reactDevBits/**', 'app/hooks/**'],
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/use-memo': 'warn',
      'react-hooks/immutability': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['*.config.js', 'jest.setup.js'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.next_build/**',
      'out/**',
      'build/**',
      'coverage/**',
      'three-geojson/**',
      'next-env.d.ts',
    ],
  },
];

export default eslintConfig;
